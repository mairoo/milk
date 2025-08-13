import {ReactNode} from "react";

export interface SessionProviderProps {
    children: ReactNode

    /** 세션 갱신 간격 (초) - 기본값: 240초 (4분) */
    refetchInterval?: number

    /** 윈도우 포커스 시 세션 갱신 여부 - 기본값: true */
    refetchOnWindowFocus?: boolean
}