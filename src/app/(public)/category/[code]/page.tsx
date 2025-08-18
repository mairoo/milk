'use client'

import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {decode} from '@/global/lib/url'
import {useCategoryBySlug, useProducts} from '@/features/inventory/public/hooks'
import {Alert} from '@/components/layout/containers/Alert'
import ProductCard from '@/components/widgets/cards/ProductCard'
import {StyledMarkdown} from "@/components/layout/containers/StyledMakrdown";

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

    const addToCart = useCallback((productId: number) => {
        console.log('장바구니에 추가:', productId)
        // TODO: 장바구니 추가 로직 구현
    }, [])

    const navigateToProduct = useCallback((productId: number, productCode: string) => {
        router.push(`/product/${productId}/${productCode}`)
    }, [router])

    const getProductImageUrl = () => {
        return `https://pincoin-s3.s3.amazonaws.com/media/${categoryData?.thumbnail}`
    }

    if (!slug) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    if (categoryLoading) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    if (categoryHasError) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>카테고리를 불러오는데 실패했습니다.</p>
                {categoryError && (
                    <p className="text-sm text-red-500 mt-1">오류: {categoryError}</p>
                )}
            </div>
        )
    }

    if (!categoryData) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>카테고리 데이터가 없습니다.</p>
            </div>
        )
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
            <div>
                {productsLoading && (
                    <div className="flex justify-center py-8">
                        <p>상품 목록 로딩 중...</p>
                    </div>
                )}

                {productsHasError && (
                    <div className="text-center py-8">
                        <p>상품 목록을 불러오는데 실패했습니다.</p>
                        {productsError && (
                            <p className="text-sm text-red-500 mt-1">오류: {productsError}</p>
                        )}
                    </div>
                )}

                {productsData && (
                    <div>
                        {productsData.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">등록된 상품이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-6">
                                {productsData.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        imageUrl={getProductImageUrl()}
                                        onAddToCart={addToCart}
                                        onClick={(productId) => navigateToProduct(productId, product.code)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}