'use client';
import { useState } from 'react';
import { Search, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import NotificationBell from '../common/NotificationBell';
import { getProductImageUrl } from '../../lib/storage';


// Categories are now dynamic based on available products
// const CATEGORIES = ... (removed)

// BRANDS removed (unused)

const OFFERS = [
    {
        id: 1,
        title: 'Best Atta Prices Today',
        subtitle: 'Fresh Chakki Atta Stock',
        image: '/assets/retailer_banner_atta.svg',
        gradient: 'from-amber-900/80 to-transparent'
    },
    {
        id: 2,
        title: 'Lowest Oil Rates This Week',
        subtitle: 'Save flat 10% on Edible Oils',
        image: '/assets/retailer_banner_oil.svg',
        gradient: 'from-yellow-900/80 to-transparent'
    },
    {
        id: 3,
        title: 'Bulk Rice Deals for Kirana',
        subtitle: 'Basmati & Regular Rice',
        image: '/assets/retailer_banner_rice.svg',
        gradient: 'from-slate-900/80 to-transparent'
    },
];

export default function RetailerHome({ onNavigate }: { onNavigate: (route: string, params?: any) => void }) {
    const { products, addToCart, cartItems, unreadCount } = useStore();

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // --- HELPER: CATEGORY ICONS (SVG) ---
    const getCategoryIcon = (category: string) => {
        const lower = category.toLowerCase();
        const iconClass = "w-4 h-4";

        if (lower === 'all') return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        );
        if (lower.includes('staple') || lower.includes('atta')) return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
        );
        if (lower.includes('oil') || lower.includes('ghee')) return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
        );
        if (lower.includes('rice')) return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
        ); // Keeping vague for grain
        if (lower.includes('spice')) return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
        );
        if (lower.includes('tea') || lower.includes('coffee')) return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
        );

        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
        );
    };

    // 1. Extract Unique Categories & Brands for Filters
    const availableCategories = ['All', ...Array.from(new Set(products.map(p => p.category || 'Uncategorized')))];

    // 2. Filter Logic
    const filteredProducts = products.filter(p => {
        // Search & Brand Filter
        const matchesSearch = !searchTerm.trim() || (
            p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            (p.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase().trim()) ||
            (p.category?.toLowerCase() || '').includes(searchTerm.toLowerCase().trim())
        );
        const matchesBrand = !selectedBrand || p.brand === selectedBrand;

        // Category Filter
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

        return matchesSearch && matchesBrand && matchesCategory;
    });

    return (
        <div className="pb-24 pt-4 bg-slate-50 dark:bg-black min-h-screen">
            {/* Header */}
            <div className="px-4 mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Mandi<span className="text-green-600 dark:text-green-500">Bhai</span></h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wholesale Market</p>
                </div>
                <NotificationBell
                    count={unreadCount}
                    onClick={() => onNavigate('notifications')}
                />
            </div>

            {/* Search */}
            <div className="px-4 mb-6 sticky top-0 z-20 bg-slate-50 dark:bg-black pt-2 pb-2">
                <div className="relative shadow-sm">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:focus:ring-green-500/20 transition-all dark:placeholder-slate-500"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
            </div>

            {/* Banners (Only show when checking 'All' and no search) */}
            {selectedCategory === 'All' && !searchTerm && (
                <div className="mb-6 overflow-x-auto no-scrollbar px-4 flex gap-4 snap-x">
                    {OFFERS.map((offer) => (
                        <div
                            key={offer.id}
                            onClick={() => setSelectedCategory(offer.title.includes('Oil') ? 'Oil & Ghee' : offer.title.includes('Atta') ? 'Staples' : 'Rice')}
                            className="min-w-[260px] h-36 rounded-2xl relative overflow-hidden flex-shrink-0 snap-center shadow-md group cursor-pointer"
                        >
                            <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className={`absolute inset-0 bg-gradient-to-r ${offer.gradient} flex flex-col justify-center px-5`}>
                                <h3 className="text-white font-bold text-lg w-2/3 leading-tight mb-1">{offer.title}</h3>
                                <p className="text-white/90 text-[10px] font-medium">{offer.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Category Filter Bar (Horizontal Chips) */}
            <div className="sticky top-[70px] z-10 bg-slate-50/95 dark:bg-black/95 backdrop-blur-sm pb-2 pt-1 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
                    {availableCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat
                                ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-green-200 dark:hover:border-slate-700'
                                }`}
                        >
                            {/* Icon is now a React Node */}
                            {getCategoryIcon(cat)}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="px-4 grid grid-cols-2 gap-3 pb-8">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => onNavigate('product_detail', { id: product.id })}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-3 shadow-sm flex flex-col justify-between h-full cursor-pointer hover:border-green-300 dark:hover:border-green-700 transition-all relative group"
                    >
                        {/* Image */}
                        <div className="relative mb-3 aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 flex items-center justify-center">
                            <img
                                src={getProductImageUrl(product.image_key)}
                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                alt={product.name}
                                loading="lazy"
                                onError={(e) => { e.currentTarget.src = '/assets/product_placeholder.png'; }}
                            />
                            {product.status === 'high_price' && (
                                <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md">High Price</span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-0.5 tracking-wider">{product.brand}</p>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug mb-2 flex-grow">{product.name}</h3>

                            <div className="flex items-end justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium decoration-slate-300 line-through decoration-1 opacity-0">₹000</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">₹{product.price}</span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">/ {product.unit || 'unit'}</span>
                                    </div>
                                </div>

                                {/* Add Button */}
                                {(() => {
                                    const cartItem = cartItems.find(i => i.id === product.id);
                                    return cartItem && cartItem.qty > 0 ? (
                                        <div className="h-8 flex items-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden shadow-sm">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(product, -1); }}
                                                className="w-8 h-full flex items-center justify-center text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 font-bold"
                                            >-</button>
                                            <span className="text-xs font-bold text-green-800 dark:text-green-300 min-w-[1.5rem] text-center">{cartItem.qty}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                                                className="w-8 h-full flex items-center justify-center text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                                            >
                                                <Plus className="w-3 h-3 stroke-[3px]" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                                            className="h-8 px-4 bg-white dark:bg-slate-800 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-lg text-xs font-bold shadow-sm hover:bg-green-50 dark:hover:bg-green-900/20 active:scale-95 transition-all uppercase tracking-wide"
                                        >
                                            ADD
                                        </button>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600 opacity-60">
                    <ShoppingBag className="w-12 h-12 mb-3 stroke-1" />
                    <p className="text-sm font-medium">No products found</p>
                </div>
            )}
        </div>
    );
}
