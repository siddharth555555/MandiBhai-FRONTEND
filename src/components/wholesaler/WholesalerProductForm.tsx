'use client';
import { useState } from 'react';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useStore } from '../../context/StoreContext';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface WholesalerProductFormProps {
    onBack: () => void;
    onSubmit?: () => void;
    product?: any;
    mode: 'add' | 'edit' | 'stock' | 'price';
}

export default function WholesalerProductForm({ onBack, onSubmit, product, mode }: WholesalerProductFormProps) {
    const { addProduct, createListing, updateProduct } = useStore();


    // Form State
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [stock, setStock] = useState(product?.totalStock?.toString() || '');
    const [startTime, setStartTime] = useState('06:00');
    const [endTime, setEndTime] = useState('14:00');

    // For simple add mode, we might need name/category if not provided (keeping concise as requested)
    const [name, setName] = useState(product?.name || '');
    const [brand, setBrand] = useState(product?.brand || '');

    const isPending = product?.approvalStatus === 'PENDING';
    const isRejected = product?.approvalStatus === 'REJECTED';

    // Validation Logic
    const isStrictValidation = mode === 'add' || isPending || isRejected;
    const isValid =
        isStrictValidation
            ? (name.trim().length > 0 &&
                brand.trim().length > 0 &&
                price.length > 0 && parseInt(price) > 0 &&
                stock.length >= 0 &&
                startTime < endTime)
            : true;

    const handleSave = async () => {
        const stockNum = parseInt(stock) || 0;
        const priceNum = parseInt(price) || 0;

        if (mode === 'add') {
            if (product?.id) {
                // Flow A: Create listing from Master Catalogue
                await createListing({
                    productId: product.id,
                    price: priceNum,
                    stock: stockNum
                });
            } else {
                // Flow B: Submit new product for moderation
                addProduct({
                    name: name || 'New Product',
                    brand: brand || 'Generic',
                    image_key: 'tata_salt_1kg', // Placeholder or image upload logic
                    unit: 'kg',
                    category: 'Staples'
                });
            }

            if (onSubmit) {
                onSubmit();
                return;
            }
        } else if (product) {
            // Edit Mode (Updates product_listings entry)
            updateProduct(product.id, {
                price: priceNum,
                totalStock: stockNum,
                validityStart: startTime,
                validityEnd: endTime
            });
        }
        onBack();
    };


    const title = mode === 'add' ? (product?.id ? 'List from Catalogue' : 'New Product Request') : 'Edit My Listing';
    const buttonLabel = mode === 'add' ? (product?.id ? 'Activate My Listing' : 'Submit for Moderation') : 'Save Changes';


    return (
        <div className="fixed inset-0 z-[70] bg-slate-50 overflow-y-auto flex flex-col pb-32">
            {/* Header */}
            <div className="bg-white px-4 py-3 sticky top-0 z-50 border-b border-slate-100 flex items-center gap-3">
                <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">{title}</h1>
            </div>

            <div className="p-4 space-y-4 max-w-lg mx-auto w-full">

                {/* Rejection Alert */}
                {isRejected && product?.rejectionReason && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-red-800 mb-1">Rejected by Admin</h3>
                            <p className="text-xs text-red-700 leading-relaxed font-medium">
                                {product.rejectionReason}
                            </p>
                        </div>
                    </div>
                )}

                {/* Product Details */}
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Product Name</label>
                        <input
                            readOnly={mode !== 'add' && !isPending && !isRejected} // Allow edit if Add, Pending, or Rejected. (Wait, standard edit allows name logic? The prompt was: "Pending... Allow editing: name, brand". Existing code had `readOnly={mode !== 'add'}` which was weird for standard edit. Actually, prompt implies we fix standard edit too? "Disabled editing: price, stock" for Pending. Implies enabled for others.)
                            // Actually, let's fix the logic:
                            // Name/Brand: Editable if Add OR Pending OR Rejected. (Standard edit might allow it too but let's stick to request constraints or safe defaults. Existing code had `readOnly={mode !== 'add'}`. I will change it to `readOnly={false}` effectively, or at least for this flow).
                            // User rule: "Pending: Allow editing name, brand". So readOnly should be false.
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Tata Salt"
                            className="w-full text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none border-b border-slate-100 pb-2"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Brand</label>
                        <input
                            readOnly={mode !== 'add' && !isPending && !isRejected} // Same logic
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="e.g. Tata"
                            className="w-full text-base font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none border-b border-slate-100 pb-2"
                        />
                    </div>
                </div>

                {/* Price & Stock Card */}
                <div className={cn("bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-6", isPending && "opacity-60 grayscale-[0.5]")}>
                    {/* Price Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Selling Price</label>
                        <div className="relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
                            <input
                                disabled={isPending}
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="w-full pl-6 text-3xl font-extrabold text-slate-800 placeholder:text-slate-200 focus:outline-none disabled:bg-transparent disabled:cursor-not-allowed"
                                placeholder="0"
                            />
                        </div>
                        {/* Market Price Indicator */}
                        <div className="mt-2 text-xs font-medium text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded">
                            Market Rate: <span className="text-slate-700 font-bold">₹45/kg</span>
                        </div>
                    </div>

                    {/* Stock Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Internal Stock</label>
                        <div className="flex items-baseline gap-2">
                            <input
                                disabled={isPending}
                                type="number"
                                value={stock}
                                onChange={e => setStock(e.target.value)}
                                className="w-24 text-2xl font-bold text-slate-800 placeholder:text-slate-200 focus:outline-none border-b border-slate-200 pb-1 focus:border-blue-500 transition-colors disabled:bg-transparent disabled:border-transparent disabled:cursor-not-allowed"
                                placeholder="0"
                            />
                            <span className="text-sm font-bold text-slate-400">kg</span>
                        </div>
                    </div>
                </div>

                {/* Validity Card */}
                <div className={cn("bg-white rounded-xl p-4 border border-slate-100 shadow-sm", isPending && "opacity-60 grayscale-[0.5]")}>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Price Validity</label>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <span className="block text-[10px] text-slate-400 font-bold mb-1">STARTS</span>
                            <input
                                disabled={isPending}
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="w-px h-8 bg-slate-100 self-end mb-2" />
                        <div className="flex-1">
                            <span className="block text-[10px] text-slate-400 font-bold mb-1">ENDS</span>
                            <input
                                disabled={isPending}
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {isPending && (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-xs text-amber-700 flex items-start gap-2">
                        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Some fields (Price, Stock, Validity) are locked while your product is under review.</p>
                    </div>
                )}

            </div>

            {/* Footer */}
            <div className="fixed bottom-0 w-full left-0 bg-white p-4 border-t border-slate-100 z-50 safe-area-pb">
                <button
                    disabled={!isValid}
                    onClick={handleSave}
                    className={cn(
                        "w-full font-bold text-base py-3.5 rounded-xl shadow-lg transition-all",
                        isValid
                            ? "bg-green-600 text-white shadow-green-200 active:scale-[0.98]"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    )}
                >
                    {buttonLabel}
                </button>
                {!isValid && (
                    <p className="text-center text-[10px] font-medium text-slate-400 mt-2">
                        Please fill all details to submit
                    </p>
                )}
            </div>
        </div>
    );
}
