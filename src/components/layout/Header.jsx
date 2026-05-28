import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import emblem from '../../assets/Emblem_of_Vietnam.svg';

const navItems = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Chatbot', to: '/chatbot' },
    { label: 'Tra cứu điều luật', to: '/tra-cuu' },
    { label: 'Cập nhật pháp luật', to: '/cap-nhat' },
];

const normalizePath = (path) =>
    path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;

export function Header() {
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const pathname = normalizePath(location.pathname);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header-glass border-b border-default">
            <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-6">
                {/* Brand */}
                <NavLink to="/" className="flex shrink-0 items-center gap-2.5 hover:opacity-90 transition-opacity">
                    <img
                        src={emblem}
                        alt="Quốc huy Việt Nam"
                        className="h-8 w-8 object-contain"
                    />
                    <span className="text-[14px] font-bold leading-snug text-on-surface hidden sm:block">
                        Luật Giao thông Việt Nam
                    </span>
                </NavLink>

                {/* Nav — desktop */}
                <nav
                    className="hidden flex-1 items-center justify-center gap-1 md:flex"
                    aria-label="Điều hướng chính"
                >
                    {navItems.map((item) => {
                        const isActive = normalizePath(item.to) === pathname;
                        return (
                            <NavLink
                                key={item.label}
                                to={item.to}
                                className={cn(
                                    'nav-link text-[13px] font-semibold px-3',
                                    isActive && 'nav-link-active',
                                )}
                            >
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-[4px] text-[15px] text-muted transition hover:bg-surface-variant focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--ds-info)]"
                        onClick={() => { console.debug('[Header] toggle theme (before):', theme); setTheme(theme === 'dark' ? 'light' : 'dark'); console.debug('[Header] toggle theme (after):', window.localStorage.getItem('legalchatbot-theme')); }}
                        aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
                        title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
                    >
                        {theme === 'dark' ? '☀' : '☾'}
                    </button>
                    <Button type="button" variant="outline" size="sm" className="hidden sm:inline-flex">
                        Đăng nhập
                    </Button>
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-default text-body-sm text-on-surface transition hover:bg-surface-variant md:hidden"
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
                        aria-label="Mở menu"
                    >
                        {menuOpen ? '✕' : '≡'}
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {menuOpen && (
                <div
                    id="mobile-nav"
                    className="border-t border-default px-5 pb-3 md:hidden"
                >
                    <nav className="flex flex-col gap-0.5 pt-2" aria-label="Điều hướng di động">
                        {navItems.map((item) => {
                            const isActive = normalizePath(item.to) === pathname;
                            return (
                                <NavLink
                                    key={item.label}
                                    to={item.to}
                                    className={cn(
                                        'rounded-[4px] px-3 py-2.5 text-[13px] font-semibold text-on-surface transition hover:bg-surface-variant',
                                        isActive && 'bg-surface-variant',
                                    )}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </NavLink>
                            );
                        })}
                        <div className="mt-2 pt-2 border-t border-default">
                            <Button type="button" variant="outline" size="sm" className="w-full">
                                Đăng nhập
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
