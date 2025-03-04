import { baseQueryWithRetry } from '@/store/common/baseQuery';
import { logout, setCredentials } from '@/store/features/auth/slice';
import { Auth } from '@/types/features/auth/auth';
import { storage } from '@/utils';
import { cookies } from '@/utils/common/cookies';
import { createApi } from '@reduxjs/toolkit/query/react';
import { jwtDecode } from 'jwt-decode';

/**
 * Redux Toolkit Query를 사용하여 인증 관련 API 엔드포인트들을 정의
 * - login: 로그인 처리
 * - refresh: 토큰 갱신
 * - logout: 로그아웃 처리
 */
export const authApi = createApi({
  // API 슬라이스의 고유 식별자
  reducerPath: 'authApi',
  // 기본 API 설정 (재시도 로직이 포함된 baseQuery 사용)
  // baseQuery: baseQueryWithRetry,
  baseQuery: baseQueryWithRetry,
  // API 엔드포인트 정의
  endpoints: (builder) => ({
    /**
     * 로그인 엔드포인트
     * @param credentials - 로그인에 필요한 인증 정보 (이메일, 비밀번호, 자동로그인 여부)
     * @returns 로그인 응답 데이터 (액세스 토큰, 만료 시간 등)
     */
    login: builder.mutation<Auth.SignInResponse, Auth.SignInRequest>({
      // API 요청 설정
      query: (credentials) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
      // 요청 시작 시 실행되는 콜백
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          // 1. API 요청이 성공적으로 완료될 때까지 대기
          const { data } = await queryFulfilled;

          // 2. 브라우저 로컬스토리지에 저장 - 브라우저 재시작해도 유지되어야 하는 데이터
          // - 자동 로그인 설정
          storage.setRememberMe(credentials.rememberMe);
          // - 토큰 갱신 타이밍 계산용
          storage.setLastRefreshTime(Date.now());

          // 3. 쿠키에 저장 - Next.js 미들웨어에서 서버 사이드 인증 체크용
          // - 인증 상태
          cookies.setAuthCookie(data.data.expiresIn);

          // - 관리자 여부
          const decodedToken: Auth.JwtPayload = jwtDecode(
            data.data.accessToken,
          );

          if (decodedToken.role === 'ROLE_ADMIN') {
            cookies.setAdminCookie(data.data.expiresIn);
          }

          // 4. Redux 스토어에 저장 - 메모리에서 실시간 상태 관리용
          // - 액세스 토큰 등 인증 정보
          dispatch(setCredentials(data));
        } catch (error) {
          // 401 등 오류 발생 시
          console.debug('로그인 실패: ', error);
        }
      },
    }),

    /**
     * 토큰 갱신 엔드포인트
     * 액세스 토큰이 만료되었을 때 새로운 토큰을 발급받음
     */
    refresh: builder.mutation<Auth.SignInResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // 쿠키 저장
          // - 인증 상태
          cookies.setAuthCookie(data.data.expiresIn);

          // - 관리자 여부
          const decodedToken: Auth.JwtPayload = jwtDecode(
            data.data.accessToken,
          );

          if (decodedToken.role === 'ROLE_ADMIN') {
            cookies.setAdminCookie(data.data.expiresIn);
          }

          // 리프레시 시간 저장
          // 두 가지 경우에 저장됨:
          // 1. 이 refresh mutation을 직접 호출할 때
          // 2. baseQueryWithRetry에서 401 에러 발생으로 자동 리프레시될 때
          storage.setLastRefreshTime(Date.now());

          // Redux store 인증 정보 갱신
          dispatch(setCredentials(data));
        } catch (error) {
          console.debug('토큰 갱신 실패: ', error);
        }
      },
    }),

    /**
     * 로그아웃 엔드포인트
     * 서버에 로그아웃 요청을 보내고 클라이언트의 인증 상태를 초기화
     */
    logout: builder.mutation<Auth.SignOutResponse, void>({
      query: () => ({
        url: '/auth/sign-out',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // 인증 관련 쿠키 삭제
          cookies.removeCookie('isAuthenticated');
          cookies.removeCookie('isAdmin');

          // Redux store의 인증 상태 초기화
          dispatch(logout());
        } catch (error) {
          console.debug('로그아웃 실패: ', error);
        }
      },
    }),
  }),
});

// 각 엔드포인트에 대한 React hooks 내보내기
export const { useLoginMutation, useRefreshMutation, useLogoutMutation } =
  authApi;
