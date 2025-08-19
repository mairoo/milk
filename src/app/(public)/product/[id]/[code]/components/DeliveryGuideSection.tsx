import {Card, CardContent} from '@/components/ui/card'

export default function DeliveryGuideSection() {
    return (
        <>
            {/* 상품권 발송 안내 */}
            <Card className="shadow-none">
                <CardContent>
                    <h2 className="font-bold mb-4">상품권 발송 안내</h2>
                    <div className="space-y-2 text-gray-700">
                        <p>• 상품권 확인은 사이트에서 확인합니다.</p>
                        <p>• 메뉴에서 모든 본인인증 절차를 완료하신 경우 최대 10분 이내로 상품권을 확인할 수 있습니다.</p>
                        <p>• 모든 본인인증 절차를 완료하시고도 10분 이내로 상품권을 확인하지 못한 경우 주문번호, 입금은행, 입금시각을 남겨주세요.</p>
                        <p>• 한국 시각 밤 11시 이후 10만원 이상 주문은 한국 시각 오전 10시 이후에 순차적으로 발송될 수 있습니다.</p>
                    </div>
                </CardContent>
            </Card>

            {/* 교환 및 환불 안내 */}
            <Card className="shadow-none">
                <CardContent>
                    <h2 className="font-bold mb-4">교환 및 환불 안내</h2>
                    <div className="space-y-2 text-gray-700">
                        <p>• 상품권을 받기 전에 고객님의 교환 또는 환불 요청이 있은 날로부터 은행 영업일 기준으로 3~4일 이내에 처리됩니다.</p>
                        <p>• 상품권을 받으신 경우 해당 상품권을 사용하지 않은 경우에 한하여 3일 이내에만 교환 또는 환불 요청 가능합니다.</p>
                        <p>• 교환 또는 환불을 원하실 경우 요청 후 은행 영업일 기준으로 5~7일 이내에 처리됩니다.</p>
                        <p>• 환불 수수료 500원 차감한 금액이 환불 입금처리됩니다.</p>
                    </div>
                </CardContent>
            </Card>

            {/* 상품권 구매 한도 안내 */}
            <Card className="shadow-none">
                <CardContent>
                    <h2 className="font-bold mb-4">상품권 구매 한도 안내</h2>
                    <div className="space-y-2 text-gray-700">
                        <p className="font-bold">
                            • 컬처랜드상품권, 도서문화상품권, 구글기프트카드를 포함하고 일일 액면가 기준 누계 10만원 이상 첫 구매 시 반드시 서류본인인증을 해야 합니다.
                        </p>
                        <p className="font-bold">
                            • 계좌이체로 일일 액면가 기준 누계 30만원 이상 첫 구매 시 반드시 서류본인인증을 해야 합니다.
                        </p>
                        <p className="font-bold">
                            • 페이팔로 최근30일 이내 액면가 기준 누계 15만원 이상 구매 시 반드시 한국 신분증으로 서류본인인증을 해야 합니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}