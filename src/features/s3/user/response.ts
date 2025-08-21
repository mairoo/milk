import {OrderCurrency, OrderPaymentMethod, OrderStatus} from "@/features/order/shared/types";

export interface MyOrderResponse {
    id: number
    created: string | null
    modified: string | null
    orderNo: string
    paymentMethod: OrderPaymentMethod
    status: OrderStatus
    totalListPrice: number
    totalSellingPrice: number
    currency: OrderCurrency
    message: string | null
    fullname: string
    transactionId: string | null
}