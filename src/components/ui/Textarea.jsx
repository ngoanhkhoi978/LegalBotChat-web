import { cn } from '../../lib/utils';

export function Textarea({ className, ...props }) {
    return (
        <textarea
            className={cn(
                'w-full rounded-[4px] border border-default bg-surface px-3 py-2 text-[14px] text-on-surface placeholder:text-muted transition-shadow focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--ds-info)]',
                className,
            )}
            {...props}
        />
    );
}
