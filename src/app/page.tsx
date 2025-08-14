'use client'

import {useSession} from 'next-auth/react'
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

                    {session &&
                        <div style={{marginTop: '15px'}}>
                            <h3>로그인 사용자 정보</h3>
                            <ul style={{listStyle: 'none', padding: 0}}>
                                <li><strong>이름:</strong> {session.user?.name || 'N/A'}</li>
                                <li><strong>이메일:</strong> {session.user?.email || 'N/A'}</li>
                                <li><strong>사용자명:</strong> {session.user?.preferred_username || 'N/A'}</li>
                                <li><strong>사용자 ID:</strong> {session.user?.id || 'N/A'}</li>
                            </ul>
                        </div>
                    }
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