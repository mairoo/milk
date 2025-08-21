import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import type {AdminOrderResponse} from './response'
import type {AdminOrderSearchRequest} from './request'

/**
 * 관리자 주문 API 엔드포인트
 *
 * 핵심 원칙:
 * - 서버 응답을 있는 그대로 반환 (최소한의 변환만)
 * - 비즈니스 로직 없음
 * - 캐싱 태그만 설정
 * - 에러 처리는 baseApi에서 담당
 */
export const orderAdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrder: builder.query<AdminOrderResponse, { orderId: number; params?: AdminOrderSearchRequest }>({
            query: ({orderId, params = {}}) => ({
                url: `/admin/orders/${orderId}`,
                method: 'GET',
                params,
            }),
            transformResponse: (response: ApiResponse<AdminOrderResponse>) => response.data,
            providesTags: (result, error, {orderId}) => [
                {type: 'AdminOrder' as const, id: orderId}
            ],
        }),
    }),
})

export const {
    useGetOrderQuery,
    useLazyGetOrderQuery,
} = orderAdminApi