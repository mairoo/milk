import {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {orderAdminApi, useLazyGetOrderQuery} from './api'
import type {AdminOrderSearchRequest} from './request'
import {getErrorMessage} from "@/global/lib/rtkQueryUtils"

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