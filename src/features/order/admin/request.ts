import {OrderPaymentMethod, OrderStatus} from "@/features/order/shared/types";

export interface AdminOrderSearchRequest {
    // Order 필드
    orderId?: number
    orderNumber?: string
    status?: OrderStatus
    paymentMethod?: OrderPaymentMethod
    paymentStatus?: string
    startDateTime?: string
    endDateTime?: string
    isActive?: boolean
    isRemoved?: boolean

    // User 필드 (주문자 정보)
    userId?: number
    userEmail?: string
    userIsActive?: boolean
    userIsRemoved?: boolean
}