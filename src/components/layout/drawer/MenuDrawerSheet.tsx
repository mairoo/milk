'use client'

import React from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";

export default function MenuDrawerSheet() {
    const {menuDrawerOpen, closeMenuDrawer} = useDrawer();

    return (
        <Sheet
            open={menuDrawerOpen}
            onOpenChange={(open) => !open && closeMenuDrawer()}
        >
            <SheetContent side="left" className="w-80">
                <SheetHeader>
                    <SheetTitle>메뉴</SheetTitle>
                    <SheetDescription className="sr-only">
                        사이트 메뉴를 탐색할 수 있습니다.
                    </SheetDescription>
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