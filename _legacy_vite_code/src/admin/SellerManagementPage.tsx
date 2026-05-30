
import { useStore } from '../context/StoreContext';
import {
    ShieldCheck,
    ShieldAlert,
    MapPin,
    Phone,
    Ban,
    CheckCircle2
} from 'lucide-react';

export default function SellerManagementPage() {
    const { wholesalers } = useStore();

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-800">Verified Wholesalers ({wholesalers.length})</h3>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    View KYC Queue
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Business Name</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">KYC Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Contact</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Location</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {wholesalers.map((w) => (
                            <tr key={w.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                            {w.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{w.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold tracking-tight">ID: {w.id.substring(0, 8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    {w.active ? (
                                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Verified</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Pending</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <Phone className="w-3 h-3" />
                                            <span className="text-xs font-bold font-mono">+91 99999 00000</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="text-xs font-semibold">{w.pincode}</span>
                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-tighter">India</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Disable Seller">
                                            <Ban className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="View Details">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
