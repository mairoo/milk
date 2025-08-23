import {OrderPaymentMethod, OrderStatus} from "@/features/order/shared/types";

export const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
        case 'PAYMENT_PENDING':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300'
        case 'PAYMENT_COMPLETED':
            return 'bg-green-100 text-green-800 border-green-300'
        case 'UNDER_REVIEW':
            return 'bg-blue-100 text-blue-800 border-blue-300'
        case 'PAYMENT_VERIFIED':
            return 'bg-emerald-100 text-emerald-800 border-emerald-300'
        case 'SHIPPED':
            return 'bg-purple-100 text-purple-800 border-purple-300'
        case 'REFUND_REQUESTED':
            return 'bg-orange-100 text-orange-800 border-orange-300'
        case 'REFUND_PENDING':
            return 'bg-amber-100 text-amber-800 border-amber-300'
        case 'REFUNDED1':
        case 'REFUNDED2':
            return 'bg-slate-100 text-slate-800 border-slate-300'
        case 'VOIDED':
            return 'bg-red-100 text-red-800 border-red-300'
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300'
    }
}

// 상태별 한글 표시 - 모든 OrderStatus 처리
export const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case 'PAYMENT_PENDING':
            return '결제대기'
        case 'PAYMENT_COMPLETED':
            return '결제완료'
        case 'UNDER_REVIEW':
            return '인증심사중'
        case 'PAYMENT_VERIFIED':
            return '입금인증완료'
        case 'SHIPPED':
            return '발송완료'
        case 'REFUND_REQUESTED':
            return '환불요청'
        case 'REFUND_PENDING':
            return '환불대기'
        case 'REFUNDED1':
            return '환불됨1'
        case 'REFUNDED2':
            return '환불됨2'
        case 'VOIDED':
            return '주문무효'
        default:
            return status
    }
}

// 결제수단별 한글 표시 - 모든 OrderPaymentMethod 처리
export const getPaymentMethodLabel = (method: OrderPaymentMethod) => {
    switch (method) {
        case 'BANK_TRANSFER':
            return '계좌이체'
        case 'ESCROW':
            return '에스크로(KB)'
        case 'PAYPAL':
            return '페이팔'
        case 'CREDIT_CARD':
            return '신용카드'
        case 'PHONE_BILLS':
            return '휴대폰결제'
        default:
            return method
    }
}

// 결제수단별 아이콘 또는 스타일 (선택사항)
export const getPaymentMethodStyle = (method: OrderPaymentMethod) => {
    switch (method) {
        case 'BANK_TRANSFER':
            return 'text-blue-600'
        case 'ESCROW':
            return 'text-green-600'
        case 'PAYPAL':
            return 'text-blue-500'
        case 'CREDIT_CARD':
            return 'text-purple-600'
        case 'PHONE_BILLS':
            return 'text-orange-600'
        default:
            return 'text-gray-600'
    }
}

