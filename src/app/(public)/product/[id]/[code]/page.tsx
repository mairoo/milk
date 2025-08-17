'use client'

import React, {useEffect, useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Minus, Plus, ShoppingCart} from 'lucide-react';
import {useProduct} from '@/features/inventory/public/hooks';

interface ProductDetailPageProps {
    params: Promise<{
        id: string;
        code: string;
    }>;
}

export default function ProductDetailPage({params}: ProductDetailPageProps) {
    const [productId, setProductId] = useState<number>(0);
    const [quantity, setQuantity] = useState(1);

    // 커스텀 hook 사용
    const {
        loading: productLoading,
        data: productData,
        error: productError,
        hasError: productHasError,
        getProduct
    } = useProduct();

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
                            className={`font-medium ${productData.stock === 'SOLD_OUT' ? 'text-red-600' : 'text-green-600'}`}>
                            {productData.stock === 'SOLD_OUT' ? '품절' : '판매중'}
                        </span>
                    </div>

                    {/* 수량 선택 */}
                    {productData.stock !== 'SOLD_OUT' && (
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
                    {productData.stock !== 'SOLD_OUT' && (
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
                        disabled={productData.stock === 'SOLD_OUT'}
                    >
                        <ShoppingCart className="h-5 w-5"/>
                        {productData.stock === 'SOLD_OUT' ? '품절' : '장바구니 담기'}
                    </Button>
                </div>
            </div>

            {/* 상품 설명 */}
            {productData.description && (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4">상품 설명</h2>
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {productData.description}
                        </pre>
                    </CardContent>
                </Card>
            )}

            {/* 상품권 안내 */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">상품권 안내</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-medium">구글기프트카드</p>
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                <li>• 발행회사: 구글 코리아</li>
                                <li>• 홈페이지: <a href="https://play.google.com/store"
                                               className="text-blue-600 hover:underline">https://play.google.com/store</a>
                                </li>
                                <li>• 고객센터: 080-234-0051</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium">상품권 번호 형식: 알파벳/숫자 20자리 또는 16자리</p>
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                <li>• <code className="bg-gray-100 px-1 rounded">1ABC-2DEF-3GHJ-4KLM-5NOP</code></li>
                                <li>• <code className="bg-gray-100 px-1 rounded">1ABC-2DEF-3GHJ-4KLM</code></li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 주의사항 */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-red-600">주의사항</h2>
                    <div className="space-y-3 text-sm">
                        <p>• 일일 충전한도는 160만원입니다.</p>
                        <p className="font-bold text-red-600">• 신규고객은 첫 구매로부터 48시간 동안 일일 50만원까지만 구매 가능합니다.</p>

                        <div className="mt-4">
                            <p className="font-medium text-red-600">BM-RGCH-06 오류</p>
                            <ul className="mt-1 space-y-1 text-gray-700 ml-4">
                                <li>• 구글 결제 센터 페이지-설정에서 <strong>국가/지역</strong>을 <strong>대한민국</strong>으로 설정</li>
                                <li>• 구글 고객센터 080-234-0051 전화문의</li>
                            </ul>
                        </div>

                        <div className="mt-4">
                            <p className="font-medium text-red-600">"이미 사용한 코드" 오류</p>
                            <ul className="mt-1 space-y-1 text-gray-700 ml-4">
                                <li>• 구글 계정에 잔액이 올바르게 업데이트되지 않은 현상으로 30분 후 다시 확인</li>
                                <li>• 구글 고객센터 080-234-0051 전화문의</li>
                            </ul>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg mt-4 space-y-2">
                            <p className="font-bold text-red-700">• 구글코리아는 국내법을 따르지 않고 취소/환불을 지원하지 않아 계정 오류 발생 등 어떤 경우에도
                                환불 처리되지 않습니다.</p>
                            <p className="font-bold text-red-700">• 현재 등록할 수 없는 카드라는 오류 또는 사용 후 게임 내 아이템 충전 시 구글에서 추가
                                정보를 요구하는 경우가 발생해도 절대 환불 처리가 안 됩니다.</p>
                            <p className="font-bold text-red-700">• 구글은 이의제기를 해도 거절되면 그 이유를 알려주지도 않고 계속 거절하기 때문에 어떠한 대응도
                                안 됩니다.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 사용방법 */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">사용방법</h2>
                    <ol className="space-y-2 text-sm">
                        <li>1. Android 스마트폰 또는 태블릿에서 Play 스토어 앱을 엽니다. 메뉴 아이콘을 탭하고 코드 사용을 선택합니다. 노트북에서는 <a
                            href="https://play.google.com/redeem"
                            className="text-blue-600 hover:underline">play.google.com/redeem</a>으로 이동합니다.
                        </li>
                        <li>2. 기프트 코드를 입력합니다.</li>
                        <li>3. 쇼핑을 시작합니다. 기프트 카드 금액이 Google Play 잔액에 추가됩니다.</li>
                    </ol>
                </CardContent>
            </Card>

            {/* 이용약관 */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">이용약관</h2>
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>1. Google Play 기프트코드는 Google Payment Korea Limited에서 발행합니다.</p>
                        <p>2. <a href="https://play.google.com/kr-card-terms"
                                 className="text-blue-600 hover:underline">play.google.com/kr-card-terms</a>에서 약관 전문 및
                            개인정보처리방침을 확인하세요.</p>
                        <p>3. 만 14세 이상의 대한민국 거주자만 사용할 수 있습니다.</p>
                        <p>4. 코드의 금액을 적립(redeem)하려면 Google Payments 계정을 보유하고 있어야 하며 인터넷에 연결되어 있어야 합니다.</p>
                        <p>5. Google Play와 YouTube에서 조건에 맞는 상품 구매를 위해서만 사용할 수 있습니다.</p>
                        <p>6. 수수료나 유효기간은 없습니다.</p>
                        <p>7. 기기와 특정 구독 구매에는 사용할 수 없습니다.</p>
                        <p>8. 기타 제한사항이 적용될 수 있습니다.</p>
                        <p className="font-bold">9. 자연재해, 카드결함으로 인해 사용할 수 없거나 잔액이 액면가의 40% 미만인 경우에만 Google Play 문의를 통하여
                            환불이 가능합니다.</p>
                        <p>10. 현금이나 기타 카드로의 전환, 신용 거래에의 이용, 재충전은 불가능합니다.</p>
                        <p>11. Google Play 이외의 잔액과 통합할 수 없으며, 재판매, 교환, 이전할 수 없습니다.</p>
                        <p>12. 코드 분실에 대해서는 책임지지 않습니다.</p>
                        <p>13. 고객 지원 및 잔액 확인을 위해서는 <a href="https://support.google.com/googleplay/go/cardhelp"
                                                      className="text-blue-600 hover:underline">support.google.com/googleplay/go/cardhelp</a> 페이지에
                            방문하세요.</p>
                        <p>14. 이용약관: <a href="https://g.co/playtermskr"
                                        className="text-blue-600 hover:underline">g.co/playtermskr</a></p>
                    </div>
                </CardContent>
            </Card>

            {/* 상품권 발송 안내 */}
            <Card>
                <CardContent className="p-6">
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
                <CardContent className="p-6">
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
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">상품권 구매 한도 안내</h2>
                    <div className="space-y-2 text-sm text-gray-700">
                        <p className="font-bold">• 문화상품권, 해피머니, 도서문화상품권, 구글기프트카드를 포함하고 일일 액면가 기준 누계 10만원 이상 첫 구매 시 반드시
                            서류본인인증을 해야 합니다.</p>
                        <p className="font-bold">• 계좌이체로 일일 액면가 기준 누계 30만원 이상 첫 구매 시 반드시 서류본인인증을 해야 합니다.</p>
                        <p className="font-bold">• 페이팔로 최근30일 이내 액면가 기준 누계 15만원 이상 구매 시 반드시 한국 신분증으로 서류본인인증을 해야 합니다.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}