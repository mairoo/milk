import {useCallback} from 'react'
import {closeAllDrawers, closeCartDrawer, closeMenuDrawer, openCartDrawer, openMenuDrawer,} from './slice'
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
    const handleOpenMenuDrawer = useCallback(() => {
        dispatch(openMenuDrawer())
    }, [dispatch])

    const handleCloseMenuDrawer = useCallback(() => {
        dispatch(closeMenuDrawer())
    }, [dispatch])

    // 모바일 장바구니 서랍 액션
    const handleOpenMobileCart = useCallback(() => {
        dispatch(openCartDrawer())
    }, [dispatch])

    const handleCloseMobileCart = useCallback(() => {
        dispatch(closeCartDrawer())
    }, [dispatch])

    // 모든 서랍 닫기
    const handleCloseAllDrawers = useCallback(() => {
        dispatch(closeAllDrawers())
    }, [dispatch])

    return {
        // 상태
        menuDrawerOpen,
        cartDrawerOpen,
        hasOpenDrawer: menuDrawerOpen || cartDrawerOpen,

        // 메뉴 서랍 액션
        openDrawerMenu: handleOpenMenuDrawer,
        closeDrawerMenu: handleCloseMenuDrawer,

        // 장바구니 서랍 액션
        openCartDrawer: handleOpenMobileCart,
        closeCartDrawer: handleCloseMobileCart,

        // 전체 액션
        closeAllDrawers: handleCloseAllDrawers,
    }
}