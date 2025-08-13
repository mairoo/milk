import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {fullHealthCheckThunk, quickHealthCheckThunk} from "@/features/s3/admin/thunk";
import {HealthCheckState} from "@/features/s3/admin/state";
import {HealthCheckResponse} from "@/features/s3/admin/response";

/**
 * S3 헬스체크 초기 상태
 */
const initialState: HealthCheckState = {
    loading: false,
    data: null,
    error: null,
    lastChecked: null,
}

/**
 * S3 헬스체크 Redux 슬라이스
 */
const slice = createSlice({
    name: 'healthCheck/admin',
    initialState,
    reducers: {
        /**
         * 헬스체크 상태 초기화
         */
        resetHealthCheck: (state) => {
            state.data = null
            state.error = null
            state.lastChecked = null
        },

        /**
         * 에러 상태 클리어
         */
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        // 빠른 헬스체크
        builder
            .addCase(quickHealthCheckThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(quickHealthCheckThunk.fulfilled, (state, action: PayloadAction<HealthCheckResponse>) => {
                state.loading = false
                state.data = action.payload
                state.lastChecked = new Date().toISOString()
            })
            .addCase(quickHealthCheckThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || '헬스체크 중 오류가 발생했습니다'
            })

        // 전체 헬스체크
        builder
            .addCase(fullHealthCheckThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fullHealthCheckThunk.fulfilled, (state, action: PayloadAction<HealthCheckResponse>) => {
                state.loading = false
                state.data = action.payload
                state.lastChecked = new Date().toISOString()
            })
            .addCase(fullHealthCheckThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || '전체 헬스체크 중 오류가 발생했습니다'
            })
    },
})

export const {resetHealthCheck, clearError} = slice.actions
export default slice.reducer