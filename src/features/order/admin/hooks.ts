import {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {adminOrderApi, useLazyGetAdminOrderListQuery, useLazyGetAdminOrderQuery} from './api'
import type {AdminOrderSearchRequest} from './request'
import {getErrorMessage} from "@/global/lib/rtkQueryUtils"

/**
 * 단일 주문 조회 훅
 */
export const useAdminOrder = () => {
    const dispatch = useDispatch()
    const [getOrderTrigger, result] = useLazyGetAdminOrderQuery()

    const getAdminOrder = useCallback((orderId: number, params?: AdminOrderSearchRequest) => {
        return getOrderTrigger({orderId, params})
    }, [getOrderTrigger])

    const reset = useCallback(() => {
        dispatch(adminOrderApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getAdminOrder,
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
    const [getAdminOrderListTrigger, result] = useLazyGetAdminOrderListQuery()

    const getAdminOrderList = useCallback((params?: AdminOrderSearchRequest & {
        page?: number;
        size?: number;
    }) => {
        return getAdminOrderListTrigger(params || {})
    }, [getAdminOrderListTrigger])

    const reset = useCallback(() => {
        dispatch(adminOrderApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getAdminOrderList,
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