
import { useStore } from '../context/StoreContext';
import { Check, X, ExternalLink } from 'lucide-react';
import { getProductImageUrl } from '../lib/storage';

export default function ProductsModerationPage() {
    const { pendingProducts, wholesalers, approveProduct, rejectProduct } = useStore();

    // Map pending products to include seller details for the UI. Filter for active queue.
    const displayProducts = pendingProducts
        .filter(p => p.status === 'pending')
        .map(p => {
            const wholesaler = wholesalers.find(w => w.id === p.submittedBy);
            return {
                ...p,
                sellerName: wholesaler?.name || 'Unknown Seller',
                sellerId: wholesaler?.id || 'unknown',
                img: getProductImageUrl(p.image_key)
            };
        });


    const handleApprove = async (id: string | number) => {
        if (confirm('Approve this product for the Master Catalogue?')) {
            await approveProduct(id);
        }
    };

    const handleReject = async (id: string | number) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            await rejectProduct(id, reason);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-800">Pending Review ({displayProducts.length})</h3>
                <div className="flex gap-2">
                    <button className="text-xs font-bold text-slate-500 bg-white border rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
                        Export JSON
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Product Details</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Submitted By</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {displayProducts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Check className="w-10 h-10 text-green-200" />
                                        <p className="text-slate-400 font-medium">Moderation queue is empty. All systems clear.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                                                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 leading-tight">{p.name}</p>
                                                <p className="text-xs text-slate-400 font-semibold">{p.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 uppercase tracking-wide">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold text-slate-700">{p.sellerName}</p>
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-tighter flex items-center gap-1">
                                                ID: {p.sellerId.substring(0, 8)}... <ExternalLink className="w-2 h-2" />
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleReject(p.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Reject Product"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(p.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                                                title="Approve & Add to Catalogue"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
