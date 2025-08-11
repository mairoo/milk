'use client'

import {signIn, useSession} from 'next-auth/react'
import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

/**
 * 로그인 페이지 컴포넌트
 *
 * NextAuth.js와 Keycloak을 연동한 로그인 페이지입니다.
 * 이미 로그인된 사용자는 자동으로 리디렉션하고,
 * 미로그인 사용자에게는 Keycloak 로그인 버튼을 제공합니다.
 *
 * - 로그인 상태 자동 확인
 * - 로그인 후 원래 페이지로 리디렉션
 * - 로그인 오류 처리
 * - 로딩 상태 표시
 */

export default function SignInPage() {
    const {data: session, status} = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // 로그인 후 리디렉션할 URL (callbackUrl 파라미터에서 가져옴)
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    // 이미 로그인된 경우 리디렉션
    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push(callbackUrl)
        }
    }, [status, session, router, callbackUrl])

    // Keycloak 로그인 처리
    const handleSignIn = async () => {
        try {
            setIsLoading(true)
            setError('')

            const result = await signIn('keycloak', {
                callbackUrl,
                redirect: false, // 수동으로 리디렉션 처리
            })

            if (result?.error) {
                setError('로그인 중 오류가 발생했습니다.')
                console.error('Sign in error:', result.error)
            } else if (result?.url) {
                // 로그인 성공 시 리디렉션
                router.push(result.url)
            }
        } catch (error) {
            setError('로그인 처리 중 문제가 발생했습니다.')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // 로딩 중인 경우
    if (status === 'loading') {
        return (
            <div>
                <h1>로그인 확인 중...</h1>
                <p>잠시만 기다려주세요.</p>
            </div>
        )
    }

    // 이미 로그인된 경우
    if (status === 'authenticated') {
        return (
            <div>
                <h1>이미 로그인되어 있습니다</h1>
                <p>{callbackUrl}로 이동 중...</p>
            </div>
        )
    }

    // 로그인 폼
    return (
        <div>
            <div>
                <h1>로그인</h1>
                <p>Pincoin 애플리케이션에 오신 것을 환영합니다.</p>

                {error && (
                    <div>
                        <p>{error}</p>
                    </div>
                )}

                <div>
                    <button
                        onClick={handleSignIn}
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : 'Keycloak으로 로그인'}
                    </button>
                </div>

                {callbackUrl !== '/' && (
                    <div>
                        <p>로그인 후 {callbackUrl} 페이지로 이동합니다.</p>
                    </div>
                )}

                <div>
                    <h2>로그인 정보</h2>
                    <ul>
                        <li>Keycloak을 통한 안전한 인증</li>
                        <li>Single Sign-On (SSO) 지원</li>
                        <li>자동 토큰 갱신</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

/**
 * 로그인 페이지 사용법
 *
 * @description
 * 이 페이지는 다음과 같은 시나리오에서 사용됩니다:
 *
 * 1. 직접 접근:
 *    http://localhost:3000/auth/sign-in
 *
 * 2. 보호된 페이지에서 리디렉션:
 *    http://localhost:3000/auth/sign-in?callbackUrl=/dashboard
 *
 * 3. 미들웨어에서 자동 리디렉션:
 *    middleware.ts에서 미인증 사용자를 이 페이지로 보냄
 *
 * 1. 페이지 로드
 * 2. 세션 상태 확인
 * 3. 이미 로그인됨 → callbackUrl로 리디렉션
 * 4. 미로그인 → 로그인 버튼 표시
 * 5. 로그인 버튼 클릭 → Keycloak으로 리디렉션
 * 6. Keycloak 인증 완료 → callbackUrl로 리디렉션
 *
 * 필요에 따라 다음을 커스터마이징할 수 있습니다:
 * - 로딩 스피너 컴포넌트
 * - 에러 메시지 스타일
 * - 로그인 버튼 디자인
 * - 추가 로그인 제공자 (Google, GitHub 등)
 */