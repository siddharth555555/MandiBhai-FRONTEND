import { useRef, useEffect } from 'react';
// import { useNotification, Notification } from '../../context/NotificationContext';
import { useStore, Notification } from '../../context/StoreContext';

interface NotificationListProps {
    onClose: () => void;
    onNavigate?: (tab: string, params?: any) => void;
}

export default function NotificationList({ onClose, onNavigate }: NotificationListProps) {
    const { notifications, markAsRead, markAllAsRead, clearNotifications } = useStore();
    // const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotification();
    const listRef = useRef<HTMLDivElement>(null);

    // Initial simple outside click handler (can be refined)
    useEffect(() => {
        // Handle close logic if needed
    }, [onClose]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Close the panel
        onClose();

        // Handle Navigation
        if (onNavigate && notification.actionRoute) {
            onNavigate(notification.actionRoute, notification.actionParams);
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - timestamp;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

        return date.toLocaleDateString();
    };

    return (
        <div
            ref={listRef}
            className="absolute right-0 top-12 w-80 bg-white shadow-xl rounded-lg border border-slate-200 z-50 flex flex-col max-h-[80vh]"
        >
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-lg">
                <h3 className="font-semibold text-slate-700">Notifications</h3>
                <div className="flex gap-2 text-xs">
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-y-auto flex-1 p-0">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No notifications yet
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-transparent'
                                    }`} />
                                <div className="flex-1">
                                    <h4 className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                                        {notification.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <span className="text-[10px] text-slate-400 mt-2 block">
                                        {formatTime(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center rounded-b-lg">
                    <button
                        onClick={clearNotifications}
                        className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}
