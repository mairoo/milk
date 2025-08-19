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
import MainContainer from "@/components/layout/containers/MainContainer";
import ToastContainer from "@/components/layout/containers/ToastContainer";

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

/**
 * 루트 레이아웃 컴포넌트
 *
 * 레이아웃 명세:
 * ┌─────────────────────────────────────────┐
 * │ Header (auto height)                    │ ← 데스크톱/모바일 조건부 렌더링
 * │ - 데스크톱: 로고 + 네비 + 검색          │   sticky top-0으로 스크롤시 고정
 * │ - 모바일: 햄버거 + 로고 + 장바구니       │   z-10으로 다른 요소 위에 표시
 * ├─────────────────────────────────────────┤
 * │ Main Content (1fr)                      │ ← 남은 공간 모두 차지
 * │ - 최소 높이: 헤더/푸터 제외한 전체 화면  │   내용 적으면 빈 공간까지 확장
 * │ - 최대 높이: 콘텐츠에 따라 무제한        │   내용 많으면 스크롤 생성
 * ├─────────────────────────────────────────┤
 * │ Footer (auto height)                    │ ← 콘텐츠 크기만큼 차지
 * │ - 콘텐츠 적을때: 화면 하단에 고정        │   min-h-screen에 의해 바닥 위치
 * │ - 콘텐츠 많을때: 스크롤 끝에 위치        │   자연스러운 문서 흐름 유지
 * └─────────────────────────────────────────┘
 *
 * CSS Grid 구조: grid-rows-[auto_1fr_auto]
 * - auto: 콘텐츠 크기에 맞춰 자동 조정 (header, footer)
 * - 1fr: 남은 공간 모두 차지 (main)
 * - min-h-screen: 최소 전체 화면 높이 보장
 */
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
        {/*
            CSS Grid 기반 전체 레이아웃:
            - grid: CSS Grid 컨테이너 활성화
            - grid-rows-[auto_1fr_auto]: 3행 그리드 (헤더-메인-푸터)
            - min-h-screen: 최소 전체 화면 높이 보장
        */}
        <body className={`${nanumGothic.className} font-sans antialiased min-h-screen grid grid-rows-[auto_1fr_auto]`}>
        <SessionProvider session={session}>
            <ReduxProvider>
                {/*
                    헤더 영역 (Grid Row 1: auto)
                    - 반응형 조건부 렌더링: CSS 기반 show/hide
                    - SSR 호환: 서버에서 두 헤더 모두 렌더링
                    - 하이드레이션 안정성: useEffect 의존성 없음
                    - 메모리 트레이드오프: 사용하지 않는 DOM 노드 존재
                */}
                <DesktopHeader className="hidden md:block"/>
                <MobileHeader className="block md:hidden"/>

                {/*
                    메인 콘텐츠 영역 (Grid Row 2: 1fr)
                    - 1fr: 헤더/푸터 제외한 모든 남은 공간 자동 할당
                    - 동적 높이: 콘텐츠에 따라 자동 확장/축소
                    - 스크롤 처리: 내용이 화면을 초과하면 자동 스크롤
                */}
                <MainContainer>
                    {children}
                </MainContainer>

                {/*
                    푸터 영역 (Grid Row 3: auto)
                    - auto: 콘텐츠 크기만큼만 높이 차지
                    - 위치: Grid + min-h-screen에 의해 자동으로 적절한 위치
                */}
                <Footer/>

                {/*
                    글로벌 오버레이 컴포넌트들
                    - Grid 레이아웃 외부에 위치 (position: fixed 사용)
                    - 전체 화면을 덮는 모달, 드로어, 토스트 등
                    - z-index로 레이어 관리

                    Z-Index 스택 구조:
                    - Header Sticky:    z-10  (기본 sticky 요소)
                    - Header Dropdown:  z-20  (헤더 위의 드롭다운 메뉴)
                    - Drawer/Sheet:     z-30  (전체 화면 사이드 패널)
                    - Modal/Dialog:     z-40  (일반 모달 창)
                    - Toast/Alert:      z-50  (최상위 알림)
                    - Debug Overlay:    z-60  (개발용 디버그 도구)

                    주의사항:
                    - CSS transform/opacity 사용 시 새로운 스택 컨텍스트 생성됨
                    - 서드파티 라이브러리와의 z-index 충돌 가능성 고려
                    - Radix UI 기본값: Portal 사용으로 body 끝에 렌더링
                */}
                <MenuDrawerSheet/> {/* 모바일 햄버거 메뉴 드로어 */}
                <CartDrawerSheet/> {/* 모바일 장바구니 드로어 */}
                <ToastContainer /> {/* 토스트 컨테이너 (z-50) */}
                {/* TODO: 확인/경고 다이얼로그 (z-40) */}
            </ReduxProvider>
        </SessionProvider>
        </body>
        </html>
    )
}