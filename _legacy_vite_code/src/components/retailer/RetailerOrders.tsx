import { useState, useEffect } from 'react';
import { Package, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function RetailerOrders({ onNavigate, initialTab = 'active' }: { onNavigate?: (route: string, params?: any) => void, initialTab?: 'active' | 'past' }) {
    const { orders } = useStore();
    const [activeTab, setActiveTab] = useState<'active' | 'past'>(initialTab);

    const displayedOrders = orders.filter(order => {
        const isHistory = ['delivered', 'cancelled', 'unfulfillable'].includes(order.status);
        return activeTab === 'active' ? !isHistory : isHistory;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort desc

    // Live Timer
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getConfirmationTimeLeft = (createdAt?: number) => {
        if (!createdAt) return "01:00";
        const end = createdAt + 60000;
        const diff = end - now;
        if (diff <= 0) return "00:00";
        const s = Math.floor(diff / 1000);
        return `00:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white sticky top-0 z-10 border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <div className="px-5 py-4">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Orders</h1>
                </div>
                {/* Tabs */}
                <div className="flex px-5 gap-6">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={cn(
                            "pb-3 text-sm font-bold relative transition-colors",
                            activeTab === 'active' ? "text-green-600 dark:text-green-500" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        )}
                    >
                        Active
                        {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-500 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={cn(
                            "pb-3 text-sm font-bold relative transition-colors",
                            activeTab === 'past' ? "text-green-600 dark:text-green-500" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        )}
                    >
                        Past Orders
                        {activeTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-500 rounded-full" />}
                    </button>
                </div>
            </header>

            <div className="p-4 space-y-4">
                {displayedOrders.length === 0 && (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-600">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No {activeTab} orders found</p>
                    </div>
                )}

                {displayedOrders.map((order) => {
                    const isConfirming = order.status === 'confirming' || order.status === 'placed';
                    const isUnfulfillable = order.status === 'unfulfillable';

                    return (
                        <div
                            key={order.id}
                            onClick={() => onNavigate?.('order_detail', { id: order.id })}
                            className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden active:scale-[0.99] transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800"
                        >

                            {/* UNFULFILLABLE STATE */}
                            {isUnfulfillable ? (
                                <div className="p-6 text-center space-y-3">
                                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                        <Package className="w-6 h-6 opacity-50" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">Unable to Confirm</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed px-4 dark:text-slate-400">
                                        We couldn’t confirm this order. Your payment will be refunded.
                                    </p>
                                </div>
                            ) : isConfirming ? (
                                /* ASSIGNING STATE UI */
                                <div className="p-5">
                                    <div className="flex items-start gap-4 mb-5">
                                        {/* Calm Pulse Icon */}
                                        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 shrink-0 dark:bg-blue-900/20 dark:text-blue-400">
                                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20 dark:bg-blue-900" />
                                            <Clock className="w-5 h-5 relative z-10" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-800 mb-1 dark:text-slate-200">Processing Order</h3>
                                            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                                                We are checking availability with nearby suppliers.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Countdown Timer Card */}
                                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col items-center justify-center dark:bg-slate-800/50 dark:border-slate-700">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 dark:text-slate-500">Estimated confirmation time</span>
                                        <span className="text-2xl font-mono font-bold text-slate-700 tracking-wider dark:text-slate-200">
                                            {getConfirmationTimeLeft(order.createdAt)}
                                        </span>
                                    </div>

                                    {/* Order Summary Card */}
                                    <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 dark:text-slate-500">Order Summary</h4>

                                        <div className="space-y-3 mb-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start text-sm">
                                                    <span className="text-slate-700 font-medium line-clamp-1 flex-1 pr-4 dark:text-slate-300">{item.name}</span>
                                                    <div className="text-right shrink-0">
                                                        <span className="text-slate-500 text-xs mr-2 dark:text-slate-400">{item.qty} x ₹{item.price}</span>
                                                        <span className="text-slate-800 font-semibold dark:text-slate-200">₹{Number(item.price) * item.qty}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Amount</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">₹{order.total}</span>
                                        </div>
                                    </div>

                                    {/* Reassurance Info */}
                                    <div className="mt-4 bg-slate-50 rounded-lg p-3 dark:bg-slate-800/50">
                                        <p className="text-[10px] text-center text-slate-500 font-medium leading-relaxed dark:text-slate-400">
                                            Your order is being confirmed with suppliers. If a supplier is unavailable, we will automatically assign another one.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* NORMAL STATE UI (LOCKED / COMPLETED) */
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-slate-100 p-1.5 rounded-lg text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                <Package className="w-4 h-4" />
                                            </span>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Order #{order.id.split('-').pop()}</h3>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500">{order.date}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-1 rounded capitalize",
                                            order.status === 'delivered' ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                                order.status === 'cancelled' ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                                    order.status === 'accepted' ? "bg-blue-600 text-white dark:bg-blue-700" :
                                                        order.status === 'placed' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500" :
                                                            "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                        )}>
                                            {order.status === 'accepted' ? 'Confirmed' : order.status === 'placed' ? 'Processing' : order.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end mt-3 border-t border-slate-50 pt-3 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                            {order.items.length} Items
                                        </div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                            ₹{order.total}
                                        </div>
                                    </div>
                                    {/* Mock Tracking Link for accepted */}
                                    {order.status === 'accepted' && (
                                        <div className="mt-3 pt-3 border-t border-slate-50 text-center dark:border-slate-800">
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Track Order (Coming Soon)</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
