'use client'

import React, {useCallback, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import Section from "@/components/widgets/cards/Section";
import {useCart} from "@/features/order/cart/hooks";
import {Minus, Plus, ShoppingCart, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {formatPrice, validateCart} from "@/features/order/cart/utils";
import {OrderFormData} from "@/app/(public)/cart/types";
import {orderSchema, PAYMENT_METHOD_OPTIONS} from "@/app/(public)/cart/constants";
import {OrderPaymentMethod} from "@/features/order/shared/types";
import {useMemberOrder} from "@/features/order/member/hooks";
import {useRouter} from "next/navigation";

export default function CartPage() {
    const router = useRouter()

    const {
        products,
        stats,
        clear,
        removeProduct,
        getDisplayQuantity,
        handleQuantityChange,
        handleQuantitySubmit,
        handleIncrement,
        handleDecrement,
    } = useCart();

    // 주문 API 훅 추가
    const {
        createOrder,
        loading: orderLoading,
        error: orderError,
        isSuccess: orderSuccess
    } = useMemberOrder();

    const {
        handleSubmit,
        watch,
        setValue,
        formState: {errors, isValid, isSubmitting}
    } = useForm<OrderFormData>({
        resolver: yupResolver(orderSchema),
        mode: 'onChange',
        defaultValues: {
            paymentMethod: undefined,
            agreements: {
                purchase: false,
                personalUse: false,
                googleGiftCard: false
            }
        }
    });

    // 현재 선택된 값들을 watch로 관찰
    const watchedPaymentMethod = watch('paymentMethod');
    const watchedAgreements = watch('agreements');

    const [cartError, setCartError] = React.useState<string | null>(null);

    // 장바구니 상태 변경시 검증
    useEffect(() => {
        const error = validateCart(stats);
        setCartError(error);
    }, [stats]);

    // 주문 성공시 처리
    useEffect(() => {
        if (orderSuccess) {
            // 장바구니 비우기
            clear();
            // 필요시 주문 완료 페이지로 리다이렉트
            router.push('/my/order');
        }
    }, [orderSuccess, clear, router]);

    // 전체 form이 유효한지 확인 (form validation + 장바구니 validation)
    const isFormValid = isValid && !cartError && !stats.isEmpty;

    // 주문 제출 핸들러
    const onSubmit = async (data: OrderFormData) => {
        // 제출 전 마지막 장바구니 검증
        const cartValidationError = validateCart(stats);
        if (cartValidationError) {
            setCartError(cartValidationError);
            return;
        }

        // 주문 요청 데이터 구성
        const orderRequest = {
            paymentMethod: data.paymentMethod,
            products: products.map(product => ({
                id: product.id,
                title: product.title,
                subtitle: product.subtitle,
                quantity: product.quantity,
                price: product.price
            })),
            totalAmount: stats.totalPrice,
            productCount: stats.productCount
        };

        // 디버깅용 로그 - 요청 데이터 확인
        console.log('🚀 주문 요청 데이터:', orderRequest);
        console.log('📝 JSON 직렬화 테스트:', JSON.stringify(orderRequest, null, 2));
        console.log('💳 동의 정보:', data.agreements);

        // 실제 주문 API 호출
        const result = await createOrder(orderRequest);

        if (result.success) {
            console.log('✅ 주문 완료:', result.data);
        } else {
            console.error('❌ 주문 처리 실패:', result.error);
            alert(result.error || '주문 처리 중 오류가 발생했습니다.');
        }
    };

    const CartProductList = () => {
        if (stats.isEmpty) {
            return (
                <div className="flex flex-col items-center justify-center text-gray-500 py-16">
                    <ShoppingCart className="w-24 h-24 mb-6 text-gray-300"/>
                    {/* 장바구니가 비어있을 때의 에러 메시지 */}
                    {cartError && (
                        <p className="text-lg text-red-600 text-center mb-2">
                            {cartError}
                        </p>
                    )}
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
                        className="text-gray-500 hover:text-red-600 cursor-pointer"
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
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-none hover:shadow-md"
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
                                    className="text-gray-500 hover:text-red-600 cursor-pointer"
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
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 hover:text-red-800 transition-colors cursor-pointer"
                                            aria-label="수량 감소"
                                        >
                                            <Minus className="h-4 w-4"/>
                                        </button>

                                        <input
                                            type="text"
                                            value={getDisplayQuantity(product.id, product.quantity)}
                                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
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
                                            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 hover:text-blue-800 transition-colors cursor-pointer"
                                            aria-label="수량 증가"
                                            disabled={product.quantity >= 9999}
                                        >
                                            <Plus className="h-4 w-4"/>
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

    // 결제 수단 선택 컴포넌트 - useCallback으로 메모이제이션
    const PaymentMethodSelector = useCallback(() => {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                    {PAYMENT_METHOD_OPTIONS.map((method, index) => (
                        <label
                            key={method.value}
                            className={`flex items-center gap-3 pb-4 cursor-pointer transition-colors rounded-md ${
                                index !== PAYMENT_METHOD_OPTIONS.length - 1 ? 'border-b border-gray-100' : ''
                            }`}
                        >
                            <input
                                type="radio"
                                value={method.value}
                                checked={watchedPaymentMethod === method.value}
                                onChange={(e) => {
                                    setValue('paymentMethod', e.target.value as OrderPaymentMethod, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }}
                                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                            />
                            <span className="text-gray-900 font-medium">{method.label}</span>
                        </label>
                    ))}
                </div>
                {errors.paymentMethod && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.paymentMethod.message}
                    </p>
                )}
            </div>
        );
    }, [watchedPaymentMethod, setValue, errors.paymentMethod]);

    // 구매동의 컴포넌트 - useCallback으로 메모이제이션
    const PurchaseAgreement = useCallback(() => {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="space-y-6">
                    {/* 구매 동의 */}
                    <div className="pb-4 border-b border-gray-100">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={watchedAgreements.purchase}
                                onChange={(e) => {
                                    setValue('agreements.purchase', e.target.checked, {
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                                className="w-4 h-4 mt-1 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <div>
                                <span className="text-sm font-bold text-gray-900">
                                    구매를 동의합니다. (전자상거래법 제8조 제2항)
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                    주문하실 상품, 가격, 배송정보, 할인정보 등을 확인하였으며, 구매에 동의합니다.
                                </p>
                            </div>
                        </label>
                        {errors.agreements?.purchase && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.agreements.purchase.message}
                            </p>
                        )}
                    </div>

                    {/* 본인 사용 목적 */}
                    <div className="pb-4 border-b border-gray-100">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={watchedAgreements.personalUse}
                                onChange={(e) => {
                                    setValue('agreements.personalUse', e.target.checked, {
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                                className="w-4 h-4 mt-1 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <div>
                                <span className="text-sm font-bold text-gray-900">
                                    본인 사용 목적으로 상품권을 구매합니다.
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                    대리구매 알바 또는 상품권 할인(페이백)을 미라로 다른 사람이 상품권 구매를 요구했다면 100% 사기입니다.
                                </p>
                            </div>
                        </label>
                        {errors.agreements?.personalUse && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.agreements.personalUse.message}
                            </p>
                        )}
                    </div>

                    {/* 구글기프트카드 환불불가 */}
                    <div>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={watchedAgreements.googleGiftCard}
                                onChange={(e) => {
                                    setValue('agreements.googleGiftCard', e.target.checked, {
                                        shouldValidate: true,
                                        shouldDirty: true
                                    });
                                }}
                                className="w-4 h-4 mt-1 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <div>
                                <span className="text-sm font-bold text-red-500">
                                    구글기프트카드는 절대 교환 및 환불불가 사실을 알고 구매합니다.
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                    구글에서 사용 오류로 이의제기 거절이 되어도 핀코인에 책임을 묻지 않습니다.
                                </p>
                            </div>
                        </label>
                        {errors.agreements?.googleGiftCard && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.agreements.googleGiftCard.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }, [watchedAgreements, setValue, errors.agreements]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
            <Section title="장바구니">
                <CartProductList/>
            </Section>

            <Section title="입금 / 결제수단">
                <PaymentMethodSelector/>
            </Section>

            <Section title="구매동의">
                <PurchaseAgreement/>
            </Section>

            {/* 주문 완료 버튼 */}
            <div className="w-full">
                <Button
                    type="submit"
                    className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white text-lg font-semibold disabled:bg-gray-400 cursor-pointer"
                    disabled={!isFormValid || isSubmitting || orderLoading}
                >
                    {orderLoading || isSubmitting ? '주문 처리 중...' : '주문 완료'}
                </Button>

                {/* 에러 메시지 표시 */}
                {cartError && (
                    <p className="mt-2 text-sm text-red-600 text-center">
                        {cartError}
                    </p>
                )}
                {orderError && (
                    <p className="mt-2 text-sm text-red-600 text-center">
                        {orderError}
                    </p>
                )}
            </div>

            <Section title="주문 시 주의사항">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="space-y-6">
                        {/* 휴대폰본인인증 필수 */}
                        <div className="pb-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-3">휴대폰본인인증 필수</h2>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-600">
                                    단, 해외에서 페이팔 결제하시는 경우 서류본인인증을 대신 완료합니다.
                                </li>
                            </ul>
                        </div>

                        {/* 서류본인인증이 필요한 경우 */}
                        <div>
                            <h2 className="font-bold text-gray-900 mb-3">서류본인인증이 필요한 경우</h2>
                            <ul className="space-y-3">
                                <li className="text-sm text-gray-600">
                                    컬처랜드상품권, 도서문화상품권, 구글기프트카드를 포함하고 일일 액면가 기준 누계 10만원 이상 첫 구매하는 경우
                                </li>
                                <li className="text-sm text-gray-600">
                                    계좌이체로 일일 액면가 기준 누계 30만원 이상 첫 구매하는 경우
                                </li>
                                <li className="text-sm text-gray-600">
                                    페이팔로 최근30일 이내 액면가 기준 누계 15만원 이상 구매하는 경우 (한국 신분증 필수)
                                </li>
                                <li className="text-sm text-gray-600">
                                    휴대폰의 명의가 다른 경우 (단, 가족 명의로라도 휴대폰본인인증은 완료해야 합니다.)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Section>
        </form>
    );
}