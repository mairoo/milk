import {Metadata} from 'next';
import {decode} from "@/global/lib/url";

interface ProductPageProps {
    params: Promise<{
        id: string;
        code: string;
    }>;
}

export async function generateMetadata({params}: ProductPageProps): Promise<Metadata> {
    const {id, code} = await params;

    return {
        title: `상품 ${id} - ${code} | 핀코인`,
        description: `상품 ID: ${id}, 상품 코드: ${code}`,
    };
}

export default async function ProductPage({params}: ProductPageProps) {
    const {id, code} = await params;
    const decodedCode = decode(code);

    return (
        <div className="px-2 md:px-0 py-2">
            <h1 className="text-3xl font-bold mb-6">{decodedCode}</h1>
            <p>상품 ID: {id}</p>
            <p>상품 코드: {decodedCode}</p>
        </div>
    );
}