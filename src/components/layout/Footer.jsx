export function Footer() {
    return (
        <footer className="bg-primary text-on-primary">
            <div className="container-page section-pad">
                <div className="footer-grid">
                    <div className="space-y-3">
                        <p className="text-headline-sm">
                            Hệ thống hỏi đáp luật giao thông Việt Nam
                        </p>
                        <p className="text-body-sm text-on-primary-muted">
                            Nền tảng tra cứu và hỗ trợ người dân tiếp cận thông
                            tin pháp luật giao thông một cách rõ ràng, đáng tin
                            cậy.
                        </p>
                        <div className="text-body-sm">
                            <p>Cơ quan chủ quản: Bộ Giao thông vận tải</p>
                            <p>Phiên bản dữ liệu: 28/05/2026</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-title-md font-semibold">
                            Liên kết nhanh
                        </p>
                        <ul className="text-body-sm space-y-2">
                            <li>
                                <a
                                    className="text-on-primary hover:underline"
                                    href="/chatbot"
                                >
                                    Bắt đầu hỏi đáp
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-on-primary hover:underline"
                                    href="/tra-cuu"
                                >
                                    Tra cứu điều luật
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-on-primary hover:underline"
                                    href="/cap-nhat"
                                >
                                    Cập nhật pháp luật
                                </a>
                            </li>
                            <li>
                                <a
                                    className="text-on-primary hover:underline"
                                    href="/"
                                >
                                    Hướng dẫn sử dụng
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <p className="text-title-md font-semibold">
                            Chủ đề phổ biến
                        </p>
                        <ul className="text-body-sm space-y-2">
                            <li>Vượt đèn đỏ</li>
                            <li>Nồng độ cồn</li>
                            <li>Giấy tờ xe</li>
                            <li>Dừng đỗ sai quy định</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <p className="text-title-md font-semibold">
                            Hỗ trợ & cập nhật
                        </p>
                        <ul className="text-body-sm space-y-2">
                            <li>Hotline: 1800 1096</li>
                            <li>Email: hotro@luatgiaothong.gov.vn</li>
                            <li>Bản tin pháp luật: cập nhật hàng tuần</li>
                            <li>Cảnh báo văn bản hết hiệu lực</li>
                        </ul>
                    </div>
                </div>
                <div className="border-on-primary/20 text-caption text-on-primary-muted mt-8 border-t pt-4">
                    © 2026 Cổng thông tin AI pháp luật giao thông Việt Nam. Tất
                    cả quyền được bảo lưu.
                </div>
            </div>
        </footer>
    );
}
