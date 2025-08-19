export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastState {
    toasts: ToastItem[]
}

export interface ToastItem {
    id: string
    type: ToastType
    title?: string
    description?: string
    duration?: number
}