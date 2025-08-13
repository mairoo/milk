import {useCallback} from 'react'
import {useSession} from 'next-auth/react'
import {useDispatch} from 'react-redux'
import {SerializedError} from '@reduxjs/toolkit'
import {FetchBaseQueryError} from '@reduxjs/toolkit/query'
import {s3AdminApi, useLazyFullHealthCheckQuery, useLazyQuickHealthCheckQuery,} from '@/features/s3/admin/api'

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
 * S3 헬스체크 비즈니스 로직 hook (RTK Query 전용)
 */
export const useS3HealthCheck = () => {
    const {data: session} = useSession()
    const dispatch = useDispatch()
    const token = session?.accessToken as string | undefined

    // Lazy 훅 사용 (수동 실행)
    const [quickCheckTrigger, quickCheckResult] = useLazyQuickHealthCheckQuery()
    const [fullCheckTrigger, fullCheckResult] = useLazyFullHealthCheckQuery()

    /**
     * 빠른 헬스체크 실행
     */
    const quickCheck = useCallback(() => {
        return quickCheckTrigger(token)
    }, [quickCheckTrigger, token])

    /**
     * 전체 헬스체크 실행
     */
    const fullCheck = useCallback(() => {
        return fullCheckTrigger(token)
    }, [fullCheckTrigger, token])

    /**
     * 헬스체크 캐시 초기화
     */
    const reset = useCallback(() => {
        dispatch(s3AdminApi.util.invalidateTags(['HealthCheck']))
    }, [dispatch])

    // 가장 최근 데이터 선택
    const getLatestResult = () => {
        const quickTime = quickCheckResult.fulfilledTimeStamp || 0
        const fullTime = fullCheckResult.fulfilledTimeStamp || 0

        if (quickTime === 0 && fullTime === 0) return quickCheckResult

        return quickTime > fullTime ? quickCheckResult : fullCheckResult
    }

    const latestResult = getLatestResult()

    /**
     * 통합 상태 계산
     */
    const loading = quickCheckResult.isLoading || fullCheckResult.isLoading
    const data = latestResult.data
    const error = latestResult.error
    const isHealthy = data?.healthy ?? false
    const hasError = !!error
    const isConnected = data?.status === 'UP'

    /**
     * 마지막 체크 시간
     */
    const lastChecked = latestResult.fulfilledTimeStamp
        ? new Date(latestResult.fulfilledTimeStamp).toISOString()
        : null

    /**
     * 마지막 체크 시간 포맷팅
     */
    const getLastCheckedFormatted = useCallback(() => {
        if (!lastChecked) return null
        return new Date(lastChecked).toLocaleString('ko-KR')
    }, [lastChecked])

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
        lastChecked,
        isHealthy,
        hasError,
        isConnected,

        // 액션
        quickCheck,      // 빠른 체크 실행
        fullCheck,       // 전체 체크 실행
        reset,           // 캐시 초기화

        // 유틸리티
        getLastCheckedFormatted,

        // RTK Query 상태
        isFetching: quickCheckResult.isFetching || fullCheckResult.isFetching,
        isSuccess: !!data,
        isError: !!error,

        // 개별 결과 (고급 사용)
        quickCheckResult,
        fullCheckResult,
    }
}