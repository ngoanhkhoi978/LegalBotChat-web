import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'legalbot_history_v1';
const MAX_CONVERSATIONS = 60;

/* ── helpers ── */

function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function loadStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveStorage(conversations) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
        console.warn('[useChatHistory] Lưu thất bại:', e);
    }
}

export function formatTime(timestamp) {
    if (!timestamp) return '';
    const now = Date.now();
    const diff = now - timestamp;
    const min = 60_000;
    const hour = 3_600_000;
    const day = 86_400_000;

    if (diff < min) return 'Vừa xong';
    if (diff < hour) return `${Math.floor(diff / min)} phút trước`;
    if (diff < day) {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    if (diff < 2 * day) return 'Hôm qua';
    if (diff < 7 * day) return `${Math.floor(diff / day)} ngày trước`;
    return new Date(timestamp).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
    });
}

/**
 * Manages chat conversation history with localStorage persistence.
 *
 * Data model:
 *   Conversation { id, title, createdAt, updatedAt, messages: Message[] }
 *   Message      { id, role, content, timestamp, error? }
 */
export function useChatHistory() {
    const [conversations, setConversations] = useState(loadStorage);
    const [activeId, setActiveId] = useState(() => {
        const stored = loadStorage();
        return stored.length > 0 ? stored[0].id : null;
    });

    /* Debounced write to localStorage — batches rapid streaming updates */
    const flushTimer = useRef(null);
    useEffect(() => {
        if (flushTimer.current) clearTimeout(flushTimer.current);
        flushTimer.current = setTimeout(() => saveStorage(conversations), 400);
        return () => clearTimeout(flushTimer.current);
    }, [conversations]);

    /* ── derived ── */
    const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
    const messages = activeConversation?.messages ?? [];

    /* ── actions ── */

    /** Create a blank conversation and activate it. Returns the new id. */
    const createConversation = useCallback(() => {
        const id = uid();
        const conv = {
            id,
            title: 'Hội thoại mới',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [],
        };
        setConversations((prev) =>
            [conv, ...prev].slice(0, MAX_CONVERSATIONS)
        );
        setActiveId(id);
        return id;
    }, []);

    /** Switch the active conversation. */
    const switchConversation = useCallback((id) => {
        setActiveId(id);
    }, []);

    /** Delete a conversation. Switches to the next one if it was active. */
    const deleteConversation = useCallback(
        (id) => {
            setConversations((prev) => {
                const next = prev.filter((c) => c.id !== id);
                if (id === activeId) {
                    setActiveId(next.length > 0 ? next[0].id : null);
                }
                return next;
            });
        },
        [activeId]
    );

    /**
     * Append a message to a conversation.
     * Auto-generates a title from the first user message.
     */
    const addMessage = useCallback((convId, message) => {
        setConversations((prev) =>
            prev.map((c) => {
                if (c.id !== convId) return c;
                const isFirstUser =
                    c.messages.length === 0 && message.role === 'user';
                const autoTitle = isFirstUser
                    ? message.content.length > 38
                        ? message.content.slice(0, 38) + '…'
                        : message.content
                    : c.title;
                return {
                    ...c,
                    title: autoTitle,
                    updatedAt: Date.now(),
                    messages: [...c.messages, message],
                };
            })
        );
    }, []);

    /**
     * Patch an existing message by id (used for streaming content updates).
     */
    const updateMessage = useCallback((convId, msgId, patch) => {
        setConversations((prev) =>
            prev.map((c) => {
                if (c.id !== convId) return c;
                return {
                    ...c,
                    updatedAt: Date.now(),
                    messages: c.messages.map((m) =>
                        m.id === msgId ? { ...m, ...patch } : m
                    ),
                };
            })
        );
    }, []);

    /** Wipe all history. */
    const clearHistory = useCallback(() => {
        setConversations([]);
        setActiveId(null);
        saveStorage([]);
    }, []);

    return {
        conversations,
        activeId,
        activeConversation,
        messages,
        /* actions */
        createConversation,
        switchConversation,
        deleteConversation,
        addMessage,
        updateMessage,
        clearHistory,
        /* util */
        uid,
    };
}
