'use client'

import {useSession} from 'next-auth/react'
import Section from "@/components/widgets/cards/Section";
import {todayCategoryData} from "@/global/types/categories";
import CategoryCard from "@/components/widgets/cards/CategoryCard";

export default function Home() {
    const {data: session, status} = useSession()
    // 세션 에러가 있는 경우 사용자에게 안내
    if (session?.error) {
        return (
            <div style={{padding: '20px', textAlign: 'center'}}>
                <h1>세션 문제 발생: {session.error}</h1>
                <p>로그인 세션에 문제가 있습니다. 다시 로그인해주세요.</p>
            </div>
        )
    }

    // 로딩 상태
    if (status === 'loading') {
        return (
            <div style={{padding: '20px', textAlign: 'center'}}>
                <h1>Pincoin App</h1>
                <p>세션을 확인하는 중...</p>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-y-6">
            <Section title="오늘의 상품권">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-6">
                    {todayCategoryData.map((category) => (
                        <CategoryCard
                            key={category.name}
                            name={category.name}
                            href={category.href}
                            imageUrl={category.imageUrl}
                            discountRate={category.discountRate}
                        />
                    ))}
                </div>
            </Section>
            <div className="flex flex-col md:flex-row gap-6">
                <Section title="상품권 금융사기 예방 수칙">
                    <ul className="space-y-2 mb-2">
                        <li>다른 사람으로부터 상품권 구매로 일부 또는 전체 금액을 입금 받기로 했습니까?</li>
                        <li>상품권 일부 또는 전체를 <strong className="text-red-600">대리구매</strong> 하여 카카오톡 등 메신저로 다른 사람에게 주기로 했습니까?</li>
                        <li>네이트온/카카오톡 등 메신저에서 지인이 급한 돈이 필요하다고 상품권을 요구했습니까?</li>
                        <li>중고나라 또는 번개장터에서 물품대금을 현금 대신 상품권으로 요구 받았습니까?</li>
                    </ul>
                    <p className="text-red-600">위 질문 중 하나라도 해당하면 사기꾼과 메신저 또는 전화 연락을 끊고 바로 경찰서에 연락하시기 바랍니다.</p>
                </Section>
                <Section>
                    광고
                </Section>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                <Section title="공지사항">
                    -
                </Section>
                <Section title="핀코인 이용후기">
                    -
                </Section>
            </div>
        </div>
    )
}