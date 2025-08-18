'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Minus, Plus, ShoppingCart} from 'lucide-react';
import {useCategoryById, useProduct} from '@/features/inventory/public/hooks';
import ReactMarkdown from 'react-markdown';
import {Alert} from "@/components/layout/containers/Alert";
import {ProductStock} from "@/features/inventory/public/response";

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
        code: string;
    }>;
}

export default function ProductDetailPage({params}: ProductDetailPageProps) {
    const [productId, setProductId] = useState<number>(0);
    const [quantity, setQuantity] = useState(1);

    const {
        loading: productLoading,
        data: productData,
        error: productError,
        hasError: productHasError,
        getProduct
    } = useProduct();

    const {
        loading: categoryLoading,
        data: categoryData,
        error: categoryError,
        hasError: categoryHasError,
        getCategoryById
    } = useCategoryById();

    useEffect(() => {
        const fetchParams = async () => {
            const {id} = await params;
            setProductId(parseInt(id));
        };

        void fetchParams();
    }, [params]);

    // productId가 준비되면 상품 조회
    useEffect(() => {
        if (productId && productId > 0) {
            getProduct(productId);
        }
    }, [productId, getProduct]);

    // 상품 데이터가 준비되면 카테고리 조회
    useEffect(() => {
        if (productData?.categoryId) {
            getCategoryById(productData.categoryId);
        }
    }, [productData?.categoryId, getCategoryById]);

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`;
    };

    const calculateDiscountRate = () => {
        if (!productData || productData.listPrice === 0) return 0;
        return ((productData.listPrice - productData.sellingPrice) / productData.listPrice) * 100;
    };

    // 재고가 품절인지 확인하는 함수
    const isSoldOut = () => {
        return productData?.stock === ProductStock.SOLD_OUT;
    };

    // productId가 아직 준비되지 않았을 때
    if (!productId) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        );
    }

    // 상품 처음 로딩 중
    if (productLoading) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        );
    }

    // 상품 에러 발생시
    if (productHasError) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>상품을 불러오는데 실패했습니다.</p>
                {productError && (
                    <p className="text-sm text-red-500 mt-1">오류: {productError}</p>
                )}
            </div>
        );
    }

    // 상품 데이터가 없을 때
    if (!productData) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>상품 데이터가 없습니다.</p>
            </div>
        );
    }

    const discountRate = calculateDiscountRate();

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">


            {/* 카테고리 로딩 또는 에러 상태 */}
            {categoryLoading && (
                <div className="text-center py-2">
                    <p className="text-sm text-gray-500">카테고리 정보 로딩 중...</p>
                </div>
            )}

            {categoryHasError && categoryError && (
                <div className="text-center py-2">
                    <p className="text-sm text-red-500">카테고리 정보를 불러오는데 실패했습니다: {categoryError}</p>
                </div>
            )}

            {/* 상품 기본 정보 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 상품 이미지 */}
                <div className="space-y-4">
                    <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg border">
                        <div
                            className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">🎁</div>
                                <p>{productData.name}</p>
                                <p className="text-sm">{productData.code}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 상품 정보 및 구매 옵션 */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {productData.name}
                        </h1>
                        {productData.subtitle && (
                            <p className="text-gray-600">{productData.subtitle}</p>
                        )}
                    </div>

                    {/* 가격 정보 */}
                    <div className="space-y-2">
                        {discountRate > 0 && (
                            <div className="flex items-center space-x-3">
                                <span className="text-lg text-gray-500 line-through">
                                    정가: {formatPrice(productData.listPrice)}
                                </span>
                                <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                                    {discountRate.toFixed(2)}% 할인
                                </span>
                            </div>
                        )}
                        <div className="text-3xl font-bold text-gray-900">
                            판매가: {formatPrice(productData.sellingPrice)}
                        </div>
                    </div>

                    {/* 재고 상태 */}
                    <div className="text-sm">
                        <span className="text-gray-600">재고: </span>
                        <span
                            className={`font-medium ${isSoldOut() ? 'text-red-600' : 'text-green-600'}`}>
                            {isSoldOut() ? '품절' : '판매중'}
                        </span>
                    </div>

                    {/* 수량 선택 */}
                    {!isSoldOut() && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                수량
                            </label>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4"/>
                                </button>
                                <span className="text-lg font-medium min-w-[3rem] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <Plus className="h-4 w-4"/>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 총 금액 */}
                    {!isSoldOut() && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium">총 금액:</span>
                                <span className="text-2xl font-bold text-emerald-600">
                                    {formatPrice(productData.sellingPrice * quantity)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 구매 버튼 */}
                    <Button
                        className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                        disabled={isSoldOut()}
                    >
                        <ShoppingCart className="h-5 w-5"/>
                        {isSoldOut() ? '품절' : '장바구니 담기'}
                    </Button>
                </div>
            </div>

            {/* 카테고리 설명 섹션 */}
            {categoryData?.description && (
                <Alert>
                    <ReactMarkdown>
                        {categoryData.description}
                    </ReactMarkdown>
                </Alert>
            )}

            {/* 카테고리 설명 섹션 */}
            {categoryData?.description1 && (
                <Alert>
                    <ReactMarkdown>
                        {categoryData.description1}
                    </ReactMarkdown>
                </Alert>
            )}

            {/* 상품권 발송 안내 */}
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">상품권 발송 안내</h2>
                    <div className="space-y-2 text-sm text-gray-700">
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
                    <h2 className="text-xl font-bold mb-4">교환 및 환불 안내</h2>
                    <div className="space-y-2 text-sm text-gray-700">
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
                    <h2 className="text-xl font-bold mb-4">상품권 구매 한도 안내</h2>
                    <div className="space-y-2 text-sm text-gray-700">
                        <p className="font-bold">• 컬쳐랜드상품권, 도서문화상품권, 구글기프트카드를 포함하고 일일 액면가 기준 누계 10만원 이상 첫 구매 시 반드시
                            서류본인인증을 해야 합니다.</p>
                        <p className="font-bold">• 계좌이체로 일일 액면가 기준 누계 30만원 이상 첫 구매 시 반드시 서류본인인증을 해야 합니다.</p>
                        <p className="font-bold">• 페이팔로 최근30일 이내 액면가 기준 누계 15만원 이상 구매 시 반드시 한국 신분증으로 서류본인인증을 해야 합니다.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}