import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="text-sm">
            {/* 상단 섹션 - 링크들과 회사 정보 */}
            <div className="bg-green-50 text-green-950">
                <div className="mx-auto container px-4 sm:px-0 py-6 space-y-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-0.5">
                        <Link href="/guide">
                            이용안내
                        </Link>
                        <Link href="/support/faq">
                            자주 묻는 질문
                        </Link>
                        <Link href="/support/contact">
                            문의하기
                        </Link>
                        <Link href="/terms">
                            이용약관
                        </Link>
                        <Link href="/privacy">
                            개인정보 처리방침
                        </Link>
                    </div>
                    <div className="text-lime-600 font-bold">주식회사 핀코인</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span>대표: 서종화</span>
                        <span>주소: 서울특별시 서초구 서초대로29길 22, 303호</span>
                        <span>사업자등록번호: 163-81-01158</span>
                        <span>통신판매업신고: 2019-서울서초-0835</span>
                        <span>help@pincoin.co.kr</span>
                    </div>
                </div>
            </div>

            {/* 하단 섹션 - 저작권 정보 */}
            <div className="bg-green-950 text-white">
                <div className="mx-auto container px-4 sm:px-0">
                    <div
                        className="flex flex-col sm:flex-row sm:justify-center sm:gap-16 items-center text-center py-4">
                        <span>Copyright © 2012-{new Date().getFullYear()} www.pincoin.co.kr</span>
                        <span>All Rights Reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}