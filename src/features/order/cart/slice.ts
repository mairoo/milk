import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AddToCartPayload, CartClientState, CartProduct, UpdateQuantityPayload} from './types'

/**
 * 초기 상태
 */
const initialState: CartClientState = {
    products: [],
    isOpen: false,
    isUpdating: false,
    totalQuantity: 0,
    totalPrice: 0,
    error: null,
}

/**
 * 유틸리티 함수: 총합 계산
 */
const calculateTotals = (products: CartProduct[]) => {
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0)
    const totalPrice = products.reduce((sum, product) => sum + (product.price * product.quantity), 0)

    return {totalQuantity, totalPrice}
}

/**
 * 장바구니 슬라이스
 * DDD: 도메인 서비스 - 종단 관심사, 단일 책임, 도메인 로직 & 상태 관리
 */
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * 상품을 장바구니에 추가
         * 이미 존재하면 수량 증가
         */
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const {id, title, subtitle, price, quantity = 1} = action.payload

            // 기존 상품 찾기
            const existingProduct = state.products.find(product => product.id === id)

            if (existingProduct) {
                // 이미 있으면 수량 증가
                existingProduct.quantity += quantity
            } else {
                // 새 상품 추가
                state.products.push({
                    id,
                    title,
                    subtitle,
                    quantity,
                    price,
                })
            }

            // 총합 재계산
            const totals = calculateTotals(state.products)
            state.totalQuantity = totals.totalQuantity
            state.totalPrice = totals.totalPrice

            // 에러 초기화
            state.error = null
        },

        /**
         * 상품 수량 업데이트
         * 수량이 0이면 제거
         */
        updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
            const {productId, quantity} = action.payload

            if (quantity <= 0) {
                // 수량이 0 이하면 제거
                state.products = state.products.filter(product => product.id !== productId)
            } else {
                // 수량 업데이트
                const product = state.products.find(product => product.id === productId)
                if (product) {
                    product.quantity = quantity
                }
            }

            // 총합 재계산
            const totals = calculateTotals(state.products)
            state.totalQuantity = totals.totalQuantity
            state.totalPrice = totals.totalPrice
        },

        /**
         * 상품 제거
         */
        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload
            state.products = state.products.filter(product => product.id !== productId)

            // 총합 재계산
            const totals = calculateTotals(state.products)
            state.totalQuantity = totals.totalQuantity
            state.totalPrice = totals.totalPrice
        },

        /**
         * 장바구니 비우기
         */
        clearCart: (state) => {
            state.products = []
            state.totalQuantity = 0
            state.totalPrice = 0
            state.error = null
        },

        /**
         * 장바구니 UI 토글
         */
        toggleCart: (state) => {
            state.isOpen = !state.isOpen
        },

        /**
         * 장바구니 열기
         */
        openCart: (state) => {
            state.isOpen = true
        },

        /**
         * 장바구니 닫기
         */
        closeCart: (state) => {
            state.isOpen = false
        },

        /**
         * 업데이트 상태 설정
         */
        setUpdating: (state, action: PayloadAction<boolean>) => {
            state.isUpdating = action.payload
        },

        /**
         * 에러 설정
         */
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },

        /**
         * 상품 수량 증가 (편의 메서드)
         */
        incrementQuantity: (state, action: PayloadAction<string>) => {
            const productId = action.payload
            const product = state.products.find(product => product.id === productId)

            if (product) {
                product.quantity += 1

                // 총합 재계산
                const totals = calculateTotals(state.products)
                state.totalQuantity = totals.totalQuantity
                state.totalPrice = totals.totalPrice
            }
        },

        /**
         * 상품 수량 감소 (편의 메서드)
         * 수량이 1이면 제거
         */
        decrementQuantity: (state, action: PayloadAction<string>) => {
            const productId = action.payload
            const product = state.products.find(product => product.id === productId)

            if (product) {
                if (product.quantity <= 1) {
                    // 수량이 1이면 제거
                    state.products = state.products.filter(p => p.id !== productId)
                } else {
                    product.quantity -= 1
                }

                // 총합 재계산
                const totals = calculateTotals(state.products)
                state.totalQuantity = totals.totalQuantity
                state.totalPrice = totals.totalPrice
            }
        },
    },
})

// 액션 내보내기
export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    setUpdating,
    setError,
    incrementQuantity,
    decrementQuantity,
} = cartSlice.actions

// 리듀서 내보내기 (store에 등록용)
export default cartSlice.reducer