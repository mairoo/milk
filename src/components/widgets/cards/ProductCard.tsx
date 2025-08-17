import React from 'react';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ShoppingCart} from 'lucide-react';
import Image from 'next/image';
import {ProductResponse, ProductStock} from "@/features/inventory/public/response";

interface ProductCardProps {
    product: ProductResponse;
    imageUrl: string;
    imageAlt?: string;
    onAddToCart?: (productId: number) => void;
    onClick?: (productId: number) => void;
    isLoading?: boolean;
}

export default function ProductCard({
                                        product,
                                        imageUrl,
                                        imageAlt,
                                        onAddToCart,
                                        onClick,
                                        isLoading = false
                                    }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return `₩${price.toLocaleString()}`;
    };

    const calculateDiscountRate = () => {
        if (product.listPrice === 0) return 0;
        return ((product.listPrice - product.sellingPrice) / product.listPrice) * 100;
    };

    const discountRate = calculateDiscountRate();
    const finalImageAlt = imageAlt || product.name;

    // 재고 상태 확인
    const isSoldOut = product.stock === ProductStock.SOLD_OUT;

    return (
        <Card
            className="w-full max-w-sm cursor-pointer p-0 gap-2"
            onClick={() => onClick?.(product.id)}
        >

            {/* 이미지 섹션 */}
            <CardHeader className="p-0">
                <div className="aspect-[156/100] w-full relative overflow-hidden rounded-t-xl">
                    <Image
                        src={imageUrl}
                        alt={finalImageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 16vw"
                        priority={false}
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
                    className="w-full flex items-center gap-2 bg-emerald-100 text-green-950 hover:bg-emerald-600 hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart?.(product.id);
                    }}
                    disabled={isLoading || isSoldOut}
                    variant={isSoldOut ? "secondary" : "default"}
                >
                    <ShoppingCart className="h-4 w-4"/>
                    {isSoldOut ? '품절' : isLoading ? '추가 중...' : '장바구니 담기'}
                </Button>
            </CardFooter>
        </Card>
    );
}