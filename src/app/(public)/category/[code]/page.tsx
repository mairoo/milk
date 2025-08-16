import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image?: string;
    inStock: boolean;
}

interface CategoryData {
    name: string;
    description: string;
    products: Product[];
}

interface CategoryPageProps {
    params: {
        code: string;
    };
}

// 카테고리 코드를 디코딩하는 함수
function decode(code: string): string {
    try {
        return decodeURIComponent(code);
    } catch {
        return code;
    }
}

// 카테고리 정보를 가져오는 함수 (실제로는 API 호출)
async function getCategoryData(code: string): Promise<CategoryData | null> {
    const decodedCode = decode(code);

    // 실제로는 API 호출
    const categoryMap: Record<string, CategoryData> = {
        '구글기프트카드': {
            name: '구글 기프트카드',
            description: '구글 플레이 스토어에서 사용할 수 있는 기프트카드',
            products: [
                {
                    id: '1',
                    name: '구글 플레이 기프트카드 10만원',
                    price: 95000,
                    originalPrice: 100000,
                    discount: 5,
                    image: '/images/google-10.jpg',
                    inStock: true
                },
                {
                    id: '2',
                    name: '구글 플레이 기프트카드 20만원',
                    price: 190000,
                    originalPrice: 200000,
                    discount: 5,
                    image: '/images/google-20.jpg',
                    inStock: true
                }
            ]
        },
        // 다른 카테고리들...
    };

    return categoryMap[decodedCode] || null;
}

export async function generateMetadata({params}: CategoryPageProps): Promise<Metadata> {
    const categoryData = await getCategoryData(params.code);

    if (!categoryData) {
        return {
            title: '카테고리를 찾을 수 없습니다 | 핀코인',
        };
    }

    return {
        title: `${categoryData.name} | 핀코인`,
        description: categoryData.description,
    };
}

export default async function CategoryPage({params}: CategoryPageProps) {
    const categoryData = await getCategoryData(params.code);

    if (!categoryData) {
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
                    <li className="text-gray-900">{categoryData.name}</li>
                </ol>
            </nav>

            {/* 카테고리 헤더 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{categoryData.name}</h1>
                <p className="text-gray-600">{categoryData.description}</p>
            </div>

            {/* 상품 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryData.products?.length > 0 ? (
                    categoryData.products.map((product: Product, index: number) => (
                        <div key={product.id || index}
                             className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-square bg-gray-100 relative">
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold mb-2">{product.name}</h3>
                                <div className="space-y-1">
                                    {product.discount && product.originalPrice && (
                                        <div className="flex items-center space-x-2">
                                            <span className="text-red-500 text-sm">{product.discount}% 할인</span>
                                            <span className="text-gray-400 line-through text-sm">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                                        </div>
                                    )}
                                    <p className="text-green-600 font-bold">{product.price.toLocaleString()}원</p>
                                </div>
                                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                      product.inStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                  }`}>
                    {product.inStock ? '판매중' : '품절'}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">해당 카테고리에 상품이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}