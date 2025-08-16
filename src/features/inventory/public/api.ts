import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import type {CategoryResponse} from './response'

/**
 * API 엔드포인트 정의
 *
 * 핵심 원칙:
 * - 서버 응답을 있는 그대로 반환 (최소한의 변환만)
 * - 비즈니스 로직 없음
 * - 캐싱 태그만 설정
 * - 에러 처리는 baseApi에서 담당
 */
export const inventoryPublicApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategoryBySlug: builder.query<CategoryResponse, string>({
            query: (slug) => ({
                url: `/open/categories/slug/${slug}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<CategoryResponse>) => response.data,
            providesTags: ['Category'],
        }),
    }),
})

export const {
    useGetCategoryBySlugQuery,
    useLazyGetCategoryBySlugQuery,
} = inventoryPublicApi