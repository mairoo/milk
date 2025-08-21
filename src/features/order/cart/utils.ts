import {CartStats} from "@/features/order/cart/types";

export const formatPrice = (price: number): string => {
    return `₩${price.toLocaleString()}`;
};

export const validateQuantity = (value: string): number | null => {
    const numValue = parseInt(value);

    if (!value || numValue <= 0) {
        return null; // 삭제를 의미
    }

    if (numValue >= 1 && numValue <= 9999) {
        return numValue;
    }

    return -1; // 유효하지 않은 값
};

export const validateCart = (cartStats: CartStats): string | null => {
    if (cartStats.isEmpty) {
        return '장바구니가 비었습니다.';
    }
    if (cartStats.totalPrice <= 0) {
        return '올바르지 않은 주문 금액입니다';
    }
    if (cartStats.productCount <= 0) {
        return '최소 1개 이상의 상품이 필요합니다';
    }
    return null;
};