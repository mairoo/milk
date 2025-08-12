import {configureStore} from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        // 다른 슬라이스들을 여기에 추가
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch