import {createAsyncThunk} from '@reduxjs/toolkit'
import {s3AdminApi} from './api'
import {HealthCheckResponse} from "@/features/s3/admin/response";

/**
 * S3 빠른 헬스체크 비동기 액션
 */
export const quickHealthCheckThunk = createAsyncThunk<
    HealthCheckResponse,
    string | undefined, // 토큰 파라미터
    { rejectValue: string }
>(
    'healthCheck/admin/quick',
    async (token, {rejectWithValue, dispatch}) => {
        try {
            return await dispatch(s3AdminApi.endpoints.quickHealthCheck.initiate(token)).unwrap()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * S3 전체 헬스체크 비동기 액션
 */
export const fullHealthCheckThunk = createAsyncThunk<
    HealthCheckResponse,
    string | undefined, // 토큰 파라미터
    { rejectValue: string }
>(
    'healthCheck/admin/full',
    async (token, {rejectWithValue, dispatch}) => {
        try {
            return await dispatch(s3AdminApi.endpoints.fullHealthCheck.initiate(token)).unwrap()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
            return rejectWithValue(errorMessage)
        }
    }
)