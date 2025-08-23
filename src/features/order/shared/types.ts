export type OrderPaymentMethod =
    | 'BANK_TRANSFER'    // 계좌이체 / 무통장입금
    | 'ESCROW'           // 에스크로 (KB)
    | 'PAYPAL'           // 페이팔 (PayPal)
    | 'CREDIT_CARD'      // 신용카드
    | 'PHONE_BILLS'      // 휴대폰결제

export type OrderCurrency = 'KRW' | 'USD'

export type OrderStatus =
    | 'PAYMENT_PENDING'     // 입금 대기
    | 'PAYMENT_COMPLETED'   // 입금 완료
    | 'UNDER_REVIEW'        // 인증심사중
    | 'PAYMENT_VERIFIED'      // 입금인증완료
    | 'SHIPPED'             // 발송완료
    | 'REFUND_REQUESTED'    // 환불 요청
    | 'REFUND_PENDING'      // 환불 대기
    | 'REFUNDED1'           // 환불됨1
    | 'REFUNDED2'           // 환불됨2
    | 'VOIDED'              // 주문무효

export type OrderVisible = 'HIDDEN' | 'VISIBLE'