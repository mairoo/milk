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

    /**
     * NextAuth 세션 전략
     * 1. jwt
     * 2. database
     *
     * jwt 장단점
     *
     * - 클라이언트 브라우저에 HttpOnly 쿠키 형태로 암호화된 세션 데이터 저장
     * - Next.js 서버 또는 백엔드에는 세션 데이터 저장 없음
     * - 관리자 강제 로그아웃 조치 불가 = 토큰 탈취되어도 토큰 만료까지 유효
     */

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30일 (NextAuth 세션)
    },

    /**
     * 콜백: 무엇을 저장하고 반환할까?
     *
     * - 인증 과정에서 데이터를 변형/검증하고 반환
     * - NextAuth가 결과를 기다림 (동기적 처리)
     */
    callbacks: {
        async jwt({token, account, profile}) {
            // 초기 로그인 시 Keycloak 토큰 정보 저장
            if (account?.access_token) {
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
                return null as unknown as JWT
            }

            // 액세스 토큰이 아직 유효하면 기존 토큰 반환
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            // 액세스 토큰 만료 이후 갱신 시도
            const refreshedToken = await refreshAccessToken(token)

            if (refreshedToken.error) {
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

    /**
     * 이벤트: 추가로 어떤 작업을 더 처리할까?
     *
     * - 인증 이벤트 발생 시 추가 작업 수행
     * - NextAuth는 결과를 기다리지 않음 (비동기적 처리)
     * - 반환값 무시, 로깅/알림/외부 API 호출 등
     */
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
