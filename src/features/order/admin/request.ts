export interface AdminOrderSearchRequest {
    // Order 필드
    orderId?: number
    orderNumber?: string
    status?: string
    paymentMethod?: string
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