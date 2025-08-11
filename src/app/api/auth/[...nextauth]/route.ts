import NextAuth, {NextAuthOptions} from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import {JWT} from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
        })
    ],

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30일 (NextAuth 세션)
    },

    callbacks: {
        async jwt({token, account, profile}) {
            // 초기 로그인 시 Keycloak 토큰 정보 저장
            if (account?.access_token) {
                console.log('=== 초기 로그인 ===')
                console.log('Access token expires in:', account.expires_at ?
                    new Date(account.expires_at * 1000).toISOString() : 'unknown')

                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token || ''
                token.idToken = account.id_token || ''
                token.accessTokenExpires = account.expires_at
                    ? account.expires_at * 1000
                    : 0
                token.refreshTokenExpires = account.refresh_expires_in
                    ? Date.now() + (account.refresh_expires_in * 1000)
                    : 0
                token.error = undefined
            }

            // 프로필 정보 저장 (사용자 식별용)
            if (profile) {
                token.preferred_username = profile.preferred_username || ''
            }

            // 이전 토큰 갱신 오류가 있으면 세션 무효화
            if (token.error === 'RefreshTokenExpired' || token.error === 'RefreshAccessTokenError') {
                console.log('토큰 갱신 실패로 세션 무효화')
                return null as unknown as JWT
            }

            // 액세스 토큰이 아직 유효하면 기존 토큰 반환
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            // 액세스 토큰 만료 시 갱신 시도
            console.log('=== 토큰 갱신 (5분 경과) ===')
            const refreshedToken = await refreshAccessToken(token)

            if (refreshedToken.error) {
                console.log('토큰 갱신 실패 - Keycloak에서 로그아웃된 것으로 판단')
                return null as unknown as JWT
            }

            return refreshedToken
        },

        async session({session, token}) {
            if (!token) {
                return {
                    ...session,
                    user: undefined,
                    accessToken: undefined,
                    expires: new Date(0).toISOString()
                }
            }

            // 세션 정보 설정
            if (session.user) {
                session.user.id = token.sub!
                session.user.preferred_username = token.preferred_username || ''
            }

            session.accessToken = token.accessToken
            return session
        }
    },

    events: {
        async signOut({token}) {
            // Keycloak 로그아웃 처리
            if (token.idToken) {
                try {
                    const issuerUrl = process.env.KEYCLOAK_ISSUER!
                    const logoutUrl = `${issuerUrl}/protocol/openid-connect/logout`
                    const params = new URLSearchParams({
                        id_token_hint: token.idToken as string,
                        post_logout_redirect_uri: process.env.NEXTAUTH_URL!
                    })

                    await fetch(`${logoutUrl}?${params.toString()}`)
                    console.log('Keycloak 로그아웃 완료')
                } catch (error) {
                    console.error('Keycloak logout error:', error)
                }
            }
        }
    }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const issuerUrl = process.env.KEYCLOAK_ISSUER!
        const refreshUrl = `${issuerUrl}/protocol/openid-connect/token`

        // 리프레시 토큰 기본 검증
        if (!token.refreshToken) {
            console.error('리프레시 토큰이 없습니다.')
            return {...token, error: 'RefreshAccessTokenError'}
        }

        if (token.refreshTokenExpires && Date.now() >= token.refreshTokenExpires) {
            console.error('리프레시 토큰이 만료되었습니다.')
            return {...token, error: 'RefreshTokenExpired'}
        }

        const requestBody = new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
        })

        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody,
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            console.error('토큰 갱신 실패:', refreshedTokens.error)

            // Keycloak에서 세션이 무효화된 경우
            if (response.status === 400 && refreshedTokens.error === 'invalid_grant') {
                console.error('Keycloak 세션이 무효화됨 (로그아웃됨)')
                return {...token, error: 'RefreshTokenExpired'}
            }

            return {...token, error: 'RefreshAccessTokenError'}
        }

        console.log('토큰 갱신 성공 - 다음 갱신:', new Date(Date.now() + refreshedTokens.expires_in * 1000).toISOString())

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            refreshTokenExpires: refreshedTokens.refresh_expires_in
                ? Date.now() + (refreshedTokens.refresh_expires_in * 1000)
                : token.refreshTokenExpires,
            error: undefined,
        }
    } catch (error) {
        console.error('토큰 갱신 중 예외 발생:', error)
        return {...token, error: 'RefreshAccessTokenError'}
    }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}

