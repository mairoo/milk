import {combineReducers, configureStore} from '@reduxjs/toolkit'
import healthCheckAdminSlice from "@/infra/s3/slices/health-check.admin.slice";

export const store = configureStore({
    reducer: {
        s3: combineReducers({
            healthCheckAdmin: healthCheckAdminSlice,
        }),
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch