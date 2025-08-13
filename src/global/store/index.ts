import {configureStore} from '@reduxjs/toolkit'
import {baseApi} from '@/global/api/baseApi'

/**
 * Redux Store 설정
 */
export const store = configureStore({
    reducer: {
        // RTK Query API reducer
        [baseApi.reducerPath]: baseApi.reducer,

        // ui: uiSlice,  // 클라이언트 전용 상태
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

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// RTK Query를 위한 타입들
export type ApiState = ReturnType<typeof baseApi.reducer>
