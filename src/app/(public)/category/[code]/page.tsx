'use client'

import {useEffect, useState} from 'react'
import {decode} from "@/global/lib/url"
import {useCategory, useProducts} from '@/features/inventory/public/hooks'
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

interface CategoryPageProps {
    params: Promise<{
        code: string;
    }>;
}

export default function CategoryPage({params}: CategoryPageProps) {
    const [slug, setSlug] = useState<string>('')

    // 커스텀 hooks 사용
    const {
        loading: categoryLoading,
        data: categoryData,
        error: categoryError,
        hasError: categoryHasError,
        isFetching: categoryFetching,
        getCategoryBySlug
    } = useCategory()

    const {
        loading: productsLoading,
        data: productsData,
        error: productsError,
        hasError: productsHasError,
        isFetching: productsFetching,
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

    // 카테고리 데이터가 있으면 표시
    if (categoryData) {
        return (
            <div className="px-2 md:px-0 py-2">
                {(categoryFetching || productsFetching) && (
                    <div className="mb-2 text-sm text-gray-500">
                        새로고침 중...
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-6">카테고리: {categoryData.title}</h1>

                <div className="space-y-4 mb-8">
                    <div>
                        <strong>ID:</strong> {categoryData.id}
                    </div>
                    <div>
                        <strong>생성일:</strong> {categoryData.created}
                    </div>
                    <div>
                        <strong>수정일:</strong> {categoryData.modified}
                    </div>
                    <div>
                        <strong>제목:</strong> {categoryData.title}
                    </div>
                    <div>
                        <strong>슬러그:</strong> {categoryData.slug}
                    </div>
                    <div>
                        <strong>썸네일:</strong> {categoryData.thumbnail}
                    </div>
                    <div>
                        <strong>설명:</strong>
                        <ReactMarkdown>
                            {categoryData.description}
                        </ReactMarkdown>
                    </div>
                    <div>
                        <strong>상세 설명:</strong>
                        <ReactMarkdown>
                            {categoryData.description1}
                        </ReactMarkdown>
                    </div>
                    <div>
                        <strong>레벨:</strong> {categoryData.level}
                    </div>
                    <div>
                        <strong>부모 ID:</strong> {categoryData.parentId}
                    </div>
                    <div>
                        <strong>할인율:</strong> {categoryData.discountRate}%
                    </div>
                    <div>
                        <strong>PG:</strong> {categoryData.pg ? '예' : '아니오'}
                    </div>
                    <div>
                        <strong>PG 할인율:</strong> {categoryData.pgDiscountRate}%
                    </div>
                </div>

                {/* 상품 목록 섹션 */}
                <div className="border-t pt-8">
                    <h2 className="text-2xl font-bold mb-4">상품 목록</h2>

                    {productsLoading && (
                        <p>상품 목록 로딩 중...</p>
                    )}

                    {productsHasError && (
                        <div>
                            <p>상품 목록을 불러오는데 실패했습니다.</p>
                            {productsError && (
                                <p className="text-sm text-red-500 mt-1">오류: {productsError}</p>
                            )}
                        </div>
                    )}

                    {productsData && (
                        <div className="space-y-6">
                            {productsData.length === 0 ? (
                                <p>등록된 상품이 없습니다.</p>
                            ) : (
                                productsData.map((product) => (
                                    <div key={product.id} className="border p-4 rounded">
                                        <div className="space-y-2">
                                            <div>
                                                <strong>ID:</strong>
                                                <Link href={`/product/${product.id}/${product.code}`}>
                                                    {product.id}
                                                </Link>
                                            </div>
                                            <div>
                                                <strong>이름:</strong> {product.name}
                                            </div>
                                            {product.subtitle && (
                                                <div>
                                                    <strong>부제목:</strong> {product.subtitle}
                                                </div>
                                            )}
                                            <div>
                                                <strong>코드:</strong> {product.code}
                                            </div>
                                            <div>
                                                <strong>정가:</strong> {product.listPrice.toLocaleString()}원
                                            </div>
                                            <div>
                                                <strong>판매가:</strong> {product.sellingPrice.toLocaleString()}원
                                            </div>
                                            {product.description && (
                                                <div>
                                                    <strong>설명:</strong>
                                                    <pre
                                                        className="whitespace-pre-wrap mt-1 p-2 bg-gray-50 rounded text-sm">
                                                        {product.description}
                                                    </pre>
                                                </div>
                                            )}
                                            <div>
                                                <strong>재고:</strong> {product.stock}
                                            </div>
                                            <div>
                                                <strong>상태:</strong> {product.status}
                                            </div>
                                            <div>
                                                <strong>포지션:</strong> {product.position}
                                            </div>
                                            <div>
                                                <strong>리뷰 수:</strong> {product.reviewCount}
                                            </div>
                                            <div>
                                                <strong>네이버 파트너:</strong> {product.naverPartner ? '예' : '아니오'}
                                            </div>
                                            {product.naverPartnerTitle && (
                                                <div>
                                                    <strong>네이버 파트너 제목:</strong> {product.naverPartnerTitle}
                                                </div>
                                            )}
                                            <div>
                                                <strong>PG:</strong> {product.pg ? '예' : '아니오'}
                                            </div>
                                            <div>
                                                <strong>PG 판매가:</strong> {product.pgSellingPrice.toLocaleString()}원
                                            </div>
                                            <div>
                                                <strong>PG 리뷰 수:</strong> {product.reviewCountPg}
                                            </div>
                                            <div>
                                                <strong>삭제됨:</strong> {product.isRemoved ? '예' : '아니오'}
                                            </div>
                                            <div>
                                                <strong>생성일:</strong> {product.created || 'N/A'}
                                            </div>
                                            <div>
                                                <strong>수정일:</strong> {product.modified || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // 예상치 못한 상태
    return (
        <div className="px-2 md:px-0 py-2">
            <p>카테고리 데이터가 없습니다.</p>
        </div>
    )
}