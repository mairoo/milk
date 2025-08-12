import type {Metadata, Viewport} from 'next'
import SessionProvider from '@/components/providers/SessionProvider'
import './globals.css'
import React from "react";
import {Nanum_Gothic} from 'next/font/google'
import {ReduxProvider} from "@/components/providers/ReduxProvider";

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
    keywords: ['Next.js', 'NextAuth', 'Keycloak', 'Authentication'],
    authors: [{name: '주식회사 핀코인'}],
    creator: 'Pincoin Team',
    publisher: 'Pincoin',

    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
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

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="ko">
        <body className={`${nanumGothic.className} font-sans antialiased`}>
        <SessionProvider>
            <ReduxProvider>
                {children}
            </ReduxProvider>
        </SessionProvider>
        </body>
        </html>
    )
}