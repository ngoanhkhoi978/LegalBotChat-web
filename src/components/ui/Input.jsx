import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                'w-full rounded-[4px] border border-default bg-surface px-3 py-2 text-body-md text-on-surface placeholder:text-muted focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--ds-info)]',
                className,
            )}
            {...props}
        />
    );
}
