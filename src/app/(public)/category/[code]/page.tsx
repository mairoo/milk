'use client'

import {useEffect, useState} from 'react'
import {decode} from "@/global/lib/url"
import {useGetCategoryBySlugQuery} from '@/features/inventory/public/api'

interface CategoryPageProps {
    params: Promise<{
        code: string;
    }>;
}

export default function CategoryPage({params}: CategoryPageProps) {
    const [slug, setSlug] = useState<string>('')

    useEffect(() => {
        const fetchSlug = async () => {
            const {code} = await params
            const decodedCode = decode(code)
            setSlug(decodedCode)
        }

        void fetchSlug()
    }, [params])

    const {data, isLoading, error, isFetching} = useGetCategoryBySlugQuery(slug, {
        skip: !slug,
    })

    // slug가 아직 준비되지 않았을 때
    if (!slug) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    // 처음 로딩 중 (캐시된 데이터가 없는 상태)
    if (isLoading) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>로딩 중...</p>
            </div>
        )
    }

    // 에러 발생시
    if (error) {
        return (
            <div className="px-2 md:px-0 py-2">
                <p>카테고리를 불러오는데 실패했습니다.</p>
            </div>
        )
    }

    // 캐시된 데이터가 있으면 즉시 표시
    if (data) {
        return (
            <div className="px-2 md:px-0 py-2">
                {isFetching && (
                    <div className="mb-2 text-sm text-gray-500">
                        새로고침 중...
                    </div>
                )}
                <h1 className="text-3xl font-bold mb-6">카테고리: {data.title}</h1>

                <div className="space-y-4">
                    <div>
                        <strong>ID:</strong> {data.id}
                    </div>
                    <div>
                        <strong>생성일:</strong> {data.created}
                    </div>
                    <div>
                        <strong>수정일:</strong> {data.modified}
                    </div>
                    <div>
                        <strong>제목:</strong> {data.title}
                    </div>
                    <div>
                        <strong>슬러그:</strong> {data.slug}
                    </div>
                    <div>
                        <strong>썸네일:</strong> {data.thumbnail}
                    </div>
                    <div>
                        <strong>설명:</strong>
                        <pre className="whitespace-pre-wrap mt-2 p-4 bg-gray-100 rounded">
                            {data.description}
                        </pre>
                    </div>
                    <div>
                        <strong>상세 설명:</strong>
                        <pre className="whitespace-pre-wrap mt-2 p-4 bg-gray-100 rounded">
                            {data.description1}
                        </pre>
                    </div>
                    <div>
                        <strong>레벨:</strong> {data.level}
                    </div>
                    <div>
                        <strong>부모 ID:</strong> {data.parentId}
                    </div>
                    <div>
                        <strong>할인율:</strong> {data.discountRate}%
                    </div>
                    <div>
                        <strong>PG:</strong> {data.pg ? '예' : '아니오'}
                    </div>
                    <div>
                        <strong>PG 할인율:</strong> {data.pgDiscountRate}%
                    </div>
                </div>
            </div>
        )
    }

    // 예상치 못한 상태 (거의 발생하지 않음)
    return (
        <div className="px-2 md:px-0 py-2">
            <p>카테고리 데이터가 없습니다.</p>
        </div>
    )
}