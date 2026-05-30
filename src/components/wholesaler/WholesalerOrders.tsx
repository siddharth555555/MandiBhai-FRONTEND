'use client';
import { useState, useEffect } from 'react';
import { Phone, MessageSquare, CreditCard, X, Package, Clock, Truck } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useStore } from '../../context/StoreContext';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function WholesalerOrders({ initialFilter = 'New', initialOrderId }: { initialFilter?: string; initialOrderId?: string }) {
    const { orders, updateOrderStatus, wholesalerProfileId, currentUserRole, fetchOrders } = useStore();

    // Deterministic fetch on mount and when wholesalerProfileId resolves
    useEffect(() => {
        if (currentUserRole === 'wholesaler') {
            fetchOrders();
        }
    }, [currentUserRole, wholesalerProfileId]);



    // Debug logging
    console.log("WHOLESALER ORDERS VIEW", {
        wholesalerProfileId,
        totalOrders: orders.length,
        visibleOrders: orders.map(o => ({ id: o.id, status: o.status, assignedTo: o.assignedWholesalerId }))
    });

    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [filter, setFilter] = useState(initialFilter);

    // Deep linking effect
    useEffect(() => {
        if (initialOrderId) {
            const target = orders.find(o => o.id === initialOrderId);
            if (target) {
                setSelectedOrder(target);
                // Also switch filter tab if needed
                // Also switch filter tab if needed
                if (target.status === 'placed') setFilter('New');
                else if (target.status === 'accepted' || target.status === 'packed' || target.status === 'out_for_delivery') setFilter('Accepted');
                else if (target.status === 'delivered') setFilter('Completed');

            }
        }
    }, [initialOrderId]);

    const filteredOrders = orders.filter(o => {
        if (filter === 'New') return o.status === 'placed';
        if (filter === 'Accepted') return ['accepted', 'packed', 'out_for_delivery'].includes(o.status);
        if (filter === 'Completed') return o.status === 'delivered' || o.status === 'cancelled';
        return false;
    });


    const handleUpdateStatus = (id: string, newStatus: any) => {
        updateOrderStatus(id, newStatus);
        setSelectedOrder(null);
    };

    const counts = {
        New: orders.filter(o => o.status === 'placed').length,
    };


    const TABS = [
        { label: 'New', value: 'New' },
        { label: 'Accepted', value: 'Accepted' },
        { label: 'Completed', value: 'Completed' }
    ];



    return (
        <div className="bg-slate-50 min-h-screen pb-24 relative dark:bg-slate-950 transition-colors duration-300">
            {/* Minimal Header */}
            <header className="bg-white px-4 pt-5 pb-2 sticky top-0 z-10 dark:bg-slate-900 transition-colors duration-300">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-white">Orders</h1>
            </header>

            {/* Lightweight Tabs */}
            <div className="bg-white px-4 pb-0 border-b border-slate-100 flex items-center gap-6 sticky top-[57px] z-10 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-300">
                {TABS.map((tab) => {
                    const isActive = filter === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={cn(
                                "pb-3 text-sm font-medium relative transition-colors",
                                isActive ? "text-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                            )}
                        >
                            {tab.label}
                            {/* Badge only for New */}
                            {tab.label === 'New' && counts.New > 0 && (
                                <span className="ml-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full align-middle">
                                    {counts.New}
                                </span>
                            )}
                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800 rounded-t-full dark:bg-white" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            <div className="p-4 space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Package className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-xs font-semibold text-slate-400">No {filter.toLowerCase()} orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        // Mock data for display
                        const area = "Sector 18, Noida";
                        const shortId = "#" + order.id.split('-').pop();
                        const isNew = order.status === 'placed';
                        // const timeLeft = isNew ? getTimerString(order.lockAt) : null;


                        return (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={cn(
                                    "bg-white p-4 rounded-xl border shadow-sm active:scale-[0.98] transition-all relative overflow-hidden dark:bg-slate-900 dark:border-slate-800",
                                    isNew ? "border-blue-200 ring-1 ring-blue-50 dark:border-blue-900/50 dark:ring-blue-900/20" : "border-slate-100 dark:border-slate-800"
                                )}

                            >
                                {/* Active Stripe for Assigning */}
                                {isNew && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                                )}


                                {/* Row 1: Name & Status */}
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-slate-800 pl-1 dark:text-slate-200">{order.customerName}</h3>
                                    {isNew ? (
                                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1 dark:bg-blue-900/30 dark:text-blue-400">
                                            <Clock className="w-3 h-3" /> New
                                        </span>
                                    ) : (
                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded capitalize", order.status === 'delivered' ? 'text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400')}>
                                            {order.status.replace(/_/g, ' ')}
                                        </span>
                                    )}
                                </div>


                                {/* Row 2: Area */}
                                <div className="mb-3 pl-1">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{area}</p>
                                </div>

                                {/* Row 3: ID & Total */}
                                <div className="flex justify-between items-end pl-1">
                                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded dark:bg-slate-800 dark:text-slate-500">{shortId}</span>
                                    <span className="text-base font-bold text-slate-900 dark:text-white">₹{order.total}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Order Details Modal/Sheet */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center backdrop-blur-sm">
                    <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                        {/* Modal Header */}
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 dark:bg-slate-900 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Order Details</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-1 bg-slate-100 rounded-full hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-950">

                            {/* placed STATUS BANNER */}
                            {selectedOrder.status === 'placed' && (
                                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 text-center dark:bg-blue-900/20 dark:border-blue-900/30">
                                    <div className="flex justify-center mb-2 text-blue-600 dark:text-blue-400">
                                        <Clock className="w-8 h-8 animate-pulse" />
                                    </div>
                                    <h3 className="text-sm font-bold text-blue-900 mb-1 dark:text-blue-200">New Order Received</h3>
                                    <p className="text-xs text-blue-700 mb-3 dark:text-blue-300">
                                        Please accept the order to start processing.
                                    </p>
                                </div>
                            )}


                            {/* accepted STATUS BANNER */}
                            {selectedOrder.status === 'accepted' && (
                                <div className="mb-6 bg-green-50 border border-green-100 rounded-xl p-4 text-center dark:bg-green-900/20 dark:border-green-900/30">
                                    <div className="flex justify-center mb-2 text-green-600 dark:text-green-400">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-sm font-bold text-green-900 mb-1 dark:text-green-200">Order Accepted</h3>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                        Order confirmed. Preparing for packing.
                                    </p>
                                </div>
                            )}


                            {/* Customer Info */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                                        {selectedOrder.customerName.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white">{selectedOrder.customerName}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{selectedOrder.customerPhone}</p>
                                    </div>
                                </div>
                                {/* Strict UI Visibility: Hide vehicle if NOT packed/out_for_delivery or delivered */}
                                {(['packed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status)) && (
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Vehicle</p>
                                        <p className="text-xs font-bold text-slate-800">Tata Ace Gold</p>
                                        <p className="text-[10px] text-slate-400">Mini Truck</p>
                                    </div>
                                )}

                            </div>

                            {/* Items */}
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm mb-4 dark:bg-slate-900 dark:border-slate-800">
                                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide dark:text-slate-300">Order Items</h4>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {(selectedOrder.items || []).map((item: any, idx: number) => (
                                        <div key={idx} className="p-4 flex items-center justify-between dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <img src={item.img} className="w-10 h-10 rounded-lg bg-slate-50 object-cover dark:bg-slate-800" />
                                                <div>
                                                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</h5>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.qty} units • ₹{item.price}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-white">₹{Number(item.price) * item.qty}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Totals */}
                                <div className="border-t border-slate-100 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800">
                                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{selectedOrder.total}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                        <span>Delivery Fee</span>
                                        <span className="font-semibold">₹0</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2 mt-2 dark:text-white dark:border-slate-800">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Details - Strict: out_for_delivery or delivered */}
                            {(selectedOrder.status === 'out_for_delivery' || selectedOrder.status === 'delivered') && (
                                <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 mb-4 dark:bg-amber-900/10 dark:border-amber-900/20">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-amber-100 p-1.5 rounded text-amber-700 dark:bg-amber-900/30 dark:text-amber-500">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 uppercase tracking-wide dark:text-slate-200">UP16 AB 1234</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                                            {selectedOrder.status === 'out_for_delivery' ? 'Out for delivery' : 'Delivered'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-lg border border-amber-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-700 ml-2 dark:text-slate-300">{selectedOrder.customerPhone}</span>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"><Phone className="w-4 h-4" /></button>
                                            <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-100"><MessageSquare className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Info - Strict: out_for_delivery or delivered */}
                            {(selectedOrder.status === 'out_for_delivery' || selectedOrder.status === 'delivered') && (
                                <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between shadow-sm dark:bg-slate-900 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase dark:text-slate-300">Payment Method</h4>
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard className="w-4 h-4 text-green-600 dark:text-green-500" />
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">{selectedOrder.paymentMethod}</span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer Actions - State Machine */}
                        <div className="p-4 border-t border-slate-100 bg-white space-y-3 dark:bg-slate-900 dark:border-slate-800">

                            {/* STATE: placed */}
                            {selectedOrder.status === 'placed' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'accepted')}
                                        className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold shadow-md hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <Package className="w-5 h-5" />
                                        Accept Order
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to cancel this order?')) {
                                                handleUpdateStatus(selectedOrder.id, 'cancelled');
                                            }
                                        }}
                                        className="w-full py-3.5 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100 shadow-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/30"
                                    >
                                        <X className="w-5 h-5" />
                                        Cancel Order
                                    </button>
                                </div>
                            )}

                            {/* STATE: accepted */}
                            {selectedOrder.status === 'accepted' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'packed')}
                                    className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Truck className="w-5 h-5" />
                                    Mark as Packed
                                </button>
                            )}

                            {/* STATE: packed */}
                            {selectedOrder.status === 'packed' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'out_for_delivery')}
                                    className="w-full py-3.5 rounded-xl bg-amber-600 text-white font-bold shadow-md hover:bg-amber-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Truck className="w-5 h-5" />
                                    Out for Delivery
                                </button>
                            )}

                            {/* STATE: out_for_delivery */}
                            {selectedOrder.status === 'out_for_delivery' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                                    className="w-full py-3 rounded-xl bg-green-600 text-white font-bold shadow hover:bg-green-700"
                                >
                                    Mark as Delivered
                                </button>
                            )}

                            {/* STATE: delivered */}
                            {selectedOrder.status === 'delivered' && (
                                <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100 dark:bg-green-900/20 dark:border-green-900/30">
                                    <span className="text-sm font-bold text-green-700 flex items-center justify-center gap-2 dark:text-green-400">
                                        <Package className="w-4 h-4" /> Order Completed
                                    </span>
                                </div>
                            )}

                            {/* STATE: cancelled */}
                            {selectedOrder.status === 'cancelled' && (
                                <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                    <span className="text-sm font-bold text-slate-500 flex items-center justify-center gap-2 dark:text-slate-400">
                                        <X className="w-4 h-4" /> Order Cancelled
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
