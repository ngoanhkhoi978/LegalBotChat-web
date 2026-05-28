import { useEffect, useState } from 'react';

const STORAGE_KEY = 'legalchatbot-theme';

// Module-level current theme and subscribers so multiple hook instances stay in sync
let currentTheme = 'light';
const subscribers = new Set();

function readSavedTheme() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
    } catch {
        // ignore
    }
    return 'light';
}

function applyThemeToDocument(theme) {
    try {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        // debug
        console.debug('[useTheme] applyThemeToDocument:', theme, document.documentElement.classList.contains('dark'));
    } catch {
        // ignore (e.g., during SSR)
    }
}

function setThemeGlobal(theme) {
    if (theme === currentTheme) return;
    currentTheme = theme;
    try {
        window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // ignore
    }
    // debug
    console.debug('[useTheme] setThemeGlobal ->', theme);
    applyThemeToDocument(theme);
    // notify subscribers
    subscribers.forEach((cb) => {
        try {
            cb(theme);
        } catch {
            // ignore subscriber errors
        }
    });
}

// initialize currentTheme once (safe-guard for environments without window)
if (typeof window !== 'undefined') {
    currentTheme = readSavedTheme();
    applyThemeToDocument(currentTheme);
    // listen to storage events from other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
            setThemeGlobal(e.newValue);
        }
    });
}

export function useTheme() {
    const [theme, setThemeState] = useState(() => currentTheme);

    useEffect(() => {
        // subscriber will update local state when global theme changes
        const cb = (t) => setThemeState(t);
        subscribers.add(cb);
        return () => subscribers.delete(cb);
    }, []);

    const setTheme = (t) => setThemeGlobal(t);

    return { theme, setTheme };
}
