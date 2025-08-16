import {createSlice} from '@reduxjs/toolkit'
import {DrawerState} from "@/features/ui/drawer/types";

const initialState: DrawerState = {
    menuDrawerOpen: false,
    cartDrawerOpen: false,
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
        openMenuDrawer: (state) => {
            state.menuDrawerOpen = true
            // 다른 서랍이 열려있으면 닫기
            state.cartDrawerOpen = false
        },
        closeMenuDrawer: (state) => {
            state.menuDrawerOpen = false
        },
        openCartDrawer: (state) => {
            state.cartDrawerOpen = true
            // 다른 서랍이 열려있으면 닫기
            state.menuDrawerOpen = false
        },
        closeCartDrawer: (state) => {
            state.cartDrawerOpen = false
        },
        closeAllDrawers: (state) => {
            state.menuDrawerOpen = false
            state.cartDrawerOpen = false
        },
    },
})

export const {
    openMenuDrawer,
    closeMenuDrawer,
    openCartDrawer,
    closeCartDrawer,
    closeAllDrawers,
} = drawerSlice.actions

export default drawerSlice.reducer