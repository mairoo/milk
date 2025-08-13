import {HealthCheckResponse} from '../types/health-check.admin.types'

/**
 * S3 헬스체크 API 클라이언트
 */
class HealthCheckAdminApi {
    private readonly baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/admin/s3/healthcheck`

    /**
     * S3 빠른 연결 테스트
     * GET http://localhost:8080/admin/s3/healthcheck
     */
    async quickHealthCheck(token?: string): Promise<HealthCheckResponse> {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {'Authorization': `Bearer ${token}`}),
            },
            mode: 'cors',
        })

        if (!response.ok) {
            throw new Error(`헬스체크 실패: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        return result.data // ApiResponse<HealthCheckResponse> 구조에서 data 추출
    }

    /**
     * S3 전체 헬스체크
     * GET http://localhost:8080/admin/s3/healthcheck/full
     */
    async fullHealthCheck(token?: string): Promise<HealthCheckResponse> {
        const response = await fetch(`${this.baseUrl}/full`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && {'Authorization': `Bearer ${token}`}),
            },
            mode: 'cors',
        })

        if (!response.ok) {
            throw new Error(`전체 헬스체크 실패: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        return result.data
    }
}

export const healthCheckAdminApi = new HealthCheckAdminApi()