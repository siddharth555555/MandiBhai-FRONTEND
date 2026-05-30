'use client';
import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Repeat, ShoppingCart, User, Package } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import RetailerProfile from './RetailerProfile';
import RetailerOrderAgain from './RetailerOrderAgain';
import RetailerHome from './RetailerHome';
import RetailerCart from './RetailerCart';
import RetailerOrders from './RetailerOrders';
import RetailerProductDetail from './RetailerProductDetail'; // Import new component
import RetailerOrderDetail from './RetailerOrderDetail';
import RetailerProductList from './RetailerProductList';
import RetailerNotifications from './RetailerNotifications';
import RetailerAnalytics from './RetailerAnalytics';
import RetailerAIPOS from './RetailerAIPOS';
import RetailerKYCDetails from './RetailerKYCDetails';
import RetailerEditProfile from './RetailerEditProfile';
import RetailerSettings from './RetailerSettings';
import RetailerDeliveries from './RetailerDeliveries';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Define explicit routes
type Route =
    | { name: 'home' }
    | { name: 'orders'; params?: { tab?: string } }
    | { name: 'order_again' }
    | { name: 'cart' }
    | { name: 'profile' }
    | { name: 'product_detail'; params: { id: string } }
    | { name: 'products'; params: { category?: string; brand?: string; search?: string } }
    | { name: 'notifications' }
    | { name: 'products'; params?: any }
    | { name: 'analytics' }
    | { name: 'ai_pos' }
    | { name: 'kyc_details'; params: { status: string; documents: string[]; submittedAt: string } }
    | { name: 'edit_profile' }
    | { name: 'settings' }
    | { name: 'deliveries' }
    | { name: 'order_detail'; params: { id: string } };


export default function RetailerDashboard() {
    // Navigation State
    const [currentRoute, setCurrentRoute] = useState<Route>({ name: 'home' });
    const { cartItems, cartTotalQty } = useStore(); // Get cart items for badge

    // Universal Navigation Handler
    const handleNavigate = (name: string, params?: any) => {
        // Map string names to Route objects
        if (name === 'product_detail') {
            setCurrentRoute({ name: 'product_detail', params: params });
        } else if (name === 'order_detail') {
            setCurrentRoute({ name: 'order_detail', params: params });
        } else if (name === 'products') {
            setCurrentRoute({ name: 'products', params: params });
        } else {
            setCurrentRoute({ name: name as any });
        }
        window.scrollTo(0, 0);
    };

    const renderContent = () => {
        switch (currentRoute.name) {
            case 'home':
                return <RetailerHome onNavigate={handleNavigate} />;
            case 'orders':
                return <RetailerOrders onNavigate={handleNavigate} initialTab={currentRoute.params?.tab as 'active' | 'past'} />;
            case 'order_detail':
                return (
                    <RetailerOrderDetail
                        orderId={currentRoute.params.id}
                        onBack={() => setCurrentRoute({ name: 'orders' })}
                        onNavigate={handleNavigate}
                    />
                );
            case 'order_again':
                return <RetailerOrderAgain />;
            case 'cart':
                return <RetailerCart onNavigate={handleNavigate} />;
            case 'profile':
                return <RetailerProfile onNavigate={handleNavigate} />;
            case 'analytics':
                return <RetailerAnalytics onBack={() => setCurrentRoute({ name: 'profile' })} />;
            case 'ai_pos':
                return <RetailerAIPOS onBack={() => setCurrentRoute({ name: 'profile' })} />;
            case 'kyc_details':
                return (
                    <RetailerKYCDetails
                        onBack={() => setCurrentRoute({ name: 'profile' })}
                        status={currentRoute.params.status}
                        documents={currentRoute.params.documents}
                        submittedAt={currentRoute.params.submittedAt}
                    />
                );
            case 'edit_profile':
                return <RetailerEditProfile onBack={() => setCurrentRoute({ name: 'profile' })} />;
            case 'settings':
                return <RetailerSettings onBack={() => setCurrentRoute({ name: 'profile' })} />;
            case 'deliveries':
                return <RetailerDeliveries onNavigate={handleNavigate} />;
            case 'product_detail':
                return (
                    <RetailerProductDetail
                        productId={currentRoute.params.id}
                        onBack={() => setCurrentRoute({ name: 'home' })}
                        onNavigate={handleNavigate}
                    />
                );
            case 'products':
                return (
                    <RetailerProductList
                        filters={currentRoute.params}
                        onBack={() => setCurrentRoute({ name: 'home' })}
                        onNavigate={handleNavigate}
                    />
                );
            case 'notifications':
                return (
                    <RetailerNotifications
                        onBack={() => setCurrentRoute({ name: 'home' })}
                        onNavigate={handleNavigate}
                    />
                );
            default:
                return <RetailerHome onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans dark:bg-slate-950 transition-colors duration-300">
            <main className="pb-0">
                {renderContent()}
            </main>

            {/* Bottom Navigation - Hide on Product Detail page for immersion */}
            {/* Blinkit-style Sticky Cart Bar */}
            {cartItems.length > 0 && currentRoute.name !== 'cart' && currentRoute.name !== 'product_detail' && (
                <div className="fixed bottom-[70px] left-0 right-0 px-3 z-40 w-full">
                    <button
                        onClick={() => handleNavigate('cart')}
                        className="w-full bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300 active:scale-[0.98] transition-transform dark:bg-green-600 dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    >
                        Go to Cart →
                    </button>
                </div>
            )}

            {currentRoute.name !== 'product_detail' && (
                <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 px-2 py-1 safe-area-pb dark:bg-slate-900 dark:border-slate-800">
                    <div className="flex justify-around items-center">
                        {[
                            { id: 'home', label: 'Home', icon: Home },
                            { id: 'orders', label: 'Orders', icon: Package },
                            { id: 'order_again', label: 'Buy Again', icon: Repeat },
                            { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartTotalQty > 0 ? cartTotalQty : undefined },
                            { id: 'profile', label: 'Profile', icon: User },
                        ].map((item) => {
                            const isActive = currentRoute.name === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    className="flex-1 flex flex-col items-center justify-center py-2 relative group"
                                >
                                    <div className={cn(
                                        "p-1.5 rounded-xl transition-all duration-200 relative",
                                        isActive ? "text-green-700 bg-green-50 translate-y-[-2px] dark:bg-green-900/20 dark:text-green-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                                    )}>
                                        <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />

                                        {/* Badge */}
                                        {item.badge && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-semibold mt-1 transition-colors",
                                        isActive ? "text-green-700 dark:text-green-400" : "text-slate-400 dark:text-slate-500"
                                    )}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
