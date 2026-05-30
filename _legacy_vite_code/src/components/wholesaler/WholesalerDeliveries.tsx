import { User, Phone, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function WholesalerDeliveries({ onNavigate }: { onNavigate: (tab: string, params?: any) => void }) {
    const { orders, wholesalerProfileId } = useStore();

    // Filter for DISPATCHED or DELIVERED orders assigned to this wholesaler
    const deliveries = orders.filter(
        o =>
            o.assignedWholesalerId === wholesalerProfileId &&
            ['out_for_delivery', 'delivered'].includes(o.status)
    );

    console.log("DELIVERIES VIEW", deliveries.length);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 px-4 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate('profile')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Deliveries</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Completed & In-Transit Orders</p>
                    </div>
                </div>
            </div>

            {/* Deliveries List */}
            <div className="p-4 space-y-4">
                {deliveries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-900">
                            <Truck className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No active deliveries</h3>
                        <p className="text-sm text-slate-400 max-w-[200px] mt-1 dark:text-slate-500">
                            Orders that you have dispatched will appear here.
                        </p>
                    </div>
                ) : (
                    deliveries.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white">
                                        Order #{order.id}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{order.date}</p>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                            <User className="w-3 h-3" />
                                            <span className="text-xs">{order.customerName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${order.status === 'delivered'
                                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                        }`}>
                                        {order.status}
                                    </span>
                                    <p className="text-sm font-bold text-slate-900 mt-1 dark:text-white">₹{order.total}</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative pl-2 py-2 mb-4">
                                {/* Vertical Line */}
                                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

                                {/* Steps */}
                                <div className="space-y-4 relative">
                                    {/* Confirmed */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500 border-[3px] border-white dark:border-slate-900 flex items-center justify-center relative z-10 shrink-0">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Order Confirmed</span>
                                    </div>

                                    {/* Dispatched */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] border-white dark:border-slate-900 relative z-10 shrink-0 ${order.status === 'out_for_delivery'
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                                            : order.status === 'delivered'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                            }`}>
                                            {order.status === 'delivered' ? (
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            )}
                                        </div>
                                        <div>
                                            <span className={`text-xs font-bold ${order.status === 'out_for_delivery' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                                Order Dispatched
                                            </span>
                                            {order.status === 'out_for_delivery' && (
                                                <p className="text-[10px] text-blue-500 dark:text-blue-400/80">Vehicle dispatched</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delivered */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] border-white dark:border-slate-900 relative z-10 shrink-0 ${order.status === 'delivered'
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-none'
                                            : 'bg-slate-100 dark:bg-slate-800'
                                            }`}>
                                            {order.status === 'delivered' && (
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-xs font-semibold ${order.status === 'delivered' ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                            {order.status === 'delivered' ? 'Delivered' : 'Estimated Delivery By 8:00 PM'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Driver Info Card */}
                            <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold border border-slate-100 dark:border-slate-700 shadow-sm">
                                    R
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Rahul Kumar</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Tata Ace • DL 1L AB 1234</p>
                                </div>
                                <a
                                    href={`tel:${order.customerPhone}`}
                                    className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Order Items Preview */}
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
                                {order.items.slice(0, 2).map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                                        <span className="text-slate-800 font-medium dark:text-slate-200">x{item.qty}</span>
                                    </div>
                                ))}
                                {order.items.length > 2 && (
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">+{order.items.length - 2} more items</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
