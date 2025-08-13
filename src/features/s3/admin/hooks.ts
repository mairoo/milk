import {useCallback} from 'react'
import {useSession} from 'next-auth/react'
import {useAppDispatch, useAppSelector} from '@/global/hooks/storeHooks'
import {fullHealthCheckThunk, quickHealthCheckThunk} from '@/features/s3/admin/thunk'
import {clearError, resetHealthCheck} from '@/features/s3/admin/slice'
import {HealthCheckType} from "@/features/s3/shared/constants";

/**
 * S3 헬스체크 비즈니스 로직 hook
 */
export const useS3HealthCheck = () => {
    const dispatch = useAppDispatch()
    const {data: session} = useSession()
    const {loading, data, error, lastChecked} = useAppSelector(
        (state) => state.s3.healthCheckAdmin
    )

    /**
     * 헬스체크 실행
     */
    const performHealthCheck = useCallback(
        async (type: HealthCheckType = 'quick') => {
            const token = session?.accessToken as string | undefined

            if (type === 'quick') {
                return dispatch(quickHealthCheckThunk(token))
            } else {
                return dispatch(fullHealthCheckThunk(token))
            }
        },
        [dispatch, session?.accessToken]
    )

    /**
     * 빠른 헬스체크 실행
     */
    const quickCheck = useCallback(() => {
        return performHealthCheck('quick')
    }, [performHealthCheck])

    /**
     * 전체 헬스체크 실행
     */
    const fullCheck = useCallback(() => {
        return performHealthCheck('full')
    }, [performHealthCheck])

    /**
     * 헬스체크 상태 초기화
     */
    const reset = useCallback(() => {
        dispatch(resetHealthCheck())
    }, [dispatch])

    /**
     * 에러 상태 클리어
     */
    const clearErrorState = useCallback(() => {
        dispatch(clearError())
    }, [dispatch])

    /**
     * 헬스체크 상태 계산
     */
    const isHealthy = data?.healthy ?? false
    const hasError = !!error
    const isConnected = data?.status === 'UP'

    /**
     * 마지막 체크 시간 포맷팅
     */
    const getLastCheckedFormatted = useCallback(() => {
        if (!lastChecked) return null
        return new Date(lastChecked).toLocaleString('ko-KR')
    }, [lastChecked])

    return {
        // 상태
        loading,
        data,
        error,
        lastChecked,
        isHealthy,
        hasError,
        isConnected,

        // 액션
        quickCheck,
        fullCheck,
        reset,
        clearErrorState,

        // 유틸리티
        getLastCheckedFormatted,
    }
}