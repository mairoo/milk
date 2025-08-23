import {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {orderAdminApi, useLazyGetOrderListQuery, useLazyGetOrderQuery} from './api'
import type {AdminOrderSearchRequest} from './request'
import {getErrorMessage} from "@/global/lib/rtkQueryUtils"

/**
 * 단일 주문 조회 훅
 */
export const useAdminOrder = () => {
    const dispatch = useDispatch()
    const [getOrderTrigger, result] = useLazyGetOrderQuery()

    const getOrder = useCallback((orderId: number, params?: AdminOrderSearchRequest) => {
        return getOrderTrigger({orderId, params})
    }, [getOrderTrigger])

    const reset = useCallback(() => {
        dispatch(orderAdminApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getOrder,
        reset,

        // 추가 상태 (필요시)
        isFetching: result.isFetching,
    }
}

/**
 * 주문 목록 조회 훅
 */
export const useAdminOrderList = () => {
    const dispatch = useDispatch()
    const [getOrderListTrigger, result] = useLazyGetOrderListQuery()

    const getOrderList = useCallback((params?: AdminOrderSearchRequest & {
        page?: number;
        size?: number;
    }) => {
        return getOrderListTrigger(params || {})
    }, [getOrderListTrigger])

    const reset = useCallback(() => {
        dispatch(orderAdminApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getOrderList,
        reset,

        // 추가 상태 (필요시)
        isFetching: result.isFetching,

        // 페이징 관련 편의 속성
        orders: result.data?.content ?? [],
        totalElements: result.data?.totalElements ?? 0,
        totalPages: result.data?.totalPages ?? 0,
        currentPage: result.data?.page ?? 0,
        isFirstPage: result.data?.first ?? true,
        isLastPage: result.data?.last ?? false,
    }
}