import {useCallback} from 'react'
import {useSession} from 'next-auth/react'
import {useDispatch} from 'react-redux'
import {s3AdminApi, useLazyFullHealthCheckQuery, useLazyQuickHealthCheckQuery,} from '@/features/s3/admin/api'
import {getErrorMessage} from "@/global/lib/rtkQueryUtils";

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

    return {
        // 상태
        loading,
        data,
        error: getErrorMessage(error),
        isHealthy,
        hasError,
        isConnected,

        // 액션
        quickCheck,      // 빠른 체크 실행
        fullCheck,       // 전체 체크 실행
        reset,           // 캐시 초기화

        // RTK Query 상태
        isFetching: quickCheckResult.isFetching || fullCheckResult.isFetching,
        isSuccess: !!data,
        isError: !!error,
    }
}