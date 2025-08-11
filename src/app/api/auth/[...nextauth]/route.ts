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
        maxAge: 30 * 24 * 60 * 60, // 30일
    },

    callbacks: {
        async jwt({token, account, profile}) {
            // 초기 로그인 시 Keycloak 토큰 정보 저장
            if (account?.access_token) {
                console.log('=== 초기 로그인 토큰 정보 ===')
                console.log('Account issuer:', account.issuer)
                console.log('Environment KEYCLOAK_ISSUER:', process.env.KEYCLOAK_ISSUER)
                console.log('Access token (first 50 chars):', account.access_token?.substring(0, 50))

                // JWT 토큰 디코딩해서 issuer 확인
                try {
                    const payload = JSON.parse(Buffer.from(account.access_token!.split('.')[1], 'base64').toString())
                    console.log('Token payload issuer:', payload.iss)
                    console.log('Token payload audience:', payload.aud)
                    console.log('Token payload expires:', new Date(payload.exp * 1000).toISOString())
                } catch (e) {
                    console.log('토큰 디코딩 실패:', e)
                }

                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token || ''
                token.idToken = account.id_token || ''
                token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0
                token.refreshTokenExpires = account.refresh_expires_in
                    ? Date.now() + (account.refresh_expires_in * 1000)
                    : 0
                token.error = undefined // 초기화
            }

            // 프로필 정보 저장
            if (profile) {
                token.roles = profile.realm_access?.roles || []
                token.groups = profile.groups || []
                token.preferred_username = profile.preferred_username || ''
            }

            // 이전에 토큰 갱신 오류가 발생했다면 만료된 상태로 유지
            if (token.error === 'RefreshTokenExpired' || token.error === 'RefreshAccessTokenError') {
                console.log('이전 토큰 갱신 실패 - 만료된 상태로 유지')
                // 토큰을 완전히 무효화하여 API 호출 불가능하게 만듦
                token.accessToken = ''
                token.refreshToken = ''
                token.accessTokenExpires = 0
                return token
            }

            // 액세스 토큰이 만료되지 않았으면 기존 토큰 반환
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            console.log('=== 토큰 갱신 시도 ===')
            console.log('Current time:', new Date().toISOString())
            console.log('Token expires at:', new Date(token.accessTokenExpires).toISOString())
            console.log('Refresh token (first 20 chars):', token.refreshToken?.toString().substring(0, 20))

            // 액세스 토큰 만료 시 리프레시 토큰으로 갱신
            const refreshedToken = await refreshAccessToken(token)

            // 토큰 갱신에 실패했다면 토큰을 무효화
            if (refreshedToken.error) {
                console.log('토큰 갱신 실패 - 토큰 무효화:', refreshedToken.error)
                refreshedToken.accessToken = ''
                refreshedToken.refreshToken = ''
                refreshedToken.accessTokenExpires = 0
            }

            return refreshedToken
        },

        async session({session, token}) {
            // 토큰이 무효화된 상태면 session.error 설정
            if (token.error === 'RefreshTokenExpired' || token.error === 'RefreshAccessTokenError'
                || !token.accessToken || token.accessTokenExpires <= 0) {
                session.error = token.error || 'TokenExpired'
                session.accessToken = undefined // API 호출 불가능하게 설정

                // 사용자 정보는 최소한으로만 유지
                if (session.user) {
                    session.user.id = token.sub!
                    session.user.roles = []
                    session.user.groups = []
                    session.user.preferred_username = token.preferred_username || ''
                }
                return session
            }

            // 정상 상태일 때만 모든 정보 제공
            if (session.user) {
                session.user.id = token.sub!
                session.user.roles = token.roles || []
                session.user.groups = token.groups || []
                session.user.preferred_username = token.preferred_username || ''
            }

            // 백엔드 API 호출용 액세스 토큰
            session.accessToken = token.accessToken

            return session
        }
    },

    pages: {
        signIn: '/auth/sign-in',
        error: '/auth/error',
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
                } catch (error) {
                    console.error('Keycloak logout error:', error)
                }
            }
        }
    }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        console.log('=== 토큰 갱신 요청 시작 ===')

        const issuerUrl = process.env.KEYCLOAK_ISSUER!
        const refreshUrl = `${issuerUrl}/protocol/openid-connect/token`

        console.log('Refresh URL:', refreshUrl)
        console.log('Client ID:', process.env.KEYCLOAK_CLIENT_ID)

        // 리프레시 토큰 유효성 검사
        if (!token.refreshToken) {
            console.error('리프레시 토큰이 없습니다.')
            return {
                ...token,
                error: 'RefreshAccessTokenError',
            }
        }

        // 리프레시 토큰 만료 검사
        if (token.refreshTokenExpires && Date.now() >= token.refreshTokenExpires) {
            console.error('리프레시 토큰이 만료되었습니다.')
            return {
                ...token,
                error: 'RefreshTokenExpired',
            }
        }

        const requestBody = new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
        })

        console.log('Request body (without secrets):', {
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            grant_type: 'refresh_token',
            refresh_token_length: token.refreshToken?.toString().length
        })

        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody,
        })

        console.log('Response status:', response.status)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))

        const refreshedTokens = await response.json()

        if (!response.ok) {
            console.error('Token refresh failed:', refreshedTokens)
            console.error('Response status:', response.status)
            console.error('Error details:', refreshedTokens.error_description || refreshedTokens.error)

            // 특정 오류에 따른 처리
            if (response.status === 400) {
                if (refreshedTokens.error === 'invalid_grant') {
                    console.error('리프레시 토큰이 만료되었거나 무효합니다.')
                    return {
                        ...token,
                        error: 'RefreshTokenExpired',
                    }
                }
            }

            return {
                ...token,
                error: 'RefreshAccessTokenError',
            }
        }

        console.log('토큰 갱신 성공!')
        console.log('New access token length:', refreshedTokens.access_token?.length)
        console.log('New expires_in:', refreshedTokens.expires_in)

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            refreshTokenExpires: refreshedTokens.refresh_expires_in
                ? Date.now() + (refreshedTokens.refresh_expires_in * 1000)
                : token.refreshTokenExpires,
            error: undefined, // 오류 상태 초기화
        }
    } catch (error) {
        console.error('Error refreshing access token:', error)

        if (error instanceof TypeError && error.message.includes('fetch failed')) {
            console.error('Keycloak 서버에 연결할 수 없습니다.')
            return {
                ...token,
                error: 'KeycloakConnectionError',
            }
        }

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}