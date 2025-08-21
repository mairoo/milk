import {OrderPaymentMethod} from "@/features/order/shared/types";

export interface OrderFormData {
    paymentMethod: OrderPaymentMethod;
    agreements: {
        purchase: boolean;
        personalUse: boolean;
        googleGiftCard: boolean;
    };
}