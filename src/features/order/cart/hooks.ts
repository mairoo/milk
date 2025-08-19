import {useMemo} from 'react'
import {
    addToCart,
    clearCart,
    closeCart,
    decrementQuantity,
    incrementQuantity,
    openCart,
    removeFromCart,
    setError,
    setUpdating,
    toggleCart,
    updateQuantity,
} from './slice'
import {AddToCartPayload, CartProduct, CartStats, UpdateQuantityPayload} from './types'
import {useAppDispatch, useAppSelector} from "@/global/store/hooks";

/**
 * 장바구니 전용 훅
 * DDD: 서비스 계층 (코디네이터/퍼사드) - 횡단 관심사
 *
 * 역할:
 * - 외부에서 장바구니 상태와 액션에 접근할 수 있는 인터페이스 제공
 * - 복잡한 비즈니스 로직을 간단한 API로 추상화
 * - 성능 최적화 (메모이제이션)
 */
export const useCart = () => {
    const dispatch = useAppDispatch()

    // 상태 선택자
    const products = useAppSelector(state => state.cart.products)
    const isOpen = useAppSelector(state => state.cart.isOpen)
    const isUpdating = useAppSelector(state => state.cart.isUpdating)
    const totalQuantity = useAppSelector(state => state.cart.totalQuantity)
    const totalPrice = useAppSelector(state => state.cart.totalPrice)
    const error = useAppSelector(state => state.cart.error)

    // 계산된 통계 (메모이제이션)
    const stats: CartStats = useMemo(() => ({
        totalQuantity,
        totalPrice,
        productCount: products.length,
        isEmpty: products.length === 0,
    }), [products.length, totalQuantity, totalPrice])

    // 액션 디스패치 함수들 (useCallback으로 최적화)
    const actions = useMemo(() => ({
        /**
         * 상품을 장바구니에 추가
         */
        addProduct: (payload: AddToCartPayload) => {
            dispatch(addToCart(payload))
        },

        /**
         * 상품 수량 업데이트
         */
        updateProductQuantity: (payload: UpdateQuantityPayload) => {
            dispatch(updateQuantity(payload))
        },

        /**
         * 상품 제거
         */
        removeProduct: (productId: string) => {
            dispatch(removeFromCart(productId))
        },

        /**
         * 장바구니 비우기
         */
        clear: () => {
            dispatch(clearCart())
        },

        /**
         * 장바구니 UI 제어
         */
        toggle: () => dispatch(toggleCart()),
        open: () => dispatch(openCart()),
        close: () => dispatch(closeCart()),

        /**
         * 상태 관리
         */
        setUpdating: (updating: boolean) => dispatch(setUpdating(updating)),
        setError: (error: string | null) => dispatch(setError(error)),

        /**
         * 편의 메서드
         */
        increment: (productId: string) => dispatch(incrementQuantity(productId)),
        decrement: (productId: string) => dispatch(decrementQuantity(productId)),
    }), [dispatch])

    // 유틸리티 함수들
    const utils = useMemo(() => ({
        /**
         * 특정 상품이 장바구니에 있는지 확인
         */
        hasProduct: (productId: string): boolean => {
            return products.some(product => product.id === productId)
        },

        /**
         * 특정 상품의 수량 반환
         */
        getProductQuantity: (productId: string): number => {
            const product = products.find(p => p.id === productId)
            return product?.quantity ?? 0
        },

        /**
         * 특정 상품 정보 반환
         */
        getProduct: (productId: string): CartProduct | undefined => {
            return products.find(p => p.id === productId)
        },

        /**
         * 장바구니 총 가격 포맷팅
         */
        getFormattedTotalPrice: (locale: string = 'ko-KR', currency: string = 'KRW'): string => {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
            }).format(totalPrice)
        },
    }), [products, totalPrice])

    return {
        // 상태
        products,
        isOpen,
        isUpdating,
        error,
        stats,

        // 액션
        ...actions,

        // 유틸리티
        ...utils,
    }
}

/**
 * 장바구니 상품별 전용 훅
 * 특정 상품에 대한 작업을 더 편리하게 처리
 */
export const useCartProduct = (productId: string) => {
    const {
        getProduct,
        getProductQuantity,
        hasProduct,
        increment,
        decrement,
        removeProduct,
        updateProductQuantity,
    } = useCart()

    const product = getProduct(productId)
    const quantity = getProductQuantity(productId)
    const inCart = hasProduct(productId)

    const actions = useMemo(() => ({
        increment: () => increment(productId),
        decrement: () => decrement(productId),
        remove: () => removeProduct(productId),
        setQuantity: (quantity: number) => updateProductQuantity({productId, quantity}),
    }), [productId, increment, decrement, removeProduct, updateProductQuantity])

    return {
        product,
        quantity,
        inCart,
        ...actions,
    }
}

/**
 * 장바구니 통계만 필요한 경우를 위한 경량 훅
 */
export const useCartStats = (): CartStats => {
    return useAppSelector(state => ({
        totalQuantity: state.cart.totalQuantity,
        totalPrice: state.cart.totalPrice,
        productCount: state.cart.products.length,
        isEmpty: state.cart.products.length === 0,
    }))
}