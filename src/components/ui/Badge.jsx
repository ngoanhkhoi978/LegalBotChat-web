import { cn } from '../../lib/utils';

const variants = {
    neutral: 'badge-neutral',
    info: 'badge-info',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
};

export function Badge({ className, variant = 'neutral', ...props }) {
    return (
        <span
            className={cn('badge-base', variants[variant], className)}
            {...props}
        />
    );
}
