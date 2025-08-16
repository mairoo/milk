import {SerializedError} from '@reduxjs/toolkit'
import {FetchBaseQueryError} from '@reduxjs/toolkit/query'

/**
 * RTK Query 에러 타입 유틸리티
 *
 * RTK Query에서 반환되는 에러 타입을 안전하게 체크하는 유틸리티 함수들
 */

/**
 * FetchBaseQueryError 타입 가드
 * HTTP 응답 에러 (4xx, 5xx 등)를 체크합니다
 */
export const isFetchBaseQueryError = (
    error: FetchBaseQueryError | SerializedError | undefined
): error is FetchBaseQueryError => {
    return typeof error === 'object' && error != null && 'status' in error
}

/**
 * SerializedError 타입 가드
 * 네트워크 에러나 기타 시리얼라이즈된 에러를 체크합니다
 */
export const isSerializedError = (
    error: FetchBaseQueryError | SerializedError | undefined
): error is SerializedError => {
    return typeof error === 'object' && error != null && 'message' in error && !('status' in error)
}

/**
 * RTK Query 에러에서 사용자 친화적인 메시지 추출
 */
export const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
): string | null => {
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
}
