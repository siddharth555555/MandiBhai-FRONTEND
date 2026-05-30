'use client';
// useState removed (unused)
import { ArrowLeft, AlertCircle, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WholesalerStatusViewProps {
    statusType: 'out_of_stock' | 'high_price' | 'expiring' | 'active' | 'pending' | 'expired' | 'update' | 'all';
    onBack: () => void;
    onAction: (product: any, action: 'stock' | 'price' | 'edit') => void;
}

export default function WholesalerStatusView({ statusType = 'active', onBack, onAction }: WholesalerStatusViewProps) {
    const { products, pendingProducts, wholesalerProfileId } = useStore();


    // Helper to get current time helpers if needed (not strictly used yet but good for future)
    // const now = new Date();

    // Filter Logic
    let items: any[] = [];
    const myPending = pendingProducts.filter(p => p.submittedBy === wholesalerProfileId);

    switch (statusType) {
        case 'pending':
            items = myPending.filter(p => p.status === 'pending');
            break;
        case 'update':
            items = myPending.filter(p => p.status === 'rejected');
            break;
        case 'all':
            items = [...products, ...myPending];
            break;
        case 'out_of_stock':
            items = products.filter(p => p.status === 'out_of_stock' || (p.totalStock ?? 0) === 0);
            break;
        case 'high_price':
            items = products.filter(p => p.status === 'high_price');
            break;
        case 'expiring':
            items = products.filter(p => p.status === 'expiring');
            break;
        case 'expired':
            items = products.filter(p => p.status === 'expired');
            break;
        case 'active':
        default:
            items = products.filter(p => (p.totalStock ?? 0) > 0);
            break;
    }


    const titleMap: Record<string, string> = {
        out_of_stock: 'Out of Stock Products',
        high_price: 'High Price Products',
        expiring: 'Expiring Price Products',
        expired: 'Expired Price Products',
        update: 'Needs Update (Rejected)',
        pending: 'Pending Approval',
        active: 'Active Products',
        all: 'All Products'
    };

    const title = titleMap[statusType] || 'Products';

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col pb-20">
            <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-2">
                <button onClick={onBack} className="p-1 -ml-1 text-slate-600"><ArrowLeft className="w-5 h-5" /></button>
                <h1 className="text-lg font-bold text-slate-800">{title}</h1>
            </div>

            <div className="p-4 space-y-3">
                {items.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <p>No products in this section yet</p>
                    </div>
                )}

                {items.map((item: any) => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <img src={item.img} className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">{item.name}</h3>

                                    {/* Subtext based on type */}
                                    {statusType === 'out_of_stock' && (
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            <p className="text-red-600 font-bold">Current Stock: {item.totalStock} kg</p>
                                            <p>Min. Required: 100 kg</p>
                                        </div>
                                    )}
                                    {statusType === 'high_price' && (
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            <p className="text-amber-600 font-bold">Current Price: ₹{item.price}/kg</p>
                                            <p>Market Average: ₹{Number(item.price) * 0.8}/kg</p>
                                        </div>
                                    )}
                                    {statusType === 'expiring' && (
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            <p className="font-bold">Current Price: ₹{item.price}/kg</p>
                                            <p>Last Updated: 2 days ago</p>
                                        </div>
                                    )}
                                    {statusType === 'pending' && (
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            <p className="font-bold text-slate-400">Submitted today</p>
                                        </div>
                                    )}
                                    {statusType === 'update' && (
                                        <div className="text-[10px] text-red-500 mt-0.5">
                                            <p className="font-bold">Rejected: {item.rejectionReason || 'No reason provided'}</p>
                                        </div>
                                    )}
                                    {(statusType === 'active' || statusType === 'all') && (
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            {Number(item.totalStock) > 0 ? (
                                                <p>• Stock: {item.totalStock} {item.unit}</p>
                                            ) : (
                                                <p className="text-slate-400">Out of stock</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status specific Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            {statusType === 'out_of_stock' && (
                                <>
                                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Low stock
                                    </span>
                                    <button
                                        onClick={() => onAction(item, 'stock')}
                                        className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Update Stock
                                    </button>
                                </>
                            )}
                            {statusType === 'high_price' && (
                                <>
                                    <span className="text-[10px] font-bold text-red-500">
                                        20% higher
                                    </span>
                                    <button
                                        onClick={() => onAction(item, 'price')}
                                        className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Edit Price
                                    </button>
                                </>
                            )}
                            {statusType === 'expiring' && (
                                <>
                                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Expires in 2 days
                                    </span>
                                    <button
                                        onClick={() => onAction(item, 'price')}
                                        className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Update Price
                                    </button>
                                </>
                            )}
                            {statusType === 'pending' && (
                                <>
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Under Review
                                    </span>
                                    <button
                                        onClick={() => onAction(item, 'edit')}
                                        className="text-blue-600 text-xs font-bold px-2 py-2 hover:bg-blue-50 rounded-lg"
                                    >
                                        Edit Details
                                    </button>
                                </>
                            )}
                            {statusType === 'update' && (
                                <>
                                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Action Required
                                    </span>
                                    <button
                                        onClick={() => onAction(item, 'edit')}
                                        className="text-red-600 text-xs font-bold px-2 py-2 hover:bg-red-50 rounded-lg"
                                    >
                                        Edit to Fix
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {/* Info Box */}
                {statusType === 'out_of_stock' && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex gap-2 items-start mt-4">
                        <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-orange-700">
                            Low stock may affect your marketplace visibility. Restock items to maintain your ranking.
                        </p>
                    </div>
                )}

                {statusType === 'high_price' && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex gap-2 items-start mt-4">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-700">
                            Other suppliers have a better price for this product so your product will not be listed.
                        </p>
                    </div>
                )}

                {statusType === 'pending' && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2 items-start mt-4">
                        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-700">
                            These products are currently under review by the Mandi Admin. They will appear in the marketplace once approved.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
