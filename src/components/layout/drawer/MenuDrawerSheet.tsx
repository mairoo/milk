'use client'

import React from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";
import {CreditCard, Dot, HelpCircle, LogOut, LucideIcon, Package, ShoppingCart, User} from "lucide-react";
import Link from "next/link";

// 메뉴 아이템 타입 정의
interface MenuItem {
    icon: LucideIcon;
    label: string;
    href: string;
    badge?: number;
}

export default function MenuDrawerSheet() {
    const {menuDrawerOpen, closeMenuDrawer} = useDrawer();

    // 핀코인 대표몰 메뉴
    const mainMenuItems: MenuItem[] = [
        {icon: User, label: "마이페이지", href: "/my/profile"},
        {icon: LogOut, label: "로그아웃", href: "/auth/logout"},
        {icon: Package, label: "주문/발송", href: "/my/order"},
        {icon: ShoppingCart, label: "장바구니", href: "/my/cart", badge: 0},
        {icon: HelpCircle, label: "고객센터", href: "/support"},
    ];

    // 상품권 카테고리
    const giftCardCategories: MenuItem[] = [
        {icon: Dot, label: "넥슨카드", href: "/category/넥슨카드"},
        {icon: Dot, label: "컬쳐랜드상품권", href: "/category/컬쳐랜드상품권"},
        {icon: Dot, label: "도서문화상품권", href: "/category/도서문화상품권"},
        {icon: Dot, label: "구글기프트카드", href: "/category/구글기프트카드"},
        {icon: Dot, label: "에그머니", href: "/category/에그머니"},
        {icon: Dot, label: "틴캐시", href: "/category/틴캐시"},
        {icon: Dot, label: "스마트문화상품권", href: "/category/스마트문화상품권"},
        {icon: Dot, label: "스타벅스", href: "/category/스타벅스"},
        {icon: Dot, label: "아프리카별풍선", href: "/category/아프리카tv"},
        {icon: Dot, label: "플레이스테이션", href: "/category/플레이스테이션-기프트카드-교환권"},
        {icon: Dot, label: "와우캐시", href: "/category/와우캐시"},
        {icon: Dot, label: "퍼니카드", href: "/category/퍼니카드"},
        {icon: Dot, label: "N코인", href: "/category/엔코인"},
        {icon: Dot, label: "요기요", href: "/category/요기요"},
        {icon: Dot, label: "한게임 상품권", href: "/category/한게임-한코인"},
        {icon: Dot, label: "메니아선불쿠폰", href: "/category/매니아선불쿠폰"},
        {icon: Dot, label: "아이템베이선불쿠폰", href: "/category/아이템베이선불쿠폰"},
    ];

    const handleLinkClick = () => {
        closeMenuDrawer();
    };

    return (
        <Sheet
            open={menuDrawerOpen}
            onOpenChange={(open) => !open && closeMenuDrawer()}
        >
            <SheetContent side="left" className="w-80 p-0 flex flex-col gap-0">
                <SheetHeader className="p-4 bg-green-50">
                    <SheetTitle className="text-green-800 font-bold">핀코인 대표몰</SheetTitle>
                    <SheetDescription className="sr-only">
                        사이트 메뉴를 탐색할 수 있습니다.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col">
                    {/* 핀코인 대표몰 섹션 */}
                    <div className="p-2">
                        <div className="space-y-1">
                            {mainMenuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 p-2 rounded-md transition-colors"
                                >
                                    <item.icon className="w-5 h-5 text-gray-600"/>
                                    <span className="text-gray-800">{item.label}</span>
                                    {item.badge !== undefined && (
                                        <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 상품권 섹션 */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-4 bg-green-50">
                            <h3 className="font-bold text-green-700">상품권</h3>
                        </div>

                        {/* 스크롤 가능한 상품권 목록 */}
                        <div className="flex-1 overflow-y-auto p-2 max-h-[calc(100vh-412px)]">
                            <div className="space-y-1">
                                {giftCardCategories.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 p-2 rounded-md transition-colors"
                                    >
                                        <item.icon className="w-5 h-5 text-gray-600 flex-shrink-0"/>
                                        <span className="text-gray-800">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 카드몰로 이동 링크 (푸터) */}
                    <div className="p-4 bg-green-50">
                        <Link
                            href="/"
                            onClick={handleLinkClick}
                            className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 text-black rounded-md transition-colors"
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