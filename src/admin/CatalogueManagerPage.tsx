'use client';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Tags,
    Image as ImageIcon
} from 'lucide-react';

export default function CatalogueManagerPage() {
    const { masterCatalogue } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter from Master Catalogue state
    const catalogue = masterCatalogue
        .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search SKUs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500/30 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm border border-slate-100 hover:bg-slate-100 transition-all">
                        <Filter className="w-4 h-4" />
                        Category
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 hover:bg-green-600 active:scale-95 transition-all">
                        <Plus className="w-4 h-4" />
                        Add New SKU
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {catalogue.map((sku) => sku && (
                    <div key={sku.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="aspect-square bg-slate-50 border-b border-slate-50 relative overflow-hidden">
                            <img src={sku.img} alt={sku.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-slate-100 hover:bg-white transition-colors">
                                    <Edit2 className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                                    {sku.category}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">SKU: {String(sku.id).substring(0, 6)}</span>
                            </div>
                            <h4 className="font-black text-slate-800 text-lg mb-0.5">{sku.name}</h4>
                            <p className="text-xs text-slate-400 font-bold mb-4">{sku.brand}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Tags className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase">FMCG</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-black uppercase">Asset OK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
