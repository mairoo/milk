import {Metadata} from 'next';
import {decode} from "@/global/lib/url";

interface CategoryPageProps {
    params: Promise<{
        code: string;
    }>;
}

export async function generateMetadata({params}: CategoryPageProps): Promise<Metadata> {
    const {code} = await params;
    const decodedCode = decode(code);

    return {
        title: `카테고리: ${decodedCode} | 핀코인`,
        description: `${decodedCode} 카테고리 상품 목록`,
    };
}

export default async function CategoryPage({params}: CategoryPageProps) {
    const {code} = await params;
    const decodedCode = decode(code);

    return (
        <div className="px-2 md:px-0 py-2">
            <h1 className="text-3xl font-bold mb-6">카테고리: {decodedCode}</h1>
            <p>현재 카테고리 코드: {decodedCode}</p>
        </div>
    );
}