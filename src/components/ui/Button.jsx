import { cn } from '../../lib/utils';

const variants = {
    primary:
        'bg-primary text-on-primary font-semibold hover:bg-[var(--ds-primary-variant)] transition-colors',
    accent:
        'bg-accent text-on-surface font-semibold hover:brightness-[0.96] active:scale-[0.99] transition',
    secondary:
        'border border-default bg-surface-variant text-on-surface font-medium hover:bg-surface hover:border-secondary-variant transition-colors',
    ghost:
        'text-info font-medium hover:opacity-75 transition-opacity',
    outline:
        'border border-primary text-primary bg-transparent font-medium hover:bg-[rgba(144,57,56,0.06)] transition-colors',
};

const sizes = {
    sm: 'h-7 px-3 text-[12px]',
    md: 'h-8 px-4 text-[13px]',
    lg: 'h-9 px-5 text-[14px]',
};

export function Button({
    asChild = false,
    className,
    variant = 'secondary',
    size = 'md',
    ...props
}) {
    const Comp = asChild ? 'span' : 'button';

    return (
        <Comp
            className={cn(
                'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-[4px] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--ds-info)] disabled:pointer-events-none disabled:opacity-40',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        />
    );
}
