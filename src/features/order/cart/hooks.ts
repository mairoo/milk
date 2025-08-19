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