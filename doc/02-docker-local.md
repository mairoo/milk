# 도커 배포

## 개발환경 (Hot Reload)

- 볼륨 마운트
- Next.js Hot Reload + npm run dev

### 구성

```
~/Projects/tropical/frontend/
~/Projects/tropical/frontend/.env
~/Projects/tropical/frontend/docker-compose.yml
~/Projects/tropical/frontend/repo/
```

### `.env`

```
PREFIX=pincoin-tropical
```

### `docker-compose.yml`

```yaml
services:
  frontend:
    container_name: ${PREFIX}-frontend
    image: ${PREFIX}-frontend:local
    build:
      context: ./repo
      dockerfile: Dockerfile.local
    working_dir: /app
    volumes:
      - ./repo:/app:cached # 소스 코드를 볼륨 마운트
      - node-modules-cache:/app/node_modules
    ports:
      - "3000:3000"
    networks:
      - app-network
    environment:
      - TZ=Asia/Seoul
      - NODE_ENV=development
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost:3000" ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

networks:
  app-network:
    name: ${PREFIX}-network
    driver: bridge

volumes:
  node-modules-cache:
    name: ${PREFIX}-node-modules-cache
```

### 명령어

```shell
# 프론트엔드 시작
docker compose up -d

# 프론트엔드 인스턴스 이미지 빌드
docker compose build --no-cache frontend

# 프론트엔드 인스턴스 중지
docker compose stop frontend

# 프론트엔드 인스턴스 시작
docker compose up -d frontend

# 컨테이너에 접속 (의존성 설치 등)
docker compose exec frontend sh

# 로그
docker compose logs -f frontend
```