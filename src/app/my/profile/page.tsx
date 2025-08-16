import {Metadata} from 'next';

export const metadata: Metadata = {
    title: '마이페이지',
    description: '나의 정보를 확인하고 수정합니다.',
};

export default function SignUpPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">마이페이지</h1>
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
        </div>
    );
}