# 설치

```
## 현재 위치에서 repo 디렉토리 생성
mkdir repo

## repo 디렉토리로 이동
cd repo

## 현재 디렉토리에 Next.js 프로젝트 생성 (점 사용)
npx create-next-app@latest . --typescript --tailwind --eslint
```

옵션 설정

```
Need to install the following packages:
create-next-app@15.4.1
Ok to proceed? (y) y

✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use Turbopack for `next dev`? … No
✔ Would you like to customize the import alias (`@/*` by default)? … Yes
✔ What import alias would you like configured? … @/*
```

- `src/` 소스 디렉토리 분리
- Turbopack 실험적 기능으로 미사용
- 상대경로 대신 절대경로 사용으로 코드 가독성과 유지보수성 향상

# 실행

```
npm run dev
```