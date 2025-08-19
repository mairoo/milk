import {useCallback} from 'react'
import {toast} from 'sonner'
import {
    addToast as addToastAction,
    clearAllToasts as clearAllToastsAction,
    removeToast as removeToastAction,
} from './slice'
import {useAppDispatch, useAppSelector} from '@/global/store/hooks'
import {ToastType} from './types'

/**
 * Sonner Toast 관리 hook
 *
 * 기능:
 * - sonner toast 호출
 * - Redux 상태와 동기화
 * - 다양한 타입의 토스트 메시지 제공
 */
export const useToast = () => {
    const dispatch = useAppDispatch()
    const {toasts} = useAppSelector((state) => state.toast)

    // 기본 토스트 추가
    const showToast = useCallback((
        type: ToastType,
        title: string,
        description?: string,
        duration?: number
    ) => {
        // Redux 상태에 추가
        dispatch(addToastAction({type, title, description, duration}))

        // Sonner toast 호출
        switch (type) {
            case 'success':
                toast.success(title, {description, duration})
                break
            case 'error':
                toast.error(title, {description, duration})
                break
            case 'warning':
                toast.warning(title, {description, duration})
                break
            case 'info':
            default:
                toast.info(title, {description, duration})
                break
        }
    }, [dispatch])

    // 편의 메서드들
    const showSuccess = useCallback((title: string, description?: string, duration?: number) => {
        showToast('success', title, description, duration)
    }, [showToast])

    const showError = useCallback((title: string, description?: string, duration?: number) => {
        showToast('error', title, description, duration)
    }, [showToast])

    const showWarning = useCallback((title: string, description?: string, duration?: number) => {
        showToast('warning', title, description, duration)
    }, [showToast])

    const showInfo = useCallback((title: string, description?: string, duration?: number) => {
        showToast('info', title, description, duration)
    }, [showToast])

    // 토스트 제거
    const removeToast = useCallback((id: string) => {
        dispatch(removeToastAction(id))
        toast.dismiss(id)
    }, [dispatch])

    // 모든 토스트 제거
    const clearAllToasts = useCallback(() => {
        dispatch(clearAllToastsAction())
        toast.dismiss()
    }, [dispatch])

    return {
        // 상태
        toasts,

        // 기본 메서드
        showToast,

        // 편의 메서드
        showSuccess,
        showError,
        showWarning,
        showInfo,

        // 제거 메서드
        removeToast,
        clearAllToasts,
    }
}