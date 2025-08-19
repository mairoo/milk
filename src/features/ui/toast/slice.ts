import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ToastItem, ToastState} from './types'

const initialState: ToastState = {
    toasts: [],
}

/**
 * Toast 상태 관리 slice
 *
 * 담당 범위:
 * - 토스트 메시지 추가/제거
 * - 토스트 목록 관리
 */
const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<ToastItem, 'id'>>) => {
            const toast: ToastItem = {
                id: Date.now().toString(),
                ...action.payload,
            }
            state.toasts.push(toast)
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
        },
        clearAllToasts: (state) => {
            state.toasts = []
        },
    },
})

export const {
    addToast,
    removeToast,
    clearAllToasts,
} = toastSlice.actions

export default toastSlice.reducer