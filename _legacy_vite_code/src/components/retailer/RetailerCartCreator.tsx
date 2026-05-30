import { useState } from 'react';
import { Search, ArrowLeft, ShoppingCart, Plus, Minus, X, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getProductImageUrl } from '../../lib/storage';

interface RetailerCartCreatorProps {
    onBack: () => void;
    initialData?: any;
}

export default function RetailerCartCreator({ onBack, initialData }: RetailerCartCreatorProps) {
    const { products, addFrequentCart, updateFrequentCart } = useStore();
    const [cartName, setCartName] = useState(initialData?.name || 'Staples Monthly');
    const [query, setQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<any[]>(initialData?.items || []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) && p.approvalStatus === 'APPROVED'
    );

    const addToCart = (item: any) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            // If already exists, maybe increment qty? or just do nothing
            if (exists) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
            return [...prev, { ...item, qty: 1 }];
        });
        setQuery('');
    };

    const handleSave = () => {
        if (!cartName || selectedItems.length === 0) return;

        const total = selectedItems.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);

        if (initialData) {
            updateFrequentCart(initialData.id, {
                name: cartName,
                itemCount: selectedItems.length,
                total: `₹${total}`,
                items: selectedItems
            });
        } else {
            addFrequentCart({
                name: cartName,
                itemCount: selectedItems.length,
                total: `₹${total}`,
                items: selectedItems
            });
        }
        onBack();
    };

    const updateQty = (id: number, delta: number) => {
        setSelectedItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setSelectedItems(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col pb-40 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-1 -ml-1 text-slate-600 dark:text-slate-400"><ArrowLeft className="w-5 h-5" /></button>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white">{initialData ? 'Edit Frequent Cart' : 'Create Frequent Cart'}</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">

                {/* Cart Name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Cart Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={cartName}
                            onChange={(e) => setCartName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:ring-green-600"
                        />
                        <span className="absolute right-3 top-3.5 text-[10px] text-slate-400 font-bold">15/30</span>
                    </div>
                </div>

                {/* Search */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Search Products</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="dol"
                            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:ring-green-600"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="absolute right-3 top-3 text-slate-400">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Search Dropdown Mock */}
                    {query.length > 0 && (
                        <div className="bg-white border border-slate-100 rounded-xl shadow-lg mt-2 overflow-hidden max-h-60 overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
                            {filteredProducts.map((item) => (
                                <div key={item.id} className="p-3 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
                                    <div className="flex items-center gap-3">
                                        <img src={getProductImageUrl(item.image_key)} className="w-10 h-10 rounded-lg bg-slate-50 object-cover" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-bold">₹{item.price}/kg</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="bg-green-600 text-white p-1.5 rounded-lg hover:bg-green-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Products */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Selected Products</label>

                    {selectedItems.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                            <ShoppingCart className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="text-xs font-bold text-slate-400">No products selected</p>
                            <p className="text-[10px] text-slate-300 mt-1">Search and add products to your frequent cart</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedItems.map((item) => (
                                <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <img src={getProductImageUrl(item.image_key)} className="w-12 h-12 rounded-lg bg-slate-50 object-cover dark:bg-slate-800" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                                            <p className="text-xs text-slate-500 font-bold dark:text-slate-400">₹{item.price}/kg</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <button onClick={() => removeItem(item.id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 dark:bg-slate-800">
                                            <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-white rounded shadow-sm hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600"><Minus className="w-3 h-3 text-slate-600 dark:text-slate-300" /></button>
                                            <span className="text-xs font-bold text-slate-800 min-w-[16px] text-center dark:text-white">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-green-600 rounded shadow-sm text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"><Plus className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Footer Actions */}
            <div className="bg-white px-4 py-3 border-t border-slate-100 fixed bottom-[64px] w-full z-40 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total ({selectedItems.length} Items)</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        ₹{selectedItems.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)}
                    </span>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!cartName || selectedItems.length === 0}
                    className="w-full py-3 bg-green-600 text-white font-bold text-sm rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:shadow-none transition-all">
                    {initialData ? 'Update Frequent Cart' : 'Confirm Frequent Cart'}
                </button>
            </div>
        </div>
    );
}
