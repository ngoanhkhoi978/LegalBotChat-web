import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    const flushTimerRef = useRef(null);
    const streamStateRef = useRef(null);
    const autoScrollRef = useRef(true);
    const scrollRafRef = useRef(null);

    useAutosizeTextarea(textareaRef, input);

    /* Probe API status on mount */
    useEffect(() => {
        checkApiStatus().then(setApiStatus);
    }, []);

    const scrollToBottom = useCallback(
        (force = false) => {
            const el = listRef.current;
            if (!el) return;
            if (!force && !autoScrollRef.current) return;

            if (scrollRafRef.current) {
                cancelAnimationFrame(scrollRafRef.current);
            }

            scrollRafRef.current = window.requestAnimationFrame(() => {
                el.scrollTop = el.scrollHeight;
            });
        },
        []
    );

    const flushStreamBuffer = useCallback(() => {
        const state = streamStateRef.current;
        if (!state) return '';

        if (state.buffer) {
            state.accumulated += state.buffer;
            state.buffer = '';
        }

        updateMessage(state.convId, state.msgId, {
            content: state.accumulated,
        });

        return state.accumulated;
    }, [updateMessage]);

    const scheduleStreamFlush = useCallback(() => {
        if (flushTimerRef.current || !streamStateRef.current) return;

        flushTimerRef.current = window.setTimeout(() => {
            flushTimerRef.current = null;
            flushStreamBuffer();
            if (streamStateRef.current?.buffer) {
                scheduleStreamFlush();
            } else {
                scrollToBottom();
            }
        }, 70);
    }, [flushStreamBuffer, scrollToBottom]);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;

        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 160;

        if (isNearBottom) {
            autoScrollRef.current = true;
        }

        if (isNearBottom || (isStreaming && autoScrollRef.current)) {
            scrollToBottom();
        }

        return () => {
            if (scrollRafRef.current) {
                cancelAnimationFrame(scrollRafRef.current);
                scrollRafRef.current = null;
            }
        };
    }, [messages, isStreaming, scrollToBottom]);

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
        autoScrollRef.current = true;
        streamStateRef.current = {
            convId,
            msgId: asstId,
            buffer: '',
            accumulated: '',
        };
        scrollToBottom(true);

        /* Abort controller so navigation cancels the stream */
        const ctrl = new AbortController();
        abortRef.current = ctrl;

        try {
            for await (const chunk of streamChat(text, ctrl.signal)) {
                const state = streamStateRef.current;
                if (!state) break;

                state.buffer += chunk;
                scheduleStreamFlush();
            }

            flushStreamBuffer();
        } catch (err) {
            if (err.name === 'AbortError') {
                /* User navigated away or sent a new message — keep partial content */
                return;
            }
            const partial = flushStreamBuffer();
            updateMessage(convId, asstId, {
                content: partial || err.message,
                error: true,
                errorMessage: err.message,
            });
            /* If API was thought online but failed, recheck */
            if (apiStatus === 'online') setApiStatus('offline');
        } finally {
            if (flushTimerRef.current) {
                clearTimeout(flushTimerRef.current);
                flushTimerRef.current = null;
            }
            streamStateRef.current = null;
            setIsStreaming(false);
            setStreamingMsgId(null);
            abortRef.current = null;
            scrollToBottom();
        }
    }, [
        input,
        isStreaming,
        activeId,
        createConversation,
        addMessage,
        updateMessage,
        uid,
        apiStatus,
        flushStreamBuffer,
        scheduleStreamFlush,
        scrollToBottom,
    ]);

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

    const handleListScroll = () => {
        const el = listRef.current;
        if (!el) return;
        autoScrollRef.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    };

    /* ── Filtered sidebar list ── */
    const filteredConversations = sidebarSearch.trim()
        ? conversations.filter((c) =>
              c.title.toLowerCase().includes(sidebarSearch.toLowerCase())
          )
        : conversations;

    const isEmpty = messages.length === 0;

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
                                    onDelete={() => {
                                        if (confirmClearId === conv.id) {
                                            deleteConversation(conv.id);
                                            setConfirmClearId(null);
                                            return;
                                        }
                                        setConfirmClearId(conv.id);
                                    }}
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
                    onScroll={handleListScroll}
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

