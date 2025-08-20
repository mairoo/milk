'use client'

import {signIn} from 'next-auth/react'
import {useSearchParams} from 'next/navigation'
import {useEffect} from 'react'

export default function SignInPage() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    useEffect(() => {
        // 페이지 로드와 동시에 Keycloak으로 리다이렉트
        void signIn('keycloak', {callbackUrl, redirect: true})
    }, [callbackUrl])

    // 리다이렉트 중에 표시할 로딩 화면
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">로그인 페이지로 이동 중...</p>
            </div>
        </div>
    )
}