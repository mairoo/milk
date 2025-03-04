/**
 * Redux의 TypeScript 지원을 위한 커스텀 훅들
 *
 * @module reduxHooks
 * @description
 * Redux의 useDispatch와 useSelector 훅에 TypeScript 타입을 미리 지정한 커스텀 훅들입니다.
 * 이를 통해 매번 dispatch와 state의 타입을 지정하지 않아도 자동으로 타입 추론이 가능합니다.
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';

/**
 * 타입이 지정된 useDispatch 훅
 *
 * @description
 * store에 정의된 AppDispatch 타입을 자동으로 지정하는 useDispatch 훅입니다.
 * 이를 사용하면 dispatch 함수가 store에 정의된 action들의 타입을 자동으로 인식합니다.
 *
 * @example
 * ```typescript
 * const dispatch = useAppDispatch();
 * dispatch(increment()); // increment action의 타입이 자동으로 인식됨
 * ```
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * 타입이 지정된 useSelector 훅
 *
 * @description
 * store에 정의된 RootState 타입을 자동으로 지정하는 useSelector 훅입니다.
 * 이를 통해 state를 선택할 때 자동 완성과 타입 체크가 가능합니다.
 *
 * @type {TypedUseSelectorHook<RootState>}
 *
 * @example
 * ```typescript
 * // state.counter의 타입이 자동으로 인식됨
 * const count = useAppSelector((state) => state.counter.value);
 * ```
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
