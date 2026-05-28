import { Button } from '../components/ui/Button';

export default function CapNhatPage() {
    return (
        <div className="bg-surface">
            <section className="section-pad-lg section-divider">
                <div className="container-page space-y-6">
                    <div className="space-y-3">
                        <p className="text-headline-sm text-secondary">
                            Cập nhật pháp luật
                        </p>
                        <p className="text-body-lg text-on-surface">
                            Khu vực cập nhật văn bản pháp luật mới sẽ hiển thị nghị định,
                            thông tư và timeline hiệu lực theo từng lĩnh vực giao thông.
                        </p>
                        <p className="text-body-sm text-muted">
                            Trong khi chờ cập nhật, bạn có thể theo dõi mục “Cập nhật pháp luật
                            mới nhất” trên trang Home.
                        </p>
                    </div>
                    <Button variant="secondary" size="lg">
                        Về trang Home
                    </Button>
                </div>
            </section>
        </div>
    );
}

