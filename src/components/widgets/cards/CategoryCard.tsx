import {useCallback} from 'react'
import {Card, CardContent, CardHeader} from '@/components/ui/card'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

interface CategoryCardProps {
    name: string
    href: string
    imageUrl: string
    discountRate?: number
    imageAlt?: string
}

export default function CategoryCard({
                                         name,
                                         href,
                                         imageUrl,
                                         discountRate,
                                         imageAlt
                                     }: CategoryCardProps) {
    const router = useRouter()

    const handleCardClick = useCallback(() => {
        router.push(href)
    }, [router, href])

    return (
        <Card className="w-full max-w-sm cursor-pointer p-0 gap-0 shadow-none hover:shadow-xl transition-shadow"
              onClick={handleCardClick}>
            {/* 이미지 섹션 */}
            <CardHeader className="p-0">
                <div className="aspect-[156/100] w-full relative overflow-hidden rounded-t-xl">
                    <Image
                        src={imageUrl}
                        alt={imageAlt || name}
                        fill
                        className="object-cover"
                    />
                </div>
            </CardHeader>

            {/* 카테고리 정보 섹션 */}
            <CardContent className="py-2 space-y-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 leading-5 text-center">
                    {name}
                </h3>

                {discountRate && discountRate > 0 && (
                    <div className="flex justify-center">
                        <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                            최대 {discountRate}% 할인
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}