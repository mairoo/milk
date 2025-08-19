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
            <Section title="오늘의 상품권" className="">
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
        </div>
    )
}