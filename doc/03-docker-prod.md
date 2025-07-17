# 프론트엔드 도커 운영 배포

## 구성

```
/opt/docker/pincoin/frontend/build.sh
/opt/docker/pincoin/frontend/deploy.sh
/opt/docker/pincoin/frontend/full-deploy.sh
/opt/docker/pincoin/frontend/dev.sh
/opt/docker/pincoin/frontend/docker-compose.yml
/opt/docker/pincoin/frontend/.env
/opt/docker/pincoin/frontend/nginx/nginx.conf
/opt/docker/pincoin/frontend/nginx/site.conf
/opt/docker/pincoin/frontend/repo/
/opt/docker/pincoin/frontend/repo/Dockerfile.prod
/opt/docker/pincoin/frontend/logs/
```

## `.env`

```
PREFIX=pincoin
```

## docker compose

### `docker-compose.yml`

```yaml
services:
  nginx:
    container_name: ${PREFIX}-frontend-nginx
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "3090:3090"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/site.conf:/etc/nginx/conf.d/site.conf
      - ./logs:/app/logs
    depends_on:
      - frontend-1
      - frontend-2
    networks:
      - app-network
    environment:
      - TZ=Asia/Seoul
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "10"

  frontend-1:
    container_name: ${PREFIX}-frontend-1
    image: ${PREFIX}-frontend:latest
    build:
      context: ./repo
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    ports:
      - "13001:3000"
    networks:
      - app-network
    environment:
      - TZ=Asia/Seoul
      - NODE_ENV=production
      - INSTANCE_ID=1
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - ./logs:/app/logs
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost:3000" ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "10"

  frontend-2:
    container_name: ${PREFIX}-frontend-2
    image: ${PREFIX}-frontend:latest
    # build: frontend-1 이미지 재사용
    restart: unless-stopped
    ports:
      - "13002:3000"
    networks:
      - app-network
    environment:
      - TZ=Asia/Seoul
      - NODE_ENV=production
      - INSTANCE_ID=2
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - ./logs:/app/logs
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost:3000" ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "20m"
        max-file: "10"

networks:
  app-network:
    name: ${PREFIX}-network
    driver: bridge

volumes:
  node-modules-cache:
    name: ${PREFIX}-node-modules-cachea
```

## NextJS

```
cd /opt/docker/pincoin/frontend
git clone git@github.com-mairoo:mairoo/milk repo
```

## nginx 로드밸런서

### `/opt/docker/pincoin/frontend/nginx/nginx.conf`

```
user nginx;
worker_processes auto;
error_log /app/logs/load-balancer-error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" "$http_x_forwarded_host"';

    access_log /app/logs/load-balancer-access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;

    # Next.js 정적 파일을 위한 gzip 설정
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    include /etc/nginx/conf.d/*.conf;
}
```

### `/opt/docker/pincoin/frontend/nginx/site.conf`

```
upstream frontend {
    server frontend-1:3000 max_fails=3 fail_timeout=30s;
    server frontend-2:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 3090;
    server_name localhost;

    # Docker 네트워크만 신뢰
    real_ip_header X-Forwarded-For;
    set_real_ip_from 172.17.0.0/16;
    set_real_ip_from 172.18.0.0/16;

    # Next.js static files caching
    location /_next/static/ {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;

        # Cache static files for a long time
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;

        expires 1h;
        add_header Cache-Control "public";
    }

    # All other requests
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;

        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # WebSocket 지원 (Next.js SSR용)
	    proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;

        # 헬스체크 실패 시 다른 서버로 재시도
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_next_upstream_tries 3;
    }

    # 헬스체크 엔드포인트
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## 주요 명령어

### 최초 시행

````shell
### 운영 환경

# 1. NextJS 프론트엔드
docker compose build frontend-1
docker compose up -d frontend-1 frontend-2
docker compose logs -f frontend-1 frontend-2

# 2. nginx 시작 (프론트엔드 로드밸런서)
docker compose up -d nginx

# 3. 전체 상태 확인
docker compose ps
````

```shell
# nginx 로드밸런서 재시작
docker compose restart nginx
```

## 구동 스크립트

### `/opt/docker/pincoin/frontend/build.sh`

```shell
#!/bin/bash
echo "📥 Pulling latest code from git..."
cd repo
git pull
cd ..

