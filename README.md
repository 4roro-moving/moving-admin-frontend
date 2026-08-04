# moving-admin-frontend

MOVING 서비스의 관리자 전용 프론트엔드입니다. 일반 사용자 프론트와 분리된 Next.js App Router 애플리케이션으로 운영되며, 백엔드의 `/api/admin/*` API를 사용할 예정입니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- TanStack Query
- Zustand
- Zod
- React Hook Form
- `fetch` 기반 공통 API Client

## 로컬 실행

```bash
npm install
npm run dev -- -p 3001
```

- 관리자 앱 기본 포트: `3001`
- 일반 사용자 서비스 URL 예시: `http://localhost:3000`

## 환경 변수

`.env.example`을 참고해 필요한 값을 설정합니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SERVICE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

`NEXT_PUBLIC_*` 환경 변수에는 비밀 값을 넣지 않습니다.

## 초기 구조

```text
src/
├─ app/
│  ├─ (auth)/
│  │  └─ login/
│  ├─ (admin)/
│  │  ├─ dashboard/
│  │  ├─ reports/
│  │  └─ contents/reviews/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/admin/layout/
├─ lib/
│  ├─ api/
│  └─ constants/
├─ providers/
├─ stores/
└─ types/
```

## 인증 흐름 예정

- 일반 사용자 프론트에서 `ADMIN` 로그인 성공 시 관리자 앱으로 이동
- 관리자 앱 진입 후 Refresh Cookie 기반 세션 복구 수행
- 세션 복구 후 `ADMIN` 역할 검증

이번 초기 작업에서는 실제 로그인 API 연결, 세션 복구, Role Guard를 구현하지 않았습니다.

## 현재 구현 범위

- 관리자용 route group과 기본 레이아웃
- 대시보드, 신고 관리, 리뷰 관리 placeholder 화면
- Query Provider, Auth Provider skeleton
- `fetch` 기반 API Client skeleton
- 관리자 인증 Zustand store skeleton

## 후속 작업

- 관리자 로그인 및 세션 복구
- 관리자 Role Guard
- 신고 관리 API 연동
- 리뷰 관리 API 연동
- 일반 사용자 프론트의 ADMIN redirect 연결
