import type {Metadata, Viewport} from 'next'
import SessionProvider from '@/global/providers/SessionProvider'
import './globals.css'
import React from "react";
import {Nanum_Gothic} from 'next/font/google'
import {ReduxProvider} from "@/global/providers/ReduxProvider";
import {RootLayoutProps} from "@/global/types/layout";
import Footer from "@/components/layout/Footer";
import DesktopHeader from "@/components/layout/DesktopHeader";

const nanumGothic = Nanum_Gothic({
    weight: ['400', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        template: '%s | Pincoin App',
        default: 'Pincoin App',
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

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="ko">
        <body className={`${nanumGothic.className} font-sans antialiased min-h-screen flex flex-col`}>
        <SessionProvider>
            <ReduxProvider>
                <DesktopHeader/>
                <main className="flex-1">
                    <div className="mx-auto container">
                        {children}
                    </div>
                </main>
                <Footer/>
            </ReduxProvider>
        </SessionProvider>
        </body>
        </html>
    )
}