'use client'

import {useEffect, useState} from 'react'
import {decode} from "@/global/lib/url"
import {useCategoryBySlug, useProducts} from '@/features/inventory/public/hooks'
import ReactMarkdown from 'react-markdown';
import {Alert} from "@/components/layout/containers/Alert";
import {useRouter} from 'next/navigation';
import ProductCard from "@/components/widgets/cards/ProductCard";

interface CategoryPageProps {
    params: Promise<{
        code: string;
    }>;
}

export default function CategoryPage({params}: CategoryPageProps) {
    const [slug, setSlug] = useState<string>('')
    const router = useRouter();

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
            const {code} = await params
            const decodedCode = decode(code)
            setSlug(decodedCode)
        }

        void fetchSlug()
    }, [params])

    // slug가 준비되면 카테고리 조회
    useEffect(() => {
        if (slug) {
            getCategoryBySlug(slug)
        }
    }, [slug, getCategoryBySlug])

    // 카테고리 데이터가 준비되면 상품 목록 조회
    useEffect(() => {
        if (categoryData?.id) {
            getProductsByCategory(categoryData.id)
        }
    }, [categoryData?.id, getProductsByCategory])

    // 장바구니 추가 핸들러
    const handleAddToCart = (productId: number) => {
        console.log('장바구니에 추가:', productId);
        // TODO: 장바구니 추가 로직 구현
    };

    // 상품 클릭 핸들러
    const handleProductClick = (productId: number, productCode: string) => {
        router.push(`/product/${productId}/${productCode}`);
    };

    // 카테고리 썸네일을 상품 이미지로 사용
    const getProductImageUrl = () => {
        return `https://pincoin-s3.s3.amazonaws.com/media/${categoryData?.thumbnail}`;
    };

    // slug가 아직 준비되지 않았을 때
    if (!slug) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    // 카테고리 처음 로딩 중
    if (categoryLoading) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    // 카테고리 에러 발생시
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

    // 카테고리 데이터가 없을 때
    if (!categoryData) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>카테고리 데이터가 없습니다.</p>
            </div>
        )
    }

    // 카테고리 데이터가 있을 때 메인 컨텐츠 렌더링
    return (
        <div className="flex flex-col gap-y-2">
            <Alert>
                <ReactMarkdown>
                    {categoryData.description}
                </ReactMarkdown>
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
                                        onAddToCart={handleAddToCart}
                                        onClick={(productId) => handleProductClick(productId, product.code)}
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