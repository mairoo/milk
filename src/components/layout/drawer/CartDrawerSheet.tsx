'use client'

import React from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";

export default function CartDrawerSheet() {
    const {cartDrawerOpen, closeCartDrawer} = useDrawer();

    return (
        <Sheet
            open={cartDrawerOpen}
            onOpenChange={(open) => !open && closeCartDrawer()}
        >
            <SheetContent side="right" className="w-60">
                <SheetHeader>
                    <SheetTitle>장바구니</SheetTitle>
                    <SheetDescription className="sr-only">
                        선택한 상품들을 확인하고 주문할 수 있습니다.
                    </SheetDescription>
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