/* ─── Markdown normalization ───
 * The LLM sometimes outputs "text.### Heading" without a blank line before
 * the heading marker. Standard CommonMark requires headings to be on their
 * own line, so we inject the missing newlines before rendering.
 */
/**
 * normalizeMarkdown — fix LLM formatting inconsistencies before ReactMarkdown.
 *
 * Standardized convention (must match backend system prompt):
 *   - Bullet lists: "- " (hyphen+space), NOT "*"
 *   - Headings: "## Title" with blank line before AND after
 *   - Bold: "**term**"
 *   - Closing: "---" then "**Kết luận:**"
 *
 * This function is a safety net for when the LLM deviates from the convention.
 */
function normalizeMarkdown(raw) {
    if (!raw) return raw;

    // 1. Normalize line endings
    let text = raw.replace(/\r\n?/g, '\n');

    // 2. Ensure ATX headings (##/###) are preceded by a blank line
    text = text.replace(/([^\n])(#{1,6} )/g, '$1\n\n$2');

    // 3. Split heading lines that accidentally include paragraph content.
    //    No length guard — let the strategies decide via their own minimums.
    //
    //    Strategy A: split at natural punctuation mark [.)!?:] with 5+ chars of body after it.
    //    Strategy B: split at direct lowercase→UPPERCASE merge (no space/newline between words).
    //                e.g. "xuất khẩuNgoài" or "bắt buộcTheo" — LLM forgot the line break.
    //                Uses Unicode \p{Ll}/\p{Lu} to cover all Vietnamese diacritic chars.
    text = text
        .split('\n')
        .flatMap((line) => {
            if (!/^#{1,6} /.test(line)) return [line];
            const pfx = (line.match(/^#{1,6} /) ?? [''])[0];
            const body = line.slice(pfx.length);
            // A: punctuation-based split
            const mA = body.match(/^(.{4,79}?[.)!?:])\s*(\S.{5,})$/);
            if (mA) return [`${pfx}${mA[1]}`, '', mA[2]];
            // B: Unicode lowercase immediately before uppercase — merged words
            const mB = body.match(/^(.{10,}?\p{Ll})(\p{Lu}.{15,})$/u);
            if (mB) return [`${pfx}${mB[1]}`, '', mB[2]];
            return [line];
        })
        .join('\n');

    // 4. Convert inline bullet patterns (sentence-ending + bullet with no newline)
    text = text.replace(/([.:!?])\s*-\s+(?=[^\d\s])/g, '$1\n\n- ');  // "text:- Item"
    text = text.replace(/([.:!?])\s*\*\s+/g, '$1\n\n- ');             // "text:* Item" → "-"

    // 5. Normalize --- thematic break to prevent setext-h2 trap.
    //    Risk: "**Kết luận:**\n---" → markdown parser reads --- as setext h2 marker!
    //    Fix: ensure --- ALWAYS has \n\n before it AND \n\n after it.
    text = text.replace(/([^\n])-{3,}/g, '$1\n\n---');       // "text---"   → blank line before
    text = text.replace(/([^\n])\n-{3,}/g, '$1\n\n---');     // "text\n---" → blank line before (setext trap)
    text = text.replace(/-{3,}([^\n])/g, '---\n\n$1');       // "---text"   → blank line after
    text = text.replace(/-{3,}\n(?!\n)/g, '---\n\n');        // "---\n"     → double newline after

    // 6. Ensure each list item starts on its own line
    text = text.replace(/([^\n])\n(- )/g, '$1\n\n$2');

    // 7. Collapse 3+ consecutive blank lines → 2
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
}

/* ─── ReactMarkdown component map ───
 * Defined outside ChatMessage to avoid recreation on every render.
 * Uses inline styles (not Tailwind classes) to bypass any CSS specificity
 * conflicts from external stylesheets.
 */
const MD_COMPONENTS = {
    h1: ({ children }) => (
        <h1 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ds-on-surface)', margin: '16px 0 8px', paddingBottom: '6px', borderBottom: '1px solid var(--ds-border)' }}>
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--ds-on-surface)',
            margin: '14px 0 6px',
            borderLeft: '3px solid var(--ds-secondary)',
            paddingLeft: '8px',
        }}>
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--ds-on-surface)',
            margin: '10px 0 4px',
        }}>
            {children}
        </h3>
    ),
    h4: ({ children }) => (
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ds-on-surface)', margin: '10px 0 4px' }}>
            {children}
        </h4>
    ),
    p: ({ children }) => (
        <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--ds-on-surface)', margin: '0 0 10px' }}>
            {children}
        </p>
    ),
    strong: ({ children }) => (
        <strong style={{ fontWeight: 600, color: 'var(--ds-on-surface)' }}>{children}</strong>
    ),
    em: ({ children }) => (
        <em style={{ fontStyle: 'italic', color: 'var(--ds-on-surface-muted)' }}>{children}</em>
    ),
    ul: ({ children }) => (
        <ul style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--ds-on-surface)', paddingLeft: '20px', margin: '6px 0 10px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--ds-on-surface)', paddingLeft: '22px', margin: '6px 0 10px', listStyleType: 'decimal', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--ds-on-surface)' }}>{children}</li>
    ),
    blockquote: ({ children }) => (
        <blockquote style={{ borderLeft: '2px solid var(--ds-secondary)', paddingLeft: '12px', margin: '8px 0', fontStyle: 'italic', color: 'var(--ds-on-surface-muted)' }}>
            {children}
        </blockquote>
    ),
    hr: () => (
        <hr style={{ border: 'none', borderTop: '1px solid var(--ds-border)', margin: '12px 0' }} />
    ),
    /* pre wraps block code; code inside pre = block, code alone = inline */
    pre: ({ children }) => (
        <pre style={{ backgroundColor: 'var(--ds-surface-variant)', borderRadius: '4px', padding: '10px 14px', overflowX: 'auto', margin: '8px 0' }}>
            {children}
        </pre>
    ),
    code: ({ className, children }) =>
        className ? (
            /* block code — already inside <pre> */
            <code style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--ds-on-surface)' }} className={className}>
                {children}
            </code>
        ) : (
            /* inline code */
            <code style={{ fontSize: '13px', fontFamily: 'monospace', backgroundColor: 'var(--ds-surface-variant)', borderRadius: '3px', padding: '1px 5px', color: 'var(--ds-on-surface)' }}>
                {children}
            </code>
        ),
    a: ({ href, children }) => (
        <a href={href} style={{ color: 'var(--ds-info)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
};

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

    if (isStreaming) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16 }}
                className="flex gap-2.5"
            >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
                    AI
                </div>

                <div className="min-w-0 flex-1">
                    <div style={{ fontSize: '15px', lineHeight: 1.7 }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                            {normalizeMarkdown(message.content)}
                        </ReactMarkdown>
                        <span className="stream-cursor" aria-hidden="true" />
                    </div>
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
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary mt-0.5">
                AI
            </div>

            <div className="flex-1 min-w-0 space-y-2.5">
                {/* Error state */}
                {message.error ? (
                    <div className="rounded-[4px] border border-[rgba(179,38,30,0.3)] bg-error-soft px-3 py-2.5">
                        <p className="text-[13px] text-error leading-relaxed">
                            {message.errorMessage || message.content}
                        </p>
                        {message.content && message.errorMessage && (
                            <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-on-surface">
                                {message.content}
                            </p>
                        )}
                    </div>
                ) : (
                    <div style={{ fontSize: '15px', lineHeight: 1.7 }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
                            {normalizeMarkdown(message.content)}
                        </ReactMarkdown>
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
