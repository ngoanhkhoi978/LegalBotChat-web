import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
    return (
        <div
            className={cn(
                'card-base elevation-sm bg-surface text-on-surface',
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }) {
    return <div className={cn('px-4 pt-4', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
    return <div className={cn('px-4 pb-4', className)} {...props} />;
}

