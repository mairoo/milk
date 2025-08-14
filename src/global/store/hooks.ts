import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {AppDispatch, RootState} from '@/global/store/index'

// 역할: 타입 안전한 Redux 훅 제공
// 의미: useSelector, useDispatch의 타입 안전한 버전

/**
 * 타입이 미리 지정된 useDispatch 훅
 * - AppDispatch 타입이 자동으로 추론됨
 * - 컴포넌트에서 dispatch 사용 시 타입 안전성 보장
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * 타입이 미리 지정된 useSelector 훅
 * - RootState 타입이 자동으로 추론됨
 * - state 접근 시 자동완성과 타입 체크 제공
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
