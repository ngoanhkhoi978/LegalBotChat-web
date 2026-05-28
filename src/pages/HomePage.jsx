import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const quickAccessItems = [
    {
        icon: '₫',
        title: 'Mức phạt giao thông',
        description: 'Tra cứu nhanh mức xử phạt theo hành vi',
        color: 'var(--ds-primary)',
    },
    {
        icon: '🍺',
        title: 'Nồng độ cồn',
        description: 'Mức phạt và biện pháp xử lý theo nồng độ',
        color: 'var(--ds-secondary)',
    },
    {
        icon: '📋',
        title: 'Giấy tờ xe',
        description: 'Bằng lái, đăng ký, bảo hiểm bắt buộc',
        color: 'var(--ds-info)',
    },
    {
        icon: '🛵',
        title: 'Luật xe máy',
        description: 'Quy tắc và các mức xử phạt xe máy',
        color: 'var(--ds-secondary)',
    },
    {
        icon: '🚗',
        title: 'Luật ô tô',
        description: 'Quy tắc và các mức xử phạt ô tô',
        color: 'var(--ds-info)',
    },
    {
        icon: '🚦',
        title: 'Biển báo giao thông',
        description: 'Nhận diện ý nghĩa và quy định biển báo',
        color: 'var(--ds-accent-warm)',
    },
    {
        icon: '⚠️',
        title: 'Tai nạn giao thông',
        description: 'Xử lý hiện trường và trách nhiệm pháp lý',
        color: 'var(--ds-error)',
    },
    {
        icon: '🪪',
        title: 'Quy định GPLX',
        description: 'Hạng bằng, thời hạn, thủ tục cấp đổi',
        color: 'var(--ds-success)',
    },
];

const legalUpdates = [
    {
        title: 'Nghị định 123/2025/NĐ-CP về xử phạt giao thông đường bộ',
        effectiveDate: '11/02/2026',
        status: 'Còn hiệu lực',
        variant: 'success',
    },
    {
        title: 'Thông tư 22/2025/TT-BGTVT về phân hạng giấy phép lái xe',
        effectiveDate: '01/04/2026',
        status: 'Sắp có hiệu lực',
        variant: 'warning',
    },
    {
        title: 'Luật Trật tự an toàn giao thông đường bộ 2024',
        effectiveDate: '01/01/2025',
        status: 'Thay thế',
        variant: 'info',
    },
    {
        title: 'Nghị định 100/2019/NĐ-CP',
        effectiveDate: '01/07/2024',
        status: 'Hết hiệu lực',
        variant: 'error',
    },
];

const statistics = [
    { label: 'Văn bản pháp luật', value: '1.284' },
    { label: 'Điều khoản', value: '6.920' },
    { label: 'Câu hỏi đã xử lý', value: '148.500+' },
    { label: 'Chủ đề giao thông', value: '312' },
];

