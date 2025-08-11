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
 * - 토큰 만료 전에 자동 갱신
 * - 윈도우 포커스 시 즉시 검증
 * - Keycloak 로그아웃 시 빠른 감지
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

/**
 * 설정 설명:
 *
 * refetchInterval: 240초 (4분)
 * - 액세스 토큰이 5분이므로 4분마다 갱신 시도
 * - 토큰이 만료되기 전에 미리 갱신하여 끊김 없는 경험
 * - Keycloak에서 로그아웃되면 갱신 실패로 세션 무효화
 *
 * refetchOnWindowFocus: true
 * - 브라우저 탭 전환 시 즉시 세션 상태 확인
 * - 다른 탭에서 로그아웃한 경우 빠른 감지
 *
 * 장점:
 * - 복잡한 실시간 검증 로직 불필요
 * - Keycloak 서버 부하 최소화
 * - 최대 5분 지연으로 로그아웃 감지
 * - 일반적인 사용 패턴에서 충분한 보안성
 */