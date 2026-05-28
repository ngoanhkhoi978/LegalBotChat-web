import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-[4px] bg-surface-variant',
                className,
            )}
            {...props}
        />
    );
}

