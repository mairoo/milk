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