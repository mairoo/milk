import Image from "next/image";
import {LogOut, MessageCircle, Package, User} from "lucide-react";
import React from "react";
import {NavLink} from "@/components/layout/NavLink";

export default function DesktopHeader() {
    return (
        <header className="sticky top-0">
            <div className="mx-auto container">
                <div className="mx-auto container flex justify-between items-center px-4 sm:px-0 py-2">
                    <div>
                        <Image
                            src="/images/pincoin_www_260x50.png"
                            alt="핀코인 로고"
                            width={360}
                            height={50}
                        />
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
                <div className="mx-auto container flex justify-between items-center px-4 sm:px-0">
                    <div>
                        <span>구글/넥슨/퍼니카드</span>
                        <span>스마트/도서문화/컬쳐랜드</span>
                        <span>에그/해피머니</span>
                        <span>온/틴캐시</span>
                        <span>선불쿠폰</span>
                    </div>
                    <div>
                        검색창
                    </div>
                </div>
            </div>
        </header>
    )
}