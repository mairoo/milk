import Image from "next/image";
import {ChevronDown, LogOut, MessageCircle, Package, User} from "lucide-react";
import React from "react";
import {NavLink} from "@/components/layout/NavLink";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const categoryItems = [
    {
        title: "구글/넥슨/퍼니카드",
        items: [
            {name: "구글기프트카드", href: "/gift-cards/google-play"},
            {name: "넥슨카드", href: "/gift-cards/nexon"},
            {name: "퍼니카드", href: "/gift-cards/funny-card"},
        ]
    },
    {
        title: "스마트/도서문화/컬쳐랜드",
        items: [
            {name: "컬쳐랜드상품권", href: "/gift-cards/cultureland"},
            {name: "도서문화상품권", href: "/gift-cards/book-culture"},
            {name: "스마트문화상품권", href: "/gift-cards/smart"},
        ]
    },
    {
        title: "에그머니",
        items: [
            {name: "에그머니", href: "/gift-cards/egg-money"},
        ]
    },
    {
        title: "틴캐시",
        items: [
            {name: "틴캐시", href: "/gift-cards/teen-cash"},
        ]
    },
    {
        title: "선불쿠폰",
        items: [
            {name: "스타벅스", href: "/coupons/mobile"},
            {name: "숲 별풍선", href: "/coupons/convenience"},
            {name: "플레이스테이션", href: "/coupons/online"},
            {name: "와우캐시", href: "/coupons/online"},
            {name: "N코인", href: "/coupons/online"},
            {name: "요기요", href: "/coupons/online"},
            {name: "한게임상품권", href: "/coupons/online"},
            {name: "매니아선불쿠폰", href: "/coupons/online"},
            {name: "아이템베이선불쿠폰", href: "/coupons/online"},
        ]
    }
];

export default function DesktopHeader() {
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
                        <NavLink href="/" icon={Package}>
                            주문/발송
                        </NavLink>
                        <NavLink href="/" icon={MessageCircle}>
                            고객센터
                        </NavLink>
                        <NavLink href="/" icon={User}>
                            마이페이지
                        </NavLink>
                        <NavLink href="" icon={LogOut}>
                            로그아웃
                        </NavLink>
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