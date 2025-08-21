import * as yup from 'yup';
import {OrderPaymentMethod} from "@/features/order/shared/types";

export const PAYMENT_METHOD_OPTIONS = [
    {value: OrderPaymentMethod.BANK_TRANSFER, label: '무통장입금'},
    {value: OrderPaymentMethod.ESCROW, label: '에스크로 (KB)'},
    {value: OrderPaymentMethod.PAYPAL, label: '페이팔 (PayPal)'},
    {value: OrderPaymentMethod.CREDIT_CARD, label: '신용카드'},
    {value: OrderPaymentMethod.PHONE_BILLS, label: '휴대폰결제'},
];

export const VALID_PAYMENT_METHODS = PAYMENT_METHOD_OPTIONS.map(option => option.value);

export const orderSchema = yup.object().shape({
    paymentMethod: yup
        .number()
        .oneOf(VALID_PAYMENT_METHODS, '결제 수단을 선택해주세요')
        .required('결제 수단을 선택해주세요'),
    agreements: yup.object().shape({
        purchase: yup
            .boolean()
            .oneOf([true], '구매 동의는 필수입니다')
            .required(),
        personalUse: yup
            .boolean()
            .oneOf([true], '본인 사용 목적 동의는 필수입니다')
            .required(),
        googleGiftCard: yup
            .boolean()
            .oneOf([true], '구글기프트카드 환불불가 동의는 필수입니다')
            .required()
    }).required()
}).required();