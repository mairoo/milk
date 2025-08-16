import {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {
    inventoryPublicApi,
    useLazyGetCategoryBySlugQuery,
    useLazyGetProductQuery,
    useLazyGetProductsByCategoryQuery
} from './api'
import type {ProductSearchRequest} from './request'
import {getErrorMessage} from "@/global/lib/rtkQueryUtils";

export const useCategory = () => {
    const dispatch = useDispatch()
    const [getCategoryTrigger, result] = useLazyGetCategoryBySlugQuery()

    const getCategoryBySlug = useCallback((slug: string) => {
        return getCategoryTrigger(slug)
    }, [getCategoryTrigger])

    const reset = useCallback(() => {
        dispatch(inventoryPublicApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getCategoryBySlug,
        reset,

        // 추가 상태 (필요시)
        isFetching: result.isFetching,
    }
}

export const useProducts = () => {
    const dispatch = useDispatch()
    const [getProductsTrigger, result] = useLazyGetProductsByCategoryQuery()

    const getProductsByCategory = useCallback((categoryId: number, params?: ProductSearchRequest) => {
        return getProductsTrigger({categoryId, params})
    }, [getProductsTrigger])

    const reset = useCallback(() => {
        dispatch(inventoryPublicApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getProductsByCategory,
        reset,

        // 추가 상태 (필요시)
        isFetching: result.isFetching,
    }
}

export const useProduct = () => {
    const dispatch = useDispatch()
    const [getProductTrigger, result] = useLazyGetProductQuery()

    const getProduct = useCallback((productId: number) => {
        return getProductTrigger(productId)
    }, [getProductTrigger])

    const reset = useCallback(() => {
        dispatch(inventoryPublicApi.util.resetApiState())
    }, [dispatch])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,

        // 핵심 액션
        getProduct,
        reset,

        // 추가 상태 (필요시)
        isFetching: result.isFetching,
    }
}
