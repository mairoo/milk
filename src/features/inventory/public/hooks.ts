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

/**
 * 카테고리 조회 비즈니스 로직 hook (RTK Query 전용)
 */
export const useCategory = () => {
    const dispatch = useDispatch()

    // Lazy 훅 사용 (수동 실행)
    const [getCategoryTrigger, getCategoryResult] = useLazyGetCategoryBySlugQuery()

    /**
     * slug로 카테고리 조회 실행
     */
    const getCategoryBySlug = useCallback((slug: string) => {
        return getCategoryTrigger(slug)
    }, [getCategoryTrigger])

    /**
     * 카테고리 캐시 초기화
     */
    const reset = useCallback(() => {
        dispatch(inventoryPublicApi.util.resetApiState())
    }, [dispatch])

    /**
     * 통합 상태 계산
     */
    const loading = getCategoryResult.isLoading
    const data = getCategoryResult.data
    const error = getCategoryResult.error
    const hasError = !!error

    /**
     * 마지막 조회 시간
     */
    const lastFetched = getCategoryResult.fulfilledTimeStamp
        ? new Date(getCategoryResult.fulfilledTimeStamp).toISOString()
        : null

    /**
     * 마지막 조회 시간 포맷팅
     */
    const getLastFetchedFormatted = useCallback(() => {
        if (!lastFetched) return null
        return new Date(lastFetched).toLocaleString('ko-KR')
    }, [lastFetched])


    return {
        // 상태
        loading,
        data,
        error: getErrorMessage(error),
        lastFetched,
        hasError,

        // 액션
        getCategoryBySlug,   // slug로 카테고리 조회 실행
        reset,               // 캐시 초기화

        // 유틸리티
        getLastFetchedFormatted,

        // RTK Query 상태
        isFetching: getCategoryResult.isFetching,
        isSuccess: !!data,
        isError: !!error,

        // 개별 결과 (고급 사용)
        getCategoryResult,
    }
}

/**
 * 상품 목록 조회 비즈니스 로직 hook (RTK Query 전용)
 */
export const useProducts = () => {
    const dispatch = useDispatch()

    // Lazy 훅 사용 (수동 실행)
    const [getProductsTrigger, getProductsResult] = useLazyGetProductsByCategoryQuery()

    /**
     * 카테고리별 상품 목록 조회 실행
     */
    const getProductsByCategory = useCallback((categoryId: number, params?: ProductSearchRequest) => {
        return getProductsTrigger({categoryId, params})
    }, [getProductsTrigger])

    /**
     * 상품 캐시 초기화
     */
    const reset = useCallback(() => {
        dispatch(inventoryPublicApi.util.resetApiState())
    }, [dispatch])

    /**
     * 통합 상태 계산
     */
    const loading = getProductsResult.isLoading
    const data = getProductsResult.data
    const error = getProductsResult.error
    const hasError = !!error

    /**
     * 마지막 조회 시간
     */
    const lastFetched = getProductsResult.fulfilledTimeStamp
        ? new Date(getProductsResult.fulfilledTimeStamp).toISOString()
        : null

    /**
     * 마지막 조회 시간 포맷팅
     */
    const getLastFetchedFormatted = useCallback(() => {
        if (!lastFetched) return null
        return new Date(lastFetched).toLocaleString('ko-KR')
    }, [lastFetched])

    return {
        // 상태
        loading,
        data,
        error: getErrorMessage(error),
        lastFetched,
        hasError,

        // 액션
        getProductsByCategory,   // 카테고리별 상품 목록 조회 실행
        reset,                   // 캐시 초기화

        // 유틸리티
        getLastFetchedFormatted,

        // RTK Query 상태
        isFetching: getProductsResult.isFetching,
        isSuccess: !!data,
        isError: !!error,

        // 개별 결과 (고급 사용)
        getProductsResult,
    }
}

export const useProduct = () => {
    const dispatch = useDispatch()

    // Lazy 훅 사용 (수동 실행)
    const [getProductTrigger, getProductResult] = useLazyGetProductQuery()

    /**
     * ID로 상품 조회 실행
     */
    const getProduct = useCallback((productId: number) => {
        return getProductTrigger(productId)
    }, [getProductTrigger])

    /**
     * 상품 캐시 초기화
     */
    const reset = useCallback(() => {
        dispatch(inventoryPublicApi.util.resetApiState())
    }, [dispatch])

    /**
     * 통합 상태 계산
     */
    const loading = getProductResult.isLoading
    const data = getProductResult.data
    const error = getProductResult.error
    const hasError = !!error

    /**
     * 마지막 조회 시간
     */
    const lastFetched = getProductResult.fulfilledTimeStamp
        ? new Date(getProductResult.fulfilledTimeStamp).toISOString()
        : null

    /**
     * 마지막 조회 시간 포맷팅
     */
    const getLastFetchedFormatted = useCallback(() => {
        if (!lastFetched) return null
        return new Date(lastFetched).toLocaleString('ko-KR')
    }, [lastFetched])

    return {
        // 상태
        loading,
        data,
        error: getErrorMessage(error),
        lastFetched,
        hasError,

        // 액션
        getProduct,              // ID로 상품 조회 실행
        reset,                   // 캐시 초기화

        // 유틸리티
        getLastFetchedFormatted,

        // RTK Query 상태
        isFetching: getProductResult.isFetching,
        isSuccess: !!data,
        isError: !!error,

        // 개별 결과 (고급 사용)
        getProductResult,
    }
}
