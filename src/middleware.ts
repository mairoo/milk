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
        const {token} = req.nextauth
        const {pathname} = req.nextUrl

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔐 [Middleware] ${pathname} - 역할: ${JSON.stringify(token?.roles || [])}`)
        }

        if (token?.error) {
            console.error(`❌ 토큰 에러: ${token.error}`)
            const signInUrl = new URL('/api/auth/signin', req.url)
            signInUrl.searchParams.set('callbackUrl', pathname)
            signInUrl.searchParams.set('error', token.error)
            return NextResponse.redirect(signInUrl)
        }

        if (pathname.startsWith('/admin')) {
            const userRoles = token?.roles as string[] || []
            if (!userRoles.includes('ADMIN')) {
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ [Middleware] 접근 허용: ${pathname}`)
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            /**
             * 인증 필요 여부 판단
             *
             * config.matcher에 의해 실행된 모든 경로는
             * 이미 "보호 대상"이므로 단순히 토큰 유효성만 체크
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
            signIn: '/api/auth/signin',
        },
    }
)

/**
 * 🎯 보호할 경로만 명시 (핵심!)
 *
 * 여기에 정의된 경로들만 미들웨어가 실행됩니다.
 * 공개 페이지(/, /products, /categories 등)는 자동으로 제외되어
 * 불필요한 인증 체크 없이 빠르게 접근 가능합니다.
 */
export const config = {
    matcher: [
        // 📱 마이페이지 관련
        '/my/:path*',           // /my/profile, /my/orders, /my/wishlist 등

        // 👑 관리자 페이지
        '/admin/:path*',        // /admin/users, /admin/products 등

        // 📦 주문 관련 (로그인 필요)
        '/orders/:path*',       // /orders/history, /orders/detail/123 등

        // 🛒 장바구니/결제 (로그인 필요)
        '/cart/checkout',       // 결제 페이지만 보호 (/cart는 공개)
        '/payment/:path*',      // /payment/success, /payment/cancel 등

        // 👤 프로필 관련
        '/profile/:path*',      // /profile/edit, /profile/security 등

        // 💳 포인트/쿠폰 관리
        '/points/:path*',       // /points/history, /points/exchange 등
        '/coupons/:path*',      // /coupons/my, /coupons/history 등

        // 📝 리뷰/문의 작성 (로그인 필요)
        '/reviews/write',       // 리뷰 작성만 보호 (/reviews는 공개)
        '/support/inquiry',     // 문의 작성만 보호 (/support는 공개)

        // 🔒 보호된 API 엔드포인트 (선택사항)
        // '/api/user/:path*',     // 사용자 관련 API
        // '/api/orders/:path*',   // 주문 관련 API
        // '/api/admin/:path*',    // 관리자 API
    ]
}