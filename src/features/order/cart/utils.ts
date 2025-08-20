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