'use client'

import React from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Menu, ShoppingCart} from "lucide-react";

interface MobileHeaderProps {
    className?: string;
}

export default function MobileHeader({className}: MobileHeaderProps) {
    // sticky 요소가 동시에 flex container가 되면, flex 레이아웃 계산과 sticky positioning 계산이 서로 간섭
    // sticky position만 담당하는 요소와 가로 배치 div 요소 분리
    // 버튼 테두리는 variant="outline"
    // 버튼 아이콘 이미지 크기는 size-*로 동작
    return (
        <header className={cn("sticky top-0 bg-white", className)}>
            <div className="flex items-center p-2">
                <div>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <Menu className="size-5"/>
                        <span className="sr-only">메뉴</span>
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <Link href="/">
                        <Image
                            src="/images/pincoin_www_98x30.png"
                            alt="핀코인 로고"
                            width={98}
                            height={30}
                            priority
                        />
                    </Link>
                </div>
                <div>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <ShoppingCart className="size-5"/>
                        <span className="sr-only">장바구니</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}