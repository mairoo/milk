'use client'

import {Toaster} from 'sonner'

/**
 * Sonner Toast 컨테이너
 *
 * 기능:
 * - 앱 전역에서 발생하는 toast 메시지 표시
 * - shadcn/ui sonner 통합
 * - 모바일/데스크톱 반응형 지원
 */
export default function ToastContainer() {
    return (
        <Toaster
            position="bottom-right"
            richColors
            closeButton
            expand
            visibleToasts={5}
            duration={1500}
        />
    )
}