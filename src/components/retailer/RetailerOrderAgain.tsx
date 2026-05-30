'use client';
import { useState } from 'react';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Plus,
    Edit,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import RetailerCartCreator from './RetailerCartCreator';
import { useStore, Product } from '../../context/StoreContext';
import { getProductImageUrl } from '../../lib/storage';
// import { useNotification } from '../../context/NotificationContext';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Mock data completely removed in favor of global state store

// PAST_ORDERS replaced by global state

export default function RetailerOrderAgain() {
    const { frequentCarts, addToCart, products, cartItems, removeFromCart, addNotification, orders } = useStore();
    // const { addNotification } = useNotification();
    const [activeTab, setActiveTab] = useState<'past_orders' | 'frequent_carts'>('past_orders');
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [showCartCreator, setShowCartCreator] = useState(false);
    const [editingCart, setEditingCart] = useState<any>(null);

    const sortedOrders = [...orders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    const handleAddToCart = (item: any, qty: number = 1) => {
        // Try to find the real product to get current price/details
        const realProduct = products.find(p => p.id === item.id);

        let productToAdd: Product;

        if (realProduct) {
            productToAdd = realProduct;
        } else {
            // Fallback for items not in current catalog
            // Create a mock product that satisfies the Product interface
            productToAdd = {
                id: item.id,
                name: item.name,
                price: item.price,
                img: item.img,
                totalStock: '100', // Mock
                status: 'active',
                ...item
            };
        }

        addToCart(productToAdd, qty);
        addNotification({
            type: 'PRODUCT',
            title: 'Added to Cart',
            message: `${productToAdd.name} added to your cart.`,
            actionRoute: 'cart'
        });
    };

    const getCartQty = (itemId: number | string) => {
        const item = cartItems.find(i => i.id === itemId);
        return item ? item.qty : 0;
    };

    const handleUpdateQty = (item: any, delta: number) => {
        const currentQty = getCartQty(item.id);
        const newQty = currentQty + delta;

        if (newQty <= 0) {
            removeFromCart(item.id);
        } else {
            // Re-construct product object for addToCart as it expects a Product
            // In a real app we might just need ID for updates if addToCart supported it, 
            // but here we reuse the product construction logic or pass the item if it matches enough.
            // reusing handleAddToCart logic but handling the specific delta
            const product: Product = {
                id: item.id,
                name: item.name,
                price: item.price,
                img: item.img,
                totalStock: '100', // Mock
                status: 'active',
                ...item
            };
            addToCart(product, delta);
        }
    };

    const handleReorderAll = (items: any[]) => {
        let addedCount = 0;
        items.forEach(item => {
            const realProduct = products.find(p => p.id === item.id);
            let productToAdd: Product;

            if (realProduct) {
                productToAdd = realProduct;
            } else {
                productToAdd = {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    img: item.img,
                    totalStock: '100',
                    status: 'active',
                    ...item
                };
            }

            addToCart(productToAdd, Number(item.qty));
            addedCount++;
        });

        if (addedCount > 0) {
            addNotification({
                type: 'ORDER',
                title: 'Order Items Added',
                message: `All items from the order have been added to your cart.`,
                actionRoute: 'cart'
            });
        }
    };

    const handleOrderFrequentCart = (cart: any) => {
        if (cart.items && Array.isArray(cart.items)) {
            cart.items.forEach((item: any) => {
                const realProduct = products.find(p => p.id === item.id);
                let productToAdd: Product;

                if (realProduct) {
                    productToAdd = realProduct;
                } else {
                    productToAdd = {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        img: item.img,
                        totalStock: '100',
                        status: 'active',
                        ...item
                    };
                }
                addToCart(productToAdd, item.qty || 1);
            });
            addNotification({
                type: 'ORDER',
                title: 'Frequent Cart Added',
                message: `${cart.name} items added to your cart.`,
                actionRoute: 'cart'
            });
        }
    }

    const handleEditFrequentCart = (cart: any) => {
        setEditingCart(cart);
        setShowCartCreator(true);
    };

    if (showCartCreator) {
        return <RetailerCartCreator
            onBack={() => {
                setShowCartCreator(false);
                setEditingCart(null);
            }}
            initialData={editingCart}
        />;
    }

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col pb-24 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 dark:bg-slate-900 dark:border-slate-800">
                <button className="p-1 -ml-1 text-slate-600 dark:text-slate-400"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Order Again</h1>
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold text-xs shadow-sm">
                    <span className="sr-only">Profile</span>
                    RK
                </div>
            </header>

            {/* Tabs */}
            <div className="flex bg-white border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('past_orders')}
                    className={cn(
                        "flex-1 py-3 text-sm font-semibold relative transition-colors",
                        activeTab === 'past_orders' ? "text-green-700 dark:text-green-500" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                >
                    Past Orders
                    {activeTab === 'past_orders' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-500 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('frequent_carts')}
                    className={cn(
                        "flex-1 py-3 text-sm font-semibold relative transition-colors",
                        activeTab === 'frequent_carts' ? "text-green-700 dark:text-green-500" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    )}
                >
                    Frequent Carts
                    {activeTab === 'frequent_carts' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 dark:bg-green-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {activeTab === 'past_orders' ? (
                <div className="flex-1 overflow-auto">
                    {/* Frequently Ordered Horizontal Scroll */}
                    <div className="bg-white pt-4 pb-6 mb-3 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                        <div className="px-4 mb-3 flex justify-between items-end">
                            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Frequently Ordered</h2>
                        </div>

                        <div className="flex overflow-x-auto px-4 gap-3 no-scrollbar pb-2">
                            {products.slice(0, 10).map((item) => (
                                <div key={item.id} className="min-w-[140px] bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col relative group dark:bg-slate-900 dark:border-slate-800">
                                    <div className="relative mb-2 self-center">
                                        <img src={getProductImageUrl(item.image_key)} alt={item.name} className="w-24 h-24 object-contain bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2" />

                                        {getCartQty(item.id) > 0 ? (
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 bg-white rounded-lg shadow-md border border-slate-100 flex items-center px-1 py-1 gap-2 w-[90%] justify-between dark:bg-slate-800 dark:border-slate-700">
                                                <button
                                                    onClick={() => handleUpdateQty(item, -1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded text-slate-600 active:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:active:bg-slate-600"
                                                >
                                                    <span className="text-lg leading-none mb-0.5">-</span>
                                                </button>
                                                <span className="text-xs font-bold text-slate-800 dark:text-white">{getCartQty(item.id)}</span>
                                                <button
                                                    onClick={() => handleUpdateQty(item, 1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-green-600 rounded text-white active:bg-green-700 dark:bg-green-700 dark:active:bg-green-600"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full shadow-md translate-x-1 translate-y-1 active:scale-95 transition-transform dark:bg-green-700"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 min-h-[2.5em] leading-tight mb-1 mt-2 dark:text-slate-200">{item.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium dark:text-slate-400">₹{item.price}/{item.unit}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="px-4 mb-4 flex gap-2">
                        {['All', 'This Week', 'This Month'].map((f, i) => (
                            <button key={i} className={cn(
                                "text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors",
                                i === 0
                                    ? "bg-slate-800 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600"
                                    : "bg-white text-slate-600 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                            )}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    <div className="px-4 space-y-3 pb-6">
                        {sortedOrders.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                No past orders found.
                            </div>
                        ) : (
                            sortedOrders.map((order) => {
                                const isExpanded = expandedOrderId === order.id;

                                return (
                                    <div key={order.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                                        <div className="p-4 flex items-start justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-0.5 dark:text-slate-400">{order.date}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-slate-900 dark:text-white">₹{order.total}</span>
                                                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50">{order.status}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleReorderAll(order.items)}
                                                    className="bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors active:scale-95 dark:bg-amber-500 dark:text-amber-950"
                                                >
                                                    Reorder All
                                                </button>
                                                {order.items.length > 0 && (
                                                    <button
                                                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                        className="text-slate-400 p-1 dark:text-slate-500"
                                                    >
                                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Items */}
                                        {isExpanded && order.items.length > 0 && (
                                            <div className="bg-slate-50/50 border-t border-slate-100 p-3 space-y-3 dark:bg-slate-800/20 dark:border-slate-800/50">
                                                {order.items.map((item, idx) => {
                                                    const product = products.find(p => p.id === item.id);
                                                    return (
                                                        <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                                                            <div className="flex items-center gap-3">
                                                                <img src={product ? getProductImageUrl(product.image_key) : item.img} className="w-10 h-10 rounded bg-slate-100 object-cover dark:bg-slate-800" />
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Qty: {item.qty} • {products.find(p => p.id === item.id)?.unit || 'unit'}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAddToCart(item, Number(item.qty) || 1)}
                                                                className="text-[10px] font-bold bg-green-600 text-white px-2 py-1 rounded transition-colors hover:bg-green-700 active:scale-95 dark:bg-green-700 dark:hover:bg-green-600"
                                                            >
                                                                Reorder Item
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            ) : (
                /* FREQUENT CARTS TAB */
                <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Your Frequent Carts</h2>
                        <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Order your frequently purchased items with one click</p>
                    </div>

                    <div className="space-y-3">
                        {frequentCarts.map((cart: any) => (
                            <div key={cart.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{cart.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">{cart.itemCount} items</p>
                                    <p className="text-sm font-bold text-slate-900 mt-2 dark:text-white">{cart.total}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleOrderFrequentCart(cart)}
                                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95 dark:bg-green-700 dark:hover:bg-green-600"
                                    >
                                        Add All to Cart <Plus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEditFrequentCart(cart)}
                                        className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                    >
                                        Edit <Edit className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowCartCreator(true)}
                            className="w-full py-3 mt-4 border border-green-600 border-dashed rounded-xl flex items-center justify-center gap-2 text-green-700 font-bold text-sm bg-green-50/50 hover:bg-green-50 transition-colors active:scale-95 dark:bg-green-900/10 dark:text-green-500 dark:hover:bg-green-900/20 dark:border-green-500/50">
                            <Plus className="w-4 h-4" />
                            Create New Frequent Cart
                        </button>
                    </div>
                </div>
            )}
            {/* Sticky Cart Bar */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-4 flex items-center justify-between z-50 animate-in slide-in-from-bottom-5 dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-slate-600 line-clamp-1 dark:text-slate-300">
                            {cartItems.length <= 2
                                ? cartItems.map(i => i.name).join(', ')
                                : `${cartItems[0].name} + ${cartItems.length - 1} more`
                            }
                        </p>
                    </div>
                    <button
                        onClick={() => { }}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold active:scale-95 transition-transform shadow-lg dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
                    >
                        Go to Cart
                    </button>
                </div>
            )}
        </div>
    );
}
