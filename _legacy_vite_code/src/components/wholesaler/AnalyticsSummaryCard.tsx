import { ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Reuse the same variant system for consistency as requested ("Same card style as status cards")
type AnalyticsCardVariant = 'blue' | 'green' | 'purple' | 'orange' | 'teal';

interface AnalyticsSummaryCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    variant?: AnalyticsCardVariant;
    onClick?: () => void;
}

const VARIANTS: Record<AnalyticsCardVariant, { bg: string; text: string; border: string; label: string }> = {
    blue: {
        bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
        text: 'text-blue-900',
        border: 'border-blue-100',
        label: 'text-blue-600'
    },
    green: {
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        text: 'text-emerald-900',
        border: 'border-emerald-100',
        label: 'text-emerald-600'
    },
    purple: {
        bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
        text: 'text-purple-900',
        border: 'border-purple-100',
        label: 'text-purple-600'
    },
    orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
        text: 'text-orange-900',
        border: 'border-orange-100',
        label: 'text-orange-600'
    },
    teal: {
        bg: 'bg-gradient-to-br from-cyan-50 to-teal-50',
        text: 'text-cyan-900',
        border: 'border-cyan-100',
        label: 'text-cyan-600'
    }
};

export default function AnalyticsSummaryCard({ title, value, subtext, variant = 'blue', onClick }: AnalyticsSummaryCardProps) {
    const styles = VARIANTS[variant];

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-4 rounded-xl border shadow-sm transition-all active:scale-[0.98]",
                styles.bg,
                styles.border
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={cn("text-xs font-bold uppercase tracking-wide opacity-80", styles.label)}>
                    {title}
                </span>
                <ChevronRight className={cn("w-4 h-4 opacity-40", styles.label)} />
            </div>

            <div className={cn("text-2xl font-bold tracking-tight mb-1", styles.text)}>
                {value}
            </div>

            {subtext && (
                <p className={cn("text-[10px] font-medium opacity-60", styles.text)}>
                    {subtext}
                </p>
            )}
        </button>
    );
}
