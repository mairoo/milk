import type {Metadata} from 'next'
import SessionProvider from '@/components/providers/SessionProvider'
import React from "react";

export const metadata: Metadata = {
    title: 'Pincoin App',
    description: 'NextAuth.js와 Keycloak 연동 애플리케이션',
}

/**
 * 루트 레이아웃 컴포넌트
 * - 전역 세션 상태 관리하는 SessionProvider로 애플리케이션을 감싸서
 * - 모든 하위 컴포넌트에서 NextAuth.js 세션 기능 사용 가능
 * - 모든 페이지에서 useSession() 훅 사용 가능
 * - 자동 토큰 갱신 및 세션 재검증
 */

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="ko">
        <body>
        <SessionProvider>
            {children}
        </SessionProvider>
        </body>
        </html>
    )
}