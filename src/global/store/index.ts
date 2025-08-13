import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {baseApi} from '@/global/api/baseApi'
import healthCheckAdminSlice from "@/features/s3/admin/slice"

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        s3: combineReducers({
            healthCheckAdmin: healthCheckAdminSlice,
        }),
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch