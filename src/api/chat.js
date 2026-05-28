const API_BASE = 'https://legal.hungreo.dpdns.org';

/**
 * Stream a chat response from the legal RAG API.
 * The backend yields plain text chunks (not SSE data: format).
 * Use for..await to consume the async generator.
 *
 * @param {string} query - User question
 * @param {AbortSignal} [signal] - Optional AbortController signal
 * @yields {string} Text chunks as they arrive
 */
export async function* streamChat(query, signal) {
    let response;
    try {
        response = await fetch(`${API_BASE}/api/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream, text/plain, */*',
            },
            body: JSON.stringify({ query }),
            signal,
        });
    } catch (err) {
        if (err.name === 'AbortError') throw err;
        // Network error, DNS failure, CORS, etc.
        throw new Error('Không thể kết nối đến máy chủ API. Kiểm tra kết nối mạng hoặc thử lại sau.');
    }

    if (!response.ok) {
        let detail = '';
        try { detail = await response.text(); } catch { /* ignore */ }
        throw new Error(
            `Máy chủ trả về lỗi ${response.status}` +
            (detail ? `: ${detail.slice(0, 120)}` : '.')
        );
    }

    if (!response.body) {
        throw new Error('Trình duyệt không hỗ trợ Streaming API. Vui lòng cập nhật trình duyệt.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            if (text) yield text;
        }
    } finally {
        reader.releaseLock();
    }
}

/**
 * Check if the API is reachable (lightweight health probe).
 * Returns 'online' | 'offline'.
 */
export async function checkApiStatus() {
    try {
        const res = await fetch(`${API_BASE}/docs`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(4000),
        });
        return res.ok || res.status < 500 ? 'online' : 'offline';
    } catch {
        return 'offline';
    }
}