const faqs = [
    {
        question: 'Vượt đèn đỏ phạt bao nhiêu tiền?',
        answer:
            'Mức phạt phụ thuộc vào loại phương tiện và tình tiết vi phạm. Hệ thống sẽ trích dẫn điều luật cụ thể theo từng trường hợp — nhập câu hỏi để xem chi tiết.',
    },
    {
        question: 'Xe máy không có gương chiếu hậu bị phạt không?',
        answer:
            'Có. Người điều khiển xe máy bắt buộc phải có gương chiếu hậu bên trái theo quy định của Luật Giao thông đường bộ.',
    },
    {
        question: 'Nồng độ cồn mức nào bị tạm giữ phương tiện?',
        answer:
            'Tùy theo mức vi phạm từ 0,25 mg/l khí thở trở lên có thể bị tạm giữ phương tiện. Hệ thống sẽ cung cấp chi tiết mức phạt và biện pháp bổ sung tương ứng.',
    },
    {
        question: 'Quên bằng lái xử phạt thế nào?',
        answer:
            'Không mang GPLX và không có GPLX là hai lỗi khác nhau với mức phạt khác nhau. Nhập câu hỏi vào hệ thống để xem chi tiết từng tình huống.',
    },
];

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function HomePage() {
    return (
        <div className="bg-surface">
            {/* ── Hero ── */}
            <section className="section-divider bg-surface">
                <div className="container-page section-pad-lg">
                    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        {/* Left */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            transition={{ duration: 0.3 }}
                            className="space-y-7"
                        >
                            <Badge variant="neutral" className="w-fit">
                                Cổng thông tin AI · Pháp luật giao thông
                            </Badge>

                            <div className="space-y-4">
                                <h1 className="text-display-lg text-on-surface leading-tight">
                                    Hệ thống hỏi đáp luật giao thông Việt Nam
                                </h1>
                                <p className="text-body-lg text-muted max-w-xl leading-relaxed">
                                    Tra cứu quy định, mức xử phạt và căn cứ pháp lý chính xác — được trích dẫn từ văn bản hiệu lực mới nhất.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button variant="accent" size="lg" asChild>
                                    <Link to="/chatbot">Bắt đầu hỏi đáp</Link>
                                </Button>
                                <Button variant="secondary" size="lg" asChild>
                                    <Link to="/tra-cuu">Tra cứu điều luật</Link>
                                </Button>
                            </div>

                            {/* Stat chips */}
                            <div className="flex flex-wrap gap-3 pt-1">
                                {statistics.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex items-baseline gap-1.5 rounded-[4px] border border-default bg-surface-variant px-3 py-1.5"
                                    >
                                        <span className="text-[17px] font-bold text-secondary leading-none">
                                            {stat.value}
                                        </span>
                                        <span className="text-caption text-muted">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — chat preview card */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="relative"
                        >
                            <div className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-accent-soft blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-6 right-4 h-32 w-32 rounded-full bg-secondary-variant-soft blur-3xl pointer-events-none" />
                            <ChatPreviewCard />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Truy cập nhanh ── */}
            <section className="section-divider bg-surface-variant">
                <div className="container-page section-pad space-y-7">
                    <SectionHeader
                        label="DANH MỤC"
                        title="Truy cập nhanh"
                        description="Các nhóm nội dung được tra cứu nhiều nhất"
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {quickAccessItems.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                transition={{ duration: 0.22, delay: i * 0.04 }}
                            >
                                <QuickAccessCard item={item} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Cập nhật pháp luật ── */}
            <section className="section-divider bg-surface">
                <div className="container-page section-pad space-y-7">
                    <SectionHeader
                        label="VĂN BẢN"
                        title="Cập nhật pháp luật"
                        description="Nghị định, thông tư và văn bản sắp có hiệu lực"
                    />
                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                        <div className="space-y-3">
                            {legalUpdates.map((update) => (
                                <UpdateRow key={update.title} update={update} />
                            ))}
                        </div>
                        <div className="panel-muted flex flex-col gap-3 p-5">
                            <p className="text-title-md text-secondary">Thông báo quan trọng</p>
                            <p className="text-body-sm text-muted flex-1">
                                Từ 01/04/2026, việc đổi GPLX yêu cầu hoàn tất hồ sơ trực tuyến trước khi đến nộp bản gốc. Kiểm tra điều kiện và thủ tục bên dưới.
                            </p>
                            <Button variant="secondary" className="w-full">
                                Xem hướng dẫn
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="section-divider bg-surface-variant">
                <div className="container-page section-pad space-y-7">
                    <SectionHeader
                        label="HỎI ĐÁP"
                        title="Câu hỏi thường gặp"
                        description="Giải đáp nhanh các tình huống phổ biến"
                    />
                    <div className="panel-surface divide-y divide-[var(--ds-border)]">
                        {faqs.map((faq) => (
                            <FaqItem key={faq.question} faq={faq} />
                        ))}
                    </div>
                    <div className="flex justify-center pt-2">
                        <Button variant="accent" size="md" asChild>
                            <Link to="/chatbot">Đặt câu hỏi cho trợ lý AI →</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Disclaimer ── */}
            <div className="section-divider bg-surface">
                <div className="container-page py-5 text-body-sm text-muted">
                    Kết quả tra cứu mang tính tham khảo, trích dẫn từ văn bản pháp luật công khai. Cập nhật đến ngày 28/05/2026.
                </div>
            </div>
        </div>
    );
}

