'use client'

import React, {useCallback, useEffect} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {formatPrice} from '@/features/order/cart/utils'
import Section from "@/components/widgets/cards/Section"
import {Button} from "@/components/ui/button"
import {ArrowLeft, Edit, Eye, RefreshCw, Trash2} from "lucide-react"
import {useAdminOrder} from "@/features/order/admin/hooks"
import {
    getPaymentMethodLabel,
    getPaymentMethodStyle,
    getStatusLabel,
    getStatusStyle,
} from "@/components/utils/orderDisplay"

export default function AdminOrderDetailPage() {
    const router = useRouter()
    const params = useParams()
    const orderId = params.id

    const {
        loading,
        error,
        hasError,
        data: order,
        getAdminOrder,
    } = useAdminOrder()

    // 주문 정보 로드
    const loadOrder = useCallback(() => {
        if (orderId) {
            // Convert string to number and handle potential conversion errors
            const orderIdNum = Array.isArray(orderId) ? parseInt(orderId[0], 10) : parseInt(orderId, 10)

            if (!isNaN(orderIdNum)) {
                getAdminOrder(orderIdNum)
            } else {
                console.error('Invalid orderId:', orderId)
            }
        }
    }, [orderId, getAdminOrder])

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

    // 주문 수정 (임시)
    const handleEdit = () => {
        // TODO: 주문 수정 페이지로 이동
        console.log('주문 수정:', orderId)
    }

    // 주문 삭제 (임시)
    const handleDelete = () => {
        // TODO: 주문 삭제 확인 모달 및 처리
        console.log('주문 삭제:', orderId)
    }

    // 고객 정보 보기 (임시)
    const handleViewCustomer = () => {
        if (order?.userId) {
            // TODO: 고객 상세 페이지로 이동
            console.log('고객 정보 보기:', order.userId)
        }
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

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
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
                    <Button
                        onClick={handleEdit}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <Edit className="w-4 h-4 mr-2"/>
                        수정
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="outline"
                        className="cursor-pointer text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4 mr-2"/>
                        삭제
                    </Button>
                </div>
            </div>

            {/* 주문 기본 정보 */}
            <Section title="주문 정보">
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 왼쪽 열 */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">주문번호</label>
                                <p className="mt-1 text-lg font-medium text-gray-900" title={order.orderNo}>
                                    {order.orderNo}
                                </p>
                            </div>

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
                                <p className={`mt-1 text-base font-medium ${getPaymentMethodStyle(order.paymentMethod)}`}>
                                    {getPaymentMethodLabel(order.paymentMethod)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">거래 ID</label>
                                <p className="mt-1 text-base text-gray-900">
                                    {order.transactionId || '없음'}
                                </p>
                            </div>
                        </div>

                        {/* 오른쪽 열 */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">정가 합계</label>
                                <p className="mt-1 text-lg text-gray-600">
                                    {formatPrice(order.totalListPrice)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">실제 결제 금액</label>
                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {formatPrice(order.totalSellingPrice)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">통화</label>
                                <p className="mt-1 text-base text-gray-900">
                                    {order.currency}
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
                                        minute: '2-digit',
                                        second: '2-digit'
                                    }) : '없음'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 메시지 */}
                    {order.message && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <label className="text-sm font-medium text-gray-500">주문 메시지</label>
                            <p className="mt-1 text-base text-gray-900 bg-gray-50 p-3 rounded-md">
                                {order.message}
                            </p>
                        </div>
                    )}
                </div>
            </Section>

            {/* 고객 정보 */}
            <Section title="고객 정보">
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">고객명</label>
                                <p className="mt-1 text-lg font-medium text-gray-900">
                                    {order.fullname}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">고객 ID</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <p className="text-base text-gray-900">
                                        {order.userId || '게스트'}
                                    </p>
                                    {order.userId && (
                                        <Button
                                            onClick={handleViewCustomer}
                                            variant="outline"
                                            size="sm"
                                            className="cursor-pointer"
                                        >
                                            <Eye className="w-3 h-3 mr-1"/>
                                            보기
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">IP 주소</label>
                                <p className="mt-1 text-base text-gray-900">
                                    {order.ipAddress}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">User Agent</label>
                                <p className="mt-1 text-sm text-gray-600 break-all">
                                    {order.userAgent || '없음'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 시스템 정보 */}
            <Section title="시스템 정보">
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500">생성일시</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {order.created ? new Date(order.created).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }) : '없음'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">수정일시</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {order.modified ? new Date(order.modified).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }) : '없음'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${order.isRemoved ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {order.isRemoved ? '삭제됨' : '활성'}
                                </span>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${order.suspicious ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {order.suspicious ? '의심스러운 주문' : '정상 주문'}
                                </span>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">표시 설정</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {order.visible}
                                </p>
                            </div>
                        </div>
                    </div>

                    {order.parentId && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <label className="text-sm font-medium text-gray-500">상위 주문 ID</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {order.parentId}
                            </p>
                        </div>
                    )}

                    {order.acceptLanguage && (
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-500">언어 설정</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {order.acceptLanguage}
                            </p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    )
}