export enum OrderPaymentMethod {
    BANK_TRANSFER = 0, // 계좌이체 / 무통장입금
    ESCROW = 1, // 에스크로 (KB)
    PAYPAL = 2, // 페이팔 (PayPal)
    CREDIT_CARD = 3, // 신용카드
    PHONE_BILLS = 6, // 휴대폰결제
}

export enum OrderCurrency {
    KRW = 0,
    USD = 1,
}

export enum OrderStatus {
    PAYMENT_PENDING = 0,     // 입금 대기
    PAYMENT_COMPLETED = 1,   // 입금 완료
    UNDER_REVIEW = 2,        // 인증심사중
    PAYMENT_VERIFY = 3,      // 입금인증완료
    SHIPPED = 4,             // 발송완료
    REFUND_REQUESTED = 5,    // 환불 요청
    REFUND_PENDING = 6,      // 환불 대기
    REFUNDED1 = 7,           // 환불됨1
    REFUNDED2 = 8,           // 환불됨2
    VOIDED = 9,              // 주문무효
}

export enum OrderVisible {
    HIDDEN = 0,              // 숨김
    VISIBLE = 1,             // 표시
}