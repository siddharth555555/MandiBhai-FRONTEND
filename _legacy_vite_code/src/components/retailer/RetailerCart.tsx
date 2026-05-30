import { useStore } from '../../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, Loader2, Store, AlertTriangle } from 'lucide-react';
import MinimumOrderModal from '../MinimumOrderModal';
import { useState } from 'react';

export default function RetailerCart({ onNavigate }: { onNavigate?: (tab: string) => void }) {
    const { cartItems, removeFromCart, addToCart, placeOrder, products,
        isOrderMinimumModal, minimumOrderErrors, dismissMinimumModal,
        getGroupedCartSummary } = useStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const splitGroups = getGroupedCartSummary();

    // Defensive total calculation: only count items with valid quantity >= 1
    const totalAmount = cartItems
        .filter(item => item.qty >= 1)
        .reduce((acc, item) => acc + (item.price * item.qty), 0);

    const handlePlaceOrder = async () => {
        if (totalAmount <= 0 || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await placeOrder({
                customerName: "Current Retailer",
                customerPhone: "+91 98765 00000",
                title: `Order #${Math.floor(Math.random() * 1000)}`,
                total: totalAmount,
                items: cartItems.filter(item => item.qty >= 1),
                paymentMethod: "Cash on delivery"
            } as any);
            if (onNavigate) onNavigate('orders');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ... (Empty state check remains same)

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-950 transition-colors duration-300">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800">
                    <Minus className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">Your cart is empty</h2>
                <p className="text-slate-500 text-sm mt-1 dark:text-slate-400">Add items from the Home screen to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-32 dark:bg-slate-950 transition-colors duration-300">
            {/* Minimum order modal — shown when any group fails pre-flight */}
            {isOrderMinimumModal && (
                <MinimumOrderModal
                    errors={minimumOrderErrors}
                    onClose={dismissMinimumModal}
                />
            )}

            <header className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-2 sticky top-0 z-10 dark:bg-slate-900 dark:border-slate-800">
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">My Cart ({cartItems.length})</h1>
            </header>

            <div className="p-4 space-y-3">
                {cartItems.filter(item => item.qty > 0).map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <img src={item.img} className="w-14 h-14 rounded-lg bg-slate-50 object-cover dark:bg-slate-800" onError={(e) => { e.currentTarget.src = '/assets/product_placeholder.png'; }} />
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</h3>
                                <p className="text-xs text-slate-500 font-bold dark:text-slate-400">₹{item.price}/kg</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <button onClick={() => removeFromCart(item.id as number)} className="text-slate-400 p-1 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1 dark:bg-slate-800">
                                <button
                                    onClick={() => {
                                        const fullProduct = products.find(p => p.id === item.id);
                                        if (fullProduct) {
                                            addToCart(fullProduct, -1);
                                        }
                                    }}
                                    className="p-1 bg-white rounded shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 border dark:border-slate-600"
                                >
                                    <Minus className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                                </button>
                                <span className="text-xs font-bold text-slate-800 min-w-[16px] text-center dark:text-slate-200">{item.qty}</span>
                                <button
                                    onClick={() => {
                                        const fullProduct = products.find(p => p.id === item.id);
                                        if (fullProduct) {
                                            addToCart(fullProduct, 1);
                                        }
                                    }}
                                    className="p-1 bg-green-600 rounded shadow-sm text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white px-4 py-4 border-t border-slate-100 fixed bottom-0 w-full z-20 pb-20 dark:bg-slate-900 dark:border-slate-800">

                {/* ── Split Order Preview ─────────────────────────────────── */}
                {splitGroups.length > 0 && (
                    <div className="mb-3">
                        {splitGroups.length > 1 && (
                            <div className="flex items-center gap-1.5 mb-2 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="text-xs font-semibold">
                                    This will create {splitGroups.length} separate orders:
                                </span>
                            </div>
                        )}
                        {splitGroups.length === 1 && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 font-medium">
                                Order will be placed with:
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {splitGroups.map(g => (
                                <div
                                    key={g.wholesalerId}
                                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg px-2.5 py-1.5"
                                >
                                    <Store className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        {g.wholesalerName}
                                    </span>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                                        ₹{g.subtotal}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Total + Button ──────────────────────────────────────── */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-slate-500 font-medium dark:text-slate-400">Total Amount</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{totalAmount}</span>
                </div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-green-600 text-white font-bold text-sm rounded-xl shadow-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-green-700 dark:hover:bg-green-600">
                    {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</>
                    ) : (
                        <>Place Order <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>
        </div>
    );
}
