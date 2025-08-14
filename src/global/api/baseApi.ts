import {createApi} from '@reduxjs/toolkit/query/react'
import axios, {AxiosError, AxiosRequestConfig} from 'axios'
import type {BaseQueryFn} from '@reduxjs/toolkit/query'
import {ErrorResponse} from "@/global/types/dto";

/// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    timeout: 30000, // 30초 타임아웃
    headers: {
        'Content-Type': 'application/json',
    },
})

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        // 요청 로깅 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
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

        // 네트워크 에러 처리
        if (!error.response) {
            return Promise.reject(new Error('네트워크 연결을 확인해주세요'))
        }

        // HTTP 상태 코드별 에러 처리
        switch (error.response.status) {
            case 401:
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

                return {
                    error: {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다',
                    },
                }
            }
        }


/**
 * Axios 기반 RTK Query API 설정
 *
 * 토큰 관리 및 재인증은 NextAuth에서 처리하므로
 * 별도의 re-authorization 로직을 구현하지 않음
 *
 * NextAuth가 제공하는 유효한 토큰을 각 endpoint에서 개별적으로 사용
 */
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),

    /**
     * tagTypes 사용법:
     * - provideTags: 쿼리가 제공하는 데이터 태그 (예: ['User', { type: 'User', id: 1 }])
     * - invalidatesTags: 뮤테이션 후 무효화할 캐시 태그 (예: ['User'] - 모든 User 캐시 삭제)
     * - 자동 refetch: invalidatesTags로 지정된 태그의 모든 쿼리가 자동으로 다시 실행됨
     */
    tagTypes: ['HealthCheck'],

    /**
     * keepUnusedDataFor 옵션:
     * - 숫자(초): 구독자가 없어진 후 지정된 시간만큼 캐시 보관 (디폴트 60초)
     * - false: 즉시 삭제 (메모리 절약)
     * - true: 무제한 보관 (메모리 누수 위험)
     */
    keepUnusedDataFor: 300, // 미사용 데이터 유지 (디폴트 60초 → 5분)

    /**
     * refetchOnMountOrArgChange 옵션:
     * - false: 캐시된 데이터가 있으면 사용, 없으면 새로 요청 (디폴트, 네트워크 요청 최소화)
     * - true: 컴포넌트 마운트시 항상 새로 요청 (데이터 신선도 우선)
     * - 숫자(초): 캐시 데이터가 지정된 시간보다 오래되었을 때만 새로 요청 (예: 60)
     */
    refetchOnMountOrArgChange: false,
    endpoints: () => ({}),
})

export default baseApi