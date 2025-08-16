import {Metadata} from 'next';

export const metadata: Metadata = {
    title: '고객센터',
    description: '핀코인에 문의사항이 있으시면 연락주세요.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">고객센터</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 연락처 정보 */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">연락처 정보</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="font-medium">이메일:</span>
                            <span className="ml-2">help@pincoin.co.kr</span>
                        </div>
                        <div>
                            <span className="font-medium">주소:</span>
                            <span className="ml-2">서울특별시 서초구 서초대로29길 22, 303호</span>
                        </div>
                        <div>
                            <span className="font-medium">사업자등록번호:</span>
                            <span className="ml-2">163-81-01158</span>
                        </div>
                    </div>
                </div>

                {/* 문의 폼 */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">문의 폼</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                이름
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                이메일
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-1">
                                문의내용
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                        >
                            문의하기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}