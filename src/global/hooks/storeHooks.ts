import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {AppDispatch, RootState} from '@/global/store'

/**
 * 타입 안전한 dispatch hook
 * Redux Toolkit의 권장 사항에 따라 typed된 dispatch를 사용
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * 타입 안전한 selector hook
 * RootState 타입이 자동으로 추론되어 타입 안전성 보장
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
