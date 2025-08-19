import {useCallback, useMemo} from 'react'
import {ShoppingCart} from 'lucide-react'
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {ProductResponse, ProductStock} from '@/features/inventory/public/response'
import Image from 'next/image';

interface ProductCardProps {
    product: ProductResponse
    imageUrl: string
    imageAlt?: string
    onAddToCart?: (productId: number) => void
    onClick?: (productId: number) => void
    isLoading?: boolean
}

export default function ProductCard({
                                        product,
                                        imageUrl,
                                        imageAlt,
                                        onAddToCart,
                                        onClick,
                                        isLoading = false
                                    }: ProductCardProps) {
    const discountRate = useMemo(() => {
        if (product.listPrice === 0) return 0
        return ((product.listPrice - product.sellingPrice) / product.listPrice) * 100
    }, [product.listPrice, product.sellingPrice])

    const isSoldOut = product.stock === ProductStock.SOLD_OUT

    const buttonText = useMemo(() => {
        if (isSoldOut) return '품절'
        if (isLoading) return '추가 중...'
        return '장바구니 담기'
    }, [isSoldOut, isLoading])

    const handleCardClick = useCallback(() => {
        onClick?.(product.id)
    }, [onClick, product.id])

    const handleAddToCart = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        onAddToCart?.(product.id)
    }, [onAddToCart, product.id])

    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`
    }

    return (
        <Card className="w-full max-w-sm cursor-pointer p-0 gap-2 shadow-none" onClick={handleCardClick}>
            {/* 이미지 섹션 */}
            <CardHeader className="p-0">
                <div className="aspect-[156/100] w-full relative overflow-hidden rounded-t-xl">
                    <Image
                        src={imageUrl}
                        alt={imageAlt || product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </CardHeader>

            {/* 상품 정보 섹션 */}
            <CardContent className="px-4 space-y-2">
                <h3 className="font-medium text-gray-900 line-clamp-2 leading-5">
                    {product.name}
                </h3>

                {product.subtitle && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                        {product.subtitle}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                        {formatPrice(product.sellingPrice)}
                    </p>
                    {discountRate > 0 && (
                        <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                            {discountRate.toFixed(1)}%
                        </span>
                    )}
                </div>
            </CardContent>

            {/* 액션 버튼 섹션 */}
            <CardFooter className="p-2">
                <Button
                    className="w-full flex items-center gap-2 bg-emerald-100 text-green-950 hover:bg-emerald-600 hover:text-white cursor-pointer"
                    onClick={handleAddToCart}
                    disabled={isLoading || isSoldOut}
                    variant={isSoldOut ? "secondary" : "default"}
                >
                    <ShoppingCart className="h-4 w-4"/>
                    {buttonText}
                </Button>
            </CardFooter>
        </Card>
    )
}