'use client'

import Image from "next/image";
import {ChevronDown, LogIn, LogOut, MessageCircle, Package, Search, ShoppingCart, User, UserPlus} from "lucide-react";
import React, {useCallback, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {NavLink} from "@/components/layout/navigation/NavLink";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {desktopMenuItems} from "@/global/types/menu";
import {cn} from "@/lib/utils";
import {useAuth} from "@/features/auth/shared/hooks";
import {useCart} from "@/features/order/cart/hooks";
import {NavButton} from "@/components/layout/navigation/NavButton";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {clearCart, restoreFromStorage} from "@/features/order/cart/slice";
import {useAppDispatch} from "@/global/store/hooks";

interface DesktopHeaderProps {
    className?: string;
}

export default function DesktopHeader({className}: DesktopHeaderProps) {
    const {data: session, status} = useSession();
    const {signIn, signOut} = useAuth();
    const {stats} = useCart();
    const dispatch = useAppDispatch();

    // 하이드레이션 완료 상태 추적
    const [isHydrated, setIsHydrated] = useState(false);

    /**
     * 하이드레이션 이슈 해결을 위한 장바구니 복원 로직
     *
     * 1. SSR: 서버에서 Badge 없이 렌더링 (isHydrated: false)
     * 2. 하이드레이션: 클라이언트에서 동일한 UI로 매칭
     * 3. useEffect: localStorage 복원 + 하이드레이션 완료 표시
     * 4. 리렌더링: 실제 장바구니 수량으로 Badge 표시
     */
    useEffect(() => {
        // localStorage에서 장바구니 복원
        dispatch(restoreFromStorage());
        // 하이드레이션 완료 표시
        setIsHydrated(true);
    }, [dispatch]);

    const handleSignOut = useCallback(async () => {
        dispatch(clearCart()); // Redux 상태 및 localStorage 모두 삭제
        await signOut();
    }, [dispatch, signOut]);

    // 로딩 중일 때는 기본 메뉴만 표시
    if (status === 'loading') {
        return (
            <header className={cn(
                "sticky top-0 z-10 bg-white shadow-sm",
                "sticky-header-stable safe-area-inset",
                className,
            )}>
                <div className="mx-auto container">
                    <div className="mx-auto container flex justify-between items-center py-2">
                        <div>
                            <Link href="/public">
                                <Image
                                    src="/images/pincoin_www_260x50.png"
                                    alt="핀코인 로고"
                                    width={360}
                                    height={50}
                                    priority
                                />
                            </Link>
                        </div>
                        <nav className="space-x-4">
                            <div className="text-gray-400">로딩 중...</div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={cn(
            "sticky top-0 z-10 bg-white shadow-sm text-sm",
            "sticky-header-stable safe-area-inset",
            className,
        )}>
            <div className="mx-auto container">
                <div className="mx-auto container flex justify-between items-center py-4">
                    <div>
                        <Link href="/">
                            <Image
                                src="/images/pincoin_www_260x50.png"
                                alt="핀코인 로고"
                                width={360}
                                height={50}
                                priority
                            />
                        </Link>
                    </div>
                    <nav className="space-x-4">
                        {!session && (
                            <>
                                <NavButton icon={LogIn} onClick={signIn}>
                                    로그인
                                </NavButton>
                                <NavLink href="/auth/sign-up" icon={UserPlus}>
                                    회원가입
                                </NavLink>
                            </>
                        )}
                        <NavLink href="/my/order" icon={Package}>
                            주문/발송
                        </NavLink>

                        <div className="relative inline-flex">
                            <NavLink href="/cart" icon={ShoppingCart}>
                                장바구니
                            </NavLink>
                            {/* 하이드레이션 완료 후에만 Badge 표시 */}
                            {isHydrated && stats.productCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                    {stats.productCount > 99 ? '99+' : stats.productCount}
                                </Badge>
                            )}
                        </div>

                        <NavLink href="/support" icon={MessageCircle}>
                            고객센터
                        </NavLink>
                        {session && (
                            <>
                                <NavLink href="/my/profile" icon={User}>
                                    마이페이지
                                </NavLink>
                                <NavButton icon={LogOut} onClick={handleSignOut}>
                                    로그아웃
                                </NavButton>
                            </>
                        )}
                    </nav>
                </div>
            </div>
            <div className="bg-green-50 text-green-950">
                <div className="mx-auto container flex justify-between items-center py-1">
                    <div className="flex items-center gap-x-12">
                        {desktopMenuItems.map((category, index) => (
                            <DropdownMenu key={index} modal={false}>
                                <DropdownMenuTrigger
                                    className="flex items-center justify-start gap-x-1 cursor-pointer hover:text-green-700 focus:outline-none">
                                    <span>{category.title}</span>
                                    <ChevronDown className="h-4 w-4"/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 p-0 rounded-sm" align="start">
                                    {category.items.map((item, itemIndex) => (
                                        <DropdownMenuItem key={itemIndex} asChild
                                                          className="p-2 rounded-none text-sm hover:!bg-green-950 hover:!text-white">
                                            <Link href={item.href} className="cursor-pointer">
                                                {item.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="상품을 검색하세요"
                                className="w-64 h-9 text-sm bg-white border-gray-200 focus:border-green-500"
                            />
                            <Button
                                size="sm"
                                className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Search className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}