import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import type {MyOrderResponse} from './response'
import type {MyOrderSearchRequest} from './request'

/**
 * 나의 주문 API 엔드포인트
 *
 * 핵심 원칙:
 * - 서버 응답을 있는 그대로 반환 (최소한의 변환만)
 * - 비즈니스 로직 없음
 * - 캐싱 태그만 설정
 * - 에러 처리는 baseApi에서 담당
 */
export const orderMyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyOrder: builder.query<MyOrderResponse, { orderId: number; params?: MyOrderSearchRequest }>({
            query: ({orderId, params = {}}) => ({
                url: `/my/orders/${orderId}`,
                method: 'GET',
                params,
            }),
            transformResponse: (response: ApiResponse<MyOrderResponse>) => response.data,
            providesTags: (_, __, {orderId}) => [
                {type: 'MyOrder' as const, id: orderId}
            ],
        }),
    }),
})

export const {
    useGetMyOrderQuery,
    useLazyGetMyOrderQuery,
} = orderMyApi