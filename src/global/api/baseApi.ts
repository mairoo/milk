import {createApi} from '@reduxjs/toolkit/query/react'
import axios, {AxiosError, AxiosRequestConfig} from 'axios'
import type {BaseQueryFn} from '@reduxjs/toolkit/query'
import {ErrorResponse} from "@/global/types/dto";
import {getSession} from 'next-auth/react'

/// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    timeout: 30000, // 30초 타임아웃
    headers: {
        'Content-Type': 'application/json',
    },
})

// 요청 인터셉터 - 토큰 자동 추가
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const session = await getSession()
            const token = session?.accessToken as string | undefined

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        } catch (error) {
            console.error('Failed to get session token:', error)
        }

        // 요청 로깅 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)

            // Authorization 헤더 로깅
            const authHeader = config.headers?.['Authorization'] ||
                config.headers?.get?.('Authorization')

            if (authHeader && typeof authHeader === 'string') {
                console.log('Authorization header:', authHeader.substring(0, 30) + '...')
            } else if (authHeader) {
                console.log('Authorization header: [present]')
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => {
        // 성공 응답 로깅 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Response: ${response.status} ${response.config.url}`)
        }
        return response
    },
    (error: AxiosError) => {
        // 에러 로깅
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', {
                status: error.response?.status,
                url: error.config?.url,
                data: error.response?.data,
            })
        }

        // CORS 에러 특별 처리
        if (!error.response && error.code === 'ERR_NETWORK') {
            console.error('CORS Error detected:', error.message)
            return Promise.reject(new Error('CORS 오류: 서버 연결을 확인해주세요'))
        }

        // 네트워크 에러 처리
        if (!error.response) {
            return Promise.reject(new Error('네트워크 연결을 확인해주세요'))
        }

        // HTTP 상태 코드별 에러 처리
        switch (error.response.status) {
            case 401:
                console.error('Authentication failed - token might be invalid')
                return Promise.reject(new Error('인증이 필요합니다'))
            case 403:
                return Promise.reject(new Error('접근 권한이 없습니다'))
            case 404:
                return Promise.reject(new Error('요청한 리소스를 찾을 수 없습니다'))
            case 500:
                return Promise.reject(new Error('서버 내부 오류가 발생했습니다'))
            default:
                return Promise.reject(error)
        }
    }
)

// Axios 기반 BaseQuery 타입 정의
interface AxiosBaseQueryArgs {
    url: string
    method?: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
    headers?: AxiosRequestConfig['headers']
    timeout?: number
}

// Axios BaseQuery 함수 구현
const axiosBaseQuery =
    (
        {baseUrl}: { baseUrl: string } = {baseUrl: ''}
    ): BaseQueryFn<
        AxiosBaseQueryArgs,
        unknown,
        {
            status?: number
            data?: ErrorResponse
            message?: string
        }
    > =>
        async ({url, method = 'GET', data, params, headers, timeout}) => {
            try {
                const result = await axiosInstance({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers,
                    timeout,
                })

                return {data: result.data}
            } catch (axiosError) {
                const error = axiosError as AxiosError<ErrorResponse>

                // CORS 에러인지 확인
                if (!error.response && error.code === 'ERR_NETWORK') {
                    console.error('CORS Error in baseQuery:', error)
                }

                return {
                    error: {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다',
                    },
                }
            }
        }

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    tagTypes: [
        'HealthCheck',
        'Category',
        'Product',
        'AdminOrder',
        'MyOrder',
    ],
    keepUnusedDataFor: 300,
    refetchOnMountOrArgChange: false,
    endpoints: () => ({}),
})

export default baseApi