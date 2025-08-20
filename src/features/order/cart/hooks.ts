import {useMemo, useState} from 'react'
import {addToCart, clearCart, decrementQuantity, incrementQuantity, removeFromCart, updateQuantity} from './slice'
import {AddToCartPayload, CartStats} from './types'
import {useAppDispatch, useAppSelector} from "@/global/store/hooks"
import {validateQuantity} from "@/features/order/cart/utils";

/**
 * 장바구니 전용 훅
 *
 * 장바구니의 모든 기능을 제공하는 단일 인터페이스
 * 기본 CRUD + 수량 관리 UI 로직 포함
 */
export const useCart = () => {
    const dispatch = useAppDispatch()

    // 상태 선택자
    const products = useAppSelector(state => state.cart.products)
    const totalQuantity = useAppSelector(state => state.cart.totalQuantity)
    const totalPrice = useAppSelector(state => state.cart.totalPrice)

    // 각 상품별 임시 입력값을 관리하는 state (UI 전용)
    const [tempInputs, setTempInputs] = useState<{ [key: string]: string }>({});

    // 계산된 통계 (메모이제이션)
    const stats: CartStats = useMemo(() => ({
        totalQuantity,
        totalPrice,
        productCount: products.length,
        isEmpty: products.length === 0,
    }), [products.length, totalQuantity, totalPrice])

    // 기본 CRUD 액션들
    const actions = useMemo(() => ({
        addProduct: (payload: AddToCartPayload) => dispatch(addToCart(payload)),
        removeProduct: (productId: string) => dispatch(removeFromCart(productId)),
        updateQuantity: (productId: string, quantity: number) => dispatch(updateQuantity({productId, quantity})),
        clear: () => dispatch(clearCart()),
        increment: (productId: string) => dispatch(incrementQuantity(productId)),
        decrement: (productId: string) => dispatch(decrementQuantity(productId)),
    }), [dispatch])

    // 수량 관리 UI 로직들
    const quantityManager = useMemo(() => ({
        // 수량 직접 변경 핸들러 (숫자만 허용, 최대 4자리)
        handleQuantityChange: (productId: string, value: string) => {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 4) {
                setTempInputs(prev => ({
                    ...prev,
                    [productId]: numericValue
                }));
            }
        },

        // 포커스 아웃시 또는 엔터키 입력시 실제 수량 업데이트
        handleQuantitySubmit: (productId: string, value: string) => {
            const validatedQuantity = validateQuantity(value);

            if (validatedQuantity === null) {
                // 빈 값이거나 0 이하면 상품 삭제
                actions.removeProduct(productId);
            } else if (validatedQuantity > 0) {
                // 유효한 값이면 수량 업데이트
                actions.updateQuantity(productId, validatedQuantity);
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
        },

        // 현재 표시할 수량값 (임시 입력값이 있으면 그것을, 없으면 실제 수량을)
        getDisplayQuantity: (productId: string, actualQuantity: number) => {
            return tempInputs[productId] ?? actualQuantity.toString();
        },

        // + 버튼 클릭 핸들러
        handleIncrement: (productId: string) => {
            const product = products.find(p => p.id === productId);
            if (product && product.quantity < 9999) {
                actions.increment(productId);
            }
        },

        // - 버튼 클릭 핸들러
        handleDecrement: (productId: string) => {
            const product = products.find(p => p.id === productId);
            if (product) {
                if (product.quantity <= 1) {
                    actions.removeProduct(productId);
                } else {
                    actions.decrement(productId);
                }
            }
        },
    }), [products, actions, tempInputs])

    const formatTotalPrice = useMemo(() =>
            (locale = 'ko-KR', currency = 'KRW') =>
                new Intl.NumberFormat(locale, {style: 'currency', currency}).format(totalPrice)
        , [totalPrice])

    return {
        // 기본 데이터
        products,
        stats,

        // 기본 액션들
        ...actions,

        // 수량 관리 UI 로직
        ...quantityManager,

        // 기타
        formatTotalPrice,
    }
}