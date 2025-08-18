'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import {Minus, Plus, ShoppingCart} from 'lucide-react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import {useCategoryById, useProduct} from '@/features/inventory/public/hooks'
import {Card, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Alert} from '@/components/layout/containers/Alert'
import {ProductStock} from '@/features/inventory/public/response'

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

    // 카테고리 이미지 URL 생성 (CategoryPage와 동일한 방식)
    const imageUrl = useMemo(() => {
        if (!categoryData?.thumbnail) return '/placeholder-image.jpg' // 기본 플레이스홀더 이미지
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

    const addToCart = useCallback(() => {
        if (!productData || isSoldOut) return

        console.log('장바구니에 추가:', {
            productId: productData.id,
            quantity,
            totalAmount
        })
        // TODO: 장바구니 추가 로직 구현
    }, [productData, isSoldOut, quantity, totalAmount])

    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`
    }

    if (!productId) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    if (productLoading) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    if (productHasError) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>상품을 불러오는데 실패했습니다.</p>
                {productError && (
                    <p className="text-red-500 mt-1">오류: {productError}</p>
                )}
            </div>
        )
    }

    if (!productData) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>상품 데이터가 없습니다.</p>
            </div>
        )
    }

    return (
        // 반응형 레이아웃: 모바일은 세로, 태블릿+ 는 1/3 + 2/3 배치
        <div className="space-y-3">
            {/* 상품 기본 정보 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* 상품 정보 및 구매 옵션 - 모바일: 전체, 태블릿+: 1/3 */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="max-w-md mx-auto lg:max-w-none space-y-2">
                        {/* 상품 이미지와 기본 정보를 가로로 배치 */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            {/* 상품 이미지 - 좌측 절반 */}
                            <div className="flex-1 flex justify-center sm:justify-start">
                                <div className="w-40 h-28 relative overflow-hidden rounded-lg border shadow-sm">
                                    <Image
                                        src={imageUrl}
                                        alt={imageAlt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 160px, 160px"
                                        priority={false}
                                    />
                                </div>
                            </div>

                            {/* 상품명과 가격 정보 - 우측 절반 */}
                            <div className="flex-1 space-y-3">
                                {/* 상품명 */}
                                <div className="text-center sm:text-left">
                                    <h1 className="text-xl font-bold">
                                        {productData.name} {productData.subtitle}
                                    </h1>
                                </div>

                                {/* 가격 정보 */}
                                <div className="bg-gray-50 p-4 rounded-lg text-center sm:text-left space-y-2">
                                    <div className="text-sm text-gray-600">
                                        정가: <span className="line-through">{formatPrice(productData.listPrice)}</span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start space-x-3">
                <span className="text-lg font-bold text-gray-900">
                    {formatPrice(productData.sellingPrice)}
                </span>
                                        {discountRate > 0 && (
                                            <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm">
                        {discountRate.toFixed(2)}% 할인
                    </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 수량 선택 및 총 금액 */}
                        {!isSoldOut && (
                            <div className="space-y-2">
                                {/* 수량 선택 */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
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
                                </div>

                                {/* 총 금액 */}
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">총 금액</span>
                                        <span className="text-xl font-bold text-emerald-600">
                    {formatPrice(totalAmount)}
                </span>
                                    </div>
                                </div>
                            </div>
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

                {/* 카테고리 설명1만 우측 영역 - 모바일: 전체, 태블릿+: 2/3 */}
                <div className="lg:col-span-2 space-y-4">
                    {/* 카테고리 상태 표시 */}
                    {categoryLoading && (
                        <div className="text-center py-2">
                            <p className="text-gray-500">카테고리 정보 로딩 중...</p>
                        </div>
                    )}

                    {categoryHasError && categoryError && (
                        <div className="text-center py-2">
                            <p className="text-red-500">
                                카테고리 정보를 불러오는데 실패했습니다: {categoryError}
                            </p>
                        </div>
                    )}

                    {/* description1만 우측 영역에 표시 */}
                    {categoryData?.description && (
                        <Alert variant="error">
                            <ReactMarkdown>
                                {categoryData.description}
                            </ReactMarkdown>
                        </Alert>
                    )}
                </div>
            </div>

            {/* 나머지 안내 섹션들 */}
            <div className="space-y-4">
                {categoryData?.description1 && (
                    <Alert variant="info">
                        <ReactMarkdown>
                            {categoryData.description1}
                        </ReactMarkdown>
                    </Alert>
                )}
                {/* 상품권 발송 안내 */}
                <Card>
                    <CardContent>
                        <h2 className="font-bold mb-4">상품권 발송 안내</h2>
                        <div className="space-y-2 text-gray-700">
                            <p>• 상품권 확인은 사이트에서 확인합니다.</p>
                            <p>• 메뉴에서 모든 본인인증 절차를 완료하신 경우 최대 10분 이내로 상품권을 확인할 수 있습니다.</p>
                            <p>• 모든 본인인증 절차를 완료하시고도 10분 이내로 상품권을 확인하지 못한 경우 주문번호, 입금은행, 입금시각을 남겨주세요.</p>
                            <p>• 한국 시각 밤 11시 이후 10만원 이상 주문은 한국 시각 오전 10시 이후에 순차적으로 발송될 수 있습니다.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 교환 및 환불 안내 */}
                <Card>
                    <CardContent>
                        <h2 className="font-bold mb-4">교환 및 환불 안내</h2>
                        <div className="space-y-2 text-gray-700">
                            <p>• 상품권을 받기 전에 고객님의 교환 또는 환불 요청이 있은 날로부터 은행 영업일 기준으로 3~4일 이내에 처리됩니다.</p>
                            <p>• 상품권을 받으신 경우 해당 상품권을 사용하지 않은 경우에 한하여 3일 이내에만 교환 또는 환불 요청 가능합니다.</p>
                            <p>• 교환 또는 환불을 원하실 경우 요청 후 은행 영업일 기준으로 5~7일 이내에 처리됩니다.</p>
                            <p>• 환불 수수료 500원 차감한 금액이 환불 입금처리됩니다.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 상품권 구매 한도 안내 */}
                <Card>
                    <CardContent>
                        <h2 className="font-bold mb-4">상품권 구매 한도 안내</h2>
                        <div className="space-y-2 text-gray-700">
                            <p className="font-bold">
                                • 컬처랜드상품권, 도서문화상품권, 구글기프트카드를 포함하고 일일 액면가 기준 누계 10만원 이상 첫 구매 시 반드시 서류본인인증을 해야 합니다.
                            </p>
                            <p className="font-bold">
                                • 계좌이체로 일일 액면가 기준 누계 30만원 이상 첫 구매 시 반드시 서류본인인증을 해야 합니다.
                            </p>
                            <p className="font-bold">
                                • 페이팔로 최근30일 이내 액면가 기준 누계 15만원 이상 구매 시 반드시 한국 신분증으로 서류본인인증을 해야 합니다.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}