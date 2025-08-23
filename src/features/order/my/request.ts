import {OrderPaymentMethod, OrderStatus} from "@/features/order/shared/types";

export interface MyOrderSearchRequest {
    // Order 필드
    orderNumber?: string
    status?: OrderStatus
    paymentMethod?: OrderPaymentMethod
    paymentStatus?: string
    startDateTime?: string
    endDateTime?: string

    // User 필드 (주문자 정보)
    userId?: number
}