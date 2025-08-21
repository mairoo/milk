export interface MyOrderSearchRequest {
    orderNumber?: string
    status?: string
    paymentMethod?: string
    paymentStatus?: string
    startDateTime?: string
    endDateTime?: string
    userId?: number
}