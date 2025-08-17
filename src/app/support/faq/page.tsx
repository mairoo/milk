import {Metadata} from 'next';

export const metadata: Metadata = {
    title: '자주 묻는 질문',
    description: '핀코인 서비스에 대한 자주 묻는 질문과 답변입니다.',
};

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "서비스는 어떻게 이용하나요?",
        answer: "회원가입 후 로그인하여 서비스를 이용하실 수 있습니다."
    },
    {
        question: "결제는 어떻게 하나요?",
        answer: "신용카드, 계좌이체 등 다양한 결제 수단을 지원합니다."
    },
    {
        question: "환불 정책은 어떻게 되나요?",
        answer: "이용약관에 따라 환불이 가능합니다. 자세한 내용은 고객센터로 문의해주세요."
    }
];

export default function FAQPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">자주 묻는 질문</h1>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-semibold mb-2 text-green-700">
                            Q. {faq.question}
                        </h3>
                        <p className="text-gray-700">A. {faq.answer}</p>
                    </div>
                ))}
            </div>
        </>
    );
}