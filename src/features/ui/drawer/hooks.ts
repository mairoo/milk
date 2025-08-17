import {useCallback} from 'react'
import {
    closeAllDrawers as closeAllDrawersAction,
    closeCartDrawer as closeCartDrawerAction,
    closeMenuDrawer as closeMenuDrawerAction,
    openCartDrawer as openCartDrawerAction,
    openMenuDrawer as openMenuDrawerAction,
} from './slice'
import {useAppDispatch, useAppSelector} from "@/global/store/hooks";

/**
 * 모바일 서랍 관리 hook
 *
 * 기능:
 * - 모바일 메뉴/장바구니 서랍 상태 관리
 * - 서랍 열기/닫기 액션
 * - 키보드 이벤트 처리 (ESC)
 */
export const useDrawer = () => {
    const dispatch = useAppDispatch()
    const {menuDrawerOpen, cartDrawerOpen} = useAppSelector((state) => state.drawer)

    // 모바일 메뉴 서랍 액션
    const openMenuDrawer = useCallback(() => {
        dispatch(openMenuDrawerAction())
    }, [dispatch])

    const closeMenuDrawer = useCallback(() => {
        dispatch(closeMenuDrawerAction())
    }, [dispatch])

    // 모바일 장바구니 서랍 액션
    const openCartDrawer = useCallback(() => {
        dispatch(openCartDrawerAction())
    }, [dispatch])

    const closeCartDrawer = useCallback(() => {
        dispatch(closeCartDrawerAction())
    }, [dispatch])

    // 모든 서랍 닫기
    const closeAllDrawers = useCallback(() => {
        dispatch(closeAllDrawersAction())
    }, [dispatch])

    return {
        // 상태
        menuDrawerOpen,
        cartDrawerOpen,
        hasOpenDrawer: menuDrawerOpen || cartDrawerOpen,

        // 메뉴 서랍 액션
        openMenuDrawer,
        closeMenuDrawer,

        // 장바구니 서랍 액션
        openCartDrawer,
        closeCartDrawer,

        // 전체 액션
        closeAllDrawers,
    }
}