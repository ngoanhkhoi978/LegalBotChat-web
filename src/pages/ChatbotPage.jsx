import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '../components/ui/Badge';
import { useAutosizeTextarea } from '../hooks/useAutosizeTextarea';

/* ─── Static data ─── */

const conversations = [
    { id: 'c1', title: 'Vượt đèn đỏ xe máy', time: '10:32', active: true },
    {
        id: 'c2',
        title: 'Nồng độ cồn khi lái xe',
        time: 'Hôm qua',
        active: false,
    },
    {
        id: 'c3',
        title: 'GPLX hết hạn xử lý thế nào',
        time: '2 ngày trước',
        active: false,
    },
];

const recentQuestions = [
    'Không mang GPLX bị phạt thế nào?',
    'Xe không chính chủ có bị phạt không?',
    'Chở quá số người quy định phạt bao nhiêu?',
];

const suggestedQuestions = [
    'Vượt đèn đỏ phạt bao nhiêu?',
    'Nồng độ cồn xe máy mức nào bị phạt?',
    'Không mang GPLX bị xử phạt thế nào?',
    'Xe không chính chủ có bị phạt không?',
];

const welcomeSuggestions = [
    'Vượt đèn đỏ xe máy phạt bao nhiêu?',
    'Nồng độ cồn mức 1 bị xử lý thế nào?',
    'Không có gương chiếu hậu có bị phạt không?',
    'Thủ tục đổi GPLX như thế nào?',
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
                {
                    title: 'Nghị định 123/2025/NĐ-CP',
                    relevance: '92%',
                    status: 'Còn hiệu lực',
                },
                {
                    title: 'Luật Trật tự an toàn giao thông đường bộ 2024',
                    relevance: '81%',
                    status: 'Thay thế',
                },
                {
                    title: 'Nghị định 100/2019/NĐ-CP',
                    relevance: '52%',
                    status: 'Hết hiệu lực',
                },
            ],
            timeline: [
                {
                    label: '01/01/2025',
                    title: 'Luật Trật tự giao thông 2024 có hiệu lực',
                },
                {
                    label: '11/02/2026',
                    title: 'Nghị định 123/2025/NĐ-CP có hiệu lực',
                },
                {
                    label: '01/04/2026',
                    title: 'Thông tư 22/2025/TT-BGTVT có hiệu lực',
                },
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
                    content:
                        'Hệ thống đang xử lý câu hỏi của bạn và sẽ trả lời kèm trích dẫn điều luật tương ứng.',
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
        /* h-full fills the <main> provided by AppShell (chatbot layout) */
        <div className="bg-surface flex h-full overflow-hidden">
            {/* ── Sidebar ── */}
            <aside
                className="border-default bg-surface-variant hidden flex-col overflow-hidden border-r md:flex"
                style={{ width: '240px', minWidth: '240px' }}
            >
                {/* Header */}
                <div className="border-default flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
                    <span className="text-on-surface text-[13px] font-bold">
                        Hội thoại
                    </span>
                    <button
                        type="button"
                        className="border-default bg-surface text-on-surface hover:bg-surface-variant rounded-[3px] border px-2 py-1 text-[11px] font-semibold transition"
                    >
                        + Mới
                    </button>
                </div>

                {/* Search */}
                <div className="shrink-0 px-3 pt-2.5 pb-2">
                    <input
                        type="search"
                        value={sidebarSearch}
                        onChange={(e) => setSidebarSearch(e.target.value)}
                        placeholder="Tìm hội thoại..."
                        className="border-default bg-surface text-on-surface placeholder:text-muted w-full rounded-[3px] border px-2.5 py-1.5 text-[13px] focus:[box-shadow:0_0_0_2px_var(--ds-info)] focus:outline-none"
                    />
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto px-2 pb-2">
                    <div className="space-y-0.5">
                        {conversations.map((chat) => (
                            <button
                                key={chat.id}
                                type="button"
                                className={`flex w-full items-center justify-between gap-2 rounded-[4px] px-3 py-2 text-left transition ${
                                    chat.active
                                        ? 'bg-surface border-default border'
                                        : 'hover:bg-surface hover:border-default border border-transparent'
                                }`}
                            >
                                <span className="text-on-surface min-w-0 flex-1 truncate text-[13px]">
                                    {chat.title}
                                </span>
                                <span className="text-muted shrink-0 text-[11px]">
                                    {chat.time}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Recent questions */}
                    <div className="border-default mt-3 border-t pt-3">
                        <p className="text-muted px-3 pb-1.5 text-[10px] font-semibold tracking-widest uppercase">
                            Gần đây
                        </p>
                        <div className="space-y-0.5">
                            {recentQuestions.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => handleSuggest(q)}
                                    className="hover:bg-surface flex w-full items-start gap-2 rounded-[4px] px-3 py-1.5 text-left transition"
                                >
                                    <span className="text-muted mt-0.5 shrink-0 text-[10px]">
                                        ↩
                                    </span>
                                    <span className="text-muted line-clamp-2 text-[12px] leading-snug">
                                        {q}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main chat ── */}
            <section className="flex flex-1 flex-col overflow-hidden">
                {/* Chat header */}
                <div className="border-default bg-surface flex shrink-0 items-center justify-between gap-3 border-b px-5 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-primary text-on-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                            AI
                        </div>
                        <div>
                            <p className="text-on-surface text-[13px] leading-tight font-bold">
                                Trợ lý pháp luật giao thông
                            </p>
                            <p className="text-muted text-[11px] leading-tight">
                                Phản hồi kèm trích dẫn và trạng thái hiệu lực
                            </p>
                        </div>
                    </div>
                    <span className="text-success flex items-center gap-1.5 text-[11px] font-semibold">
                        <span className="bg-success h-1.5 w-1.5 rounded-full" />
                        Đang hoạt động
                    </span>
                </div>

                {/* Message list — only this scrolls */}
                <div
                    ref={listRef}
                    className="bg-surface flex-1 overflow-y-auto"
                    style={{ overscrollBehavior: 'contain' }}
                >
                    {isEmpty ? (
                        <WelcomeState onSuggest={handleSuggest} />
                    ) : (
                        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 pt-6 pb-3">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <ChatMessage key={msg.id} message={msg} />
                                ))}
                            </AnimatePresence>
                            {isTyping && <TypingIndicator />}
                            <div aria-live="polite" className="sr-only">
                                {isTyping ? 'Đang chuẩn bị phản hồi...' : ''}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input — always visible, never scrolls away */}
                <div className="border-default bg-surface shrink-0 border-t px-4 pt-2.5 pb-3">
                    <div className="mx-auto w-full max-w-5xl">
                        {/* Suggestions — show when messages exist and input is empty */}
                        {!isEmpty && !input && (
                            <div className="mb-2 flex flex-wrap gap-x-1 gap-y-1">
                                {suggestedQuestions.map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => handleSuggest(q)}
                                        className="border-default text-muted hover:border-secondary-variant hover:text-on-surface rounded-[3px] border bg-transparent px-2 py-0.5 text-[11px] transition"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input row */}
                        <div className="border-default bg-surface flex items-end gap-2 rounded-[4px] border px-3 py-2 transition focus-within:[box-shadow:0_0_0_2px_var(--ds-info)]">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập câu hỏi về luật giao thông..."
                                className="text-on-surface placeholder:text-muted max-h-[140px] min-h-[24px] flex-1 resize-none bg-transparent py-0.5 text-[15px] leading-relaxed focus:outline-none"
                                style={{ fontFamily: 'var(--ds-font-base)' }}
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="bg-accent text-on-surface shrink-0 rounded-[3px] px-3.5 py-1.5 text-[12px] font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                                Gửi
                            </button>
                        </div>
                        <p className="text-muted mt-1 text-[10px]">
                            Enter để gửi · Shift + Enter để xuống dòng
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ─── Welcome state ─── */

function WelcomeState({ onSuggest }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-10 text-center">
            <div className="bg-primary text-on-primary flex h-12 w-12 items-center justify-center rounded-full text-[13px] font-bold">
                AI
            </div>
            <div className="space-y-1.5">
                <h2 className="text-on-surface text-[20px] leading-tight font-bold">
                    Trợ lý pháp luật giao thông
                </h2>
                <p className="text-muted max-w-sm text-[14px] leading-relaxed">
                    Đặt câu hỏi để tra cứu quy định, mức xử phạt và căn cứ pháp
                    lý giao thông Việt Nam.
                </p>
            </div>
            <div className="flex max-w-sm flex-wrap justify-center gap-2">
                {welcomeSuggestions.map((q) => (
                    <button
                        key={q}
                        type="button"
                        onClick={() => onSuggest(q)}
                        className="border-default bg-surface text-on-surface hover:border-secondary-variant rounded-[4px] border px-3.5 py-2 text-[13px] shadow-(--ds-elevation-sm) transition hover:shadow-(--ds-elevation-md)"
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16 }}
                className="flex justify-end"
            >
                <div className="bg-accent-soft text-on-surface max-w-[68%] rounded-[10px] rounded-br-[3px] px-4 py-2.5 text-[15px] leading-relaxed">
                    {message.content}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className="flex gap-2.5"
        >
            {/* AI avatar */}
            <div className="bg-primary text-on-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold">
                AI
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 space-y-2.5">
                <div className="chat-prose">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ children }) => <p>{children}</p>,
                            strong: ({ children }) => (
                                <strong>{children}</strong>
                            ),
                            ul: ({ children }) => <ul>{children}</ul>,
                            li: ({ children }) => <li>{children}</li>,
                            code: ({ children }) => <code>{children}</code>,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                {(!!message.citations?.length ||
                    !!message.references?.length) && (
                    <CitationsPanel
                        citations={message.citations}
                        references={message.references}
                    />
                )}

                {(!!message.retrieval?.documents?.length ||
                    !!message.retrieval?.timeline?.length ||
                    !!message.retrieval?.entities?.length) && (
                    <RetrievalPanel retrieval={message.retrieval} />
                )}
            </div>
        </motion.div>
    );
}

