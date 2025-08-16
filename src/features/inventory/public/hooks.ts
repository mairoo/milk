import {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {SerializedError} from '@reduxjs/toolkit'
import {FetchBaseQueryError} from '@reduxjs/toolkit/query'
import {inventoryPublicApi, useLazyGetCategoryBySlugQuery} from './api'

// RTK Query 에러 타입 유틸리티
const isFetchBaseQueryError = (
    error: FetchBaseQueryError | SerializedError | undefined
): error is FetchBaseQueryError => {
    return typeof error === 'object' && error != null && 'status' in error
}

const isSerializedError = (
    error: FetchBaseQueryError | SerializedError | undefined
): error is SerializedError => {
    return typeof error === 'object' && error != null && 'message' in error && !('status' in error)
}

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
        dispatch(inventoryPublicApi.util.invalidateTags(['Category']))
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

    /**
     * 에러 메시지 포맷팅 (RTK Query 타입 안전)
     */
    const getErrorMessage = useCallback(() => {
        if (!error) return null

        // FetchBaseQueryError (HTTP 에러)
        if (isFetchBaseQueryError(error)) {
            // 서버에서 반환한 에러 메시지
            if (error.data && typeof error.data === 'object' && 'message' in error.data) {
                return (error.data as { message: string }).message
            }

            // HTTP 상태 코드
            return `HTTP ${error.status}: 서버 오류`
        }

        // SerializedError (네트워크 에러 등)
        if (isSerializedError(error)) {
            return error.message || '네트워크 오류가 발생했습니다'
        }

        // 기본 메시지
        return '알 수 없는 오류가 발생했습니다'
    }, [error])

    return {
        // 상태
        loading,
        data,
        error: getErrorMessage(),
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