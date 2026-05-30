'use client';
import { XCircle } from 'lucide-react';

export interface MinimumOrderError {
    wholesalerId: string;
    wholesalerName: string;
    subtotal: number;
    minimum: number;
}

interface Props {
    errors: MinimumOrderError[];
    onClose: () => void;
}

export default function MinimumOrderModal({ errors, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                                Minimum Order Not Met
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                No orders placed. Add more items to proceed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error cards */}
                <div className="space-y-3 mb-5">
                    {errors.map((e, i) => {
                        const shortfall = e.minimum - e.subtotal;
                        const pct = Math.min(Math.round((e.subtotal / e.minimum) * 100), 100);
                        return (
                            <div key={i} className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/40 rounded-xl p-4">
                                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-2">
                                    {e.wholesalerName}
                                </p>
                                {/* Progress bar */}
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2">
                                    <div
                                        className="bg-red-400 h-1.5 rounded-full transition-all"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>Your total: <strong className="text-slate-700 dark:text-slate-300">₹{e.subtotal}</strong></span>
                                    <span>Minimum: <strong className="text-slate-700 dark:text-slate-300">₹{e.minimum}</strong></span>
                                </div>
                                <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400">
                                    Add ₹{shortfall} more from {e.wholesalerName} to unlock this order.
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Action */}
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors active:scale-[0.98]"
                >
                    Back to Cart
                </button>
            </div>
        </div>
    );
}
