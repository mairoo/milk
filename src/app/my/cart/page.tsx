import {Metadata} from 'next';

export const metadata: Metadata = {
    title: '장바구니',
    description: '상품권 장바구니에서 구매 상품 수량을 변경 및 금액 확인 후 결제합니다.',
};

export default function MyCartPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">장바구니</h1>
            <div className="prose max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">서비스 소개</h2>
                    <p>핀코인 서비스에 대한 전반적인 소개 내용입니다.</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">이용 방법</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>회원가입을 진행합니다</li>
                        <li>서비스를 이용합니다</li>
                        <li>문의사항이 있으면 고객센터로 연락주세요</li>
                    </ol>
                </section>
            </div>
        </>
    );
}