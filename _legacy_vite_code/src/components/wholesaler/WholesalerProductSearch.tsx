import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WholesalerProductSearchProps {
    onBack: () => void;
    onSelect: (product: any) => void;
}

export default function WholesalerProductSearch({ onBack, onSelect }: WholesalerProductSearchProps) {
    const { masterCatalogue } = useStore();
    const [query, setQuery] = useState('');

    const filteredProducts = masterCatalogue.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );


    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-2">
                <button onClick={onBack} className="p-1 -ml-1 text-slate-600"><ArrowLeft className="w-5 h-5" /></button>
                <div className="flex-1">
                    <h1 className="text-sm font-bold text-slate-800">Search Products</h1>
                    <p className="text-[10px] text-slate-400">Search your catalogue to manage items</p>
                </div>
            </div>

            <div className="p-4 flex-1">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by product name..."
                        className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
                    />
                </div>

                {query.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 opacity-50">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                            <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-semibold text-slate-500">Search for existing products</p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">Search Results ({filteredProducts.length})</h2>
                        <div className="space-y-3">
                            {filteredProducts.map((item) => (
                                <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={item.img} className="w-12 h-12 rounded-lg bg-slate-50 object-cover" />
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800">{item.name}</h3>
                                            <div className="text-xs text-slate-500 flex gap-2">
                                                <span>Stock: {item.totalStock}</span>
                                                <span className="font-semibold text-slate-800">₹{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onSelect(item)}
                                        className="text-xs font-bold text-blue-600 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50"
                                    >
                                        Select
                                    </button>
                                </div>
                            ))}

                            {/* Option to add new if not found */}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-sm text-slate-500 mb-3">No products found matching "{query}"</p>
                                    <button
                                        onClick={() => onSelect({ name: query, totalStock: 0, price: 0, img: '' })}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
                                    >
                                        Create New "{query}"
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
