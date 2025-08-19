import {Dot, HelpCircle, LogOut, LucideIcon, Package, User} from "lucide-react";

export const desktopMenuItems = [
    {
        title: "구글/넥슨/퍼니카드",
        items: [
            {name: "구글기프트카드", href: "/category/구글기프트카드"},
            {name: "넥슨카드", href: "/category/넥슨카드"},
            {name: "퍼니카드", href: "/category/퍼니카드"},
        ]
    },
    {
        title: "스마트/도서문화/컬쳐랜드",
        items: [
            {name: "컬쳐랜드상품권", href: "/category/컬쳐랜드상품권"},
            {name: "도서문화상품권", href: "/category/도서문화상품권"},
            {name: "스마트문화상품권", href: "/category/스마트문화상품권"},
        ]
    },
    {
        title: "에그머니",
        items: [
            {name: "에그머니", href: "/category/에그머니"},
        ]
    },
    {
        title: "틴캐시",
        items: [
            {name: "틴캐시", href: "/category/틴캐시"},
        ]
    },
    {
        title: "선불쿠폰",
        items: [
            {name: "스타벅스", href: "/category/스타벅스"},
            {name: "숲 별풍선", href: "/category/아프리카tv"},
            {name: "플레이스테이션", href: "/category/플레이스테이션-기프트카드-교환권"},
            {name: "와우캐시", href: "/category/와우캐시"},
            {name: "N코인", href: "/category/엔코인"},
            {name: "요기요", href: "/category/요기요"},
            {name: "한게임상품권", href: "/category/한게임-한코인"},
            {name: "매니아선불쿠폰", href: "/category/매니아선불쿠폰"},
            {name: "아이템베이선불쿠폰", href: "/category/아이템베이선불쿠폰"},
        ]
    }
];

interface MobileMenuItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const mobileMenuItems: MobileMenuItem[] = [
    {icon: User, label: "마이페이지", href: "/my/profile"},
    {icon: LogOut, label: "로그아웃", href: "/auth/logout"},
    {icon: Package, label: "주문/발송", href: "/my/order"},
    {icon: HelpCircle, label: "고객센터", href: "/support"},
];

export const mobileMenuItems1: MobileMenuItem[] = [
    {icon: Dot, label: "넥슨카드", href: "/category/넥슨카드"},
    {icon: Dot, label: "컬쳐랜드상품권", href: "/category/컬쳐랜드상품권"},
    {icon: Dot, label: "도서문화상품권", href: "/category/도서문화상품권"},
    {icon: Dot, label: "구글기프트카드", href: "/category/구글기프트카드"},
    {icon: Dot, label: "에그머니", href: "/category/에그머니"},
    {icon: Dot, label: "틴캐시", href: "/category/틴캐시"},
    {icon: Dot, label: "스마트문화상품권", href: "/category/스마트문화상품권"},
    {icon: Dot, label: "아프리카별풍선", href: "/category/아프리카tv"},
    {icon: Dot, label: "플레이스테이션", href: "/category/플레이스테이션-기프트카드-교환권"},
    {icon: Dot, label: "스타벅스", href: "/category/스타벅스"},
    {icon: Dot, label: "와우캐시", href: "/category/와우캐시"},
    {icon: Dot, label: "퍼니카드", href: "/category/퍼니카드"},
    {icon: Dot, label: "N코인", href: "/category/엔코인"},
    {icon: Dot, label: "요기요", href: "/category/요기요"},
    {icon: Dot, label: "메니아선불쿠폰", href: "/category/매니아선불쿠폰"},
    {icon: Dot, label: "아이템베이선불쿠폰", href: "/category/아이템베이선불쿠폰"},
];