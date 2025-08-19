'use client'

import React from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {useDrawer} from "@/features/ui/drawer/hooks";
import {useCart} from "@/features/order/cart/hooks";
import {Minus, Plus, ShoppingCart, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function CartDrawerSheet() {
    const {cartDrawerOpen, closeCartDrawer} = useDrawer();
    const {products, stats, increment, decrement, removeProduct, clear} = useCart();

    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`;
    };

    return (
        <Sheet
            open={cartDrawerOpen}
            onOpenChange={(open) => !open && closeCartDrawer()}
        >
            <SheetContent
                side="right"
                className="w-80 p-0 flex flex-col gap-0 [&>button]:!border-0 [&>button]:!border-none [&>button]:!rounded-none [&>button]:!ring-0 [&>button]:!ring-offset-0 [&>button]:focus:!outline-none [&>button]:focus-visible:!outline-none [&>button]:focus:!ring-0 [&>button]:focus-visible:!ring-0 [&>button]:hover:!opacity-70 border-l-0"
            >
                <SheetHeader className="p-3 bg-emerald-50 border-l-orange-400 border-l-4">
                    <SheetTitle className="text-emerald-800 font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5"/>
                        장바구니
                        {stats.totalQuantity > 0 && (
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                {stats.totalQuantity}
                            </span>
                        )}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        선택한 상품들을 확인하고 수량을 조절할 수 있습니다.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 flex flex-col min-h-0">
                    {stats.isEmpty ? (
                        // 빈 장바구니
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
                            <ShoppingCart className="w-16 h-16 mb-4 text-gray-300"/>
                            <p className="text-center">장바구니가 비어있습니다</p>
                            <p className="text-sm text-center mt-1">상품을 담아보세요!</p>
                        </div>
                    ) : (
                        <>
                            {/* 장바구니 헤더 - 상품 개수 및 전체 삭제 */}
                            <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    총 {stats.productCount}개 상품
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clear}
                                    className="text-gray-500 hover:text-red-600 h-auto p-1"
                                >
                                    <Trash2 className="w-4 h-4 mr-1"/>
                                    전체삭제
                                </Button>
                            </div>

                            {/* 스크롤 가능한 상품 목록 */}
                            <div className="flex-1 overflow-y-auto p-2">
                                <div className="space-y-3">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                                        >
                                            {/* 상품 정보 */}
                                            <div className="mb-3">
                                                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                                    {product.title} {product.subtitle}
                                                </h4>
                                                <p className="text-sm font-semibold text-emerald-600 mt-1">
                                                    {formatPrice(product.price)}
                                                </p>
                                            </div>

                                            {/* 수량 조절 및 삭제 */}
                                            <div className="flex items-center justify-between">
                                                {/* 수량 조절 */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => decrement(product.id)}
                                                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                        aria-label="수량 감소"
                                                    >
                                                        <Minus className="h-3 w-3 text-gray-600"/>
                                                    </button>
                                                    <span className="min-w-[2rem] text-center font-medium text-sm">
                                                        {product.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => increment(product.id)}
                                                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                        aria-label="수량 증가"
                                                    >
                                                        <Plus className="h-3 w-3 text-gray-600"/>
                                                    </button>
                                                </div>

                                                {/* 소계 및 삭제 버튼 */}
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm text-gray-900">
                                                        {formatPrice(product.price * product.quantity)}
                                                    </span>
                                                    <button
                                                        onClick={() => removeProduct(product.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        aria-label="상품 삭제"
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 합계 섹션 */}
                            <div className="p-3 bg-emerald-50 border-t-4 border-orange-400">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">상품금액</span>
                                        <span className="font-medium">{formatPrice(stats.totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">배송비</span>
                                        <span className="font-medium">무료</span>
                                    </div>
                                    <hr className="my-2"/>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-emerald-800">총 결제금액</span>
                                        <span className="font-bold text-lg text-emerald-800">
                                            {formatPrice(stats.totalPrice)}
                                        </span>
                                    </div>
                                </div>

                                {/* 주문하기 버튼 (향후 구현 예정) */}
                                <Button
                                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    disabled
                                >
                                    주문하기 (준비중)
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}