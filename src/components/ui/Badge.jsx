import { cn } from '../../lib/utils';

const variants = {
    neutral: 'bg-surface text-on-surface border border-default',
    info: 'bg-surface text-info border border-default',
    success: 'bg-surface text-success border border-default',
    warning: 'bg-surface text-accent-warm border border-default',
    error: 'bg-surface text-error border border-default',
};

export function Badge({ className, variant = 'neutral', ...props }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-[3px] px-2 py-1 text-caption font-medium',
                variants[variant],
                className,
            )}
            {...props}
        />
    );
}
