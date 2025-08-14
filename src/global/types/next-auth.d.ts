import {DefaultSession, DefaultUser} from "next-auth"
import {DefaultJWT} from "next-auth/jwt"

/**
 * NextAuth.js 타입 확장
 *
 * NextAuth.js의 기본 타입에 Keycloak 특화 필드를 추가
 * 모듈 선언을 통해 기존 타입을 확장하여 타입 안전성을 보장
 */

/**
 * next-lib 모듈 확장
 * 세션, 사용자, 프로필, 계정 관련 타입을 확장
 */
declare module "next-auth" {
    /**
     * 세션 인터페이스 확장
     * 클라이언트에서 useSession()으로 접근하는 세션 객체의 타입을 정의
     *
     * - session 콜백에서 반환하는 객체 타입
     * - 클라이언트에서 session.user.preferred_username으로 접근 가능
     * - 권한 정보(roles, groups)는 Spring Backend에서 독립적으로 관리
     * - accessToken은 API 호출 시에만 사용
     */
    interface Session {
        user: {
            id: string
            preferred_username: string
        } & DefaultSession["user"]
        accessToken?: string
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
        preferred_username: string
    }

    /**
     * Keycloak OpenID Connect 프로필 정보 타입 정의
     *
     * ## 설계 원칙: 인증과 인가의 분리
     * - Keycloak: 순수 인증 서버 (사용자 식별 정보만 제공)
     * - 백엔드: 독립적 권한 관리 (KeycloakJwtAuthenticationConverter에서 처리)
     *
     * ## 제외된 필드
     * - realm_access.roles: 비즈니스 로직 종속성 제거
     * - groups: 서비스별 독립적 권한 체계 구축
     */
    interface Profile {
        sub: string // 사용자 고유 ID
        email_verified: boolean // 이메일 인증 상태
        preferred_username: string // 사용자명 (이메일)
        given_name: string // 이름
        family_name: string // 성
        email: string // 이메일
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
 * next-lib/jwt 모듈 확장
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
     * - 사용자 식별 정보(preferred_username)만 포함
     * - 권한 정보는 Spring Backend에서 Keycloak JWT로부터 직접 추출
     */
    interface JWT extends DefaultJWT {
        accessToken: string
        refreshToken: string
        idToken: string
        accessTokenExpires: number
        refreshTokenExpires: number
        preferred_username: string
        error?: string
    }
}