import {Metadata} from 'next';

export const metadata: Metadata = {
    title: '개인정보 처리방침',
    description: '핀코인 개인정보 처리방침입니다.',
};

export default function PrivacyPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">개인정보 처리방침</h1>

            <div className="prose max-w-none">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. 개인정보의 처리목적</h2>
                    <p>
                        주식회사 핀코인(이하 &quot;회사&quot;)은 다음의 목적을 위하여 개인정보를 처리하고 있으며,
                        다음의 목적 이외의 용도로는 이용하지 않습니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                        <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                        <li>서비스 제공 및 계약의 이행, 서비스 제공에 따른 요금정산</li>
                        <li>고충처리 목적으로 개인정보 처리상황 확인, 사실조사를 위한 연락·통지 등</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. 개인정보의 처리 및 보유기간</h2>
                    <p>
                        회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는
                        법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. 처리하는 개인정보의 항목</h2>
                    <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                        <li>필수항목: 이름, 이메일주소, 휴대전화번호</li>
                        <li>선택항목: 생년월일, 성별</li>
                        <li>자동생성정보: 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. 개인정보보호책임자</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">성명:</span> 서종화</p>
                        <p><span className="font-medium">직책:</span> 대표이사</p>
                        <p><span className="font-medium">연락처:</span> help@pincoin.co.kr</p>
                    </div>
                </section>

                <div className="mt-8 text-sm text-gray-600">
                    <p>시행일: 2024년 1월 1일</p>
                </div>
            </div>
        </>
    );
}