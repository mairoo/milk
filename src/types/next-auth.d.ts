import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

/**
 * NextAuth.js 타입 확장
 *
 * NextAuth.js의 기본 타입에 Keycloak 특화 필드를 추가
 * 모듈 선언을 통해 기존 타입을 확장하여 타입 안전성을 보장
 */

/**
 * next-auth 모듈 확장
 * 세션, 사용자, 프로필, 계정 관련 타입을 확장
 */
declare module "next-auth" {
    /**
     * 세션 인터페이스 확장
     * 클라이언트에서 useSession()으로 접근하는 세션 객체의 타입을 정의
     *
     * - session 콜백에서 반환하는 객체 타입
     * - 클라이언트에서 session.user.roles 등으로 접근 가능
     * - 보안상 accessToken은 서버 사이드에서만 사용
     */
    interface Session {
        user: {
            id: string
            roles: string[]
            groups: string[]
            preferred_username: string
        } & DefaultSession["user"]
        accessToken: string
        error?: string
    }

    /**
     * 사용자 인터페이스 확장
     * 향후 사용자 정보를 직접 다룰 때 사용
     *
     * - NextAuth.js 내부에서 사용자 객체 타입
     * - 현재 직접 사용하지 않지만 타입 시스템 완성도를 위해 정의
     */
    interface User extends DefaultUser {
        roles: string[]
        groups: string[]
        preferred_username: string
    }

    /**
     * 프로필 인터페이스 확장
     * Keycloak에서 반환하는 OpenID Connect 프로필 정보의 타입을 정의
     *
     * - jwt 콜백의 profile 매개변수 타입
     * - Keycloak 사용자 정보 및 역할/그룹 정보 포함
     * - realm_access.roles로 Keycloak 역할 정보 접근
     */
    interface Profile {
        sub: string
        email_verified: boolean
        preferred_username: string
        given_name: string
        family_name: string
        email: string
        realm_access?: {
            roles: string[]
        }
        groups?: string[]
    }

    /**
     * 계정 인터페이스 확장
     * Keycloak OAuth 2.0 토큰 응답의 타입을 정의
     *
     * - jwt 콜백의 account 매개변수 타입
     * - 초기 로그인 시 Keycloak에서 받는 토큰 정보
     * - access_token, refresh_token 등 OAuth 2.0 표준 필드
     */
    interface Account {
        access_token: string
        refresh_token: string
        id_token: string
        expires_at: number
        refresh_expires_in: number
        token_type: string
        scope: string
    }
}

/**
 * next-auth/jwt 모듈 확장
 * JWT 토큰 관련 타입을 확장
 *
 * next-auth와 별도 모듈로 분리된 이유:
 * - JWT 전략과 Database 전략을 선택적으로 사용 가능
 * - JWT 관련 기능만 사용할 때 불필요한 의존성 제거
 * - 타입 시스템의 모듈화로 더 나은 트리 쉐이킹 지원
 */
declare module "next-auth/jwt" {
    /**
     * JWT 인터페이스 확장
     * 서버에서 관리하는 JWT 토큰의 페이로드 타입을 정의
     *
     * - jwt 콜백에서 관리하는 토큰 객체 타입
     * - refreshAccessToken 함수의 매개변수/반환값 타입
     * - 민감한 토큰 정보(accessToken, refreshToken)는 서버에서만 관리
     * - 토큰 만료 시간 추적으로 자동 갱신 지원
     */
    interface JWT extends DefaultJWT {
        accessToken: string
        refreshToken: string
        idToken: string
        accessTokenExpires: number
        refreshTokenExpires: number
        roles: string[]
        groups: string[]
        preferred_username: string
        error?: string
    }
}