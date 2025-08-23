import {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {myOrderApi, useLazyGetMyOrderListQuery, useLazyGetMyOrderQuery} from './api'
import type {MyOrderSearchRequest} from './request'
import {getErrorMessage} from "@/global/lib/rtkQueryUtils"

/**
 * 단일 주문 조회 훅
 */
export const useMyOrder = () => {
    const dispatch = useDispatch()
    const [getMyOrderTrigger, result] = useLazyGetMyOrderQuery()

    const getMyOrder = useCallback((orderId: number, params?: MyOrderSearchRequest) => {
        return getMyOrderTrigger({orderId, params})
    }, [getMyOrderTrigger])

    const reset = useCallback(() => {
        dispatch(myOrderApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getMyOrder,
        reset,

        // 추가 상태 (필요시)
        isFetching: result.isFetching,
    }
}

/**
 * 내 주문 목록 조회 훅
 */
export const useMyOrderList = () => {
    const dispatch = useDispatch()
    const [getMyOrderListTrigger, result] = useLazyGetMyOrderListQuery()

    const getMyOrderList = useCallback((params?: MyOrderSearchRequest & {
        page?: number;
        size?: number;
        sort?: string[];
    }) => {
        return getMyOrderListTrigger(params || {})
    }, [getMyOrderListTrigger])

    const reset = useCallback(() => {
        dispatch(myOrderApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getMyOrderList,
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