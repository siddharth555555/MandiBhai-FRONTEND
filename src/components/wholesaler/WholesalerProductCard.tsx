'use client';
import { Edit3, Clock, AlertCircle } from 'lucide-react';
import { Product, PendingProduct } from '../../context/StoreContext';
import { getProductImageUrl } from '../../lib/storage';

interface WholesalerProductCardProps {
    product: Product | PendingProduct;
    onEdit: (product: any) => void;
}

export default function WholesalerProductCard({ product, onEdit }: WholesalerProductCardProps) {
    const isPending = 'status' in product && (product.status === 'pending' || product.status === 'rejected');
    const isProduct = !isPending;

    // Type casting for convenience in the UI
    const p = product as Product;
    const pending = product as PendingProduct;

    return (
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start gap-3 active:scale-[0.99] transition-all relative group dark:bg-slate-900 dark:border-slate-800">
            {/* Image */}
            <div className="relative shrink-0">
                <img
                    src={getProductImageUrl(product.image_key)}
                    alt={product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                    onError={(e) => { e.currentTarget.src = '/assets/product_placeholder.png'; }}
                />
                {isPending && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                        {pending.status === 'pending' ? <Clock className="w-5 h-5 text-amber-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-0.5 pr-6">
                <div className="mb-1">
                    <h3 className="text-sm font-semibold text-slate-700 leading-tight line-clamp-1 dark:text-slate-200">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            {isProduct ? `${p.totalStock} ${p.unit && `(${p.unit})`}` : (pending.status === 'pending' ? 'Pending Moderation' : 'Rejected')}
                        </span>
                        {product.category && (
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider before:content-['•'] before:mr-1 before:opacity-50">
                                {product.category}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-end justify-between mt-1.5">
                    {isProduct && <p className="text-slate-900 font-extrabold text-lg leading-none tracking-tight dark:text-white">₹{p.price}</p>}
                    {!isProduct && <p className="text-xs font-bold text-amber-600 uppercase tracking-tighter">{pending.status}</p>}

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-1 justify-end">
                        {isProduct && p.status === 'high_price' && (
                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-md border border-purple-100 font-bold whitespace-nowrap dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/30">
                                High Price
                            </span>
                        )}
                        {isProduct && p.status === 'expiring' && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md border border-amber-100 font-bold whitespace-nowrap dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30">
                                Expiring
                            </span>
                        )}
                        {isProduct && p.status === 'out_of_stock' && (
                            <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-md border border-red-100 font-bold whitespace-nowrap dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                                Out of Stock
                            </span>
                        )}
                        {isPending && pending.status === 'rejected' && (
                            <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md border border-red-100 font-bold dark:bg-red-900/20 dark:text-red-400">
                                Fix Required
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Action - Subtle & Absolute */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                }}
                className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 active:opacity-100 touch-manipulation"
                aria-label="Edit product"
            >
                <Edit3 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

