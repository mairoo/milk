'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import {Minus, Plus, ShoppingCart} from 'lucide-react'
import {useCategoryById, useProduct} from '@/features/inventory/public/hooks'
import {useCart} from '@/features/order/cart/hooks'
import {useToast} from '@/features/ui/toast/hooks'
import {Button} from '@/components/ui/button'
import {Alert} from '@/components/layout/containers/Alert'
import {ProductStock} from '@/features/inventory/public/response'
import {StyledMarkdown} from "@/components/layout/containers/StyledMakrdown";
import Image from 'next/image';
import DeliveryGuideSection from "@/app/(public)/product/[id]/[code]/components/DeliveryGuideSection";

interface ProductDetailPageProps {
    params: Promise<{
        id: string
        code: string
    }>
}

export default function ProductDetailPage({params}: ProductDetailPageProps) {
    const [productId, setProductId] = useState<number>(0)
    const [quantity, setQuantity] = useState(1)

    const {
        loading: productLoading,
        data: productData,
        error: productError,
        hasError: productHasError,
        getProduct
    } = useProduct()

    const {
        loading: categoryLoading,
        data: categoryData,
        error: categoryError,
        hasError: categoryHasError,
        getCategoryById
    } = useCategoryById()

    const {addProduct} = useCart()
    const {showSuccess, showError} = useToast()

    const discountRate = useMemo(() => {
        if (!productData || productData.listPrice === 0) return 0
        return ((productData.listPrice - productData.sellingPrice) / productData.listPrice) * 100
    }, [productData])

    const totalAmount = useMemo(() => {
        if (!productData) return 0
        return productData.sellingPrice * quantity
    }, [productData, quantity])

    const isSoldOut = useMemo(() => {
        return productData?.stock === ProductStock.SOLD_OUT
    }, [productData?.stock])

    // 카테고리 이미지 URL 생성
    const imageUrl = useMemo(() => {
        if (!categoryData?.thumbnail) return '/placeholder-image.jpg'
        return `https://pincoin-s3.s3.amazonaws.com/media/${categoryData.thumbnail}`
    }, [categoryData])

    const imageAlt = useMemo(() => {
        return productData ? `${productData.name} 상품 이미지` : '상품 이미지'
    }, [productData])

    useEffect(() => {
        const fetchParams = async () => {
            try {
                const {id} = await params
                setProductId(parseInt(id))
            } catch (err) {
                console.error('Failed to fetch params:', err)
            }
        }

        void fetchParams()
    }, [params])

    useEffect(() => {
        if (productId && productId > 0) {
            getProduct(productId)
        }
    }, [productId, getProduct])

    useEffect(() => {
        if (productData?.categoryId) {
            getCategoryById(productData.categoryId)
        }
    }, [productData?.categoryId, getCategoryById])

    const updateQuantity = useCallback((delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta))
    }, [])

    const increaseQuantity = useCallback(() => {
        updateQuantity(1)
    }, [updateQuantity])

    const decreaseQuantity = useCallback(() => {
        updateQuantity(-1)
    }, [updateQuantity])

    /**
     * 장바구니에 상품 추가
     * 현재 선택된 수량만큼 장바구니에 추가
     */
    const addToCart = useCallback(() => {
        if (!productData || isSoldOut) {
            return
        }

        try {
            // 입력값 검증
            if (!productData.id || quantity <= 0) {
                showError('오류', '유효하지 않은 상품 정보입니다.')
                return
            }

            // 장바구니에 추가
            addProduct({
                id: String(productData.id),
                title: productData.name,
                subtitle: productData.subtitle || '',
                price: productData.sellingPrice,
                quantity: quantity
            })

            // 성공 메시지 표시
            showSuccess(
                '장바구니 추가',
                `${productData.name} ${productData.subtitle}이(가) ${quantity}개 장바구니에 추가되었습니다.`
            )

            // 수량을 1로 초기화 (선택사항)
            setQuantity(1)

        } catch (error) {
            console.error('장바구니 추가 실패:', error)
            showError('오류', '장바구니에 추가하는 중 오류가 발생했습니다.')
        }
    }, [productData, isSoldOut, quantity, addProduct, showSuccess, showError])

    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`
    }

    if (!productId || productLoading) {
        return <p className="px-2 md:px-0 py-2">로딩 중...</p>
    }

    if (productHasError) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>상품을 불러오는데 실패했습니다.</p>
                {productError && <p className="text-red-500 mt-1">오류: {productError}</p>}
            </div>
        )
    }

    if (!productData) {
        return <p className="px-2 md:px-0 py-2">상품 데이터가 없습니다.</p>
    }

    return (
        <div className="w-full space-y-3">
            {/* 상품 기본 정보 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* 좌측: 상품 정보 및 구매 옵션 */}
                <div className="space-y-6">
                    <div className="max-w-md mx-auto lg:max-w-none space-y-2">
                        {/* 상품 이미지와 기본 정보 */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            {/* 상품 이미지 */}
                            <div className="flex justify-center sm:justify-start">
                                <div className="w-40 h-28 relative overflow-hidden rounded-lg border">
                                    <Image
                                        src={imageUrl}
                                        alt={imageAlt}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* 상품명과 가격 정보 */}
                            <div
                                className="flex-1 flex flex-col gap-y-2 sm:justify-between sm:h-28 text-center md:text-start py-2">
                                <h1 className="text-xl font-bold text-gray-900 truncate">
                                    {productData.name} {productData.subtitle}
                                </h1>

                                <div className="text-sm text-gray-600">
                                    정가: <span className="line-through">{formatPrice(productData.listPrice)}</span>
                                </div>

                                <div className="flex items-center justify-center md:justify-start space-x-3 flex-wrap">
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatPrice(productData.sellingPrice)}
                                    </span>
                                    {discountRate > 0 && (
                                        <span
                                            className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm font-medium whitespace-nowrap">
                                            {discountRate.toFixed(0)}% 할인
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 수량 선택 및 총 금액 */}
                        {!isSoldOut && (
                            <>
                                {/* 수량 선택 */}
                                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                    <span className="font-medium text-gray-700">수량</span>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={decreaseQuantity}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:border-gray-300 transition-colors"
                                            disabled={quantity <= 1}
                                            aria-label="수량 감소"
                                        >
                                            <Minus className="h-4 w-4 text-gray-600"/>
                                        </button>
                                        <span className="min-w-[3rem] text-center font-semibold text-lg">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={increaseQuantity}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-white hover:border-gray-400 transition-colors"
                                            aria-label="수량 증가"
                                        >
                                            <Plus className="h-4 w-4 text-gray-600"/>
                                        </button>
                                    </div>
                                </div>

                                {/* 총 금액 */}
                                <div
                                    className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 flex items-center justify-between">
                                    <span className="font-medium text-gray-700">총 금액</span>
                                    <span className="text-xl font-bold text-emerald-600">
                                        {formatPrice(totalAmount)}
                                    </span>
                                </div>
                            </>
                        )}

                        {/* 구매 버튼 */}
                        <Button
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 disabled:bg-gray-400"
                            disabled={isSoldOut}
                            onClick={addToCart}
                        >
                            <ShoppingCart className="h-5 w-5"/>
                            {isSoldOut ? '품절' : '장바구니 담기'}
                        </Button>
                    </div>
                </div>

                {/* 우측: 카테고리 설명 */}
                <div className="lg:col-span-2 flex flex-col">
                    {/* 카테고리 상태 표시 */}
                    {categoryLoading && (
                        <p className="text-gray-500 text-center py-2">카테고리 정보 로딩 중...</p>
                    )}

                    {categoryHasError && categoryError && (
                        <p className="text-red-500 text-center py-2">
                            카테고리 정보를 불러오는데 실패했습니다: {categoryError}
                        </p>
                    )}

                    {/* 카테고리 설명 */}
                    {categoryData?.description && (
                        <Alert variant="warning" className="flex-1">
                            <div className="h-full overflow-y-auto">
                                <StyledMarkdown variant="compact">
                                    {categoryData.description}
                                </StyledMarkdown>
                            </div>
                        </Alert>
                    )}
                </div>
            </div>

            {/* 나머지 안내 섹션들 */}
            {categoryData?.description1 && (
                <Alert variant="info" className="px-6">
                    <StyledMarkdown variant="compact">
                        {categoryData.description1}
                    </StyledMarkdown>
                </Alert>
            )}

            <DeliveryGuideSection/>
        </div>
    )
}