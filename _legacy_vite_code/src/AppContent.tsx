import { useStore } from './context/StoreContext';
import AuthLogin from './components/AuthLogin';
import WholesalerDashboard from './components/wholesaler/WholesalerDashboard';
import RetailerDashboard from './components/retailer/RetailerDashboard';
import SetLocation from './components/SetLocation';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductsModerationPage from './admin/ProductsModerationPage';
import CatalogueManagerPage from './admin/CatalogueManagerPage';
import SellerManagementPage from './admin/SellerManagementPage';
import OrdersMonitoringPage from './admin/OrdersMonitoringPage';

// Demo mode — amber banner shown during stakeholder demo
const DEMO_MODE = true;

export default function AppContent() {
    const { currentUserRole, isAuthenticated, isSessionLoading, isLocationRequired } = useStore();

    const renderAdminPage = (activePage: string) => {
        switch (activePage) {
            case 'dashboard': return <AdminDashboard />;
            case 'moderation': return <ProductsModerationPage />;
            case 'catalogue': return <CatalogueManagerPage />;
            case 'wholesalers': return <SellerManagementPage />;
            case 'retailers': return <div className="p-8 text-slate-400 font-bold">Retailer Management (Internal Ops) coming soon...</div>;
            case 'orders': return <OrdersMonitoringPage />;
            default: return <AdminDashboard />;
        }
    };

    if (isSessionLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AuthLogin />;
    }

    if (isLocationRequired) {
        return <SetLocation />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative dark:bg-slate-950 transition-colors duration-300">
            {/* Demo Mode Banner */}
            {DEMO_MODE && (
                <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 shadow-md">
                    <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
                    Demo Mode — OTP temporarily bypassed
                </div>
            )}
            <div className={DEMO_MODE ? 'pt-7' : ''}>
                {currentUserRole === 'admin' ? (
                    <AdminLayout>
                        {(activePage) => renderAdminPage(activePage)}
                    </AdminLayout>
                ) : currentUserRole === 'wholesaler' ? (
                    <WholesalerDashboard />
                ) : (
                    <RetailerDashboard />
                )}
            </div>
        </div>
    );
}
