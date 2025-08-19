'use client'

import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {decode} from '@/global/lib/url'
import {useCategoryBySlug, useProducts} from '@/features/inventory/public/hooks'
import {useCart} from '@/features/order/cart/hooks'
import {useToast} from '@/features/ui/toast/hooks'
import {Alert} from '@/components/layout/containers/Alert'
import ProductCard from '@/components/widgets/cards/ProductCard'
import {StyledMarkdown} from "@/components/layout/containers/StyledMakrdown"

interface CategoryPageProps {
    params: Promise<{
        code: string
    }>
}

export default function CategoryPage({params}: CategoryPageProps) {
    const router = useRouter()
    const [slug, setSlug] = useState<string>('')

    const {
        loading: categoryLoading,
        data: categoryData,
        error: categoryError,
        hasError: categoryHasError,
        getCategoryBySlug
    } = useCategoryBySlug()

    const {
        loading: productsLoading,
        data: productsData,
        error: productsError,
        hasError: productsHasError,
        getProductsByCategory
    } = useProducts()

    const {addProduct} = useCart()
    const {showInfo, showError} = useToast()

    useEffect(() => {
        const fetchSlug = async () => {
            try {
                const {code} = await params
                const decodedCode = decode(code)
                setSlug(decodedCode)
            } catch (err) {
                console.error('Failed to fetch slug:', err)
            }
        }

        void fetchSlug()
    }, [params])

    useEffect(() => {
        if (slug) {
            getCategoryBySlug(slug)
        }
    }, [slug, getCategoryBySlug])

    useEffect(() => {
        if (categoryData?.id) {
            getProductsByCategory(categoryData.id)
        }
    }, [categoryData?.id, getProductsByCategory])

    /**
     * 장바구니에 상품 추가
     */
    const addToCart = useCallback((productId: number) => {
        try {
            // 입력값 검증
            if (!productId || !Number.isInteger(productId) || productId <= 0) {
                showError('오류', '유효하지 않은 상품 ID입니다.')
                return
            }

            // 상품 데이터 찾기
            const product = productsData?.find(p => p.id === productId)

            if (!product) {
                showError('오류', '상품 정보를 찾을 수 없습니다.')
                return
            }

            // 장바구니에 추가
            addProduct({
                id: String(product.id),
                title: product.name,
                subtitle: product.subtitle || '',
                price: product.sellingPrice,
                quantity: 1
            })

            // 성공 메시지 표시
            showInfo(
                '장바구니 추가',
                `${product.name} ${product.subtitle}이(가) 장바구니에 추가되었습니다.`
            )

        } catch (error) {
            console.error('장바구니 추가 실패:', error)
            showError('오류', '장바구니에 추가하는 중 오류가 발생했습니다.')
        }
    }, [productsData, addProduct, showInfo, showError])

    const navigateToProduct = useCallback((productId: number, productCode: string) => {
        router.push(`/product/${productId}/${productCode}`)
    }, [router])

    const getProductImageUrl = () => {
        return `https://pincoin-s3.s3.amazonaws.com/media/${categoryData?.thumbnail}`
    }

    // Early returns for loading and error states
    if (!slug || categoryLoading) {
        return <p className="px-2 md:px-0 py-2">로딩 중...</p>
    }

    if (categoryHasError) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>카테고리를 불러오는데 실패했습니다.</p>
                {categoryError && <p className="text-sm text-red-500 mt-1">오류: {categoryError}</p>}
            </div>
        )
    }

    if (!categoryData) {
        return <p className="px-2 md:px-0 py-2">카테고리 데이터가 없습니다.</p>
    }

    return (
        <div className="flex flex-col gap-y-2">
            {/* 카테고리 설명 */}
            <Alert>
                <StyledMarkdown variant="compact">
                    {categoryData.description}
                </StyledMarkdown>
            </Alert>

            {/* 상품 목록 섹션 */}
            {productsLoading && (
                <p className="text-center py-8">상품 목록 로딩 중...</p>
            )}

            {productsHasError && (
                <div className="text-center py-8">
                    <p>상품 목록을 불러오는데 실패했습니다.</p>
                    {productsError && <p className="text-sm text-red-500 mt-1">오류: {productsError}</p>}
                </div>
            )}

            {productsData && (
                productsData.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">등록된 상품이 없습니다.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-6">
                        {productsData.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                imageUrl={getProductImageUrl()}
                                onAddToCart={addToCart}
                                onClick={(productId) => navigateToProduct(productId, product.code)}
                                isPriority={index === 0} // 첫 번째 이미지만 priority
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    )
}