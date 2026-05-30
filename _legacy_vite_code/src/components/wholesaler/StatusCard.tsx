import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type StatusCardVariant = 'active' | 'out_of_stock' | 'high_price' | 'expiring' | 'neutral' | 'success' | 'info';

interface StatusCardProps {
    title: string;
    count: number | string;
    variant?: StatusCardVariant;
    onClick?: () => void;
    className?: string;
}

const VARIANTS: Record<StatusCardVariant, { bg: string; text: string; subtext: string; border: string; shadow?: string }> = {
    active: {
        bg: 'bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20',
        text: 'text-indigo-900 dark:text-indigo-300',
        subtext: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-blue-100/50 dark:border-blue-900/30'
    },
    success: {
        bg: 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20',
        text: 'text-emerald-900 dark:text-emerald-300',
        subtext: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-100/50 dark:border-emerald-900/30'
    },
    out_of_stock: {
        bg: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
        text: 'text-orange-900 font-bold dark:text-orange-300',
        subtext: 'text-orange-700 font-semibold dark:text-orange-400',
        border: 'border-orange-200 shadow-md ring-1 ring-orange-100 dark:border-orange-900/50 dark:ring-orange-900/30'
    },
    high_price: {
        bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20',
        text: 'text-purple-900 dark:text-purple-300',
        subtext: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-900/30'
    },
    expiring: {
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
        text: 'text-amber-900 dark:text-amber-300',
        subtext: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 shadow-sm dark:border-amber-900/30'
    },
    info: {
        bg: 'bg-gradient-to-br from-cyan-50/50 to-teal-50/50 dark:from-cyan-900/20 dark:to-teal-900/20',
        text: 'text-cyan-900 dark:text-cyan-300',
        subtext: 'text-cyan-600 dark:text-cyan-400',
        border: 'border-cyan-100/50 dark:border-cyan-900/30'
    },
    neutral: {
        bg: 'bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-800 dark:to-gray-800',
        text: 'text-slate-900 dark:text-slate-200',
        subtext: 'text-slate-500 dark:text-slate-400',
        border: 'border-slate-100/50 dark:border-slate-700/50'
    }
};

export default function StatusCard({ title, count, variant = 'neutral', onClick, className }: StatusCardProps) {
    const styles = VARIANTS[variant];

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left relative overflow-hidden",
                "rounded-2xl border p-4 transition-all duration-200",
                "hover:shadow-md active:scale-[0.98]",
                styles.shadow || "shadow-sm",
                styles.bg,
                styles.border,
                className
            )}
        >
            <div className="relative z-10 flex flex-col h-full justify-between gap-1">
                <div className="flex justify-between items-start w-full">
                    <span className={cn("text-xs font-bold tracking-wide uppercase opacity-90", styles.subtext)}>
                        {title}
                    </span>
                    {onClick && <ChevronRight className={cn("w-4 h-4 opacity-50", styles.subtext)} />}
                </div>

                <span className={cn("text-3xl tracking-tight", styles.text, variant === 'out_of_stock' ? "font-black" : "font-bold")}>
                    {count}
                </span>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white opacity-40 blur-2xl pointer-events-none" />
        </button>
    );
}
