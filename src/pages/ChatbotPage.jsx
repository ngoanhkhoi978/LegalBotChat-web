import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '../components/ui/Badge';
import { useAutosizeTextarea } from '../hooks/useAutosizeTextarea';
import { useChatHistory, formatTime } from '../hooks/useChatHistory';
import { streamChat, checkApiStatus } from '../api/chat';

/* ─── Constants ─── */

const WELCOME_SUGGESTIONS = [
    'Vượt đèn đỏ xe máy phạt bao nhiêu?',
    'Nồng độ cồn mức 1 bị xử lý thế nào?',
    'Không có gương chiếu hậu có bị phạt không?',
    'Thủ tục đổi GPLX như thế nào?',
];

const QUICK_SUGGESTIONS = [
    'Vượt đèn đỏ phạt bao nhiêu?',
    'Nồng độ cồn xe máy?',
    'Không mang GPLX xử phạt thế nào?',
    'Xe không chính chủ có bị phạt không?',
];

/* ─── Page ─── */

export default function ChatbotPage() {
    const {
        conversations,
        activeId,
        activeConversation,
        messages,
        createConversation,
        switchConversation,
        deleteConversation,
        addMessage,
        updateMessage,
        clearHistory,
        uid,
    } = useChatHistory();

    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMsgId, setStreamingMsgId] = useState(null);
    const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [confirmClearId, setConfirmClearId] = useState(null);

    const listRef = useRef(null);
    const textareaRef = useRef(null);
    const abortRef = useRef(null);

    useAutosizeTextarea(textareaRef, input);

    /* Probe API status on mount */
    useEffect(() => {
        checkApiStatus().then(setApiStatus);
    }, []);

    /* Auto-scroll to bottom when messages update or streaming */
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
        if (isNearBottom || isStreaming) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, isStreaming]);

    /* ── Send handler ── */
    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || isStreaming) return;

        /* Ensure we have an active conversation */
        let convId = activeId;
        if (!convId) {
            convId = createConversation();
        }

        /* Add user message */
        addMessage(convId, {
            id: uid(),
            role: 'user',
            content: text,
            timestamp: Date.now(),
        });
        setInput('');
        setIsStreaming(true);

        /* Add empty placeholder for the assistant response */
        const asstId = uid();
        addMessage(convId, {
            id: asstId,
            role: 'assistant',
            content: '',
            timestamp: Date.now(),
        });
        setStreamingMsgId(asstId);

        /* Abort controller so navigation cancels the stream */
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        try {
            let accumulated = '';
            for await (const chunk of streamChat(text, ctrl.signal)) {
                accumulated += chunk;
                updateMessage(convId, asstId, { content: accumulated });
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                /* User navigated away or sent a new message — keep partial content */
                return;
            }
            updateMessage(convId, asstId, {
                content: err.message,
                error: true,
            });
            /* If API was thought online but failed, recheck */
            if (apiStatus === 'online') setApiStatus('offline');
        } finally {
            setIsStreaming(false);
            setStreamingMsgId(null);
            abortRef.current = null;
        }
    }, [input, isStreaming, activeId, createConversation, addMessage, updateMessage, uid, apiStatus]);

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

    const handleNewConversation = () => {
        /* Abort any active stream */
        if (abortRef.current) {
            abortRef.current.abort();
        }
        createConversation();
    };

    const handleSwitchConversation = (id) => {
        if (isStreaming) {
            abortRef.current?.abort();
        }
        switchConversation(id);
    };

    /* ── Filtered sidebar list ── */
    const filteredConversations = sidebarSearch.trim()
        ? conversations.filter((c) =>
              c.title.toLowerCase().includes(sidebarSearch.toLowerCase())
          )
        : conversations;

    const isEmpty = messages.length === 0;
    const currentMessage = messages[messages.length - 1];
    const isLastMsgStreaming =
        isStreaming && currentMessage?.id === streamingMsgId;

    return (
        <div className="flex h-full overflow-hidden bg-surface">

            {/* ── Sidebar ── */}
            <aside
                className="hidden md:flex flex-col overflow-hidden border-r border-default bg-surface-variant"
                style={{ width: '240px', minWidth: '240px' }}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-default px-4 py-3">
                    <span className="text-[13px] font-bold text-on-surface">Hội thoại</span>
                    <button
                        type="button"
                        onClick={handleNewConversation}
                        className="rounded-[3px] border border-default bg-surface px-2 py-1 text-[11px] font-semibold text-on-surface transition hover:bg-surface-variant"
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
                        className="w-full rounded-[3px] border border-default bg-surface px-2.5 py-1.5 text-[12px] text-on-surface placeholder:text-muted focus:outline-none focus:[box-shadow:0_0_0_2px_var(--ds-info)]"
                    />
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto px-2 pb-2">
                    {filteredConversations.length === 0 ? (
                        <p className="px-3 py-4 text-[12px] text-muted text-center">
                            {sidebarSearch ? 'Không tìm thấy hội thoại.' : 'Chưa có hội thoại nào.'}
                        </p>
                    ) : (
                        <div className="space-y-0.5">
                            {filteredConversations.map((conv) => (
                                <ConversationItem
                                    key={conv.id}
                                    conv={conv}
                                    isActive={conv.id === activeId}
                                    onSelect={() => handleSwitchConversation(conv.id)}
                                    onDelete={() =>
                                        confirmClearId === conv.id
                                            ? (deleteConversation(conv.id), setConfirmClearId(null))
                                            : setConfirmClearId(conv.id)
                                    }
                                    confirmDelete={confirmClearId === conv.id}
                                />
                            ))}
                        </div>
                    )}

                    {/* Clear all */}
                    {conversations.length > 0 && (
                        <div className="mt-3 border-t border-default pt-3 px-1">
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Xóa toàn bộ lịch sử hội thoại?')) {
                                        clearHistory();
                                    }
                                }}
                                className="w-full rounded-[3px] px-3 py-1.5 text-[11px] text-error transition hover:bg-error-soft text-left"
                            >
                                Xóa toàn bộ lịch sử
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Main chat ── */}
            <section className="flex flex-1 flex-col overflow-hidden">
                {/* Chat header */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-default bg-surface px-5 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                            AI
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-on-surface leading-tight">
                                Trợ lý pháp luật giao thông
                            </p>
                            <p className="text-[11px] text-muted leading-tight">
                                GraphRAG · Luật giao thông Việt Nam
                            </p>
                        </div>
                    </div>
                    <ApiStatusBadge status={apiStatus} />
                </div>

                {/* Message list */}
                <div
                    ref={listRef}
                    className="flex-1 overflow-y-auto bg-surface"
                    style={{ overscrollBehavior: 'contain' }}
                >
                    {isEmpty ? (
                        <WelcomeState onSuggest={handleSuggest} apiStatus={apiStatus} />
                    ) : (
                        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-5 pt-6 pb-3">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <ChatMessage
                                        key={msg.id}
                                        message={msg}
                                        isStreaming={isStreaming && msg.id === streamingMsgId}
                                    />
                                ))}
                            </AnimatePresence>
                            <div aria-live="polite" className="sr-only">
                                {isStreaming ? 'Trợ lý đang phản hồi...' : ''}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-default bg-surface px-4 pb-3 pt-2.5">
                    <div className="mx-auto w-full max-w-2xl">
                        {/* Quick suggestions — shown only when conversation active + input empty */}
                        {!isEmpty && !input && !isStreaming && (
                            <div className="mb-2 flex flex-wrap gap-x-1 gap-y-1">
                                {QUICK_SUGGESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => handleSuggest(q)}
                                        className="rounded-[3px] border border-default bg-transparent px-2 py-0.5 text-[11px] text-muted transition hover:border-secondary-variant hover:text-on-surface"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input row */}
                        <div className="flex items-end gap-2 rounded-[4px] border border-default bg-surface transition focus-within:[box-shadow:0_0_0_2px_var(--ds-info)] px-3 py-2">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập câu hỏi về luật giao thông..."
                                disabled={isStreaming}
                                className="flex-1 resize-none bg-transparent text-[15px] text-on-surface placeholder:text-muted focus:outline-none leading-relaxed min-h-[24px] max-h-[140px] py-0.5 disabled:opacity-60"
                                style={{ fontFamily: 'var(--ds-font-base)' }}
                            />
                            {isStreaming ? (
                                <button
                                    type="button"
                                    onClick={() => abortRef.current?.abort()}
                                    className="shrink-0 rounded-[3px] border border-default bg-surface-variant px-3.5 py-1.5 text-[12px] font-semibold text-on-surface transition hover:bg-error-soft hover:text-error"
                                >
                                    Dừng
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="shrink-0 rounded-[3px] bg-accent px-3.5 py-1.5 text-[12px] font-semibold text-on-surface transition hover:brightness-95 disabled:opacity-35 disabled:cursor-not-allowed"
                                >
                                    Gửi
                                </button>
                            )}
                        </div>
                        <p className="mt-1 text-[10px] text-muted">
                            Enter để gửi · Shift + Enter để xuống dòng
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ─── ConversationItem ─── */

function ConversationItem({ conv, isActive, onSelect, onDelete, confirmDelete }) {
    return (
        <div
            className={`group flex w-full items-center gap-1.5 rounded-[4px] px-3 py-2 transition ${
                isActive
                    ? 'bg-surface border border-default'
                    : 'border border-transparent hover:bg-surface hover:border-default'
            }`}
        >
            <button
                type="button"
                onClick={onSelect}
                className="flex flex-1 min-w-0 items-center justify-between gap-2 text-left"
            >
                <span className="min-w-0 flex-1 truncate text-[13px] text-on-surface">
                    {conv.title}
                </span>
                <span className="shrink-0 text-[11px] text-muted">
                    {formatTime(conv.updatedAt)}
                </span>
            </button>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className={`shrink-0 rounded-[3px] px-1 py-0.5 text-[10px] transition ${
                    confirmDelete
                        ? 'bg-error-soft text-error'
                        : 'text-muted opacity-0 group-hover:opacity-100 hover:text-error'
                }`}
                title={confirmDelete ? 'Nhấn lần nữa để xác nhận' : 'Xóa hội thoại'}
            >
                {confirmDelete ? 'Xóa?' : '×'}
            </button>
        </div>
    );
}

/* ─── API status badge ─── */

function ApiStatusBadge({ status }) {
    if (status === 'checking') {
        return (
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse" />
                Đang kiểm tra
            </span>
        );
    }
    if (status === 'online') {
        return (
            <span className="flex items-center gap-1.5 text-[11px] text-success font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Trực tuyến
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1.5 text-[11px] text-error font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-error" />
            Ngoại tuyến
        </span>
    );
}

/* ─── Welcome state ─── */

function WelcomeState({ onSuggest, apiStatus }) {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary font-bold text-[13px]">
                AI
            </div>
            <div className="space-y-1.5">
                <h2 className="text-[20px] font-bold text-on-surface leading-tight">
                    Trợ lý pháp luật giao thông
                </h2>
                <p className="text-[14px] text-muted max-w-sm leading-relaxed">
                    Hỏi về quy định, mức xử phạt và căn cứ pháp lý giao thông Việt Nam.
                </p>
                {apiStatus === 'offline' && (
                    <p className="text-[12px] text-error mt-1">
                        ⚠ Máy chủ AI chưa kết nối được. Câu trả lời sẽ không khả dụng.
                    </p>
                )}
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                {WELCOME_SUGGESTIONS.map((q) => (
                    <button
                        key={q}
                        type="button"
                        onClick={() => onSuggest(q)}
                        className="rounded-[4px] border border-default bg-surface px-3.5 py-2 text-[13px] text-on-surface shadow-(--ds-elevation-sm) transition hover:border-secondary-variant hover:shadow-(--ds-elevation-md)"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─── Chat message ─── */

function ChatMessage({ message, isStreaming }) {
    const isUser = message.role === 'user';

    if (isUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16 }}
                className="flex justify-end"
            >
                <div className="max-w-[68%] rounded-[10px] rounded-br-[3px] bg-accent-soft px-4 py-2.5 text-[15px] text-on-surface leading-relaxed">
                    {message.content}
                </div>
            </motion.div>
        );
    }

    /* Assistant — show typing indicator if content is empty during stream */
    if (!message.content && isStreaming) {
        return <TypingIndicator />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className="flex gap-2.5"
        >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary mt-0.5">
                AI
            </div>

            <div className="flex-1 min-w-0 space-y-2.5">
                {/* Error state */}
                {message.error ? (
                    <div className="rounded-[4px] border border-[rgba(179,38,30,0.3)] bg-error-soft px-3 py-2.5">
                        <p className="text-[13px] text-error leading-relaxed">{message.content}</p>
                    </div>
                ) : (
                    <div className={`chat-prose${isStreaming ? ' stream-active' : ''}`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => <p>{children}</p>,
                                strong: ({ children }) => <strong>{children}</strong>,
                                ul: ({ children }) => <ul>{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                                li: ({ children }) => <li>{children}</li>,
                                code: ({ children }) => <code>{children}</code>,
                                h3: ({ children }) => <h3 className="text-[14px] font-bold text-on-surface mt-3 mb-1">{children}</h3>,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                        {isStreaming && (
                            <span className="stream-cursor" aria-hidden="true" />
                        )}
                    </div>
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
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/70 text-[9px] font-bold text-on-primary mt-1">
                AI
            </div>
            <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-1">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
                </div>
                <div className="space-y-1.5">
                    <div className="skeleton h-2.5 w-48" />
                    <div className="skeleton h-2.5 w-72" />
                    <div className="skeleton h-2.5 w-60" />
                </div>
            </div>
        </motion.div>
    );
}
