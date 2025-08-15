import {createSlice} from '@reduxjs/toolkit'
import {DrawerState} from "@/features/ui/drawer/types";

const initialState: DrawerState = {
    mobileMenuOpen: false,
    mobileCartOpen: false,
}

/**
 * UI 서랍 상태 관리 slice
 *
 * 담당 범위:
 * - 모바일 메뉴 서랍 상태
 * - 모바일 장바구니 서랍 상태
 * - 기타 서랍/모달 UI 상태
 */
const drawerSlice = createSlice({
    name: 'drawer',
    initialState,
    reducers: {
        openMobileMenu: (state) => {
            state.mobileMenuOpen = true
            // 다른 서랍이 열려있으면 닫기
            state.mobileCartOpen = false
        },
        closeMobileMenu: (state) => {
            state.mobileMenuOpen = false
        },
        openMobileCart: (state) => {
            state.mobileCartOpen = true
            // 다른 서랍이 열려있으면 닫기
            state.mobileMenuOpen = false
        },
        closeMobileCart: (state) => {
            state.mobileCartOpen = false
        },
        closeAllDrawers: (state) => {
            state.mobileMenuOpen = false
            state.mobileCartOpen = false
        },
    },
})

export const {
    openMobileMenu,
    closeMobileMenu,
    openMobileCart,
    closeMobileCart,
    closeAllDrawers,
} = drawerSlice.actions

export default drawerSlice.reducer