import type {Metadata, Viewport} from 'next'
import SessionProvider from '@/global/providers/SessionProvider'
import './globals.css'
import React from "react";
import {Nanum_Gothic} from 'next/font/google'
import {ReduxProvider} from "@/global/providers/ReduxProvider";
import {RootLayoutProps} from "@/global/types/layout";
import Footer from "@/components/layout/Footer";
import DesktopHeader from "@/components/layout/header/DesktopHeader";
import {getServerSession} from "next-auth";
import {authOptions} from "@/global/lib/auth";
import MobileHeader from "@/components/layout/header/MobileHeader";
import MenuDrawerSheet from "@/components/layout/drawer/MenuDrawerSheet";
import CartDrawerSheet from "@/components/layout/drawer/CartDrawerSheet";

const nanumGothic = Nanum_Gothic({
    weight: ['400', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        template: '%s | 대한민국 1등 온라인 상품권 쇼핑몰 핀코인',
        default: '핀코인 상품권 쇼핑몰',
    },
    description: '대한민국 1등 상품권 쇼핑몰 핀코인',
    keywords: ['컬쳐랜드', '넥슨카드', '구글기프트카드'],
    authors: [{name: '주식회사 핀코인'}],
    creator: '핀코인 개발팀',
    publisher: '핀코인',

    icons: {
        icon: '/favicon.ico', // 32x32px
        apple: '/apple-touch-icon.png', // 180x180px
    },

    other: {
        'theme-color': '#87b842', // 브라우저 UI 테마 색상
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    // maximumScale: 1, - 접근성을 위해 사용자 확대/축소 허용
}

export default async function RootLayout({children}: RootLayoutProps) {
    // 브라우저 쿠키 읽기 (빠름)
    // JWT 복호화 (CPU 연산 필요)
    // 토큰 만료 검증 (빠름)
    // 필요시 토큰 갱신 (외부 API 호출 - 지연 가능성)
    const session = await getServerSession(authOptions)

    // 헤더 렌더링 - CSS 기반 반응형 방식 채택
    // - 장점: SSR 호환성, 즉시 렌더링, 하이드레이션 안정성
    // - 단점: 사용하지 않는 DOM 노드 메모리 점유, 초기 번들 크기 증가
    // - 포기: 적응형 컴포넌트 패턴 (런타임 조건부 렌더링)
    //   → useEffect 의존으로 인한 하이드레이션 불일치 및 렌더링 지연 문제
    return (
        <html lang="ko">
        <body className={`${nanumGothic.className} font-sans antialiased min-h-screen flex flex-col`}>
        <SessionProvider session={session}>
            <ReduxProvider>
                <DesktopHeader className="hidden md:block"/>
                <MobileHeader className="block md:hidden"/>
                <main className="flex-1 py-2 px-2 md:px-0">
                    <div className="mx-auto container">
                        {children}
                    </div>
                </main>
                <Footer/>
                {/* 글로벌 오버레이 백드롭 (모달, 토스트 등) */}
                <MenuDrawerSheet/>
                <CartDrawerSheet/>
                {/* TODO: 토스트 컨테이너 */}
                {/* TODO: 확인/경고 다이얼로그 */}
            </ReduxProvider>
        </SessionProvider>
        </body>
        </html>
    )
}