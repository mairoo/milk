'use client'

import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {formatPrice} from '@/features/order/cart/utils'
import Section from "@/components/widgets/cards/Section"
import {Button} from "@/components/ui/button"
import {ChevronLeft, ChevronRight, RefreshCw, Search} from "lucide-react"
import {useMyOrderList} from "@/features/order/my/hooks";
import {MyOrderResponse} from "@/features/s3/user/response";
import {
    getPaymentMethodLabel,
    getPaymentMethodStyle,
    getStatusLabel,
    getStatusStyle,
} from "@/components/utils/orderDisplay"

// 페이지네이션 설정
const PAGE_SIZE = 10

// 주문번호를 UUID 첫 8자로 축약하는 함수
const formatOrderNo = (orderNo: string) => {
    if (!orderNo) return ''
    return orderNo.length > 8 ? `${orderNo.substring(0, 8)}...` : orderNo
}

export default function MyOrderListPage() {
    const [currentPage, setCurrentPage] = useState(0)
    const [searchOrderNo, setSearchOrderNo] = useState('')
    const [appliedSearchOrderNo, setAppliedSearchOrderNo] = useState('')

    const {
        loading,
        error,
        hasError,
        getMyOrderList,
        orders,
        totalElements,
        totalPages,
        isFirstPage,
        isLastPage,
    } = useMyOrderList()

    // 주문 목록 로드 함수를 useCallback으로 메모이제이션
    const loadOrders = useCallback((page: number, orderNo?: string) => {
        const params = {
            page,
            size: PAGE_SIZE,
            ...(orderNo && {orderNumber: orderNo})
        }

        getMyOrderList(params)
        setCurrentPage(page)
    }, [getMyOrderList])

    // 초기 데이터 로드
    useEffect(() => {
        loadOrders(0)
    }, [loadOrders])

    // 검색 핸들러
    const handleSearch = () => {
        setAppliedSearchOrderNo(searchOrderNo)
        loadOrders(0, searchOrderNo)
    }

    // 검색 초기화
    const handleResetSearch = () => {
        setSearchOrderNo('')
        setAppliedSearchOrderNo('')
        loadOrders(0)
    }

    // 페이지 변경
    const handlePageChange = (page: number) => {
        loadOrders(page, appliedSearchOrderNo)
    }

    // 새로고침
    const handleRefresh = () => {
        loadOrders(currentPage, appliedSearchOrderNo)
    }

    // 페이지네이션 버튼 생성
    const paginationButtons = useMemo(() => {
        if (totalPages <= 1) return []

        const buttons = []
        const startPage = Math.max(0, currentPage - 2)
        const endPage = Math.min(totalPages - 1, currentPage + 2)

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(i)
        }

        return buttons
    }, [currentPage, totalPages])

    // 검색 영역 컴포넌트
    const SearchSection = () => (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label htmlFor="orderNoSearch" className="block text-sm font-medium text-gray-700 mb-2">
                        주문번호 검색
                    </label>
                    <input
                        id="orderNoSearch"
                        type="text"
                        value={searchOrderNo}
                        onChange={(e) => setSearchOrderNo(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch()
                            }
                        }}
                        placeholder="주문번호를 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleSearch}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2"
                    >
                        <Search className="w-4 h-4 mr-2"/>
                        검색
                    </Button>
                    <Button
                        onClick={handleResetSearch}
                        variant="outline"
                        className="px-4 py-2"
                    >
                        초기화
                    </Button>
                </div>
            </div>
        </div>
    )

    // 주문 목록 테이블 컴포넌트
    const OrderTable = () => {
        if (loading && orders.length === 0) {
            return (
                <div className="flex justify-center items-center py-16">
                    <div className="text-gray-500">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4"/>
                        <p>주문 내역을 불러오는 중...</p>
                    </div>
                </div>
            )
        }

        if (hasError) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-red-600">
                    <p className="text-lg mb-4">주문 내역을 불러오는데 실패했습니다.</p>
                    {error && <p className="text-sm text-gray-500 mb-4">{error}</p>}
                    <Button onClick={handleRefresh} variant="outline">
                        다시 시도
                    </Button>
                </div>
            )
        }

        if (orders.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <p className="text-lg mb-4">주문 내역이 없습니다.</p>
                    {appliedSearchOrderNo && (
                        <p className="text-sm text-gray-400 mb-4">
                            {appliedSearchOrderNo}에 대한 검색 결과가 없습니다.
                        </p>
                    )}
                </div>
            )
        }

        return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* 데스크톱 테이블 */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    주문번호
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    주문일시
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    결제수단
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    상태
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    결제금액
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order: MyOrderResponse) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900" title={order.orderNo}>
                                            {formatOrderNo(order.orderNo)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {order.created && (
                                            <div className="text-sm text-gray-900">
                                                {new Date(order.created).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div
                                            className={`text-sm font-medium ${getPaymentMethodStyle(order.paymentMethod)}`}>
                                            {getPaymentMethodLabel(order.paymentMethod)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(order.totalSellingPrice)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 모바일 카드 */}
                <div className="md:hidden">
                    <div className="divide-y divide-gray-200">
                        {orders.map((order: MyOrderResponse) => (
                            <div key={order.id} className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 mb-1" title={order.orderNo}>
                                            {formatOrderNo(order.orderNo)}
                                        </div>
                                        {order.created && (
                                            <div className="text-xs text-gray-500">
                                                {new Date(order.created).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div
                                        className={`text-sm font-medium ${getPaymentMethodStyle(order.paymentMethod)}`}>
                                        {getPaymentMethodLabel(order.paymentMethod)}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(order.totalSellingPrice)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // 페이지네이션 컴포넌트
    const Pagination = () => {
        if (totalPages <= 1) return null

        return (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between sm:hidden w-full">
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={isFirstPage}
                        variant="outline"
                        size="sm"
                    >
                        이전
                    </Button>
                    <span className="text-sm text-gray-700">
            {currentPage + 1} / {totalPages}
          </span>
                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={isLastPage}
                        variant="outline"
                        size="sm"
                    >
                        다음
                    </Button>
                </div>

                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            전체 <span className="font-medium">{totalElements}</span>개 중{' '}
                            <span className="font-medium">{currentPage * PAGE_SIZE + 1}</span>-
                            <span className="font-medium">
                {Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}
              </span>개 표시
                        </p>
                    </div>
                    <div>
                        <nav className="flex items-center space-x-2">
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={isFirstPage}
                                variant="outline"
                                size="sm"
                            >
                                <ChevronLeft className="h-4 w-4"/>
                                이전
                            </Button>

                            {paginationButtons.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    variant={page === currentPage ? "default" : "outline"}
                                    size="sm"
                                    className={page === currentPage ? "bg-sky-600 hover:bg-sky-700" : ""}
                                >
                                    {page + 1}
                                </Button>
                            ))}

                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={isLastPage}
                                variant="outline"
                                size="sm"
                            >
                                다음
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">주문/발송 내역</h1>
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}/>
                    새로고침
                </Button>
            </div>

            {/* 검색 섹션 */}
            <Section title="검색">
                <SearchSection/>
            </Section>

            {/* 주문 목록 섹션 */}
            <Section title="주문 목록">
                <OrderTable/>
            </Section>

            {/* 페이지네이션 */}
            <Pagination/>
        </div>
    )
}