'use client';
import { ArrowLeft, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
// Product removed (unused)
import { getProductImageUrl } from '../../lib/storage';

interface RetailerProductListProps {
    filters: {
        category?: string;
        brand?: string;
        search?: string;
    };
    onBack: () => void;
    onNavigate: (route: string, params?: any) => void;
}

export default function RetailerProductList({ filters, onBack, onNavigate }: RetailerProductListProps) {
    const { products, addToCart } = useStore();

    // Filter Logic
    const filteredProducts = products.filter(p => {
        let match = true;
        if (filters.category) {
            match = match && (p.category?.toLowerCase() === filters.category.toLowerCase() || p.category === filters.category);
        }
        if (filters.brand) {
            match = match && p.brand?.toLowerCase() === filters.brand.toLowerCase();
        }
        if (filters.search) {
            match = match && (
                p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                (p.brand?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
            );
        }
        return match;
    });

    const title = filters.search ? `Results for "${filters.search}"`
        : filters.category ? filters.category
            : filters.brand ? filters.brand
                : 'Products';

    return (
        <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
                <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full dark:text-slate-400 dark:hover:bg-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-800 capitalize leading-tight dark:text-white">{title}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{filteredProducts.length} items</p>
                </div>
            </div>

            {/* Product Grid */}
            <div className="p-4">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => onNavigate('product_detail', { id: product.id })}
                                className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm flex flex-col justify-between h-full cursor-pointer hover:border-green-200 transition-colors dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                            >
                                <div>
                                    <div className="relative mb-2">
                                        <img src={getProductImageUrl(product.image_key)} className="w-full h-32 object-contain bg-slate-50 rounded-lg dark:bg-slate-800" alt={product.name} />
                                        {product.status === 'high_price' && (
                                            <span className="absolute top-1 right-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded dark:bg-amber-900/30 dark:text-amber-500">High Price</span>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight mb-1 dark:text-slate-200">{product.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-3">
                                        <p className="text-sm font-bold text-green-700 dark:text-green-400">₹{product.price}</p>
                                        <span className="text-slate-400 text-xs font-normal dark:text-slate-500">/{product.unit || 'unit'}</span>
                                    </div>
                                </div>
                                {(() => {
                                    const cartItem = useStore().cartItems.find(i => i.id === product.id);
                                    return cartItem ? (
                                        <div className="w-full h-9 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg overflow-hidden dark:bg-green-900/20 dark:border-green-800">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product, -1);
                                                }}
                                                className="w-8 h-full flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors dark:text-green-400 dark:hover:bg-green-900/30"
                                            >
                                                <span className="text-lg font-bold leading-none mb-1">-</span>
                                            </button>
                                            <span className="text-sm font-bold text-green-800 dark:text-green-300">{cartItem.qty}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product, 1);
                                                }}
                                                className="w-8 h-full flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors dark:text-green-400 dark:hover:bg-green-900/30"
                                            >
                                                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product, 1);
                                            }}
                                            className="w-full py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-green-100 active:scale-95 transition-all dark:bg-slate-800 dark:text-green-400 dark:border-slate-700 dark:hover:bg-slate-700">
                                            <Plus className="w-3.5 h-3.5" /> Add
                                        </button>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-60 dark:text-slate-600">
                        <ShoppingBag className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
                        <p className="font-medium text-slate-500 dark:text-slate-500">No products found</p>
                        <p className="text-xs mt-1">Try changing filters or search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
}
