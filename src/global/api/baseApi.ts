import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json')
        return headers
    },
})

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: () => ({}),
})