/* ─── Typing indicator ─── */

function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex gap-2.5"
        >
            <div className="bg-primary/70 text-on-primary mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold">
                AI
            </div>
            <div className="flex flex-col gap-2 pt-1">
                {/* Animated dots */}
                <div className="flex items-center gap-1">
                    <span className="typing-dot bg-muted h-1.5 w-1.5 rounded-full" />
                    <span className="typing-dot bg-muted h-1.5 w-1.5 rounded-full" />
                    <span className="typing-dot bg-muted h-1.5 w-1.5 rounded-full" />
                </div>
                {/* Shimmer lines */}
                <div className="space-y-1.5">
                    <div className="skeleton h-2.5 w-48" />
                    <div className="skeleton h-2.5 w-72" />
                    <div className="skeleton h-2.5 w-60" />
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Citations panel ─── */

function CitationsPanel({ citations, references }) {
    return (
        <details className="group">
            <summary className="text-secondary flex cursor-pointer list-none items-center gap-2 text-[12px] font-semibold select-none">
                <span className="rounded-[2px] border border-current px-1 py-0 text-[10px] leading-4 font-bold">
                    §
                </span>
                Trích dẫn & nguồn tham khảo
                <span className="text-muted ml-auto text-[10px] font-normal group-open:hidden">
                    xem
                </span>
                <span className="text-muted ml-auto hidden text-[10px] font-normal group-open:inline">
                    ẩn
                </span>
            </summary>
            <div className="border-default bg-surface-variant mt-1.5 space-y-2.5 rounded-[4px] border px-3 py-2.5">
                {!!citations?.length && (
                    <div className="space-y-1">
                        <p className="text-muted text-[10px] font-semibold tracking-wider uppercase">
                            Điều luật trích dẫn
                        </p>
                        <ul className="space-y-1">
                            {citations.map((c) => (
                                <li
                                    key={c.clause}
                                    className="flex items-baseline gap-1.5 text-[13px]"
                                >
                                    <span className="text-secondary shrink-0 font-semibold">
                                        {c.clause}
                                    </span>
                                    <span className="text-muted">—</span>
                                    <span className="text-on-surface">
                                        {c.law}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {!!references?.length && (
                    <div className="space-y-1">
                        <p className="text-muted text-[10px] font-semibold tracking-wider uppercase">
                            Nguồn tham khảo
                        </p>
                        <ul className="space-y-0.5">
                            {references.map((r) => (
                                <li key={r.title}>
                                    <a
                                        href={r.url}
                                        className="text-info text-[13px] hover:underline"
                                    >
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
            <summary className="text-muted hover:text-on-surface flex cursor-pointer list-none items-center gap-2 text-[12px] font-semibold transition-colors select-none">
                <span className="text-[10px] font-bold">▤</span>
                Chi tiết truy xuất văn bản
                <span className="ml-auto text-[10px] font-normal group-open:hidden">
                    xem
                </span>
                <span className="ml-auto hidden text-[10px] font-normal group-open:inline">
                    ẩn
                </span>
            </summary>
            <div className="border-default bg-surface-variant mt-1.5 space-y-3 rounded-[4px] border px-3 py-2.5">
                {!!retrieval.documents?.length && (
                    <div className="space-y-1.5">
                        <p className="text-muted text-[10px] font-semibold tracking-wider uppercase">
                            Văn bản liên quan
                        </p>
                        <div className="space-y-1">
                            {retrieval.documents.map((doc) => (
                                <div
                                    key={doc.title}
                                    className="border-default bg-surface flex items-center gap-2 rounded-[3px] border px-2.5 py-1.5"
                                >
                                    <span className="text-on-surface flex-1 truncate text-[12px]">
                                        {doc.title}
                                    </span>
                                    <span className="text-muted shrink-0 text-[11px]">
                                        {doc.relevance}
                                    </span>
                                    <Badge
                                        variant={
                                            docStatusVariant[doc.status] ||
                                            'neutral'
                                        }
                                    >
                                        {doc.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!!retrieval.timeline?.length && (
                    <div className="space-y-1.5">
                        <p className="text-muted text-[10px] font-semibold tracking-wider uppercase">
                            Dòng thời gian
                        </p>
                        <ol className="border-default space-y-2 border-l-2 pl-3">
                            {retrieval.timeline.map((item) => (
                                <li key={item.label} className="relative">
                                    <span className="bg-secondary absolute top-1.5 -left-[17px] h-1.5 w-1.5 rounded-full" />
                                    <p className="text-muted text-[10px]">
                                        {item.label}
                                    </p>
                                    <p className="text-on-surface text-[12px]">
                                        {item.title}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {!!retrieval.entities?.length && (
                    <div className="space-y-1.5">
                        <p className="text-muted text-[10px] font-semibold tracking-wider uppercase">
                            Thực thể
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {retrieval.entities.map((e) => (
                                <span
                                    key={e}
                                    className="border-default bg-surface text-on-surface rounded-[3px] border px-2 py-0.5 text-[11px]"
                                >
                                    {e}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </details>
    );
}
