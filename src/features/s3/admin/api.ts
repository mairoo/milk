import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import type {HealthCheckResponse} from './response'

export const s3AdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        quickHealthCheck: builder.query<HealthCheckResponse, string | undefined>({
            query: (token) => ({
                url: '/admin/s3/healthcheck',
                headers: token ? {Authorization: `Bearer ${token}`} : {},
            }),
            transformResponse: (response: ApiResponse<HealthCheckResponse>) => response.data,
        }),

        fullHealthCheck: builder.query<HealthCheckResponse, string | undefined>({
            query: (token) => ({
                url: '/admin/s3/healthcheck/full',
                headers: token ? {Authorization: `Bearer ${token}`} : {},
            }),
            transformResponse: (response: ApiResponse<HealthCheckResponse>) => response.data,
        }),
    }),
})

export const {
    useQuickHealthCheckQuery,
    useFullHealthCheckQuery,
} = s3AdminApi