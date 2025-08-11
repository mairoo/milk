'use client'

import {signIn, useSession} from 'next-auth/react'
import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function SignInPage() {
    const {data: session, status} = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const callbackUrl = searchParams.get('callbackUrl') || '/'

    // 인증된 사용자 자동 리디렉션
    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push(callbackUrl)
        }
    }, [status, session, router, callbackUrl])

    const handleSignIn = async () => {
        try {
            setIsLoading(true)
            setError('')

            const result = await signIn('keycloak', {
                callbackUrl,
                redirect: false,
            })

            if (result?.error) {
                setError('로그인 중 오류가 발생했습니다.')
                console.error('Sign in error:', result.error)
            } else if (result?.url) {
                router.push(result.url)
            }
        } catch (error) {
            setError('로그인 처리 중 문제가 발생했습니다.')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold mb-2">로그인 확인 중...</h1>
                    <p className="text-gray-600">잠시만 기다려주세요.</p>
                </div>
            </div>
        )
    }

    if (status === 'authenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-semibold mb-2">이미 로그인되어 있습니다</h1>
                    <p className="text-gray-600">{callbackUrl}로 이동 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
                    <p className="text-gray-600">Pincoin 애플리케이션에 오신 것을 환영합니다.</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div>
                    <button
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                            ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        }`}
                    >
                        {isLoading ? '로그인 중...' : 'Keycloak으로 로그인'}
                    </button>
                </div>

                {callbackUrl !== '/' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-blue-600 text-sm">
                            로그인 후 <strong>{callbackUrl}</strong> 페이지로 이동합니다.
                        </p>
                    </div>
                )}

                <div className="bg-gray-50 rounded-md p-4">
                    <h2 className="text-lg font-semibold mb-3">로그인 정보</h2>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Keycloak을 통한 안전한 인증</li>
                        <li>• Single Sign-On (SSO) 지원</li>
                        <li>• 5분 토큰으로 빠른 보안 검증</li>
                        <li>• 자동 토큰 갱신</li>
                    </ul>
                </div>

                <div className="text-xs text-gray-500 text-center">
                    <p><strong>보안 안내:</strong></p>
                    <p>Keycloak에서 로그아웃하면 최대 5분 내에 이 애플리케이션 세션도 자동 무효화됩니다.</p>
                </div>
            </div>
        </div>
    )
}

/**
 * 5분 토큰 방식의 장점:
 *
 * 1. 단순성: 복잡한 실시간 검증 로직 불필요
 * 2. 성능: Keycloak 서버 호출 최소화
 * 3. 보안: 최대 5분 지연으로 충분한 보안성
 * 4. 안정성: 네트워크 문제에 덜 민감
 * 5. 확장성: 서버 리소스 절약
 *
 * 사용 시나리오:
 * - 일반적인 웹 애플리케이션에 적합
 * - 극도로 민감한 실시간 보안이 필요하지 않은 경우
 * - 사용자 경험과 보안의 균형점
 */