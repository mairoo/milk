/**
 * 장바구니 상품 도메인 모델
 * DDD: 핵심 비즈니스 객체
 */
export interface CartProduct {
    id: string
    title: string
    subtitle: string
    quantity: number
    price: number
}

/**
 * 장바구니 도메인 모델
 */
export interface Cart {
    id: string
    products: CartProduct[]
    totalQuantity: number
    totalPrice: number
    createdAt: string
    updatedAt: string
}

/**
 * 장바구니 클라이언트 상태
 * DDD: 도메인 서비스에서 관리하는 상태
 */
export interface CartClientState {
    // 장바구니 데이터
    products: CartProduct[]

    // UI 상태
    isOpen: boolean
    isUpdating: boolean

    // 계산된 값들 (캐시)
    totalQuantity: number
    totalPrice: number

    // 에러 상태
    error: string | null
}

/**
 * 장바구니 상품 추가/수정을 위한 페이로드
 */
export interface AddToCartPayload {
    id: string
    title: string
    subtitle: string
    price: number
    quantity?: number // 기본값 1
}

/**
 * 수량 업데이트 페이로드
 */
export interface UpdateQuantityPayload {
    productId: string
    quantity: number
}

/**
 * 장바구니 통계 (읽기 전용)
 */
export interface CartStats {
    totalQuantity: number
    totalPrice: number
    productCount: number
    isEmpty: boolean
}