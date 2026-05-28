import { cn } from '../../lib/utils';

const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-variant',
    accent: 'bg-accent text-on-surface hover:brightness-95',
    secondary:
        'bg-surface-variant text-on-surface hover:border-secondary-variant border border-default',
    ghost: 'text-info hover:underline',
    outline:
        'border border-primary text-primary bg-transparent hover:bg-accent-soft',
};

const sizes = {
    sm: 'px-3 py-2 text-body-sm',
    md: 'px-4 py-2 text-body-md',
    lg: 'px-5 py-3 text-body-lg',
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
                'inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold transition duration-200 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--ds-info)]',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        />
    );
}
