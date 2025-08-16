import {Metadata} from 'next';

interface CategoryPageProps {
    params: Promise<{
        code: string;
    }>;
}

export async function generateMetadata({params}: CategoryPageProps): Promise<Metadata> {
    const {code} = await params;

    return {
        title: `카테고리: ${code} | 핀코인`,
        description: `${code} 카테고리 상품 목록`,
    };
}

export default async function CategoryPage({params}: CategoryPageProps) {
    const {code} = await params;

    return (
        <div className="px-2 md:px-0 py-2">
            <h1 className="text-3xl font-bold mb-6">카테고리: {code}</h1>
            <p>현재 카테고리 코드: {code}</p>
        </div>
    );
}