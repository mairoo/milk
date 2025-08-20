import {NextAuthOptions} from 'next-auth'
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

    pages: {
        signIn: '/auth/sign-in', // 커스텀 로그인 페이지
    },

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

            // 이전 토큰 갱신 오류가 있으면 오류 토큰 반환 (세션 무효화)
            // null 대신 만료된 토큰 반환으로 타입 안정성 보장
            if (token.error === 'RefreshTokenExpired' || token.error === 'RefreshAccessTokenError') {
                return {
                    ...token,
                    error: token.error,
                    accessToken: '',
                    refreshToken: '',
                    accessTokenExpires: 0,
                    refreshTokenExpires: 0
                }
            }

            // 액세스 토큰이 아직 유효하면 기존 토큰 반환
            if (Date.now() < token.accessTokenExpires) {
                return token
            }

            // 액세스 토큰 만료 이후 갱신 시도
            const refreshedToken = await refreshAccessToken(token)

            // 갱신 실패하면 오류 토큰 반환
            // null 대신 만료된 토큰 반환으로 타입 안정성 보장
            if (refreshedToken.error) {
                return {
                    ...token,
                    error: refreshedToken.error,
                    accessToken: '',
                    refreshToken: '',
                    accessTokenExpires: 0,
                    refreshTokenExpires: 0
                }
            }

            return refreshedToken
        },

        async session({session, token}) {
            // 토큰에 오류가 있거나 유효하지 않은 경우 세션 무효화
            // !token: JWT 토큰 자체가 없음 (심각한 오류)
            // token.error: 토큰 갱신 실패 오류
            // !token.accessToken: 만료된 토큰 오류 (액세스 토큰이 빈 문자열)
            if (!token || token.error || !token.accessToken) {
                return {
                    ...session,
                    user: undefined,
                    accessToken: undefined,
                    expires: new Date(0).toISOString(),
                    error: token?.error, // "로그인 필요" vs "세션 만료로 인한 로그인 필요" 구분 가능
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

                    // 타임아웃 설정
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => controller.abort(), 5000)

                    await fetch(`${logoutUrl}?${params.toString()}`, {
                        signal: controller.signal
                    })

                    clearTimeout(timeoutId)
                } catch (error) {
                    console.error('Keycloak logout error:', error)
                }
            }
        }
    },
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

        // 타임아웃 설정
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10초

        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: requestBody,
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            // 응답 본문 읽기 시도
            let errorDetails
            try {
                errorDetails = await response.json()
            } catch {
                errorDetails = await response.text()
            }

            console.error(`토큰 갱신 실패 (${response.status}):`, errorDetails)

            // Keycloak에서 세션이 무효화된 경우
            if (response.status === 400 &&
                (typeof errorDetails === 'object' && errorDetails.error === 'invalid_grant')) {
                console.error('Keycloak 세션이 무효화됨 (로그아웃됨)')
                return {...token, error: 'RefreshTokenExpired'}
            }

            return {...token, error: 'RefreshAccessTokenError'}
        }

        const refreshedTokens = await response.json()

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
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('토큰 갱신 타임아웃')
        } else {
            console.error('토큰 갱신 중 예외 발생:', error)
        }
        return {...token, error: 'RefreshAccessTokenError'}
    }
}