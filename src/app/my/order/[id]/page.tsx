'use client'

import React, {useCallback, useEffect} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {formatPrice} from '@/features/order/cart/utils'
import Section from "@/components/widgets/cards/Section"
import {Button} from "@/components/ui/button"
import {ArrowLeft, CreditCard, MessageSquare, Package, RefreshCw} from "lucide-react"
import {useMyOrder} from "@/features/order/my/hooks"
import {
    getPaymentMethodLabel,
    getPaymentMethodStyle,
    getStatusLabel,
    getStatusStyle,
} from "@/components/utils/orderDisplay"

export default function MyOrderDetailPage() {
    const router = useRouter()
    const params = useParams()
    const orderId = params.id

    const {
        loading,
        error,
        hasError,
        data: order,
        getMyOrder,
    } = useMyOrder()

    // 주문 정보 로드
    const loadOrder = useCallback(() => {
        if (orderId) {
            // Convert string to number and handle potential conversion errors
            const orderIdNum = Array.isArray(orderId) ? parseInt(orderId[0], 10) : parseInt(orderId, 10)

            if (!isNaN(orderIdNum)) {
                getMyOrder(orderIdNum)
            } else {
                console.error('Invalid orderId:', orderId)
            }
        }
    }, [orderId, getMyOrder])

    // 초기 데이터 로드
    useEffect(() => {
        loadOrder()
    }, [loadOrder])

    // 새로고침
    const handleRefresh = () => {
        loadOrder()
    }

    // 뒤로가기
    const handleBack = () => {
        router.back()
    }

    // 주문 취소 (임시)
    const handleCancel = () => {
        // TODO: 주문 취소 확인 모달 및 처리
        console.log('주문 취소:', orderId)
    }

    // 재주문 (임시)
    const handleReorder = () => {
        // TODO: 장바구니에 동일 상품 추가 후 주문 페이지로 이동
        console.log('재주문:', orderId)
    }

    // 고객센터 문의 (임시)
    const handleInquiry = () => {
        // TODO: 고객센터 문의 페이지로 이동
        console.log('고객센터 문의:', orderId)
    }

    // Invalid orderId 처리
    if (orderId && (Array.isArray(orderId) ? isNaN(parseInt(orderId[0], 10)) : isNaN(parseInt(orderId, 10)))) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        뒤로가기
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center py-32 text-red-600">
                    <p className="text-lg mb-4">잘못된 주문 ID입니다.</p>
                    <Button onClick={handleBack} variant="outline">
                        뒤로가기
                    </Button>
                </div>
            </div>
        )
    }

    // 로딩 상태
    if (loading && !order) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        뒤로가기
                    </Button>
                </div>

                <div className="flex justify-center items-center py-32">
                    <div className="text-gray-500">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4"/>
                        <p>주문 정보를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        )
    }

    // 에러 상태
    if (hasError || !order) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        뒤로가기
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center py-32 text-red-600">
                    <p className="text-lg mb-4">주문 정보를 불러오는데 실패했습니다.</p>
                    {error && <p className="text-sm text-gray-500 mb-4">{error}</p>}
                    <Button onClick={handleRefresh} variant="outline">
                        다시 시도
                    </Button>
                </div>
            </div>
        )
    }

    // 주문 상태에 따른 액션 버튼 표시 여부 결정
    const canCancel = order.status === 'PAYMENT_PENDING' || order.status === 'PAYMENT_COMPLETED' || order.status === 'UNDER_REVIEW'
    const canReorder = order.status === 'SHIPPED' || order.status === 'REFUNDED1' || order.status === 'REFUNDED2' || order.status === 'VOIDED'

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        뒤로가기
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">주문 상세</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}/>
                        새로고침
                    </Button>
                </div>
            </div>

            {/* 주문 상태 배너 */}
            <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                        <Package className="w-6 h-6 text-gray-400"/>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">주문번호: {order.orderNo.substring(0, 12)}...</h2>
                            <p className="text-sm text-gray-500">
                                {order.created ? new Date(order.created).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : '주문일 정보 없음'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <span
                            className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </div>
                </div>
            </div>

            {/* 주문 정보 */}
            <Section title="주문 정보">
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 왼쪽 열 */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">주문번호</label>
                                <p className="mt-1 text-base font-medium text-gray-900 break-all" title={order.orderNo}>
                                    {order.orderNo}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">주문자명</label>
                                <p className="mt-1 text-base text-gray-900">
                                    {order.fullname}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">주문일시</label>
                                <p className="mt-1 text-base text-gray-900">
                                    {order.created ? new Date(order.created).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '없음'}
                                </p>
                            </div>
                        </div>

                        {/* 오른쪽 열 */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">주문 상태</label>
                                <div className="mt-1">
                                    <span
                                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">결제 수단</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <CreditCard className="w-4 h-4 text-gray-400"/>
                                    <span
                                        className={`text-base font-medium ${getPaymentMethodStyle(order.paymentMethod)}`}>
                                        {getPaymentMethodLabel(order.paymentMethod)}
                                    </span>
                                </div>
                            </div>

                            {order.transactionId && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">거래 ID</label>
                                    <p className="mt-1 text-sm text-gray-700 font-mono break-all">
                                        {order.transactionId}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Section>

            {/* 결제 정보 */}
            <Section title="결제 정보">
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-base text-gray-600">상품 정가</span>
                            <span className="text-base text-gray-900">{formatPrice(order.totalListPrice)}</span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-base text-gray-600">할인 금액</span>
                            <span className="text-base text-red-600">
                                -{formatPrice(order.totalListPrice - order.totalSellingPrice)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                            <span className="text-lg font-semibold text-gray-900">최종 결제 금액</span>
                            <span
                                className="text-2xl font-bold text-blue-600">{formatPrice(order.totalSellingPrice)}</span>
                        </div>

                        <div className="text-right">
                            <span className="text-sm text-gray-500">통화: {order.currency}</span>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 주문 메시지 */}
            {order.message && (
                <Section title="주문 메시지">
                    <div className="bg-white border border-gray-300 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                            <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5"/>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {order.message}
                            </p>
                        </div>
                    </div>
                </Section>
            )}

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                {canCancel && (
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="cursor-pointer text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                        주문 취소
                    </Button>
                )}

                {canReorder && (
                    <Button
                        onClick={handleReorder}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        재주문하기
                    </Button>
                )}

                <Button
                    onClick={handleInquiry}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <MessageSquare className="w-4 h-4 mr-2"/>
                    고객센터 문의
                </Button>
            </div>

            {/* 주의사항 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">주문 관련 안내</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 주문 취소는 상품 준비 중 단계에서만 가능합니다.</li>
                    <li>• 배송이 시작된 후에는 반품/교환 신청을 이용해 주세요.</li>
                    <li>• 주문과 관련된 문의사항이 있으시면 고객센터로 연락해 주세요.</li>
                    <li>• 결제 정보는 개인정보보호를 위해 일부만 표시됩니다.</li>
                </ul>
            </div>
        </div>
    )
}