export enum OrderPaymentMethod {
    BANK_TRANSFER = 0, // 계좌이체 / 무통장입금
    ESCROW = 1, // 에스크로 (KB)
    PAYPAL = 2, // 페이팔 (PayPal)
    CREDIT_CARD = 3, // 신용카드
    PHONE_BILLS = 6, // 휴대폰결제
}
