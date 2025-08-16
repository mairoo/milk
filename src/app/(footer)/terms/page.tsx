import {Metadata} from 'next';

export const metadata: Metadata = {
    title: '이용약관',
    description: '핀코인 서비스 이용약관입니다.',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">이용약관</h1>

            <div className="prose max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
                    <p>
                        이 약관은 주식회사 핀코인(이하 &quot;회사&quot;)이 제공하는 서비스의 이용조건 및 절차,
                        회사와 이용자간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">제2조 (정의)</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>&quot;서비스&quot;라 함은 회사가 제공하는 모든 서비스를 의미합니다.</li>
                        <li>&quot;이용자&quot;라 함은 회사의 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                        <li>&quot;회원&quot;이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할
                            수 있는 자를
                            말합니다.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
                    <p>
                        이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
                        회사는 합리적인 사유가 발생할 경우에는 이 약관을 변경할 수 있으며, 약관이 변경되는 경우
                        변경된 약관의 내용과 시행일을 정하여, 그 시행일로부터 최소 7일 이전부터 서비스 내 공지사항을
                        통해 예고합니다.
                    </p>
                </section>

                <div className="mt-8 text-sm text-gray-600">
                    <p>시행일: 2024년 1월 1일</p>
                </div>
            </div>
        </div>
    );
}