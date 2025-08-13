import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import type {HealthCheckResponse} from './response'

export const s3AdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        quickHealthCheck: builder.query<HealthCheckResponse, string | undefined>({
            query: (token) => ({
                url: '/admin/s3/healthcheck',
                method: 'GET',
                headers: token ? {Authorization: `Bearer ${token}`} : {},
                timeout: 5000, // 빠른 체크는 5초 타임아웃
            }),
            transformResponse: (response: ApiResponse<HealthCheckResponse>) => response.data,
            providesTags: ['HealthCheck'],
            // 캐시 시간 설정 (30초)
            keepUnusedDataFor: 30,
        }),

        fullHealthCheck: builder.query<HealthCheckResponse, string | undefined>({
            query: (token) => ({
                url: '/admin/s3/healthcheck/full',
                method: 'GET',
                headers: token ? {Authorization: `Bearer ${token}`} : {},
                timeout: 30000, // 전체 체크는 30초 타임아웃
            }),
            transformResponse: (response: ApiResponse<HealthCheckResponse>) => response.data,
            providesTags: ['HealthCheck'],
            // 캐시 시간 설정 (5분)
            keepUnusedDataFor: 300,
        }),
    }),
})

export const {
    useQuickHealthCheckQuery,
    useFullHealthCheckQuery,
    useLazyQuickHealthCheckQuery,
    useLazyFullHealthCheckQuery,
} = s3AdminApi