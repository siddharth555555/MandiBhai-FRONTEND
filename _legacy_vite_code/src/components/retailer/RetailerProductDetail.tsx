import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProductImageUrl } from '../../lib/storage';
import { useState } from 'react';

interface RetailerProductDetailProps {
    productId: string;
    onBack: () => void;
    onNavigate: (route: string, params?: any) => void;
}

export default function RetailerProductDetail({ productId, onBack, onNavigate }: RetailerProductDetailProps) {
    const { products, addToCart, cartItems: cart } = useStore();
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    const [qty, setQty] = useState(1);

    if (!product) {
        return <div className="p-8 text-center">Product not found</div>;
    }

    const handleAdd = () => {
        addToCart(product, qty);
        setQty(1);
    };

    return (
        <div className="bg-white min-h-screen relative pb-24 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center gap-4 border-b border-slate-100 safe-area-pt dark:bg-slate-900/80 dark:border-slate-800">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors dark:hover:bg-slate-800">
                    <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </button>
                <h1 className="font-bold text-slate-800 text-lg line-clamp-1 flex-1 dark:text-white">{product.name}</h1>
                <button onClick={() => onNavigate('cart')} className="p-2 relative">
                    <ShoppingCart className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    {cart.length > 0 && (
                        <span className="absolute top-1 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center dark:ring-2 dark:ring-slate-900">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Image */}
            <div className="h-72 w-full bg-slate-50 flex items-center justify-center p-8 dark:bg-slate-900">
                <img src={getProductImageUrl(product.image_key)} alt={product.name} className="h-full w-full object-contain" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
                <div>
                    {product.status === 'high_price' && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block dark:bg-amber-900/30 dark:text-amber-500">High Price Alert</span>
                    )}
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 dark:text-white">{product.name}</h2>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-green-700 dark:text-green-500">₹{product.price}</span>
                        <span className="text-slate-500 font-medium mb-1.5 dark:text-slate-400">/{product.unit}</span>
                    </div>
                </div>

                {/* Rating / Info (Mock) */}
                <div className="flex gap-4 py-4 border-t border-b border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">4.8</span>
                        <span className="text-slate-400 text-sm dark:text-slate-500">(120 reviews)</span>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-2 dark:text-slate-200">Description</h3>
                    <p className="text-slate-600 leading-relaxed text-sm dark:text-slate-400">
                        Premium quality {product.name.toLowerCase()} sourced directly from the best farms.
                        Perfect for daily household consumption.
                    </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">Pure</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">Fresh Stock</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">Best Seller</span>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 safe-area-pb shadow-lg z-20 dark:bg-slate-900 dark:border-slate-800 dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
                {cartItem ? (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-xs text-slate-500 font-medium dark:text-slate-400">In cart</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{cartItem.qty * product.price}</p>
                        </div>
                        <button
                            onClick={() => onNavigate('cart')}
                            className="bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform dark:bg-green-600 dark:shadow-green-900/20"
                        >
                            View Cart
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <div className="flex items-center gap-4 bg-slate-100 rounded-xl px-4 dark:bg-slate-800">
                            <button
                                onClick={() => setQty(Math.max(1, qty - 1))}
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-slate-900 w-4 text-center dark:text-white">{qty}</span>
                            <button
                                onClick={() => setQty(qty + 1)}
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-2 dark:bg-white dark:text-slate-900 dark:shadow-slate-900/20"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
