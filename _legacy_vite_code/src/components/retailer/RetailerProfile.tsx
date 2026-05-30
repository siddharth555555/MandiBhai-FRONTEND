

import {
    Settings,
    Truck,
    History,
    BarChart2,
    Monitor, // approximating AI-POS
    ChevronRight,
    MapPin,
    Clock,
    Tag,
    Percent, // Tax
    LogOut,
    User,
    Store,
    Mail,
    Phone,
    CreditCard,
    Camera,
    FileText
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

import { useStore } from '../../context/StoreContext';

export default function RetailerProfile({ onNavigate }: { onNavigate: (route: string, params?: any) => void }) {
    const { logout, retailerProfile } = useStore();

    const handleQuickAction = (label: string) => {
        switch (label) {
            case 'Deliveries':
                onNavigate('deliveries');
                break;
            case 'Order History':
                onNavigate('orders', { tab: 'past' });
                break;
            case 'Analytics':
                onNavigate('analytics');
                break;
            case 'AI-POS':
                onNavigate('ai_pos');
                break;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 dark:bg-slate-900 dark:border-slate-800">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Profile</h1>
                <button
                    onClick={() => onNavigate('settings')}
                    className="p-1 -mr-1 hover:bg-slate-50 rounded-full transition-colors active:scale-95 dark:hover:bg-slate-800"
                >
                    <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="relative">
                        <img
                            src={retailerProfile?.profilePhoto || "https://placehold.co/150x150/1e293b/ffffff?text=RK"}
                            alt={retailerProfile?.fullName || "Retailer"}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md relative z-10 dark:border-slate-800"
                        />
                        <div className="absolute bottom-0 right-0 z-20 bg-green-600 rounded-full p-1 border-2 border-white dark:border-slate-800">
                            <Camera className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800 leading-tight dark:text-white">{retailerProfile?.fullName || "Rajesh Kumar"}</h2>
                        <p className="text-sm text-slate-500 mb-2 dark:text-slate-400">Gold Business Member</p>

                        <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                                <div className="h-full bg-yellow-500 w-[80%] rounded-full" />
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">80% Complete</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 px-1 dark:text-slate-300">Quick Actions</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'Deliveries', icon: Truck, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
                            { label: 'Order History', icon: History, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
                            { label: 'Analytics', icon: BarChart2, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
                            { label: 'AI-POS', icon: Monitor, bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
                        ].map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuickAction(action.label)}
                                className="flex flex-col items-center gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm active:scale-95 transition-transform dark:bg-slate-900 dark:border-slate-800"
                            >
                                <div className={cn("p-2 rounded-lg", action.bg)}>
                                    <action.icon className={cn("w-5 h-5", action.text)} />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight dark:text-slate-400">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* KYC Status */}
                <button
                    onClick={() => onNavigate('kyc_details', {
                        status: 'Pending',
                        documents: ['Aadhar Card', 'PAN Card', 'Business License'],
                        submittedAt: 'Feb 3, 2026 at 10:30 AM'
                    })}
                    className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden text-left active:scale-[0.99] transition-transform dark:bg-slate-900 dark:border-slate-800"
                >
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">KYC Status</h3>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 dark:bg-amber-900/20 dark:text-amber-500 dark:border-amber-900/30">Pending for approval</span>
                    </div>
                    <div className="p-4">
                        <div className="flex gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 dark:bg-green-900/20">
                                <FileText className="w-5 h-5 text-green-600 dark:text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Documents Submitted</h4>
                                <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">Aadhar Card, PAN Card, Business License</p>
                            </div>
                        </div>
                        <div className="w-full py-2.5 bg-green-50 text-green-700 font-semibold text-sm rounded-lg hover:bg-green-100 transition-colors text-center dark:bg-slate-800 dark:text-green-400 dark:hover:bg-slate-700">
                            View Submission Details
                        </div>
                    </div>
                </button>

                {/* Personal Information */}
                <div>
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Personal Information</h3>
                        <button
                            onClick={() => onNavigate('edit_profile')}
                            className="text-xs font-bold text-green-600 hover:text-green-700 disabled:opacity-50 dark:text-green-400 dark:hover:text-green-300"
                        >
                            Edit
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:divide-slate-800">
                        {[
                            { icon: User, label: 'Full Name', value: retailerProfile?.fullName },
                            { icon: Store, label: 'Business Name', value: retailerProfile?.businessName },
                            { icon: Mail, label: 'Email', value: retailerProfile?.email },
                            { icon: Phone, label: 'Phone', value: retailerProfile?.phone },
                            { icon: CreditCard, label: 'GST Number', value: retailerProfile?.gstNumber },
                            { icon: MapPin, label: 'Address', value: (retailerProfile as any)?.address },
                        ].map((item, idx) => (
                            <div key={idx} className="p-4 flex gap-4">
                                <item.icon className="w-5 h-5 text-slate-400 mt-0.5 dark:text-slate-500" />
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 font-medium dark:text-slate-500">{item.label}</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5 dark:text-slate-200">{item.value || '—'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Preferences */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 px-1 dark:text-slate-300">Order Preferences</h3>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:divide-slate-800">
                        {[
                            { icon: MapPin, title: 'Store Address', sub: 'Shop No. 123, Gandhi Market...' },
                            { icon: Clock, title: 'Business Hours', sub: '9:00 AM - 9:00 PM' },
                            { icon: Tag, title: 'Business Category', sub: 'General Store, Groceries' },
                            { icon: Percent, title: 'Tax Settings', sub: 'GST Registered' },
                        ].map((pref, idx) => (
                            <button key={idx} className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors dark:hover:bg-slate-800">
                                <div className="flex gap-4 items-center">
                                    <pref.icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pref.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 dark:text-slate-400">{pref.sub}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sign Out */}
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border border-red-100 bg-white text-red-600 font-semibold text-sm active:scale-[0.99] transition-all hover:bg-red-50 dark:bg-slate-900 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-slate-800"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>

            </div>
        </div>
    );
}
