import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

/**
 * RTK Query 기본 설정
 *
 * 토큰 관리 및 재인증은 NextAuth에서 처리하므로
 * 별도의 re-authorization 로직을 구현하지 않음
 *
 * NextAuth가 제공하는 유효한 토큰을 각 endpoint에서 개별적으로 사용
 */
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json')
            return headers
        },
    }),
    endpoints: () => ({}),
})