import { Button } from '../components/ui/Button';

export default function TraCuuPage() {
    return (
        <div className="bg-surface">
            <section className="section-pad-lg section-divider">
                <div className="container-page space-y-6">
                    <div className="space-y-3">
                        <p className="text-headline-sm text-secondary">
                            Tra cứu điều luật
                        </p>
                        <p className="text-body-lg text-on-surface">
                            Trang tra cứu đang được hoàn thiện để tích hợp bộ lọc văn bản,
                            mức xử phạt và trạng thái hiệu lực.
                        </p>
                        <p className="text-body-sm text-muted">
                            Bạn có thể tạm thời sử dụng trang Chatbot để tra cứu nhanh theo
                            câu hỏi cụ thể.
                        </p>
                    </div>
                    <Button variant="accent" size="lg">
                        Mở chatbot tra cứu
                    </Button>
                </div>
            </section>
        </div>
    );
}

