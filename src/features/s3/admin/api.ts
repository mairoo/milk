import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import type {HealthCheckResponse} from './response'

/**
 * API 엔드포인트 정의
 *
 * 핵심 원칙:
 * - 서버 응답을 있는 그대로 반환 (최소한의 변환만)
 * - 비즈니스 로직 없음
 * - 캐싱 태그만 설정
 * - 에러 처리는 baseApi에서 담당
 */
export const s3AdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        quickHealthCheck: builder.query<HealthCheckResponse, string | undefined>({
            query: (token) => ({
                url: '/admin/s3/healthcheck',
                method: 'GET',
                headers: token ? {Authorization: `Bearer ${token}`} : {},
            }),
            transformResponse: (response: ApiResponse<HealthCheckResponse>) => response.data,
            providesTags: ['HealthCheck'],
        }),

        fullHealthCheck: builder.query<HealthCheckResponse, string | undefined>({
            query: (token) => ({
                url: '/admin/s3/healthcheck/full',
                method: 'GET',
                headers: token ? {Authorization: `Bearer ${token}`} : {},
            }),
            transformResponse: (response: ApiResponse<HealthCheckResponse>) => response.data,
            providesTags: ['HealthCheck'],
        }),
    }),
})

export const {
    useQuickHealthCheckQuery,
    useFullHealthCheckQuery,
    useLazyQuickHealthCheckQuery,
    useLazyFullHealthCheckQuery,
} = s3AdminApi