/**
 * ===================================================================
 * 리프레시 토큰 관리 시스템 상세 설명
 * ===================================================================
 *
 * ## 리프레시 발생 조건
 *
 * ### 1. 자동 리프레시 (주기적 갱신)
 * ```
 * SessionProvider의 refetchInterval: 240초 (4분)마다 실행
 * ↓
 * useSession()이 /api/auth/session 호출
 * ↓
 * JWT 콜백에서 액세스 토큰 만료 시간 확인
 * ↓
 * Date.now() >= token.accessTokenExpires 조건 만족 시 갱신
 * ```
 *
 * ### 2. 수동 리프레시 (사용자 액션 시)
 * ```
 * 사용자가 페이지 새로고침 또는 API 호출
 * ↓
 * 윈도우 포커스 시 (refetchOnWindowFocus: true)
 * ↓
 * 액세스 토큰 만료 확인 후 갱신
 * ```
 *
 * ### 3. 갱신 조건 상세
 * - **액세스 토큰 만료 시간**: 5분 (Keycloak 설정)
 * - **갱신 주기**: 4분 (토큰 만료 1분 전)
 * - **리프레시 토큰 유효 기간**: 보통 30분~24시간 (Keycloak 설정)
 * - **NextAuth 세션 만료**: 30일 (maxAge 설정)
 *
 * ## 리프레시 책임 주체
 *
 * ### NextAuth.js 서버 (주체)
 * ```
 * 역할: 리프레시 토큰 관리 및 갱신 요청 처리
 * 위치: /app/api/auth/[...nextauth]/route.ts
 * 실행: JWT 콜백 함수 내에서 refreshAccessToken() 호출
 * ```
 *
 * ### SessionProvider (트리거)
 * ```
 * 역할: 주기적 갱신 스케줄링
 * 위치: 클라이언트 React 컴포넌트
 * 실행: refetchInterval로 정기적 세션 확인 요청
 * ```
 *
 * ### Keycloak 서버 (토큰 발급자)
 * ```
 * 역할: 새로운 액세스 토큰 발급
 * 엔드포인트: {KEYCLOAK_ISSUER}/protocol/openid-connect/token
 * 검증: 리프레시 토큰의 유효성 및 세션 상태 확인
 * ```
 *
 * ## 리프레시 처리 절차
 *
 * ### 1단계: 갱신 필요성 판단
 * ```
 * JWT 콜백 실행
 * ↓
 * 현재 시간과 액세스 토큰 만료 시간 비교
 * ↓
 * if (Date.now() >= token.accessTokenExpires) {
 *     리프레시 토큰 갱신 시작
 * }
 * ```
 *
 * ### 2단계: 리프레시 토큰 검증
 * ```
 * 리프레시 토큰 존재 여부 확인
 * ↓
 * 리프레시 토큰 만료 시간 확인
 * ↓
 * 검증 실패 시 → 세션 무효화 (로그아웃)
 * ```
 *
 * ### 3단계: Keycloak 토큰 갱신 요청
 * ```
 * POST {KEYCLOAK_ISSUER}/protocol/openid-connect/token
 * Body: {
 *   grant_type: 'refresh_token',
 *   refresh_token: token.refreshToken,
 *   client_id: KEYCLOAK_CLIENT_ID,
 *   client_secret: KEYCLOAK_CLIENT_SECRET
 * }
 * ```
 *
 * ### 4단계: 응답 처리
 * ```
 * 성공 (200) → 새 토큰으로 JWT 업데이트 → httpOnly 쿠키 갱신
 * 실패 (400) → 'invalid_grant' 에러 → 세션 무효화
 * 실패 (기타) → 'RefreshAccessTokenError' → 세션 무효화
 * ```
 *
 * ### 5단계: 클라이언트 상태 업데이트
 * ```
 * 갱신 성공 → useSession()이 새 세션 정보 반환
 * 갱신 실패 → useSession()이 unauthenticated 상태 반환
 * 자동 리디렉션 → 로그인 페이지로 이동
 * ```
 *
 * ## 에러 처리 및 장애 대응
 *
 * ### 일반적인 갱신 실패 원인
 * 1. **Keycloak 세션 만료**: 다른 브라우저/탭에서 로그아웃
 * 2. **리프레시 토큰 만료**: 장시간 비활성 상태
 * 3. **네트워크 오류**: Keycloak 서버 연결 실패
 * 4. **설정 오류**: 클라이언트 ID/Secret 불일치
 *
 * ### 자동 복구 메커니즘
 * ```
 * 갱신 실패 감지
 * ↓
 * JWT 콜백에서 null 반환
 * ↓
 * NextAuth.js가 자동으로 httpOnly 쿠키 삭제
 * ↓
 * 클라이언트에서 unauthenticated 상태로 변경
 * ↓
 * 보호된 페이지 접근 시 자동으로 로그인 페이지 리디렉션
 * ```
 *
 * ## 보안 고려사항
 *
 * ### 토큰 보안
 * - **액세스 토큰**: 5분 짧은 수명으로 노출 위험 최소화
 * - **리프레시 토큰**: httpOnly 쿠키에 저장하여 XSS 공격 방지
 * - **자동 순환**: 갱신 시마다 새로운 리프레시 토큰 발급 (옵션)
 *
 * ### 세션 무결성
 * - **실시간 검증**: Keycloak 세션 상태와 동기화
 * - **즉시 무효화**: 갱신 실패 시 로컬 세션 즉시 삭제
 * - **크로스탭 동기화**: 브라우저 탭 간 세션 상태 일관성 유지
 */