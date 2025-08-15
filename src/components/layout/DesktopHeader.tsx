'use client'

import Image from "next/image";
import {ChevronDown, LogIn, LogOut, MessageCircle, Package, ShoppingCart, User, UserPlus} from "lucide-react";
import React from "react";
import {signIn, signOut, useSession} from "next-auth/react";
import {NavLink} from "@/components/layout/NavLink";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {categoryItems} from "@/global/types/constants";

export default function DesktopHeader() {
    const {data: session, status} = useSession();

    // 로그아웃 핸들러
    const handleLogout = () => {
        signOut({callbackUrl: '/'});
    };

    const handleLogin = () => {
        signIn('keycloak');
    }

    // 로딩 중일 때는 기본 메뉴만 표시
    if (status === 'loading') {
        return (
            <header className="sticky top-0 bg-white">
                <div className="mx-auto container">
                    <div className="mx-auto container flex justify-between items-center px-4 sm:px-0 py-2">
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
                            <div className="text-gray-400">로딩 중...</div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 bg-white">
            <div className="mx-auto container">
                <div className="mx-auto container flex justify-between items-center px-4 sm:px-0 py-2">
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
                                <NavLink href="" icon={LogIn} onClick={handleLogin}>
                                    로그인
                                </NavLink>
                                <NavLink href="/auth/register" icon={UserPlus}>
                                    회원가입
                                </NavLink>
                            </>
                        )}
                        <NavLink href="/orders" icon={Package}>
                            주문/발송
                        </NavLink>
                        <NavLink href="/cart" icon={ShoppingCart}>
                            장바구니
                        </NavLink>
                        <NavLink href="/customer-service" icon={MessageCircle}>
                            고객센터
                        </NavLink>
                        {session && (
                            <>
                                <NavLink href="/mypage" icon={User}>
                                    마이페이지
                                </NavLink>
                                <NavLink href="" icon={LogOut} onClick={handleLogout}>
                                    로그아웃
                                </NavLink>
                            </>
                        )}
                    </nav>
                </div>
            </div>
            <div className="bg-green-50 text-green-950">
                <div className="mx-auto container flex justify-between items-center px-4 sm:px-0 py-2">
                    <div className="flex items-center gap-x-12">
                        {categoryItems.map((category, index) => (
                            <DropdownMenu key={index}>
                                <DropdownMenuTrigger
                                    className="flex items-center justify-start gap-x-1 cursor-pointer hover:text-green-700 focus:outline-none">
                                    <span>{category.title}</span>
                                    <ChevronDown className="h-4 w-4"/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 p-0 rounded-sm" align="start">
                                    {category.items.map((item, itemIndex) => (
                                        <DropdownMenuItem key={itemIndex} asChild
                                                          className="px-4 py-2 rounded-none text-base hover:!bg-green-950 hover:!text-white">
                                            <a href={item.href} className="cursor-pointer">
                                                {item.name}
                                            </a>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ))}
                    </div>
                    <div>
                        검색창
                    </div>
                </div>
            </div>
        </header>
    )
}