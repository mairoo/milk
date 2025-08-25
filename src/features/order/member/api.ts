import {baseApi} from '@/global/api/baseApi'
import type {ApiResponse} from '@/global/types/dto'
import {MemberOrderCreateResponse} from "@/features/order/member/response";
import {MemberOrderCreateRequest} from "@/features/order/member/request";

/**
 * Member Order API 엔드포인트
 *
 * 핵심 원칙:
 * - 서버 응답을 있는 그대로 반환 (최소한의 변환만)
 * - 비즈니스 로직 없음
 * - 캐싱 태그만 설정
 * - 에러 처리 및 토큰 처리는 baseApi에서 담당
 */
export const memberOrderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * 주문 생성
         */
        createMemberOrder: builder.mutation<MemberOrderCreateResponse, MemberOrderCreateRequest>({
            query: (request) => ({
                url: '/member/orders',
                method: 'POST',
                body: request,
            }),
            transformResponse: (response: ApiResponse<MemberOrderCreateResponse>) => response.data,
            invalidatesTags: [
                {type: 'MyOrder' as const, id: 'LIST'},
            ],
        }),
    }),
})

export const {
    useCreateMemberOrderMutation,
} = memberOrderApi