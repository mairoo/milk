import NextAuth, { NextAuthOptions } from 'next-auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { JWT } from 'next-auth/jwt'

/**
 * NextAuth.js 인증 설정
 * Keycloak과 연동하여 OAuth 2.0/OpenID Connect 인증을 처리합니다.
 * JWT 기반 세션 관리와 토큰 자동 갱신을 지원합니다.
 */
export const authOptions: NextAuthOptions = {
    /**
     * 인증 제공자 설정
     * Keycloak OAuth 2.0/OpenID Connect 제공자를 설정합니다.
     */
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,

            // 브라우저 리디렉션용 - 외부 URL
            issuer: process.env.KEYCLOAK_ISSUER!,

            // 서버 내부 통신용 - 모든 엔드포인트를 내부 URL로 재정의
            authorization: `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/auth`,
            token: `${process.env.KEYCLOAK_ISSUER_INTERNAL}/protocol/openid-connect/token`,
            userinfo: `${process.env.KEYCLOAK_ISSUER_INTERNAL}/protocol/openid-connect/userinfo`,

            // OpenID Connect Discovery 비활성화하고 수동 설정
            wellKnown: undefined,

            // JWKS 엔드포인트 추가 (JWT 토큰 검증용)
            jwks_endpoint: `${process.env.KEYCLOAK_ISSUER_INTERNAL}/protocol/openid-connect/certs`,
        })
    ],

    /**
     * 세션 관리 설정
     * JWT 기반 세션을 사용하여 서버 메모리 사용량을 최적화합니다.
     * 데이터베이스 없이도 확장 가능한 세션 관리가 가능합니다.
     */
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30일
    },

    /**
     * 콜백 함수 설정
     * 인증 과정에서 JWT 토큰과 세션 데이터를 커스터마이징합니다.
     */
    callbacks: {
        /**
         * JWT 콜백 - 토큰 생성 및 갱신 처리
         * Keycloak에서 받은 액세스 토큰, 리프레시 토큰, 사용자 정보를 JWT에 저장합니다.
         * 토큰 만료 시 자동으로 리프레시 토큰을 사용하여 갱신합니다.
         */
        async jwt({ token, account, profile }) {
            // 초기 로그인 시 Keycloak 토큰 정보 저장
            if (account?.access_token) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token || ''
                token.idToken = account.id_token || ''
                token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0
                token.refreshTokenExpires = account.refresh_expires_in
                    ? Date.now() + (account.refresh_expires_in * 1000)
                    : 0
            }

            // 프로필 정보 저장
            if (profile) {
                token.roles = profile.realm_access?.roles || []
                token.groups = profile.groups || []
                token.preferred_username = profile.preferred_username || ''
            }

            // 액세스 토큰이 만료되지 않았으면 기존 토큰 반환
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            // 액세스 토큰 만료 시 리프레시 토큰으로 갱신
            return await refreshAccessToken(token)
        },

        /**
         * 세션 콜백 - 클라이언트에 전달할 세션 데이터 구성
         * JWT에서 필요한 정보만 추출하여 세션 객체를 구성합니다.
         * 보안상 민감한 토큰 정보는 서버 사이드에서만 사용합니다.
         */
        async session({ session, token }) {
            // 세션에 필요한 정보만 전달 (보안상 민감한 토큰은 클라이언트에 노출하지 않음)
            if (session.user) {
                session.user.id = token.sub!
                session.user.roles = token.roles
                session.user.groups = token.groups
                session.user.preferred_username = token.preferred_username
            }

            // 백엔드 API 호출용 액세스 토큰 (서버 사이드에서만 사용)
            session.accessToken = token.accessToken
            if (token.error) {
                session.error = token.error
            }

            return session
        }
    },

    /**
     * 커스텀 페이지 설정
     * NextAuth.js의 기본 페이지 대신 커스텀 페이지를 사용합니다.
     */
    pages: {
        signIn: '/auth/signin',    // 커스텀 로그인 페이지
        error: '/auth/error',      // 인증 오류 페이지
    },

    /**
     * 이벤트 핸들러 설정
     * 인증 관련 이벤트 발생 시 추가 처리를 수행합니다.
     */
    events: {
        /**
         * 로그아웃 이벤트 핸들러
         * NextAuth.js 로그아웃 시 Keycloak 서버에서도 완전히 로그아웃합니다.
         */
        async signOut({ token }) {
            // Keycloak 로그아웃 처리
            if (token.idToken) {
                try {
                    const issuerUrl = process.env.KEYCLOAK_ISSUER!
                    const logoutUrl = `${issuerUrl}/protocol/openid-connect/logout`
                    const params = new URLSearchParams({
                        id_token_hint: token.idToken as string,
                        post_logout_redirect_uri: process.env.NEXTAUTH_URL!
                    })

                    // Keycloak 서버에 로그아웃 요청
                    await fetch(`${logoutUrl}?${params.toString()}`)
                } catch (error) {
                    console.error('Keycloak logout error:', error)
                }
            }
        }
    }
}

/**
 * 리프레시 토큰을 사용하여 액세스 토큰을 갱신합니다.
 *
 * @description
 * Keycloak의 리프레시 토큰을 사용하여 만료된 액세스 토큰을 새로 발급받습니다.
 * 토큰 갱신에 실패할 경우 에러 상태를 반환하여 재로그인을 유도합니다.
 *
 * @param {JWT} token - 현재 JWT 토큰 (리프레시 토큰 포함)
 * @returns {Promise<JWT>} 갱신된 JWT 토큰 또는 에러 상태가 포함된 토큰
 *
 * @example
 * // JWT 콜백에서 자동 호출
 * const refreshedToken = await refreshAccessToken(token)
 *
 * @throws 네트워크 오류나 Keycloak 서버 오류 시 에러 상태 토큰 반환
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        // 서버 내부 통신이므로 INTERNAL URL 사용
        const issuerUrl = process.env.KEYCLOAK_ISSUER_INTERNAL!
        const refreshUrl = `${issuerUrl}/protocol/openid-connect/token`

        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID!,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken,
            }),
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
            console.error('Token refresh failed:', refreshedTokens)
            // 에러를 던지지 않고 직접 에러 토큰 반환
            return {
                ...token,
                error: 'RefreshAccessTokenError',
            }
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            refreshTokenExpires: refreshedTokens.refresh_expires_in
                ? Date.now() + (refreshedTokens.refresh_expires_in * 1000)
                : token.refreshTokenExpires,
        }
    } catch (error) {
        console.error('Error refreshing access token:', error)

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }