import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse, PageResponse} from '@/global/types/dto'
import type {AdminOrderResponse} from './response'
import type {AdminOrderSearchRequest} from './request'

/**
 * 관리자 주문 API 엔드포인트
 *
 * 핵심 원칙:
 * - 서버 응답을 있는 그대로 반환 (최소한의 변환만)
 * - 비즈니스 로직 없음
 * - 캐싱 태그만 설정
 * - 에러 처리 및 토큰 처리는 baseApi에서 담당
 */
export const adminOrderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * 단일 주문 조회
         */
        getAdminOrder: builder.query<AdminOrderResponse, { orderId: number; params?: AdminOrderSearchRequest }>({
            query: ({orderId, params = {}}) => ({
                url: `/admin/orders/${orderId}`,
                method: 'GET',
                params,
            }),
            transformResponse: (response: ApiResponse<AdminOrderResponse>) => response.data,
            providesTags: (_, __, {orderId}) => [
                {type: 'AdminOrder' as const, id: orderId}
            ],
        }),

        /**
         * 주문 목록 조회 (페이징)
         */
        getAdminOrderList: builder.query<PageResponse<AdminOrderResponse>, AdminOrderSearchRequest & {
            page?: number;
            size?: number;
        }>({
            query: (params = {}) => ({
                url: '/admin/orders',
                method: 'GET',
                params,
            }),
            transformResponse: (response: ApiResponse<PageResponse<AdminOrderResponse>>) => response.data,
            providesTags: (result) => [
                {type: 'AdminOrder' as const, id: 'LIST'},
                // 각 주문에 대한 개별 태그도 추가 (목록에서 개별 주문이 무효화될 때 목록도 갱신)
                ...(result?.content?.map((order) => ({
                    type: 'AdminOrder' as const,
                    id: order.id
                })) ?? [])
            ],
        }),
    }),
})

export const {
    useGetAdminOrderQuery,
    useLazyGetAdminOrderQuery,
    useGetAdminOrderListQuery,
    useLazyGetAdminOrderListQuery,
} = adminOrderApi