import {OrderCurrency, OrderPaymentMethod, OrderStatus, OrderVisible} from "@/features/order/shared/types";

export interface AdminOrderResponse {
    id: number
    created: string | null
    modified: string | null
    isRemoved: boolean
    orderNo: string
    userAgent: string | null
    acceptLanguage: string | null
    ipAddress: string
    paymentMethod: OrderPaymentMethod
    status: OrderStatus
    totalListPrice: number
    totalSellingPrice: number
    currency: OrderCurrency
    message: string | null
    parentId: number | null
    userId: number | null
    fullname: string
    transactionId: string | null
    visible: OrderVisible
    suspicious: boolean
}