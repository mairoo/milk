'use client'

import React from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Menu, ShoppingCart} from "lucide-react";
import {useDrawer} from "@/features/ui/drawer/hooks";

interface MobileHeaderProps {
    className?: string;
}

export default function MobileHeader({className}: MobileHeaderProps) {
    const {openMenuDrawer, openCartDrawer} = useDrawer();

    return (
        <header className={cn(
            "sticky top-0 z-10 bg-green-50 shadow-none sticky-header-stable",
            className,
        )}>
            <div className="flex items-center p-2">
                <div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={openMenuDrawer}
                    >
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
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={openCartDrawer}
                    >
                        <ShoppingCart className="size-5"/>
                        <span className="sr-only">장바구니</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}