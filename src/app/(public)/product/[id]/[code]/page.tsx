import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";

interface ProductPageProps {
    params: {
        id: string;
        code: string;
    };
}

// 상품 코드를 디코딩하는 함수
function decode(code: string): string {
    try {
        return decodeURIComponent(code);
    } catch {
        return code;
    }
}

// 상품 정보를 가져오는 함수 (실제로는 API 호출)
async function getProductData(id: string, code: string) {
    const decodedCode = decode(code);

    // 실제로는 API 호출
    const mockProduct = {
        id: id,
        code: decodedCode,
        name: decodedCode,
        description: `${decodedCode}에 대한 상세 설명입니다.`,
        price: 200000,
        originalPrice: 250000,
        discount: 20,
        images: [
            '/images/product-1.jpg',
            '/images/product-2.jpg'
        ],
        category: '구글기프트카드',
        inStock: true,
        deliveryInfo: '즉시 발송',
        features: [
            '디지털 상품으로 즉시 전송',
            '유효기간: 구매일로부터 1년',
            '환불 불가 상품'
        ]
    };

    // productId가 숫자가 아니거나 존재하지 않는 경우
    if (isNaN(Number(id))) {
        return null;
    }

    return mockProduct;
}

export async function generateMetadata({params}: ProductPageProps): Promise<Metadata> {
    const productData = await getProductData(params.id, params.code);

    if (!productData) {
        return {
            title: '상품을 찾을 수 없습니다 | 핀코인',
        };
    }

    return {
        title: `${productData.name} | 핀코인`,
        description: productData.description,
        openGraph: {
            title: productData.name,
            description: productData.description,
            images: productData.images,
        },
    };
}

export default async function ProductPage({params}: ProductPageProps) {
    const productData = await getProductData(params.id, params.code);

    if (!productData) {
        notFound();
    }
    decode(params.code);
    return (
        <div className="container mx-auto px-4 py-8">
            {/* 브레드크럼 */}
            <nav className="mb-6 text-sm text-gray-600">
                <ol className="flex items-center space-x-2">
                    <li><Link href="/" className="hover:text-green-600">홈</Link></li>
                    <li>/</li>
                    <li><Link href="/category" className="hover:text-green-600">카테고리</Link></li>
                    <li>/</li>
                    <li><a href={`/category/${encodeURIComponent(productData.category)}`}
                           className="hover:text-green-600">
                        {productData.category}
                    </a></li>
                    <li>/</li>
                    <li className="text-gray-900">{productData.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 상품 이미지 */}
                <div>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
                        {productData.images[0] ? (
                            <Image
                                src={productData.images[0]}
                                alt={productData.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                이미지 없음
                            </div>
                        )}
                    </div>

                    {/* 썸네일 이미지들 */}
                    {productData.images.length > 1 && (
                        <div className="flex space-x-2">
                            {productData.images.slice(1).map((image, index) => (
                                <div key={index} className="w-20 h-20 bg-gray-100 rounded-lg relative overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={`${productData.name} ${index + 2}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 상품 정보 */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>

                    {/* 가격 정보 */}
                    <div className="mb-6">
                        {productData.discount > 0 && (
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-red-500 font-bold text-lg">{productData.discount}% 할인</span>
                                <span className="text-gray-400 line-through">
                  {productData.originalPrice.toLocaleString()}원
                </span>
                            </div>
                        )}
                        <div className="text-3xl font-bold text-green-600">
                            {productData.price.toLocaleString()}원
                        </div>
                    </div>

                    {/* 배송 정보 */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">배송:</span>
                            <span className="text-green-600 font-bold">{productData.deliveryInfo}</span>
                        </div>
                    </div>

                    {/* 상품 특징 */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">상품 특징</h3>
                        <ul className="space-y-2">
                            {productData.features.map((feature, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 구매 버튼 */}
                    <div className="space-y-3">
                        <button
                            disabled={!productData.inStock}
                            className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {productData.inStock ? '구매하기' : '품절'}
                        </button>

                        <button
                            className="w-full border border-green-600 text-green-600 py-4 px-6 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                            장바구니 담기
                        </button>
                    </div>
                </div>
            </div>

            {/* 상품 상세 설명 */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">상품 상세 정보</h2>
                <div className="prose max-w-none">
                    <p>{productData.description}</p>
                </div>
            </div>
        </div>
    );
}