'use client'

import React from "react";
import {Sheet, SheetContent, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";

export default function MenuDrawerSheet() {
    const {menuDrawerOpen, closeDrawerMenu} = useDrawer();

    return (
        <Sheet
            open={menuDrawerOpen}
            onOpenChange={(open) => !open && closeDrawerMenu()}
        >
            <SheetContent side="left" className="w-80">
                <SheetHeader>
                    <SheetTitle>메뉴</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                    {/* 여기에 메뉴 컨텐츠가 들어갈 예정 */}
                    <p className="text-gray-500 text-center py-8">
                        메뉴 컨텐츠가 들어갈 예정입니다.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}