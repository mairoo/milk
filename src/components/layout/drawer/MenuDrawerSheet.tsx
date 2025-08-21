'use client'

import React, {useCallback} from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";
import {CreditCard, LogIn, UserPlus} from "lucide-react";
import Link from "next/link";
import {mobileMenuItems, mobileMenuItems1} from "@/global/types/menu";
import {useSession} from "next-auth/react";
import {useAuth} from "@/features/auth/shared/hooks";
import {useAppDispatch} from "@/global/store/hooks";
import {clearCart} from "@/features/order/cart/slice";

export default function MenuDrawerSheet() {
    const {menuDrawerOpen, closeMenuDrawer} = useDrawer();
    const {data: session, status} = useSession();
    const {signIn, signOut} = useAuth();
    const dispatch = useAppDispatch();

    const handleLinkClick = () => {
        closeMenuDrawer();
    };

    const handleAuthAction = (action: () => void) => {
        action();
        closeMenuDrawer();
    };

    const handleSignOut = useCallback(async () => {
        dispatch(clearCart()); // Redux 상태 및 localStorage 모두 삭제
        await signOut();
        closeMenuDrawer();
    }, [dispatch, signOut, closeMenuDrawer]);

    return (
        <Sheet
            open={menuDrawerOpen}
            onOpenChange={(open) => !open && closeMenuDrawer()}
        >
            <SheetContent
                side="left"
                className="w-60 p-0 flex flex-col gap-0 [&>button]:!border-0 [&>button]:!border-none [&>button]:!rounded-none [&>button]:!ring-0 [&>button]:!ring-offset-0 [&>button]:focus:!outline-none [&>button]:focus-visible:!outline-none [&>button]:focus:!ring-0 [&>button]:focus-visible:!ring-0 [&>button]:hover:!opacity-70"
            >
                <SheetHeader className="p-3 bg-green-100 border-l-orange-400 border-l-4">
                    <SheetTitle className="text-green-800 font-bold">핀코인 대표몰</SheetTitle>
                    <SheetDescription className="sr-only">
                        사이트 메뉴를 탐색할 수 있습니다.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col">
                    {/* 로그인/비로그인 사용자 구분 메뉴 */}
                    <div className="p-2">
                        <div className="space-y-3">
                            {status === 'loading' ? (
                                <div className="text-gray-400 px-2">로딩 중...</div>
                            ) : !session ? (
                                // 비로그인 사용자 메뉴: 로그인, 회원가입, 주문/발송, 고객센터
                                <>
                                    <button
                                        onClick={() => handleAuthAction(signIn)}
                                        className="flex items-center gap-3 px-2 w-full text-left transition-colors"
                                    >
                                        <LogIn className="w-5 h-5 text-gray-600"/>
                                        <span className="text-gray-800">로그인</span>
                                    </button>
                                    <Link
                                        href="/auth/sign-up"
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 px-2 transition-colors"
                                    >
                                        <UserPlus className="w-5 h-5 text-gray-600"/>
                                        <span className="text-gray-800">회원가입</span>
                                    </Link>
                                    {mobileMenuItems
                                        .filter(item => item.label === "주문/발송" || item.label === "고객센터")
                                        .map((item, index) => (
                                            <Link
                                                key={index}
                                                href={item.href}
                                                onClick={handleLinkClick}
                                                className="flex items-center gap-3 px-2 transition-colors"
                                            >
                                                <item.icon className="w-5 h-5 text-gray-600"/>
                                                <span className="text-gray-800">{item.label}</span>
                                            </Link>
                                        ))}
                                </>
                            ) : (
                                // 로그인 사용자 메뉴: 주문/발송, 고객센터, 마이페이지, 로그아웃
                                <>
                                    {mobileMenuItems
                                        .filter(item => item.label === "주문/발송" || item.label === "고객센터" || item.label === "마이페이지" || item.label === "로그아웃")
                                        .sort((a, b) => {
                                            const order = ["주문/발송", "고객센터", "마이페이지", "로그아웃"];
                                            return order.indexOf(a.label) - order.indexOf(b.label);
                                        })
                                        .map((item, index) => {
                                            if (item.label === "로그아웃") {
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={handleSignOut}
                                                        className="flex items-center gap-3 px-2 w-full text-left transition-colors"
                                                    >
                                                        <item.icon className="w-5 h-5 text-gray-600"/>
                                                        <span className="text-gray-800">{item.label}</span>
                                                    </button>
                                                );
                                            }
                                            return (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    onClick={handleLinkClick}
                                                    className="flex items-center gap-3 px-2 transition-colors"
                                                >
                                                    <item.icon className="w-5 h-5 text-gray-600"/>
                                                    <span className="text-gray-800">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                </>
                            )}
                        </div>
                    </div>

                    {/* 상품권 섹션 */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-3 bg-green-100 border-l-orange-400 border-l-4">
                            <h3 className="font-bold text-green-800">상품권</h3>
                        </div>

                        {/* 스크롤 가능한 상품권 목록 */}
                        <div className="flex-1 overflow-y-auto p-2 max-h-[calc(100dvh-292px)]">
                            <div className="space-y-3">
                                {mobileMenuItems1.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 px-2 transition-colors"
                                    >
                                        <item.icon className="w-5 h-5 text-gray-600 flex-shrink-0"/>
                                        <span className="text-gray-800">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 카드몰로 이동 링크 (푸터) */}
                    <div className="p-3 bg-green-100 text-green-800 font-bold border-l-orange-400 border-l-4">
                        <Link
                            href="/"
                            onClick={handleLinkClick}
                            className="w-full flex items-center justify-center gap-2 transition-colors"
                        >
                            <CreditCard className="w-4 h-4"/>
                            <span>카드몰로 이동</span>
                        </Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}