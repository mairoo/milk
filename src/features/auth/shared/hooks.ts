'use client'

import {signIn as nextSignIn, signOut as nextSignOut, useSession} from "next-auth/react";
import {useCallback, useEffect} from "react";

export function useAuth() {
    const {data: session} = useSession();

    const signIn = useCallback(async () => {
        await nextSignIn('keycloak');
    }, []);

    const signOut = useCallback(async () => {
        await nextSignOut({callbackUrl: '/'});
    }, []);

    // 토큰 만료나 갱신 실패 때문에 세션 오류 시 자동 로그아웃
    useEffect(() => {
        if (session?.error) {
            if (session.error === 'RefreshTokenExpired' || session.error === 'RefreshAccessTokenError') {
                void nextSignOut({callbackUrl: '/'})
            }
        }
    }, [session?.error, signOut])

    return {
        signIn,
        signOut,
    };
}