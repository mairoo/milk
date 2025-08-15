'use client'

import {signIn, signOut, useSession} from "next-auth/react";
import {useCallback, useEffect} from "react";

export function useAuth() {
    const {data: session} = useSession();

    const handleLogin = useCallback(async () => {
        await signIn('keycloak');
    }, []);

    const handleLogout = useCallback(async () => {
        await signOut({callbackUrl: '/'});
    }, []);

    // 토큰 만료나 갱신 실패 때문에 세션 오류 시 자동 로그아웃
    useEffect(() => {
        if (session?.error) {
            if (session.error === 'RefreshTokenExpired' || session.error === 'RefreshAccessTokenError') {
                void signOut({callbackUrl: '/'})
            }
        }
    }, [session?.error, handleLogout])

    return {
        handleLogin,
        handleLogout
    };
}