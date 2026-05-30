'use client';
import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Store, ClipboardList, User, BarChart4 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import WholesalerCatalogue from './WholesalerCatalogue';
import WholesalerOrders from './WholesalerOrders';
import WholesalerProfile from './WholesalerProfile';
import WholesalerHeader from './WholesalerHeader';
import WholesalerAnalytics from './WholesalerAnalytics';
import WholesalerNotifications from './WholesalerNotifications';
import WholesalerDeliveries from './WholesalerDeliveries';
import WholesalerSettings from './WholesalerSettings';
import WholesalerInventory from './WholesalerInventory';


function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type Tab = 'catalogue' | 'inventory' | 'orders' | 'analytics' | 'profile' | 'notifications' | 'deliveries' | 'settings';


export default function WholesalerDashboard() {
    const { fetchOrders } = useStore();
    const [activeTab, setActiveTab] = useState<Tab>('catalogue');
    const [ordersInitialFilter, setOrdersInitialFilter] = useState('New');
    const [navigationParams, setNavigationParams] = useState<any>({});

    const handleNavigate = (tab: string, params?: any) => {
        if (tab === 'orders') fetchOrders();
        if (tab === 'orders') {
            if (params?.filter) setOrdersInitialFilter(params.filter);
            // Store other params like initialOrderId
            setNavigationParams((prev: any) => ({ ...prev, orders: params }));
        } else if (tab === 'catalogue') {

            setNavigationParams((prev: any) => ({ ...prev, catalogue: params }));
        } else if (tab === 'profile') {
            setNavigationParams((prev: any) => ({ ...prev, profile: params }));
        }

        if (['catalogue', 'orders', 'analytics', 'profile', 'notifications', 'deliveries', 'settings'].includes(tab)) {
            setActiveTab(tab as Tab);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'catalogue':
                return <WholesalerCatalogue highlightProductId={navigationParams.catalogue?.productId} />;
            case 'inventory':
                return <WholesalerInventory />;

            case 'orders':
                return <WholesalerOrders
                    initialFilter={ordersInitialFilter}
                    initialOrderId={navigationParams.orders?.orderId}
                />;
            case 'analytics': return <WholesalerAnalytics />;
            case 'profile': return <WholesalerProfile onNavigate={handleNavigate} />;
            case 'notifications': return <WholesalerNotifications onNavigate={handleNavigate} onBack={() => setActiveTab('catalogue')} />;
            case 'deliveries': return <WholesalerDeliveries onNavigate={handleNavigate} />;
            case 'settings': return <WholesalerSettings onBack={() => setActiveTab('profile')} />;
            default: return <WholesalerCatalogue />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
            {/* Global Header */}
            <WholesalerHeader onNavigate={handleNavigate} />

            <main className="pb-0">
                {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-2 py-1 safe-area-pb dark:bg-slate-900 dark:border-slate-800">
                <div className="flex justify-around items-center">
                    {([
                        { id: 'catalogue', label: 'Catalogue', icon: Store },
                        { id: 'inventory', label: 'Inventory', icon: ClipboardList }, // Reuse icon or similar
                        { id: 'orders', label: 'Orders', icon: ClipboardList },
                        { id: 'analytics', label: 'Analytics', icon: BarChart4 },
                        { id: 'profile', label: 'Profile', icon: User },
                    ] as { id: string; label: string; icon: any; badge?: number }[]).map((item) => {

                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.id === 'orders') fetchOrders();
                                    setActiveTab(item.id as Tab);
                                }}
                                className="flex-1 flex flex-col items-center justify-center py-2 relative group"
                            >
                                <div className={cn(
                                    "p-1.5 rounded-xl transition-all duration-200 relative",
                                    isActive ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 translate-y-[-2px]" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400"
                                )}>
                                    <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />

                                    {item.badge && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-semibold mt-1 transition-colors",
                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                                )}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
