import { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useAutosizeTextarea } from '../hooks/useAutosizeTextarea';

/* ─── Static data ─── */

const conversations = [
    { id: 'c1', title: 'Vượt đèn đỏ xe máy', time: '10:32', active: true },
    { id: 'c2', title: 'Nồng độ cồn khi lái xe', time: 'Hôm qua', active: false },
    { id: 'c3', title: 'GPLX hết hạn xử lý thế nào', time: '2 ngày trước', active: false },
];

const suggestedQuestions = [
    'Vượt đèn đỏ phạt bao nhiêu?',
    'Nồng độ cồn xe máy mức nào bị phạt?',
    'Không mang GPLX bị xử phạt thế nào?',
    'Xe không chính chủ có bị phạt không?',
];

const messagesSeed = [
    {
        id: 'm1',
        role: 'user',
        content: 'Tôi vượt đèn đỏ ở ngã tư, mức phạt mới nhất là bao nhiêu?',
    },
    {
        id: 'm2',
        role: 'assistant',
        content:
            'Theo **Nghị định 123/2025/NĐ-CP**, hành vi vượt đèn đỏ đối với **xe máy** bị xử phạt **từ 800.000đ đến 1.200.000đ** và có thể bị trừ điểm GPLX nếu tái phạm.\n\n**Căn cứ pháp lý:** Điều 7, Khoản 4 Nghị định 123/2025/NĐ-CP.\n\nBạn có muốn xem chi tiết mức phạt cho ô tô hoặc các tình tiết tăng nặng không?',
        citations: [
            { law: 'Nghị định 123/2025/NĐ-CP', clause: 'Điều 7, Khoản 4' },
        ],
        references: [
            { title: 'Cổng Dịch vụ công Quốc gia — Tra cứu văn bản', url: '#' },
        ],
        retrieval: {
            documents: [
                { title: 'Nghị định 123/2025/NĐ-CP', relevance: '92%', status: 'Còn hiệu lực' },
                { title: 'Luật Trật tự an toàn giao thông đường bộ 2024', relevance: '81%', status: 'Thay thế' },
                { title: 'Nghị định 100/2019/NĐ-CP', relevance: '52%', status: 'Hết hiệu lực' },
            ],
            timeline: [
                { label: '01/01/2025', title: 'Luật Trật tự giao thông 2024 có hiệu lực' },
                { label: '11/02/2026', title: 'Nghị định 123/2025/NĐ-CP có hiệu lực' },
                { label: '01/04/2026', title: 'Thông tư 22/2025/TT-BGTVT có hiệu lực' },
            ],
            entities: ['Vượt đèn đỏ', 'Điều 7', 'Xe máy', 'Trừ điểm GPLX'],
        },
    },
];

const docStatusVariant = {
    'Còn hiệu lực': 'success',
    'Thay thế': 'info',
    'Sắp có hiệu lực': 'warning',
    'Hết hiệu lực': 'error',
};

/* ─── Page ─── */

