import {useMemo, useState} from 'react'
import {addToCart, clearCart, decrementQuantity, incrementQuantity, removeFromCart, updateQuantity} from './slice'
import {AddToCartPayload, CartStats} from './types'
import {useAppDispatch, useAppSelector} from "@/global/store/hooks"
import {validateQuantity} from "@/features/order/cart/utils";

/**
 * 장바구니 전용 훅
 *
 * 장바구니의 모든 기능을 제공하는 단일 인터페이스
 */
export const useCart = () => {
    const dispatch = useAppDispatch()

    // 상태 선택자
    const products = useAppSelector(state => state.cart.products)
    const totalQuantity = useAppSelector(state => state.cart.totalQuantity)
    const totalPrice = useAppSelector(state => state.cart.totalPrice)

    // 계산된 통계 (메모이제이션)
    const stats: CartStats = useMemo(() => ({
        totalQuantity,
        totalPrice,
        productCount: products.length,
        isEmpty: products.length === 0,
    }), [products.length, totalQuantity, totalPrice])

    const actions = useMemo(() => ({
        // 기본 CRUD
        addProduct: (payload: AddToCartPayload) => dispatch(addToCart(payload)),
        removeProduct: (productId: string) => dispatch(removeFromCart(productId)),
        updateQuantity: (productId: string, quantity: number) => dispatch(updateQuantity({productId, quantity})),
        clear: () => dispatch(clearCart()),

        // 편의 메서드
        increment: (productId: string) => dispatch(incrementQuantity(productId)),
        decrement: (productId: string) => dispatch(decrementQuantity(productId)),
    }), [dispatch])

    const formatTotalPrice = useMemo(() =>
            (locale = 'ko-KR', currency = 'KRW') =>
                new Intl.NumberFormat(locale, {style: 'currency', currency}).format(totalPrice)
        , [totalPrice])

    return {
        products,
        stats,
        ...actions,
        formatTotalPrice,
    }
}

export const useCartQuantityManager = () => {
    const {products, increment, decrement, removeProduct, updateQuantity} = useCart();

    // 각 상품별 임시 입력값을 관리하는 state
    const [tempInputs, setTempInputs] = useState<{ [key: string]: string }>({});

    // 수량 직접 변경 핸들러
    const handleQuantityChange = (productId: string, value: string) => {
        setTempInputs(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    // 포커스 아웃시 또는 엔터키 입력시 실제 수량 업데이트
    const handleQuantitySubmit = (productId: string, value: string) => {
        const validatedQuantity = validateQuantity(value);

        if (validatedQuantity === null) {
            // 빈 값이거나 0 이하면 상품 삭제
            removeProduct(productId);
        } else if (validatedQuantity > 0) {
            // 유효한 값이면 수량 업데이트
            updateQuantity(productId, validatedQuantity);
        } else {
            // 유효하지 않은 값이면 원래 수량으로 되돌리기
            const product = products.find(p => p.id === productId);
            if (product) {
                setTempInputs(prev => ({
                    ...prev,
                    [productId]: product.quantity.toString()
                }));
            }
        }

        // 임시 입력값 초기화
        setTempInputs(prev => {
            const newInputs = {...prev};
            delete newInputs[productId];
            return newInputs;
        });
    };

    // 현재 표시할 수량값 (임시 입력값이 있으면 그것을, 없으면 실제 수량을)
    const getDisplayQuantity = (productId: string, actualQuantity: number) => {
        return tempInputs[productId] ?? actualQuantity.toString();
    };

    // + 버튼 클릭 핸들러
    const handleIncrement = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product && product.quantity < 9999) {
            increment(productId);
        }
    };

    // - 버튼 클릭 핸들러
    const handleDecrement = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            if (product.quantity <= 1) {
                removeProduct(productId);
            } else {
                decrement(productId);
            }
        }
    };

    // 수량 입력 onChange 핸들러 (숫자만 허용, 최대 4자리)
    const handleQuantityInputChange = (productId: string, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 4) {
            handleQuantityChange(productId, numericValue);
        }
    };

    return {
        tempInputs,
        handleQuantityChange: handleQuantityInputChange,
        handleQuantitySubmit,
        getDisplayQuantity,
        handleIncrement,
        handleDecrement,
    };
};