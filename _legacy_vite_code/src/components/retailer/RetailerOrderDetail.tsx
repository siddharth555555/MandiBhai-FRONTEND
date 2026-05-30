import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Phone, MapPin, Clock, Plus, Minus, Trash2, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface RetailerOrderDetailProps {
    orderId: string;
    onBack: () => void;
    onNavigate?: (route: string, params?: any) => void;
}

export default function RetailerOrderDetail({ orderId, onBack, onNavigate }: RetailerOrderDetailProps) {
    const { orders, updateOrderLineItem, removeOrderLineItem, updateOrderStatus, products, addToCart } = useStore();
    const order = orders.find(o => o.id === orderId);

    // Live Timer Logic
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <p className="text-slate-500">Order not found</p>
                <button onClick={onBack} className="mt-4 text-green-700 font-bold">Go Back</button>
            </div>
        );
    }

    const getEditTimeLeft = () => {
        if (!order.createdAt) return "00:00";
        const end = order.createdAt + 60000; // 1 min window
        const diff = end - now;
        if (diff <= 0) return null;
        const s = Math.floor(diff / 1000);
        return `00:${s.toString().padStart(2, '0')}`;
    };

    const isNew = order.status === 'placed';
    const isAccepted = order.status === 'accepted';
    const isPacked = order.status === 'packed';
    const isDispatched = order.status === 'out_for_delivery';
    const isDelivered = order.status === 'delivered';
    const isCancelled = order.status === 'cancelled';


    const editTimeLeft = isNew ? getEditTimeLeft() : null;
    const isEditable = isNew && editTimeLeft !== null;


    const handleReorder = () => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                addToCart(product, item.qty);
            }
        });
        if (onNavigate) {
            onNavigate('cart');
        }
    };

    // Mock Driver Data
    const mockDriverWithVehicle = {
        name: "Rahul Kumar",
        phone: "+91 98765 43210",
        vehicle: "Tata Ace",
        vehicleNo: "DL 1L AB 1234",
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
                <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-800">Order Details</h1>
                    <p className="text-xs text-slate-500">#{order.id.split('-').pop()}</p>
                </div>
                {/* Status Badge in Header */}
                <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full capitalize",
                    isDelivered ? "bg-green-50 text-green-700" :
                        isCancelled ? "bg-red-50 text-red-700" :
                            isDispatched ? "bg-purple-50 text-purple-700" :
                                isPacked ? "bg-blue-100 text-blue-700" :
                                    isAccepted ? "bg-blue-600 text-white" :
                                        isNew ? "bg-amber-100 text-amber-700" :
                                            "bg-slate-100 text-slate-600"
                )}>
                    {isAccepted ? 'Confirmed' : isNew ? 'Processing' : order.status.replace(/_/g, ' ')}

                </span>
            </header>

            {/* Lifecycle Stepper (Hide if Unfulfillable or Cancelled) */}
            {!isCancelled && (

                <div className="bg-white border-b border-slate-100 z-30 sticky top-[57px] overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex items-center px-4 py-4 min-w-[320px] justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />

                        {[
                            { id: 'placed', label: 'Placed' },
                            { id: 'accepted', label: 'Accepted' },
                            { id: 'packed', label: 'Packed' },
                            { id: 'out_for_delivery', label: 'Dispatch' },
                            { id: 'delivered', label: 'Delivered' }
                        ].map((step, idx) => {
                            const getStepStatus = (stepId: string) => {
                                const steps = ['placed', 'accepted', 'packed', 'out_for_delivery', 'delivered'];

                                let currentStatus = order.status;
                                // Treat PLACED and CONFIRMING as effectively distinct for visual progress if needed, 
                                // but logically PLACED -> CONFIRMING is instant in our app.
                                // If status is PLACED, we're at step 0. 
                                // If status is CONFIRMING, we're at step 1.

                                const currentIdx = steps.indexOf(currentStatus);
                                const stepIdx = steps.indexOf(stepId);

                                if (currentIdx === -1) return 'inactive';
                                if (stepIdx < currentIdx) return 'completed';
                                if (stepIdx === currentIdx) return 'active';
                                return 'inactive';
                            };

                            const status = getStepStatus(step.id);

                            return (
                                <div key={idx} className="relative z-10 flex flex-col items-center gap-1.5">
                                    <div className={cn(
                                        "w-3 h-3 rounded-full border-2 transition-all duration-300",
                                        status === 'completed' ? "bg-green-500 border-green-500" :
                                            status === 'active' ? "bg-white border-green-500 scale-125 box-content" :
                                                "bg-white border-slate-200"
                                    )}>
                                        {status === 'active' && <div className="w-1.5 h-1.5 bg-green-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold whitespace-nowrap transition-colors",
                                        status === 'completed' || status === 'active' ? "text-slate-800" : "text-slate-300"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="p-4 space-y-4">

                {/* UNFULFILLABLE Warning */}
                {isCancelled && (

                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-red-700 text-sm">Order Unfulfillable</h3>
                                <p className="text-xs text-red-600 mt-1 leading-relaxed">
                                    Unfortunately, we could not fulfill your order at this time.
                                    Any payment made will be refunded within 24 hours.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleReorder}
                                className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-all shadow-sm shadow-red-200"
                            >
                                Add items back to cart
                            </button>
                            <button
                                onClick={() => onNavigate?.('home')}
                                className="flex-1 py-2.5 bg-white text-slate-600 border border-slate-200 text-xs font-bold rounded-lg active:scale-95 transition-all hover:bg-slate-50"
                            >
                                Try ordering again later
                            </button>
                        </div>
                    </div>
                )}


                {/* Status Banner / Timer / Cancellation */}
                {isEditable ? (
                    <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 shadow-sm relative overflow-hidden">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Review Your Order</h3>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                    You can modify items or cancel within this window. Order will be locked automatically.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex justify-center items-center gap-2 bg-white/50 p-2.5 rounded-lg border border-amber-100/50">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Time Left:</span>
                                <span className="text-xl font-mono font-bold text-amber-700 tracking-wider">
                                    {editTimeLeft}
                                </span>
                            </div>
                            {/* Removed Manual Confirm Button as per 'Automatically move order' request, or keep it for 'Confirm Now'?
                                Request says 'After provided countdown ends... auto move'.
                                Usually good UX to allow early confirm. I'll NOT implement a button unless asked, to strictly verify the timer.
                                User said "Show cancel + edit options".
                                Previous code had 'Confirm Now'. I will remove it to force reliance on timer/auto-accept or just just focus on Edit/Cancel.
                                User didn't ask for "Confirm Now".
                            */}
                        </div>
                        {/* Cancel Button */}
                        <div className="mt-2 pt-2 border-t border-amber-100/50 text-center">
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to cancel this order?')) {
                                        updateOrderStatus(orderId, 'cancelled');

                                    }
                                }}
                                className="text-xs font-bold text-red-500 hover:text-red-600 underline"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                                isDelivered ? 'bg-green-50 text-green-600' :
                                    isCancelled ? 'bg-red-50 text-red-600' :
                                        isDispatched ? 'bg-purple-50 text-purple-600' :
                                            isAccepted ? 'bg-blue-50 text-blue-600' :
                                                'bg-slate-100 text-slate-600'
                            )}>
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-800 text-sm">
                                    {isAccepted ? 'Order Confirmed' :
                                        isPacked ? 'Order Packed' :
                                            isDispatched ? 'Out for Delivery' :
                                                isDelivered ? 'Order Delivered' :
                                                    isCancelled ? 'Order Cancelled' :
                                                        order.status.replace(/_/g, ' ')}

                                </h2>
                                <p className="text-xs text-slate-500">{order.date}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Driver Info (Only DISPATCHED) */}
                {isDispatched && (
                    <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm animate-in slide-in-from-bottom-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Driver Details</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">
                                {mockDriverWithVehicle.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{mockDriverWithVehicle.name}</h4>
                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                    <span>{mockDriverWithVehicle.vehicle}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span>{mockDriverWithVehicle.vehicleNo}</span>
                                </div>
                            </div>
                            <a href={`tel:${mockDriverWithVehicle.phone}`} className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                                <Phone className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Items List */}
                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Ordered Products</h3>
                        {isEditable && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Editing Enabled
                            </span>
                        )}
                    </div>

                    <div className="divide-y divide-slate-50">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 py-3 first:pt-0">
                                <img src={item.img} alt={item.name} className="w-14 h-14 rounded-lg bg-slate-50 object-cover border border-slate-100 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{item.name}</h4>
                                    <div className="flex justify-between items-end">
                                        {isEditable ? (
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                                                    <button
                                                        onClick={() => item.qty > 1 ? updateOrderLineItem(orderId, item.id, item.qty - 1) : removeOrderLineItem(orderId, item.id)}
                                                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-red-500 active:scale-95 transition-all"
                                                    >
                                                        {item.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <span className="text-sm font-bold w-6 text-center text-slate-800">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateOrderLineItem(orderId, item.id, item.qty + 1)}
                                                        className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-green-600 active:scale-95 transition-all"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="text-xs text-slate-400">× ₹{item.price}</div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-slate-500">
                                                <span className="font-medium text-slate-700">{item.qty} units</span>
                                                <span className="mx-1.5 text-slate-300">|</span>
                                                ₹{item.price}/unit
                                            </div>
                                        )}
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">₹{item.price * item.qty}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bill Details */}
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Item Total</span>
                            <span>₹{order.total}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Delivery Charges</span>
                            <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 text-sm">
                            <span className="font-bold text-slate-800">Grand Total</span>
                            <span className="font-bold text-slate-900 text-base dark:text-white">₹{order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Info (Mock) */}
                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Delivery Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-slate-800">Delivery Address</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                    Shri Krishna Kirana Store<br />
                                    Shop No. 12, Main Market, Sector 4<br />
                                    New Delhi, 110001
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-slate-800">Phone Number</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{order.customerPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