/* ─── Sub-components ─── */

function SectionHeader({ label, title, description }) {
    return (
        <div className="space-y-1">
            <p className="text-label text-secondary">{label}</p>
            <p className="text-headline-sm text-on-surface">{title}</p>
            <p className="text-body-md text-muted">{description}</p>
        </div>
    );
}

function QuickAccessCard({ item }) {
    return (
        <button
            type="button"
            className="card-base hover-card w-full p-5 text-left transition flex flex-col gap-3 group"
        >
            <span
                className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[18px]"
                style={{ background: `color-mix(in srgb, ${item.color} 12%, transparent)` }}
                aria-hidden="true"
            >
                {item.icon}
            </span>
            <div className="flex-1 space-y-1">
                <p className="text-title-md text-on-surface group-hover:text-secondary transition-colors">
                    {item.title}
                </p>
                <p className="text-body-sm text-muted leading-snug">{item.description}</p>
            </div>
            <span className="text-body-sm text-info flex items-center gap-1">
                Tra cứu <span aria-hidden>→</span>
            </span>
        </button>
    );
}

function UpdateRow({ update }) {
    return (
        <div className="card-base hover-panel flex flex-wrap items-center justify-between gap-3 p-4 transition">
            <div className="flex-1 space-y-0.5 min-w-0">
                <p className="text-body-md font-semibold text-on-surface leading-snug">
                    {update.title}
                </p>
                <p className="text-caption text-muted">
                    Ngày hiệu lực: {update.effectiveDate}
                </p>
            </div>
            <Badge variant={update.variant}>{update.status}</Badge>
        </div>
    );
}

function FaqItem({ faq }) {
    return (
        <details className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-title-md text-on-surface">{faq.question}</span>
                <span className="shrink-0 text-muted text-[16px] transition-transform group-open:rotate-45">
                    +
                </span>
            </summary>
            <p className="mt-3 text-body-md text-muted leading-relaxed">{faq.answer}</p>
        </details>
    );
}

function ChatPreviewCard() {
    return (
        <div className="panel-surface relative overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-default px-5 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                    AI
                </div>
                <div className="flex-1">
                    <p className="text-body-sm font-semibold text-on-surface">Trợ lý pháp luật</p>
                </div>
                <Badge variant="success">Trực tuyến</Badge>
            </div>

            {/* Messages preview */}
            <div className="space-y-4 px-5 py-4">
                {/* User message */}
                <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-[12px] rounded-br-[3px] bg-accent-soft px-4 py-2.5">
                        <p className="text-body-sm text-on-surface leading-snug">
                            Vượt đèn đỏ xe máy phạt bao nhiêu?
                        </p>
                    </div>
                </div>

                {/* Assistant message */}
                <div className="flex gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary mt-0.5">
                        AI
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="text-body-sm text-on-surface leading-relaxed">
                            Theo <strong className="text-secondary">Nghị định 123/2025</strong>, xe máy vượt đèn đỏ bị phạt{' '}
                            <strong className="text-on-surface">800.000đ – 1.200.000đ</strong>, có thể bị trừ điểm GPLX.
                        </p>
                        <div className="flex items-center gap-1.5 rounded-[4px] border border-default bg-surface-variant px-3 py-1.5">
                            <span className="text-caption text-muted">Căn cứ:</span>
                            <span className="text-caption font-semibold text-info">Điều 7, Khoản 4</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input preview */}
            <div className="border-t border-default px-5 py-3">
                <div className="flex items-center gap-2 rounded-[4px] border border-default bg-surface-variant px-3 py-2">
                    <p className="flex-1 text-body-sm text-muted">
                        Nhập câu hỏi về luật giao thông...
                    </p>
                    <div className="h-7 rounded-[4px] bg-accent px-3 flex items-center">
                        <span className="text-[12px] font-semibold text-on-surface">Gửi</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-default px-5 py-2.5">
                <span className="text-caption text-muted">Văn bản cập nhật đến 28/05/2026</span>
                <span className="text-caption text-success font-medium">● Độ tin cậy cao</span>
            </div>
        </div>
    );
}
