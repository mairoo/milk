/**
 * S3 헬스체크 관련 타입 정의
 */

/**
 * 헬스체크 응답 타입 (백엔드 HealthCheckResponse와 매칭)
 */
export interface HealthCheckResponse {
    status: string
    healthy: boolean
    timestamp: string
    service: string
    checks?: string[]
}

/**
 * 헬스체크 상태
 */
export interface HealthCheckState {
    loading: boolean
    data: HealthCheckResponse | null
    error: string | null
    lastChecked: string | null
}

/**
 * 헬스체크 타입 구분
 */
export type HealthCheckType = 'quick' | 'full'

/**
 * API 에러 응답 타입
 */
export interface HealthCheckError {
    message: string
    timestamp: string
    details?: string[]
}