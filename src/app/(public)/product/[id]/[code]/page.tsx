'use client'

import {useEffect, useState} from 'react'
import {useGetProductQuery} from '@/features/inventory/public/api'

interface ProductPageProps {
    params: Promise<{
        id: string;
        code: string;
    }>;
}

export default function ProductPage({params}: ProductPageProps) {
    const [productId, setProductId] = useState<number>(0)

    useEffect(() => {
        const fetchParams = async () => {
            const {id} = await params
            setProductId(parseInt(id))
        }

        void fetchParams()
    }, [params])

    const {
        data: productData,
        isLoading: productLoading,
        error: productError,
        isFetching: productFetching
    } = useGetProductQuery(productId, {
        skip: !productId || productId === 0,
    })

    // productId가 아직 준비되지 않았을 때
    if (!productId) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    // 상품 처음 로딩 중
    if (productLoading) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    // 상품 에러 발생시
    if (productError) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>상품을 불러오는데 실패했습니다.</p>
            </div>
        )
    }

    // 상품 데이터가 있으면 표시
    if (productData) {
        return (
            <div className="px-2 md:px-0 py-2">
                {productFetching && (
                    <div className="mb-2 text-sm text-gray-500">
                        새로고침 중...
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-6">상품: {productData.name}</h1>

                <div className="space-y-4">
                    <div>
                        <strong>ID:</strong> {productData.id}
                    </div>
                    <div>
                        <strong>생성일:</strong> {productData.created || 'N/A'}
                    </div>
                    <div>
                        <strong>수정일:</strong> {productData.modified || 'N/A'}
                    </div>
                    <div>
                        <strong>삭제됨:</strong> {productData.isRemoved ? '예' : '아니오'}
                    </div>
                    <div>
                        <strong>이름:</strong> {productData.name}
                    </div>
                    {productData.subtitle && (
                        <div>
                            <strong>부제목:</strong> {productData.subtitle}
                        </div>
                    )}
                    <div>
                        <strong>코드:</strong> {productData.code}
                    </div>
                    <div>
                        <strong>정가:</strong> {productData.listPrice.toLocaleString()}원
                    </div>
                    <div>
                        <strong>판매가:</strong> {productData.sellingPrice.toLocaleString()}원
                    </div>
                    {productData.description && (
                        <div>
                            <strong>설명:</strong>
                            <pre className="whitespace-pre-wrap mt-2 p-4 bg-gray-100 rounded">
                                {productData.description}
                            </pre>
                        </div>
                    )}
                    <div>
                        <strong>포지션:</strong> {productData.position}
                    </div>
                    <div>
                        <strong>상태:</strong> {productData.status}
                    </div>
                    <div>
                        <strong>재고:</strong> {productData.stock}
                    </div>
                    <div>
                        <strong>카테고리 ID:</strong> {productData.categoryId}
                    </div>
                    <div>
                        <strong>리뷰 수:</strong> {productData.reviewCount}
                    </div>
                    <div>
                        <strong>네이버 파트너:</strong> {productData.naverPartner ? '예' : '아니오'}
                    </div>
                    {productData.naverPartnerTitle && (
                        <div>
                            <strong>네이버 파트너 제목:</strong> {productData.naverPartnerTitle}
                        </div>
                    )}
                    {productData.naverAttribute && (
                        <div>
                            <strong>네이버 속성:</strong> {productData.naverAttribute}
                        </div>
                    )}
                    {productData.naverPartnerTitlePg && (
                        <div>
                            <strong>네이버 파트너 제목 PG:</strong> {productData.naverPartnerTitlePg}
                        </div>
                    )}
                    <div>
                        <strong>PG:</strong> {productData.pg ? '예' : '아니오'}
                    </div>
                    <div>
                        <strong>PG 판매가:</strong> {productData.pgSellingPrice.toLocaleString()}원
                    </div>
                    <div>
                        <strong>PG 리뷰 수:</strong> {productData.reviewCountPg}
                    </div>
                </div>
            </div>
        )
    }

    // 예상치 못한 상태
    return (
        <div className="px-2 md:px-0 py-2">
            <p>상품 데이터가 없습니다.</p>
        </div>
    )
}