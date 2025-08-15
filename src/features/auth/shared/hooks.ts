'use client'

import {signIn, signOut} from "next-auth/react";
import {useCallback} from "react";

export function useAuth() {
    const handleLogin = useCallback(async () => {
        await signIn('keycloak');
    }, []);

    const handleLogout = useCallback(async () => {
        await signOut({callbackUrl: '/'});
    }, []);

    return {
        handleLogin,
        handleLogout
    };
}