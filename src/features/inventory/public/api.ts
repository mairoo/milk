import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import type {CategoryResponse, ProductResponse} from './response'
import type {ProductSearchRequest} from './request'

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
            providesTags: (result, error, slug) => [
                {type: 'Category' as const, id: slug}
            ],
        }),

        getCategoryById: builder.query<CategoryResponse, number>({
            query: (categoryId) => ({
                url: `/open/categories/${categoryId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<CategoryResponse>) => response.data,
            providesTags: (result, error, categoryId) => [
                {type: 'Category' as const, id: categoryId}
            ],
        }),

        getProductsByCategory: builder.query<ProductResponse[], { categoryId: number; params?: ProductSearchRequest }>({
            query: ({categoryId, params = {}}) => ({
                url: `/open/products/category/${categoryId}`,
                method: 'GET',
                params,
            }),
            transformResponse: (response: ApiResponse<ProductResponse[]>) => response.data,
            providesTags: (result, error, {categoryId}) => [
                {type: 'Product' as const, id: `category-${categoryId}`}
            ],
        }),
        getProduct: builder.query<ProductResponse, number>({
            query: (productId) => ({
                url: `/open/products/${productId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<ProductResponse>) => response.data,
            providesTags: (result, error, productId) => [
                {type: 'Product' as const, id: productId}
            ],
        }),
    }),
})

export const {
    useGetCategoryBySlugQuery,
    useLazyGetCategoryBySlugQuery,
    useGetCategoryByIdQuery,
    useLazyGetCategoryByIdQuery,
    useGetProductsByCategoryQuery,
    useLazyGetProductsByCategoryQuery,
    useGetProductQuery,
    useLazyGetProductQuery,
} = inventoryPublicApi