import Image from "next/image";
import Link from "next/link";
import {LogOut, MessageCircle, Package, User} from "lucide-react";
import React from "react";

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
                    <div className="space-x-4">
                        <Link
                            href=""
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md  hover:bg-gray-100 hover:text-gray-900 hover:font-bold transition-colors"
                        >
                            <Package className="h-4 w-4"/>
                            주문/발송
                        </Link>

                        <Link
                            href=""
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md  hover:bg-gray-100 hover:text-gray-900 hover:font-bold transition-colors"
                        >
                            <MessageCircle className="h-4 w-4"/>
                            고객센터
                        </Link>

                        <Link
                            href=""
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md  hover:bg-gray-100 hover:text-gray-900 hover:font-bold transition-colors"
                        >
                            <User className="h-4 w-4"/>
                            마이페이지
                        </Link>

                        <Link
                            href=""
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md  hover:bg-gray-100 hover:text-gray-900 hover:font-bold transition-colors"
                        >
                            <LogOut className="h-4 w-4"/>
                            로그아웃
                        </Link>
                    </div>
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