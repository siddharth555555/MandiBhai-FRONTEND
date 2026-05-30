'use client';

import { useStore } from '../context/StoreContext';
import {
    FileText,
    ExternalLink,
    Clock,
    Hash
} from 'lucide-react';

export default function OrdersMonitoringPage() {
    const { orders } = useStore();

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'PLACED': return 'bg-blue-100 text-blue-700';
            case 'ACCEPTED': return 'bg-indigo-100 text-indigo-700';
            case 'DISPATCHED': return 'bg-purple-100 text-purple-700';
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden font-sans">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-800">Global Order Log ({orders.length})</h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Monthly PDF Report
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Order Instance</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Transaction</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-center">Lifecycle</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 text-right">Value (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">
                                    No marketplace orders found in global monitoring.
                                </td>
                            </tr>
                        ) : (
                            orders.map((o) => (
                                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500">
                                                <Hash className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight uppercase">ORD-{o.id.substring(0, 6)}</p>
                                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                    <Clock className="w-2.5 h-2.5" /> {o.date}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 font-black uppercase w-8">From:</span>
                                                <span className="text-xs text-slate-700 font-bold">{o.customerName} (Retailer)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-slate-400 font-black uppercase w-8">To:</span>
                                                <span className="text-xs text-slate-800 font-black flex items-center gap-1">
                                                    Wholesaler ID: {String(o.assignedWholesalerId).substring(0, 8)} <ExternalLink className="w-2.5 h-2.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(o.status)}`}>
                                                {o.status}
                                            </span>
                                            <div className="flex gap-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${o.status !== 'confirming' ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                                <div className={`w-1.5 h-1.5 rounded-full ${['accepted', 'out_for_delivery', 'delivered', 'completed'].includes(o.status) ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                                <div className={`w-1.5 h-1.5 rounded-full ${['out_for_delivery', 'delivered', 'completed'].includes(o.status) ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                                <div className={`w-1.5 h-1.5 rounded-full ${['delivered', 'completed'].includes(o.status) ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <p className="text-lg font-black text-slate-900 leading-none">₹{o.total.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{o.items.length} SKUs included</p>
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
