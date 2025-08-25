import {OrderPaymentMethod} from "@/features/order/shared/types";

export interface MemberOrderCreateRequest {
    paymentMethod: OrderPaymentMethod
    products: MemberOrderProductRequest[]
    totalAmount: number
    productCount: number
}

export interface MemberOrderProductRequest {
    id: string
    title: string
    subtitle: string
    quantity: number
    price: number
}