import {useMemo} from 'react'
import {addToCart, clearCart, decrementQuantity, incrementQuantity, removeFromCart, updateQuantity} from './slice'
import {AddToCartPayload, CartStats} from './types'
import {useAppDispatch, useAppSelector} from "@/global/store/hooks"

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

    // 액션들 (간단하고 직관적)
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

    // 유틸리티 함수들
    const utils = useMemo(() => ({
        hasProduct: (productId: string) => products.some(p => p.id === productId),
        getProduct: (productId: string) => products.find(p => p.id === productId),
        getQuantity: (productId: string) => products.find(p => p.id === productId)?.quantity ?? 0,
        formatTotalPrice: (locale = 'ko-KR', currency = 'KRW') =>
            new Intl.NumberFormat(locale, {style: 'currency', currency}).format(totalPrice),
    }), [products, totalPrice])

    return {
        // 상태
        products,
        stats,

        // 액션
        ...actions,

        // 유틸리티
        ...utils,
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