'use client'

import {useState} from 'react';
import Section from "@/components/widgets/cards/Section";
import {useCart} from "@/features/order/cart/hooks";
import {Minus, Plus, ShoppingCart, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {OrderPaymentMethod} from "@/features/order/shared/types";

export default function MyCartPage() {
    const {products, stats, increment, decrement, removeProduct, clear, updateQuantity} = useCart();

    // 각 상품별 임시 입력값을 관리하는 state
    const [tempInputs, setTempInputs] = useState<{ [key: string]: string }>({});

    // 결제 수단 선택 state
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<OrderPaymentMethod | null>(null);

    // 구매 동의 체크박스 state
    const [agreements, setAgreements] = useState({
        purchase: false,
        personalUse: false,
        googleGiftCard: false
    });

    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`;
    };

    // 수량 직접 변경 핸들러
    const handleQuantityChange = (productId: string, value: string) => {
        setTempInputs(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    // 포커스 아웃시 또는 엔터키 입력시 실제 수량 업데이트
    const handleQuantitySubmit = (productId: string, value: string) => {
        const numValue = parseInt(value);

        if (!value || numValue <= 0) {
            removeProduct(productId);
        } else if (numValue >= 1 && numValue <= 9999) {
            updateQuantity?.(productId, numValue);
        } else {
            const product = products.find(p => p.id === productId);
            if (product) {
                setTempInputs(prev => ({
                    ...prev,
                    [productId]: product.quantity.toString()
                }));
            }
        }

        setTempInputs(prev => {
            const newInputs = {...prev};
            delete newInputs[productId];
            return newInputs;
        });
    };

    // 현재 표시할 수량값
    const getDisplayQuantity = (productId: string, actualQuantity: number) => {
        return tempInputs[productId] ?? actualQuantity.toString();
    };

    // + 버튼 클릭 핸들러
    const handleIncrement = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product && product.quantity < 9999) {
            increment(productId);
        }
    };

    // - 버튼 클릭 핸들러
    const handleDecrement = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            if (product.quantity <= 1) {
                removeProduct(productId);
            } else {
                decrement(productId);
            }
        }
    };

    const CartProductList = () => {
        if (stats.isEmpty) {
            return (
                <div className="flex flex-col items-center justify-center text-gray-500 py-16">
                    <ShoppingCart className="w-24 h-24 mb-6 text-gray-300"/>
                    <p className="text-lg text-center mb-2">장바구니가 비어있습니다</p>
                    <p className="text-sm text-center text-gray-400">상품을 담아보세요!</p>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {/* 장바구니 헤더 - 상품 개수 및 전체 삭제 */}
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">
                        총 {stats.productCount}개 상품
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clear}
                        className="text-gray-500 hover:text-red-600"
                    >
                        <Trash2 className="w-4 h-4 mr-2"/>
                        비우기
                    </Button>
                </div>

                {/* 상품 목록 */}
                <div className="space-y-2">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-none"
                        >
                            {/* 상품 정보 및 삭제 버튼 */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                        {product.title} {product.subtitle}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        단가: {formatPrice(product.price)}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeProduct(product.id)}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4 mr-2"/>
                                    삭제
                                </Button>
                            </div>

                            {/* 수량 조절 및 가격 정보 */}
                            <div className="flex items-center justify-between">
                                {/* 수량 조절 */}
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-700 font-medium">수량:</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecrement(product.id)}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            aria-label="수량 감소"
                                        >
                                            <Minus className="h-4 w-4 text-gray-600"/>
                                        </button>

                                        <input
                                            type="text"
                                            value={getDisplayQuantity(product.id, product.quantity)}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                if (value.length <= 4) {
                                                    handleQuantityChange(product.id, value);
                                                }
                                            }}
                                            onBlur={(e) => handleQuantitySubmit(product.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.currentTarget.blur();
                                                }
                                            }}
                                            className="w-16 h-10 text-center font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            aria-label="수량 입력"
                                        />

                                        <button
                                            onClick={() => handleIncrement(product.id)}
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            aria-label="수량 증가"
                                            disabled={product.quantity >= 9999}
                                        >
                                            <Plus className="h-4 w-4 text-gray-600"/>
                                        </button>
                                    </div>
                                </div>

                                {/* 소계 */}
                                <div className="text-right">
                                    <p className="text-gray-600 text-sm mb-1">소계</p>
                                    <p className="font-bold text-emerald-600">
                                        {formatPrice(product.price * product.quantity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 총 결제 금액 */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                    <div className="flex justify-between items-center font-bold text-emerald-800 text-lg">
                        <span>총 결제금액</span>
                        <span> {formatPrice(stats.totalPrice)}</span>
                    </div>
                </div>
            </div>
        );
    };

    // 결제 수단 선택 컴포넌트
    const PaymentMethodSelector = () => {
        const paymentMethods = [
            {value: OrderPaymentMethod.BANK_TRANSFER, label: '무통장입금'},
            {value: OrderPaymentMethod.ESCROW, label: '에스크로 (KB)'},
            {value: OrderPaymentMethod.PAYPAL, label: '페이팔 (PayPal)'},
            {value: OrderPaymentMethod.CREDIT_CARD, label: '신용카드'},
            {value: OrderPaymentMethod.PHONE_BILLS, label: '휴대폰결제'},
        ];

        return (
            <div className="space-y-3">
                {paymentMethods.map((method) => (
                    <label
                        key={method.value}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={selectedPaymentMethod === method.value}
                            onChange={(e) => setSelectedPaymentMethod(Number(e.target.value) as OrderPaymentMethod)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                        />
                        <span className="text-gray-900 font-medium">{method.label}</span>
                    </label>
                ))}
            </div>
        );
    };

    // 구매동의 컴포넌트
    const PurchaseAgreement = () => {
        const handleAgreementChange = (key: keyof typeof agreements) => {
            setAgreements(prev => ({
                ...prev,
                [key]: !prev[key]
            }));
        };

        return (
            <div className="space-y-6">
                {/* 구매 동의 */}
                <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreements.purchase}
                            onChange={() => handleAgreementChange('purchase')}
                            className="w-5 h-5 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <div>
                            <span className="text-gray-900 font-medium">
                                구매를 동의합니다. (전자상거래법 제 8조 제2항)
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                                주문하실 상품, 가격, 배송정보, 할인정보 등을 확인하였으며, 구매에 동의합니다.
                            </p>
                        </div>
                    </label>
                </div>

                {/* 본인 사용 목적 */}
                <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreements.personalUse}
                            onChange={() => handleAgreementChange('personalUse')}
                            className="w-5 h-5 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <div>
                            <span className="text-gray-900 font-medium">
                                본인 사용 목적으로 상품권을 구매합니다.
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                                대리구매 알바 또는 상품권 할인(페이백)을 미끼로 다른 사람이 상품권 구매를 요구했다면 100% 사기입니다.
                            </p>
                        </div>
                    </label>
                </div>

                {/* 구글기프트카드 환불불가 */}
                <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreements.googleGiftCard}
                            onChange={() => handleAgreementChange('googleGiftCard')}
                            className="w-5 h-5 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <div>
                            <span className="text-gray-900 font-medium">
                                구글기프트카드는 절대 교환 및 환불불가 사실을 알고 구매합니다.
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                                구글에서 사용 오류로 이의제기 거절이 되어도 핀코인에 책임을 묻지 않습니다.
                            </p>
                        </div>
                    </label>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-y-6">
            <Section title="장바구니 / 주문결제">
                <CartProductList/>
            </Section>

            <Section title="입금 / 결제수단">
                <PaymentMethodSelector/>
            </Section>

            <Section title="구매동의">
                <PurchaseAgreement/>
            </Section>

            <Section title="첫 주문 시 주의사항">
                <h2 className="font-bold mb-2">휴대폰본인인증 필수</h2>
                <ul className="space-y-1 mb-4">
                    <li>단, 해외에서 페이팔 결제하시는 경우 서류본인인증을 대신 완료합니다.</li>
                </ul>
                <h2 className="font-bold mb-2">서류본인인증이 필요한 경우</h2>
                <ul className="space-y-1">
                    <li>문화상품권, 해피머니, 도서문화상품권, 구글기프트카드를 포함하고 일일 액면가 기준 누계 10만원 이상 첫 구매하는 경우</li>
                    <li>계좌이체로 일일 액면가 기준 누계 30만원 이상 첫 구매하는 경우</li>
                    <li>페이팔로 최근30일 이내 액면가 기준 누계 15만원 이상 구매하는 경우 (한국 신분증 필수)</li>
                    <li>휴대폰의 명의가 다른 경우 (단, 가족 명의로라도 휴대폰본인인증은 완료해야 합니다.)</li>
                </ul>
            </Section>
        </div>
    );
}