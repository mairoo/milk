'use client'

import React from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";
import {CreditCard} from "lucide-react";
import Link from "next/link";
import {mobileMenuItems, mobileMenuItems1} from "@/global/types/menu";

export default function MenuDrawerSheet() {
    const {menuDrawerOpen, closeMenuDrawer} = useDrawer();

    const handleLinkClick = () => {
        closeMenuDrawer();
    };

    return (
        <Sheet
            open={menuDrawerOpen}
            onOpenChange={(open) => !open && closeMenuDrawer()}
        >
            <SheetContent side="left" className="w-80 p-0 flex flex-col gap-0">
                <SheetHeader className="p-3 bg-green-50 border-l-orange-400 border-l-4">
                    <SheetTitle className="text-green-800 font-bold">핀코인 대표몰</SheetTitle>
                    <SheetDescription className="sr-only">
                        사이트 메뉴를 탐색할 수 있습니다.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col">
                    {/* 핀코인 대표몰 섹션 */}
                    <div className="p-2">
                        <div className="space-y-3">
                            {mobileMenuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-3 px-2 transition-colors"
                                >
                                    <item.icon className="w-5 h-5 text-gray-600"/>
                                    <span className="text-gray-800">{item.label}</span>
                                    {item.badge !== undefined && (
                                        <span className="ml-auto bg-green-800 text-white text-xs px-2 py-1 rounded-md">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 상품권 섹션 */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-3 bg-green-50 border-l-orange-400 border-l-4">
                            <h3 className="font-bold text-green-800">상품권</h3>
                        </div>

                        {/* 스크롤 가능한 상품권 목록 */}
                        <div className="flex-1 overflow-y-auto p-2 max-h-[calc(100vh-328px)]">
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
                    <div className="p-3 bg-green-50 text-green-800 font-bold border-l-orange-400 border-l-4">
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