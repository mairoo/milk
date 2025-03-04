/**
 * JWT 토큰 디코딩 시 페이로드 데이터 타입
 * @property sub - 사용자 이메일 (subject)
 * @property role - 사용자 역할 (ex: "ROLE_ADMIN", "ROLE_MEMBER")
 * @property username - 사용자명
 * @property iat - 토큰 발급 시간 (issued at)
 * @property exp - 토큰 만료 시간 (expiration)
 */
export type JwtPayload = {
  sub: string;
  role: string;
  username: string;
  iat: number;
  exp: number;
};

/**
 * 로그인 요청 시 필요한 데이터 타입
 */
export interface SignInRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * 회원가입 요청 시 필요한 데이터 타입
 */
export interface SignUpRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  lastName: string;
  firstName: string;
}

/**
 * 로그인 성공 시 서버로부터 받는 응답 데이터 타입
 */
export interface SignInResponse {
  status: number;
  timestamp: string;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

/**
 * 로그아웃 응답 데이터 타입
 */
export interface SignOutResponse {
  username: string;
  email: string;
  password: string;
}

/**
 * Redux store에서 관리하는 인증 관련 상태 타입
 */
export interface AuthState {
  accessToken: string | null;
  tokenType: string | null;
  expiresIn: number | null;
  isLoading: boolean;
  isProcessing: boolean;
  role: string;
  error: string | null;
  fieldErrors: Record<string, string>;
}