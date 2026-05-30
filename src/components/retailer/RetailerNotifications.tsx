'use client';
import { ArrowLeft, Bell } from 'lucide-react';

import { useStore } from '../../context/StoreContext';

interface RetailerNotificationsProps {
    onBack: () => void;
    onNavigate: (route: string, params?: any) => void;
}

export default function RetailerNotifications({ onBack, onNavigate }: RetailerNotificationsProps) {
    const { notifications, markAsRead, markAllAsRead } = useStore();


    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Handle Action Navigation
        // Prioritize structured actionParams if available
        if (notification.actionRoute) {
            // DIRECT NAVIGATION based on route name
            if (notification.actionRoute === 'order_detail' && notification.actionParams?.id) {
                onNavigate('order_detail', { id: notification.actionParams.id });
            } else if (notification.actionRoute === 'products') {
                onNavigate('products', notification.actionParams || {});
            } else {
                // Fallback for simple routes or legacy data
                onNavigate(notification.actionRoute, notification.actionParams);
            }
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - timestamp;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;

        return date.toLocaleDateString();
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24 relative dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center justify-between safe-area-pt dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white">Notifications</h1>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-transform dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100 bg-white min-h-[calc(100vh-65px)] dark:bg-slate-900 dark:divide-slate-800">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4 dark:bg-slate-800">
                            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                        </div>
                        <h3 className="text-slate-800 font-bold mb-1 dark:text-slate-200">No notifications</h3>
                        <p className="text-slate-400 text-sm dark:text-slate-500">You're all caught up!</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer dark:hover:bg-slate-800 dark:active:bg-slate-700 ${!notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${notification.isRead ? 'bg-transparent' :
                                    notification.type === 'ORDER' ? 'bg-blue-600 shadow-sm shadow-blue-200 dark:shadow-blue-900/40' :
                                        notification.type === 'PRODUCT' ? 'bg-green-500 shadow-sm shadow-green-200 dark:shadow-green-900/40' :
                                            'bg-amber-500 shadow-sm shadow-amber-200 dark:shadow-amber-900/40'
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-4 mb-1">
                                        <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'
                                            }`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap dark:text-slate-500">
                                            {formatTime(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`text-xs ${!notification.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                        } leading-relaxed line-clamp-2`}>
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
