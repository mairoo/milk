import {useCallback} from 'react'
import {getErrorMessage} from "@/global/lib/rtkQueryUtils"
import {useCreateMemberOrderMutation} from "@/features/order/member/api";
import {MemberOrderCreateRequest} from "@/features/order/member/request";

/**
 * Member Order 생성 훅
 */
export const useMemberOrder = () => {
    const [createMemberOrderTrigger, result] = useCreateMemberOrderMutation()

    const createOrder = useCallback(async (request: MemberOrderCreateRequest) => {
        try {
            const response = await createMemberOrderTrigger(request).unwrap()
            return {
                success: true,
                data: response,
                error: null
            }
        } catch {
            return {
                success: false,
                data: null,
                error: getErrorMessage(result.error)
            }
        }
    }, [createMemberOrderTrigger, result.error])

    return {
        // 핵심 상태
        loading: result.isLoading,
        data: result.data,
        error: getErrorMessage(result.error),
        hasError: !!result.error,
        isSuccess: result.isSuccess,

        // 핵심 액션
        createOrder,

        // 추가 상태 (필요시)
        isUninitialized: result.isUninitialized,

        // RTK Query 원본 결과 (고급 사용)
        originalResult: result,
    }
}