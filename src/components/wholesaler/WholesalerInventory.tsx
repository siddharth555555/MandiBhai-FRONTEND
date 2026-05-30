'use client';
import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Edit2, Save, X, Package, AlertCircle, TrendingUp } from 'lucide-react';

import { supabase } from '../../lib/supabase';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function WholesalerInventory() {
    const { wholesalerProfileId, addNotification } = useStore();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState({ price: 0, stock: 0, active: true });

    useEffect(() => {
        if (wholesalerProfileId) {
            fetchListings();
        }
    }, [wholesalerProfileId]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('product_listings')
                .select('*, products(*)')
                .eq('wholesaler_id', wholesalerProfileId);

            if (error) throw error;
            setListings(data || []);
        } catch (err: any) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (listing: any) => {
        setEditingId(listing.id);
        setEditValues({
            price: listing.price,
            stock: listing.stock,
            active: listing.active
        });
    };

    const handleSave = async (id: string) => {
        try {
            const { error } = await supabase
                .from('product_listings')
                .update({
                    price: editValues.price,
                    stock: editValues.stock,
                    active: editValues.active,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            setListings(prev => prev.map(l =>
                l.id === id ? { ...l, ...editValues } : l
            ));
            setEditingId(null);

            addNotification({
                type: 'SYSTEM',
                title: 'Inventory Updated',
                message: 'Product listing successfully updated.',
                actionRoute: 'inventory'
            });

        } catch (err: any) {
            console.error('Error updating listing:', err);
            alert('Failed to update: ' + err.message);
        }
    };

    const filtered = listings.filter(l =>
        l.products?.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.products?.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen pb-24 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white px-4 pt-5 pb-4 sticky top-0 z-10 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory</h1>
                    <div className="flex gap-2">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {listings.length} SKUs
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search your inventory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white"
                    />
                </div>
            </header>

            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-slate-500 font-medium animate-pulse">Loading listings...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-slate-800 font-bold mb-1 dark:text-white">No products found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search or add items from catalogue.</p>
                    </div>
                ) : (
                    filtered.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                            <div className="p-4 flex gap-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 dark:bg-slate-800">
                                    {item.products?.image_url ? (
                                        <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-6 h-6 text-slate-300" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.products?.name}</h3>
                                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.products?.category}</p>
                                        </div>
                                        {item.active ? (
                                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold dark:bg-green-900/20 dark:text-green-400">Live</span>
                                        ) : (
                                            <span className="bg-slate-50 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold dark:bg-slate-800 dark:text-slate-500">Hidden</span>
                                        )}
                                    </div>

                                    {editingId === item.id ? (
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={editValues.price}
                                                    onChange={e => setEditValues(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                    className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Stock (PCS)</label>
                                                <input
                                                    type="number"
                                                    value={editValues.stock}
                                                    onChange={e => setEditValues(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                                    className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div className="col-span-2 flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`active-${item.id}`}
                                                        checked={editValues.active}
                                                        onChange={e => setEditValues(prev => ({ ...prev, active: e.target.checked }))}
                                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`active-${item.id}`} className="text-xs font-bold text-slate-600 dark:text-slate-300">Active Listing</label>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                                                    <button onClick={() => handleSave(item.id)} className="p-2 text-blue-600 hover:text-blue-700"><Save className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex gap-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Price</p>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">₹{item.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Stock</p>
                                                    <p className={cn("text-sm font-bold", item.stock < 10 ? "text-amber-500" : "text-slate-800 dark:text-white")}>{item.stock} <span className="text-[10px] font-medium text-slate-400">PCS</span></p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 dark:bg-slate-800 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {item.stock === 0 && (
                                <div className="bg-red-50 px-4 py-2 flex items-center gap-2 dark:bg-red-900/10">
                                    <AlertCircle className="w-3 h-3 text-red-500" />
                                    <span className="text-[10px] font-bold text-red-600 uppercase">Out of Stock — Hidden from Retailers</span>
                                </div>
                            )}

                            {item.stock > 0 && item.stock < 10 && (
                                <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 dark:bg-amber-900/10">
                                    <AlertCircle className="w-3 h-3 text-amber-500" />
                                    <span className="text-[10px] font-bold text-amber-600 uppercase">Low Stock Warning</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Float Action: Add New - Link to catalogue */}
            <button className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20">
                <Package className="w-7 h-7" />
            </button>
        </div>
    );
}
