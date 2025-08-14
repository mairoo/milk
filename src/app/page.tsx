'use client'

import {signIn, signOut, useSession} from 'next-auth/react'
import {useS3HealthCheck} from "@/features/s3/admin/hooks";

export default function Home() {
    const {data: session, status} = useSession()

    const {
        loading,
        isHealthy,
        hasError,
        error,
        quickCheck,
        fullCheck,
    } = useS3HealthCheck()

    // 로딩 상태
    if (status === 'loading') {
        return (
            <div style={{padding: '20px', textAlign: 'center'}}>
                <h1>Pincoin App</h1>
                <p>세션을 확인하는 중...</p>
            </div>
        )
    }

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
            <main>
                {/* 로그인 상태 섹션 */}
                <section style={{marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px'}}>
                    <h2>현재 로그인 상태</h2>

                    {session ? (
                        <div>
                            <p style={{color: 'green', fontWeight: 'bold'}}>✅ 로그인됨</p>

                            <div style={{marginTop: '15px'}}>
                                <h3>사용자 정보</h3>
                                <ul style={{listStyle: 'none', padding: 0}}>
                                    <li><strong>이름:</strong> {session.user?.name || 'N/A'}</li>
                                    <li><strong>이메일:</strong> {session.user?.email || 'N/A'}</li>
                                    <li><strong>사용자명:</strong> {session.user?.preferred_username || 'N/A'}</li>
                                    <li><strong>사용자 ID:</strong> {session.user?.id || 'N/A'}</li>
                                </ul>
                            </div>

                            <div style={{marginTop: '20px'}}>
                                <button
                                    onClick={() => signOut({callbackUrl: '/'})}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p style={{color: 'red', fontWeight: 'bold'}}>❌ 로그인되지 않음</p>
                            <p>Keycloak을 통해 로그인하세요.</p>

                            <div style={{marginTop: '20px'}}>
                                <button
                                    onClick={() => signIn('keycloak')}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginRight: '10px'
                                    }}
                                >
                                    로그인
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* 시스템 정보 섹션 */}
                <section
                    style={{marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                    <h2>시스템 정보</h2>
                    <ul style={{listStyle: 'none', padding: 0}}>
                        <li>• Keycloak을 통한 안전한 인증</li>
                        <li>• Single Sign-On (SSO) 지원</li>
                        <li>• 5분 토큰으로 빠른 보안 검증</li>
                        <li>• 자동 토큰 갱신</li>
                        <li>• JWT 기반 세션 관리</li>
                    </ul>
                </section>

                {/* 테스트 기능 섹션 */}
                <section style={{marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px'}}>
                    <h2>테스트 기능</h2>

                    <div style={{marginBottom: '15px'}}>
                        <h3>세션 상태 확인</h3>
                        <p><strong>Status:</strong> {status}</p>
                        <p><strong>Session Exists:</strong> {session ? 'Yes' : 'No'}</p>
                        {session?.accessToken && (
                            <p><strong>Access Token:</strong> 존재함 (토큰 내용은 보안상 표시하지 않음)</p>
                        )}
                    </div>

                    <div>
                        <h3>API 테스트</h3>
                        <button
                            onClick={async () => {
                                if (!session?.accessToken) {
                                    alert('로그인이 필요합니다.')
                                    return
                                }

                                try {
                                    // 백엔드 API 호출 예시
                                    const response = await fetch('/api/test', {
                                        headers: {
                                            'Authorization': `Bearer ${session.accessToken}`
                                        }
                                    })

                                    if (response.ok) {
                                        const data = await response.text()
                                        alert(`API 호출 성공: ${data}`)
                                    } else {
                                        alert(`API 호출 실패: ${response.status}`)
                                    }
                                } catch (error) {
                                    alert(`API 호출 오류: ${error}`)
                                }
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                            disabled={!session}
                        >
                            인증된 API 호출 테스트
                        </button>

                        <button
                            onClick={() => {
                                console.log('Current Session:', session)
                                console.log('Session Status:', status)
                                alert('콘솔에서 세션 정보를 확인하세요.')
                            }}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#17a2b8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            세션 정보 콘솔 출력
                        </button>
                    </div>
                </section>

                <div>
                    <button onClick={quickCheck} disabled={loading}>
                        빠른 체크
                    </button>
                    <button onClick={fullCheck} disabled={loading}>
                        전체 체크
                    </button>

                    {loading && <p>체크 중...</p>}
                    {isHealthy && <p>✅ S3 연결 정상</p>}
                    {hasError && <p>❌ 오류: {error}</p>}
                </div>
            </main>
        </div>
    )
}