'use client';

import { useStore } from '../context/StoreContext';
import {
    Users,
    Store,
    Package,
    Clock,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
    const { wholesalers, orders } = useStore();

    const stats = [
        { label: 'Pending Approvals', value: '12', icon: Clock, color: 'orange', trend: '+2 this hour' },
        { label: 'Total Wholesalers', value: wholesalers.length.toString(), icon: Store, color: 'blue', trend: '1 pending KYC' },
        { label: 'Active Retailers', value: '1,284', icon: Users, color: 'green', trend: '+12% vs last week' },
        { label: 'Orders Today', value: orders.length.toString(), icon: Package, color: 'purple', trend: '₹42,500 total' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg">
                                <TrendingUp size={12} />
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[400px] flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative text-center space-y-4 p-8">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center text-slate-300 mb-6">
                                <TrendingUp size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">Operational Overview</h3>
                            <p className="text-slate-400 max-w-sm font-medium">Marketplace liquidity and transaction volume analytics will be displayed here in real-time.</p>
                            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
                                View Full Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar/Quick Actions Area */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                        <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2">
                            Internal Tooling
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-400">ADMIN</span>
                        </h3>
                        <div className="space-y-3">
                            {[
                                'Wholesaler KYC Approval',
                                'Retailer Verification',
                                'Global Search SKUs',
                                'System Logs'
                            ].map((tool, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-left group">
                                    <span className="font-bold text-slate-600 text-sm">{tool}</span>
                                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h4 className="font-black text-xl mb-2 relative z-10">System Status</h4>
                        <p className="text-slate-400 text-sm font-medium mb-6 relative z-10">All core services are operational.</p>
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-green-400">Database: Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
