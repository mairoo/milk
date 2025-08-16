'use client'

import React from "react";
import {Sheet, SheetContent, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";

export default function CartDrawerSheet() {
    const {cartDrawerOpen, closeCartDrawer} = useDrawer();

    return (
        <Sheet
            open={cartDrawerOpen}
            onOpenChange={(open) => !open && closeCartDrawer()}
        >
            <SheetContent side="right" className="w-80">
                <SheetHeader>
                    <SheetTitle>장바구니</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                    {/* 여기에 장바구니 컨텐츠가 들어갈 예정 */}
                    <p className="text-gray-500 text-center py-8">
                        장바구니 컨텐츠가 들어갈 예정입니다.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}