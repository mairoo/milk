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

    // PG 상품인지 확인하여 적절한 가격 사용
    const displaySellingPrice = product.pg ? product.pgSellingPrice : product.sellingPrice;

    return (
        <Card
            className="w-full max-w-sm cursor-pointer"
            onClick={() => onClick?.(product.id)}
        >

            {/* 이미지 섹션 */}
            <CardHeader className="p-0">
                <div className="aspect-square w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={imageUrl}
                        alt={finalImageAlt}
                        width={400}  // 명시적 크기 지정으로 position 문제 해결
                        height={400}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}  // 카드 이미지는 lazy loading
                    />
                </div>
            </CardHeader>

            {/* 상품 정보 섹션 */}
            <CardContent className="p-4 space-y-2">
                <h3 className="font-medium text-gray-900 line-clamp-2 leading-5">
                    {product.name}
                </h3>

                {product.subtitle && (
                    <p className="text-sm text-gray-600 line-clamp-1">
                        {product.subtitle}
                    </p>
                )}

                <div className="space-y-1">
                    {product.listPrice > displaySellingPrice && (
                        <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.listPrice)}
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">
                            {formatPrice(displaySellingPrice)}
                        </p>
                        {discountRate > 0 && (
                            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                                {discountRate.toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>

            {/* 액션 버튼 섹션 */}
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full flex items-center gap-2"
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