echo "🔨 Building frontend image..."
docker compose build --no-cache frontend-1
```

### `/opt/docker/pincoin/frontend/deploy.sh`

```shell
#!/bin/bash

check_health() {
    local service=$1
    local port=""
    if [ "$service" = "backend-1" ]; then
        port="10011"
    elif [ "$service" = "backend-2" ]; then
        port="10012"
    fi

    echo "⏳ Waiting for $service to be healthy..."
    for i in {1..36}; do  # 3분 대기 (5초 * 36)
        if curl -f -s http://localhost:$port/health > /dev/null 2>&1; then
            echo "✅ $service is healthy!"
            return 0
        fi
        echo -n "."
        sleep 5
    done

    echo "❌ $service failed to become healthy!"
    return 1
}

restart_service() {
    local service=$1
    echo "🔄 Restarting $service..."

    docker compose stop $service
    docker compose up -d $service

    if check_health $service; then
        return 0
    else
        return 1
    fi
}

# 서비스 순차적 재시작
echo "🔄 Rolling restart..."

# backend-1 재시작
if restart_service "backend-1"; then
    echo "✅ backend-1 restarted successfully"
else
    echo "❌ backend-1 restart failed"
    exit 1
fi

# backend-2 재시작
if restart_service "backend-2"; then
    echo "✅ backend-2 restarted successfully"
else
    echo "❌ backend-2 restart failed"
    exit 1
fi
```

### `/opt/docker/pincoin/frontend/full-deploy.sh`

```shell
#!/bin/bash

echo "🚀 Starting full deployment..."
source ./build.sh && source ./deploy.sh && echo "🎉 Full deployment completed!"
```

# 호스트 설정

## `/etc/nginx/sites-enabled/pincoin.kr`

```
# HTTP to HTTPS 리다이렉트 (프론트엔드)
server {
    listen 80;
    listen [::]:80;
    server_name *.pincoin.kr;
    # HTTP 요청을 HTTPS로 리다이렉트
    return 301 https://$server_name$request_uri;
}

# HTTPS 서버 (프론트엔드)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name *.pincoin.kr;

    # SSL 인증서 경로 (Let's Encrypt 기준)
    ssl_certificate /opt/docker/pincoin/ssl/pincoin.kr.pem;
    ssl_certificate_key /opt/docker/pincoin/ssl/pincoin.kr.key;

    # SSL 보안 설정
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS 헤더 (HTTPS 강제)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 요청 크기 제한
    client_max_body_size 10M;

    # 보안 헤더
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # 프록시 설정
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    proxy_connect_timeout 10s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;

    # 로그 설정
    access_log /opt/docker/pincoin/frontend/logs/host-access.log;
    error_log /opt/docker/pincoin/frontend/logs/host-error.log;

    location / {
        proxy_pass http://localhost:3090;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 설정 (Next.js SSR에 필요)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

## logrotate

### 구성

```shell
sudo chmod 755 /opt/docker/pincoin/frontend/logs/
sudo chown www-data:root /opt/docker/pincoin/frontend/logs/
sudo chown www-data:root /opt/docker/pincoin/frontend/logs/*.log
```

### `/etc/logrotate.d/pincoin`

```
# 프론트엔드 호스트 nginx 로그
/opt/docker/pincoin/frontend/logs/host-*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    su www-data root
    create 644 www-data root
    postrotate
        systemctl reload nginx 2>/dev/null || true
    endscript
}

# 프론트엔드 도커 nginx 로그
/opt/docker/pincoins/frontend/logs/load-balancer-*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    su root root
    create 644 root root
    copytruncate
}
```

### 주요 명령어

```shell
# 설정 문법 검사
sudo logrotate -d /etc/logrotate.d/pincoin

# 강제 로테이션 테스트
sudo logrotate -f /etc/logrotate.d/pincoin

# 상태 확인
sudo cat /var/lib/logrotate/status | grep pincoin
```