export default function ChatbotPage() {
    const [messages, setMessages] = useState(messagesSeed);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sidebarSearch, setSidebarSearch] = useState('');
    const listRef = useRef(null);
    const textareaRef = useRef(null);

    useAutosizeTextarea(textareaRef, input);

    /* Scroll to bottom on new messages */
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;
        setMessages((prev) => [
            ...prev,
            { id: `m${prev.length + 1}`, role: 'user', content: text },
        ]);
        setInput('');
        setIsTyping(true);
        window.setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: `m${prev.length + 1}`,
                    role: 'assistant',
                    content: 'Hệ thống đang xử lý câu hỏi của bạn và sẽ trả lời kèm trích dẫn điều luật tương ứng.',
                    citations: [],
                    references: [],
                    retrieval: { documents: [], timeline: [], entities: [] },
                },
            ]);
            setIsTyping(false);
        }, 1400);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggest = (q) => {
        setInput(q);
        textareaRef.current?.focus();
    };

    const isEmpty = messages.length === 0;

    return (
        <div
            className="bg-surface"
            style={{
                height: 'calc(100vh - var(--header-height))',
                display: 'flex',
                overflow: 'hidden',
            }}
        >
            <div
                className="container-page flex flex-1 gap-0 overflow-hidden"
                style={{ padding: '0', maxWidth: '100%' }}
            >
                {/* Sidebar */}
                <aside
                    className="hidden md:flex flex-col gap-0 border-r border-default bg-surface-variant overflow-hidden"
                    style={{ width: '260px', minWidth: '260px' }}
                >
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between gap-2 border-b border-default px-4 py-3">
                        <span className="text-body-sm font-bold text-on-surface">Hội thoại</span>
                        <button
                            type="button"
                            className="rounded-[4px] border border-default bg-surface px-2.5 py-1 text-[12px] font-semibold text-on-surface transition hover:bg-surface-variant"
                        >
                            + Mới
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 pt-3 pb-2">
                        <input
                            type="search"
                            value={sidebarSearch}
                            onChange={(e) => setSidebarSearch(e.target.value)}
                            placeholder="Tìm hội thoại..."
                            className="w-full rounded-[4px] border border-default bg-surface px-3 py-2 text-body-sm text-on-surface placeholder:text-muted focus:outline-none focus:[box-shadow:0_0_0_2px_var(--ds-info)]"
                        />
                    </div>

                    {/* Conversation list */}
                    <div className="flex-1 overflow-y-auto px-2 pb-2">
                        <div className="space-y-0.5">
                            {conversations.map((chat) => (
                                <button
                                    key={chat.id}
                                    type="button"
                                    className={`flex w-full items-center justify-between gap-2 rounded-[6px] px-3 py-2.5 text-left transition ${
                                        chat.active
                                            ? 'bg-surface border border-default shadow-[var(--ds-elevation-sm)]'
                                            : 'hover:bg-surface border border-transparent'
                                    }`}
                                >
                                    <span className="min-w-0 flex-1 truncate text-body-sm text-on-surface">
                                        {chat.title}
                                    </span>
                                    <span className="shrink-0 text-caption text-muted">{chat.time}</span>
                                </button>
                            ))}
                        </div>

                        {/* Recents */}
                        <div className="mt-4 border-t border-default pt-3">
                            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                                Câu hỏi gần đây
                            </p>
                            <div className="space-y-0.5">
                                {[
                                    'Không mang GPLX bị phạt thế nào?',
                                    'Xe không chính chủ có bị phạt không?',
                                    'Chở quá số người quy định phạt bao nhiêu?',
                                ].map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => handleSuggest(q)}
                                        className="flex w-full items-start gap-2 rounded-[6px] px-3 py-2 text-left transition hover:bg-surface"
                                    >
                                        <span className="mt-0.5 shrink-0 text-muted text-[10px]">↩</span>
                                        <span className="text-[13px] text-muted leading-snug line-clamp-2">
                                            {q}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main chat area */}
                <section className="flex flex-1 flex-col overflow-hidden bg-surface">
                    {/* Chat header */}
                    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-default px-5 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
                                AI
                            </div>
                            <div>
                                <p className="text-[14px] font-bold text-on-surface leading-tight">
                                    Trợ lý pháp luật giao thông
                                </p>
                                <p className="text-[12px] text-muted leading-tight">
                                    Phản hồi kèm trích dẫn và trạng thái hiệu lực
                                </p>
                            </div>
                        </div>
                        <Badge variant="success">Đang hoạt động</Badge>
                    </div>

                    {/* Message list */}
                    <div
                        ref={listRef}
                        className="flex-1 overflow-y-auto"
                        style={{ padding: isEmpty ? '0' : '24px 24px 8px' }}
                    >
                        {isEmpty ? (
                            <WelcomeState onSuggest={handleSuggest} />
                        ) : (
                            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <ChatMessage key={msg.id} message={msg} />
                                    ))}
                                </AnimatePresence>
                                {isTyping && <ChatMessageSkeleton />}
                                <div aria-live="polite" className="sr-only">
                                    {isTyping ? 'Đang chuẩn bị phản hồi...' : ''}
                                </div>
                                <div className="h-2" />
                            </div>
                        )}
                    </div>

                    {/* Input area */}
                    <div className="shrink-0 border-t border-default bg-surface px-4 pb-4 pt-3">
                        <div className="mx-auto w-full max-w-3xl">
                            {/* Suggested questions — only when conversation is active but input is empty */}
                            {!isEmpty && !input && (
                                <div className="mb-3 flex flex-wrap gap-1.5">
                                    {suggestedQuestions.map((q) => (
                                        <button
                                            key={q}
                                            type="button"
                                            onClick={() => handleSuggest(q)}
                                            className="rounded-[999px] border border-default bg-surface px-3 py-1 text-[13px] text-on-surface transition hover:border-secondary-variant hover:bg-surface-variant"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input row */}
                            <div className="flex items-end gap-2 rounded-[8px] border border-default bg-surface transition focus-within:[box-shadow:0_0_0_2px_var(--ds-info)] px-3 py-2">
                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Nhập câu hỏi về luật giao thông..."
                                    className="flex-1 resize-none bg-transparent text-body-md text-on-surface placeholder:text-muted focus:outline-none leading-relaxed min-h-[28px] max-h-[160px] py-0.5"
                                    style={{ fontFamily: 'var(--ds-font-base)' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="shrink-0 rounded-[4px] bg-accent px-4 py-1.5 text-[13px] font-semibold text-on-surface transition hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Gửi
                                </button>
                            </div>
                            <p className="mt-1.5 text-[11px] text-muted">
                                Enter để gửi · Shift + Enter để xuống dòng
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

/* ─── Welcome state ─── */

function WelcomeState({ onSuggest }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary font-bold text-[15px]">
                AI
            </div>
            <div className="space-y-2">
                <h2 className="text-headline-sm text-on-surface">Trợ lý pháp luật giao thông</h2>
                <p className="text-body-md text-muted max-w-md">
                    Đặt câu hỏi về quy định, mức xử phạt và căn cứ pháp lý giao thông Việt Nam.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {[
                    'Vượt đèn đỏ xe máy phạt bao nhiêu?',
                    'Nồng độ cồn mức 1 bị xử lý thế nào?',
                    'Không có gương chiếu hậu có bị phạt không?',
                    'Thủ tục đổi GPLX như thế nào?',
                ].map((q) => (
                    <button
                        key={q}
                        type="button"
                        onClick={() => onSuggest(q)}
                        className="rounded-[8px] border border-default bg-surface px-4 py-2.5 text-body-sm text-on-surface shadow-[var(--ds-elevation-sm)] transition hover:border-secondary-variant hover:shadow-[var(--ds-elevation-md)]"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─── Chat message ─── */

function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    if (isUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="flex justify-end"
            >
                <div className="max-w-[68%] rounded-[12px] rounded-br-[3px] bg-accent-soft px-4 py-3 text-body-md text-on-surface leading-relaxed">
                    {message.content}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="flex gap-3"
        >
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary mt-0.5">
                AI
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
                {/* Markdown body */}
                <div className="chat-prose">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }) => <p>{children}</p>,
                            strong: ({ children }) => <strong>{children}</strong>,
                            ul: ({ children }) => <ul>{children}</ul>,
                            li: ({ children }) => <li>{children}</li>,
                            code: ({ children }) => <code>{children}</code>,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                {/* Citations */}
                {(!!message.citations?.length || !!message.references?.length) && (
                    <CitationsPanel
                        citations={message.citations}
                        references={message.references}
                    />
                )}

                {/* Retrieval details */}
                {(!!message.retrieval?.documents?.length ||
                    !!message.retrieval?.timeline?.length ||
                    !!message.retrieval?.entities?.length) && (
                    <RetrievalPanel retrieval={message.retrieval} />
                )}
            </div>
        </motion.div>
    );
}

/* ─── Chat skeleton ─── */

function ChatMessageSkeleton() {
    return (
        <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-variant text-[9px] font-bold text-muted mt-0.5">
                AI
            </div>
            <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
                <Skeleton className="h-3.5 w-4/6" />
            </div>
        </div>
    );
}

/* ─── Citations panel ─── */

function CitationsPanel({ citations, references }) {
    return (
        <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-[13px] font-semibold text-secondary">
                <span className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-secondary text-[10px] font-bold text-secondary">
                    §
                </span>
                Trích dẫn & nguồn tham khảo
                <span className="ml-auto text-[11px] text-muted group-open:hidden">▸</span>
                <span className="ml-auto text-[11px] text-muted hidden group-open:inline">▾</span>
            </summary>
            <div className="mt-2 rounded-[6px] border border-default bg-surface-variant px-4 py-3 space-y-3">
                {!!citations?.length && (
                    <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                            Điều luật trích dẫn
                        </p>
                        <ul className="space-y-1">
                            {citations.map((c) => (
                                <li key={c.clause} className="flex items-baseline gap-2 text-[13px]">
                                    <span className="shrink-0 text-secondary font-semibold">{c.clause}</span>
                                    <span className="text-muted">—</span>
                                    <span className="text-on-surface">{c.law}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {!!references?.length && (
                    <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                            Nguồn tham khảo
                        </p>
                        <ul className="space-y-1">
                            {references.map((r) => (
                                <li key={r.title}>
                                    <a href={r.url} className="text-[13px] text-info hover:underline">
                                        {r.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </details>
    );
}

/* ─── Retrieval panel ─── */

function RetrievalPanel({ retrieval }) {
    return (
        <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-[13px] font-semibold text-muted hover:text-on-surface transition-colors">
                <span className="text-[10px]">🔍</span>
                Chi tiết truy xuất văn bản
                <span className="ml-auto text-[11px] group-open:hidden">▸</span>
                <span className="ml-auto text-[11px] hidden group-open:inline">▾</span>
            </summary>
            <div className="mt-2 rounded-[6px] border border-default bg-surface-variant px-4 py-3 space-y-4">
                {!!retrieval.documents?.length && (
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                            Văn bản liên quan
                        </p>
                        <div className="space-y-1.5">
                            {retrieval.documents.map((doc) => (
                                <div
                                    key={doc.title}
                                    className="flex items-center gap-3 rounded-[4px] border border-default bg-surface px-3 py-2"
                                >
                                    <span className="flex-1 text-[13px] text-on-surface truncate">
                                        {doc.title}
                                    </span>
                                    <span className="text-caption text-muted shrink-0">{doc.relevance}</span>
                                    <Badge variant={docStatusVariant[doc.status] || 'neutral'}>
                                        {doc.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!!retrieval.timeline?.length && (
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                            Dòng thời gian hiệu lực
                        </p>
                        <ol className="space-y-2 border-l-2 border-secondary pl-4">
                            {retrieval.timeline.map((item) => (
                                <li key={item.label} className="relative">
                                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-secondary" />
                                    <p className="text-caption text-muted">{item.label}</p>
                                    <p className="text-[13px] text-on-surface">{item.title}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {!!retrieval.entities?.length && (
                    <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                            Thực thể liên quan
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {retrieval.entities.map((e) => (
                                <Badge key={e} variant="neutral">{e}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </details>
    );
}
