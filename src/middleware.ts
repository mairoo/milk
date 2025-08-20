import {withAuth} from "next-auth/middleware"
import {NextResponse} from "next/server"

/**
 * 보호할 경로만 명시하는 Middleware
 *
 * 장점:
 * - 명확하고 직관적인 설정
 * - 성능 최적화 (필요한 경로에서만 실행)
 * - 실수 방지 및 유지보수 용이
 * - 공개 페이지는 미들웨어 실행 안됨 (성능 향상)
 */
export default withAuth(
    function middleware(req) {
        const {pathname} = req.nextUrl

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔐 [Middleware] ${pathname} - 인증 통과`)
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            /**
             * 인증 필요 여부 판단
             *
             * 단순히 토큰 존재 여부만 체크
             */
            authorized: ({token, req}) => {
                const isAuthorized = !!token && !token.error

                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔍 [Auth Check] ${req.nextUrl.pathname} - 인증: ${isAuthorized}`)
                }

                return isAuthorized
            },
        },
        pages: {
            signIn: '/auth/sign-in',
        },
    }
)

/**
 * 보호할 경로만 명시
 *
 * 여기에 정의된 경로들만 미들웨어가 실행
 * 공개 페이지(/, /products, /categories 등)는 자동으로 제외되어 불필요한 인증 체크 없이 빠르게 접근 가능
 */
export const config = {
    matcher: [
        // 📱 마이페이지 관련
        '/my/:path*',

        // 👑 관리자 페이지
        '/admin/:path*',

        // 📦 주문 관련 (로그인 필요)
        '/orders/:path*',

        // 🛒 장바구니/결제 (로그인 필요)
        '/cart/checkout',
        '/payment/:path*',

        // 👤 프로필 관련
        '/profile/:path*',

        // 💳 포인트/쿠폰 관리
        '/points/:path*',
        '/coupons/:path*',

        // 📝 리뷰/문의 작성 (로그인 필요)
        '/reviews/write',
        '/support/inquiry',
    ]
}