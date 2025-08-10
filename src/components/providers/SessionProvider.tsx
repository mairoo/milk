'use client'

import {SessionProvider as NextAuthSessionProvider} from 'next-auth/react'
import {ReactNode} from 'react'

/**
 * 세션 프로바이더 컴포넌트
 *
 * NextAuth.js 세션을 애플리케이션 전체에서 사용할 수 있도록 하는 Provider 컴포넌트
 * Client Component로 구현되어 React Context API를 통해 세션 상태를 관리
 *
 * - 애플리케이션 전체 세션 상태 관리
 * - 자동 세션 갱신 (refetchInterval)
 * - 포커스 시 세션 재검증 (refetchOnWindowFocus)
 * - 타입 안전한 세션 접근
 *
 * @usage
 * ```tsx
 * // app/layout.tsx
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         <SessionProvider>
 *           {children}
 *         </SessionProvider>
 *       </body>
 *     </html>
 *   )
 * }
 *
 * // 컴포넌트에서 사용
 * import { useSession } from 'next-auth/react'
 *
 * function MyComponent() {
 *   const { data: session, status } = useSession()
 *
 *   if (status === 'loading') return <div>로딩중...</div>
 *   if (status === 'unauthenticated') return <div>로그인 필요</div>
 *
 *   return <div>안녕하세요, {session?.user?.name}님!</div>
 * }
 * ```
 */

interface SessionProviderProps {
    /** 자식 컴포넌트 */
    children: ReactNode

    // 세션 갱신 간격 (초)
    refetchInterval?: number

    // 윈도우 포커스 시 세션 재검증 여부
    refetchOnWindowFocus?: boolean
}

/**
 * 세션 프로바이더 컴포넌트
 *
 * NextAuth.js의 SessionProvider를 래핑하여 애플리케이션에 최적화된 설정을 제공
 */
export default function SessionProvider({
                                            children,
                                            refetchInterval = 300, // 5분마다 세션 갱신
                                            refetchOnWindowFocus = true,
                                        }: SessionProviderProps) {
    return (
        <NextAuthSessionProvider
            // 세션 자동 갱신 설정
            refetchInterval={refetchInterval}
            // 윈도우 포커스 시 세션 재검증
            refetchOnWindowFocus={refetchOnWindowFocus}
            // 기본 세션 베이스 경로
            basePath="/api/auth"
        >
            {children}
        </NextAuthSessionProvider>
    )
}

/**
 * 세션 상태 타입
 * useSession 훅에서 반환하는 status 값
 */
export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

/**
 * 세션 훅 사용 예제
 *
 * @example
 * ```tsx
 * import { useSession, signIn, signOut } from 'next-auth/react'
 *
 * function AuthButton() {
 *   const { data: session, status } = useSession()
 *
 *   if (status === 'loading') {
 *     return <button disabled>로딩중...</button>
 *   }
 *
 *   if (session) {
 *     return (
 *       <div>
 *         <p>로그인됨: {session.user?.email}</p>
 *         <p>역할: {session.user?.roles?.join(', ')}</p>
 *         <button onClick={() => signOut()}>로그아웃</button>
 *       </div>
 *     )
 *   }
 *
 *   return <button onClick={() => signIn('keycloak')}>로그인</button>
 * }
 * ```
 */