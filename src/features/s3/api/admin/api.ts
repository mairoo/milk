import axios from 'axios'
import {HealthCheckResponse} from "@/features/s3/types/admin/dto";

/**
 * S3 헬스체크 API 클라이언트
 */
class Api {
    private readonly baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/admin/s3/healthcheck`

    /**
     * S3 빠른 연결 테스트
     * GET http://localhost:8080/admin/s3/healthcheck
     */
    async quickHealthCheck(token?: string): Promise<HealthCheckResponse> {
        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && {'Authorization': `Bearer ${token}`}),
                },
            })

            return response.data.data // ApiResponse<HealthCheckResponse> 구조에서 data 추출
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`헬스체크 실패: ${error.response?.status} ${error.response?.statusText}`)
            }
            throw new Error('헬스체크 실패: 알 수 없는 오류가 발생했습니다')
        }
    }

    /**
     * S3 전체 헬스체크
     * GET http://localhost:8080/admin/s3/healthcheck/full
     */
    async fullHealthCheck(token?: string): Promise<HealthCheckResponse> {
        try {
            const response = await axios.get(`${this.baseUrl}/full`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && {'Authorization': `Bearer ${token}`}),
                },
            })

            return response.data.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`전체 헬스체크 실패: ${error.response?.status} ${error.response?.statusText}`)
            }
            throw new Error('전체 헬스체크 실패: 알 수 없는 오류가 발생했습니다')
        }
    }
}

export const healthCheckAdminApi = new Api()