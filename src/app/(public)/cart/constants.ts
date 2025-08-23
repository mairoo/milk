import * as yup from 'yup';
import {OrderPaymentMethod} from "@/features/order/shared/types";

export const PAYMENT_METHOD_OPTIONS = [
    {value: 'BANK_TRANSFER' as const, label: '무통장입금'},
    {value: 'ESCROW' as const, label: '에스크로 (KB)'},
    {value: 'PAYPAL' as const, label: '페이팔 (PayPal)'},
    {value: 'CREDIT_CARD' as const, label: '신용카드'},
    {value: 'PHONE_BILLS' as const, label: '휴대폰결제'},
] as const;

export const VALID_PAYMENT_METHODS: OrderPaymentMethod[] = PAYMENT_METHOD_OPTIONS.map(option => option.value);

export const orderSchema = yup.object().shape({
    paymentMethod: yup
        .string()
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