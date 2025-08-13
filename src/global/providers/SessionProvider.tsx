'use client'

import {SessionProvider as NextAuthSessionProvider, SessionProviderProps} from 'next-auth/react'

/**
 * 5분 액세스 토큰에 최적화된 세션 프로바이더
 *
 * ## 세션 관리 메커니즘
 * - 세션은 사용자가 웹 애플리케이션에 로그인한 후 유지되는 상태 정보
 * - HTTP는 무상태(stateless) 프로토콜이므로, 각 요청마다 사용자 인증 상태를 기억할 수 없음
 * - 세션을 통해 **"사용자가 누구인지, 무엇을 할 수 있는지"를 지속적으로 추적하는 메커니즘
 *
 * ## JWT 세션 전략에서 useSession() 호출 시 동작 과정
 * 1. `/api/auth/session` API 호출
 * 2. **NextAuth.js 서버가 브라우저 httpOnly 쿠키 읽기** (클라이언트 측 js에서는 HttpOnly 쿠키 읽을 수 없음)
 * 3. JWT 복호화해서 세션 정보 반환
 *
 * ## 상태 관리
 * **NextAuth.js가 httpOnly 쿠키를 통해 세션을 관리하므로 별도의 Redux 같은 클라이언트 상태 관리 불필요**
 */
export default function SessionProvider({
                                            children,
                                            refetchInterval = 240, // 4분마다 갱신 (5분 토큰보다 1분 빠르게)
                                            refetchOnWindowFocus = true,
                                        }: SessionProviderProps) {
    return (
        <NextAuthSessionProvider
            refetchInterval={refetchInterval}
            refetchOnWindowFocus={refetchOnWindowFocus}
            basePath="/api/auth"
        >
            {children}
        </NextAuthSessionProvider>
    )
}