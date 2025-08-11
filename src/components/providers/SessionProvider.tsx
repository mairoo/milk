'use client'

import {SessionProvider as NextAuthSessionProvider} from 'next-auth/react'
import {ReactNode} from 'react'

interface SessionProviderProps {
    children: ReactNode
    refetchInterval?: number
    refetchOnWindowFocus?: boolean
}

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
 *
 * ## 주요 장점들
 * ### 보안성
 * - httpOnly 쿠키로 XSS 공격 방지
 * - 액세스 토큰이 클라이언트 JavaScript에서 직접 접근 불가
 *
 * ### 자동 관리
 * - 4분마다 자동 토큰 갱신 (`refetchInterval: 240`)
 * - 윈도우 포커스 시 세션 상태 확인
 * - Keycloak 로그아웃 시 자동 세션 무효화
 *
 * ### 간편한 사용
 * - `useSession` 훅으로 어디서든 세션 상태 접근
 * - 로딩/인증/비인증 상태 자동 제공
 *
 * ## 설정 설명
 * ### refetchInterval: 240초 (4분)
 * - 액세스 토큰이 5분이므로 4분마다 갱신 시도
 * - 토큰이 만료되기 전에 미리 갱신하여 끊김 없는 경험
 * - Keycloak에서 로그아웃되면 갱신 실패로 세션 무효화
 *
 * ### refetchOnWindowFocus: true
 * - 브라우저 탭 전환 시 즉시 세션 상태 확인
 * - 다른 탭에서 로그아웃한 경우 빠른 감지
 *
 * ## 전체적인 장점
 * - 복잡한 실시간 검증 로직 불필요
 * - Keycloak 서버 부하 최소화
 * - 최대 5분 지연으로 로그아웃 감지
 * - 일반적인 사용 패턴에서 충분한 보안성
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