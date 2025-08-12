import type {Metadata, Viewport} from 'next'
import SessionProvider from '@/components/providers/SessionProvider'
import './globals.css'
import React from "react";

export const metadata: Metadata = {
    title: {
        template: '%s | Pincoin App',
        default: 'Pincoin App',
    },
    description: 'NextAuth.js와 Keycloak 연동 애플리케이션',
    keywords: ['Next.js', 'NextAuth', 'Keycloak', 'Authentication'],
    authors: [{name: 'Pincoin Team'}],
    creator: 'Pincoin Team',
    publisher: 'Pincoin',

    openGraph: {
        title: 'Pincoin App',
        description: 'NextAuth.js와 Keycloak 연동 애플리케이션',
        url: 'https://pincoin.co.kr',
        siteName: 'Pincoin App',
        locale: 'ko_KR',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Pincoin App',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Pincoin App',
        description: 'NextAuth.js와 Keycloak 연동 애플리케이션',
        images: ['/og-image.png'],
    },

    manifest: '/manifest.json',

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

    category: 'technology',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="ko">
        <body className="font-sans antialiased">
        <SessionProvider>
            {children}
        </SessionProvider>
        </body>
        </html>
    )
}