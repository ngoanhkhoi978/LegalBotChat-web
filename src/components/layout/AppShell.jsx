import { useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function AppShell({ children }) {
    const { pathname } = useLocation();
    const isChatbot = pathname === '/chatbot' || pathname === '/chatbot/';

    if (isChatbot) {
        return (
            <div
                className="bg-surface text-on-surface"
                style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
            >
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[4px] focus:bg-accent focus:px-4 focus:py-2 focus:text-on-surface"
                >
                    Bỏ qua điều hướng
                </a>
                <Header />
                <main
                    id="main-content"
                    style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-surface text-on-surface">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[4px] focus:bg-accent focus:px-4 focus:py-2 focus:text-on-surface"
            >
                Bỏ qua điều hướng
            </a>
            <Header />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
