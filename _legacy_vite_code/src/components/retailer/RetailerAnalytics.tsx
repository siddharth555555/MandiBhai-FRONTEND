
import { ArrowLeft, BarChart2, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function RetailerAnalytics({ onBack }: { onBack: () => void }) {
    return (
        <div className="bg-slate-50 min-h-screen dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Analytics</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-green-50 rounded-lg dark:bg-green-900/20">
                                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-500" />
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Spend</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">₹45,230</p>
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <TrendingUp className="w-3 h-3" /> +12% this month
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                                <Package className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Orders</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">24</p>
                        <p className="text-xs text-blue-600 mt-1">Last 30 days</p>
                    </div>
                </div>

                {/* Categories Chart Placeholder */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 dark:text-slate-200">Top Categories</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Staples', pct: '65%', color: 'bg-orange-500' },
                            { label: 'Oil & Ghee', pct: '20%', color: 'bg-yellow-500' },
                            { label: 'Snacks', pct: '15%', color: 'bg-blue-500' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                                    <span className="text-slate-500 dark:text-slate-500">{item.pct}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                                    <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 dark:bg-indigo-900/20 dark:border-indigo-800">
                    <BarChart2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 dark:text-indigo-400" />
                    <div>
                        <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-300">Deep Insights Coming Soon</h4>
                        <p className="text-xs text-indigo-600 mt-1 leading-relaxed dark:text-indigo-400">
                            We are building advanced analytics to help you track your margins and most profitable products.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
