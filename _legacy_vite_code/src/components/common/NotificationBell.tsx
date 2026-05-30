
import { useStore } from '../../context/StoreContext';

interface NotificationBellProps {
    onNavigate?: (tab: string, params?: any) => void;
    count?: number;
    onClick?: () => void;
}

export default function NotificationBell({ onNavigate, count, onClick }: NotificationBellProps) {
    // Only fetch from store if count prop is NOT provided. Avoid Hook call if possible? 
    // Hooks must be top level. So we always call it.
    const { unreadCount } = useStore();

    // If count is provided via prop, use it (Retailer mode)
    // Otherwise try to use wholesaler context (now StoreContext), default to 0
    const effectiveCount = count !== undefined ? count : (unreadCount || 0);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (onNavigate) {
            onNavigate('notifications');
        }
    };

    return (
        <button
            onClick={handleClick}
            className="relative p-1.5 hover:bg-slate-50 rounded-full transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>

            {effectiveCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {effectiveCount > 9 ? '9+' : effectiveCount}
                </span>
            )}
        </button>
    );
}
