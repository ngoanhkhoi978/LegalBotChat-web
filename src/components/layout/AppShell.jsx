import { Footer } from './Footer';
import { Header } from './Header';

export function AppShell({ children }) {
    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[4px] focus:bg-accent focus:px-4 focus:py-2 focus:text-on-surface"
            >
                Bỏ qua điều hướng
            </a>
            <Header />
            <main id="main-content" className="min-h-[70vh]">
                {children}
            </main>
            <Footer />
        </div>
    );
}

