import { StoreProvider } from '@/providers/common/StoreProvider';
import type { Metadata, Viewport } from 'next';
import { Nanum_Gothic, Nanum_Gothic_Coding } from 'next/font/google';
import './globals.css';
import React from 'react';

const nanum = Nanum_Gothic({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nanum-gothic',
});

const nanumCoding = Nanum_Gothic_Coding({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-nanum-gothic-coding',
});

export const metadata: Metadata = {
  title: '핀코인',
  description: '대한민국 1등 온라인 상품권 쇼핑몰 핀코인',
  icons: {
    icon: 'https://pincoin-s3.s3.amazonaws.com/static/images/shop/default/favicon.png',
    shortcut: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
    <body
      className={`${nanum.variable} ${nanumCoding.variable} antialiased`}
    >
    <StoreProvider>
      {children}
    </StoreProvider>
    </body>
    </html>
  );
}