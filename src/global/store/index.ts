import {configureStore} from '@reduxjs/toolkit'
import {baseApi} from '@/global/api/baseApi'
import drawerReducer from '@/features/ui/drawer/slice'
import cartReducer from '@/features/order/cart/slice'

/**
 * Redux Store 설정
 *
 * 핵심 구성:
 * - baseApi: RTK Query (서버 상태)
 * - userSlice: 클라이언트 상태 (UI, 필터, 선택 등)
 * - middleware: RTK Query 미들웨어 추가
 * - devTools: 개발 환경에서만 활성화
 */
export const store = configureStore({
    reducer: {
        // RTK Query API reducer (라이브러리 자동 생성)
        [baseApi.reducerPath]: baseApi.reducer,

        // 클라이언트 전용 상태
        drawer: drawerReducer, // UI 서랍
        cart: cartReducer, // 장바구니
        // 모달, 토스트, 알림
        // 프로필
        // 테마, 다크모드
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // RTK Query를 위한 serializable 체크 설정
            serializableCheck: {
                ignoredActions: [baseApi.util.resetApiState.type],
            },
        }).concat(baseApi.middleware),

    // 개발 환경에서만 Redux DevTools 활성화
    devTools: process.env.NODE_ENV !== 'production',
})

/**
 * 사용자 경험 향상을 위해 상태를 영속화하는 전략
 * - Store 구독 및 상태 변화 감지
 * - 특정 상태 변화에 대한 부수 효과 처리
 * - localStorage 동기화 등에 활용
 *
 * 예시
 * - 즐겨찾기: 사용자가 설정한 즐겨찾기 목록 유지
 * - 장바구니: 페이지 새로고침해도 담아둔 상품 보존
 * - 필터 설정: 사용자가 마지막에 설정한 검색/필터 조건 복원
 * - UI 설정: 다크모드, 언어 설정, 레이아웃 선호도 등
 */

store.subscribe(() => {
})

// 앱 시작 시 localStorage에서 즐겨찾기 복원 처리

/**
 * 타입 정의들
 * - TypeScript와 완벽한 통합을 위한 타입들
 * - 컴포넌트에서 타입 안전하게 사용 가능
 */

// 루트 상태 타입
export type RootState = ReturnType<typeof store.getState>

// Dispatch 타입
export type AppDispatch = typeof store.dispatch

// Store 타입
export type AppStore = typeof store

//  RTK Query 상태 타입 (필요시 사용)
export type ApiState = ReturnType<typeof baseApi.reducer>
