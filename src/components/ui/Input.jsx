import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                'h-8 w-full rounded-[4px] border border-default bg-surface px-3 text-[14px] text-on-surface placeholder:text-muted transition-shadow focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--ds-info)]',
                className,
            )}
            {...props}
        />
    );
}
