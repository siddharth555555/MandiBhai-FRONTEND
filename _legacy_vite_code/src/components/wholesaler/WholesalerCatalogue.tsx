import { useState, useEffect } from 'react';

import {
    Search,
} from 'lucide-react';
import WholesalerProductSearch from './WholesalerProductSearch';
import WholesalerProductForm from './WholesalerProductForm';
import WholesalerCatalogueHeader from './WholesalerCatalogueHeader';
import WholesalerStatusView from './WholesalerStatusView';
import StatusCard from './StatusCard';
import WholesalerProductCard from './WholesalerProductCard';
import { useStore } from '../../context/StoreContext';


// Types for navigation within the tab
// Types for navigation within the tab
// Types for navigation within the tab
type ViewState = 'dashboard' | 'search' | 'form' | 'status_view';
type StatusType = 'out_of_stock' | 'high_price' | 'expiring' | 'active' | 'pending' | 'expired' | 'update' | 'all';

export default function WholesalerCatalogue({ highlightProductId }: { highlightProductId?: string }) {
    // Navigation State
    const [view, setView] = useState<ViewState>('dashboard');
    const [formMode, setFormMode] = useState<'add' | 'edit' | 'stock' | 'price'>('add');
    const [statusType, setStatusType] = useState<StatusType>('active');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const { products, pendingProducts, wholesalerProfileId } = useStore();

    // Derived Wholesaler View Logic
    const myPending = pendingProducts.filter(p => p.submittedBy === wholesalerProfileId);
    const approvedProducts = products; // Already filtered for this wholesaler in StoreContext

    // Deep linking effect
    useEffect(() => {
        if (highlightProductId) {
            const target = products.find(p => p.id.toString() === highlightProductId || p.id === highlightProductId);
            if (target) {
                setSelectedProduct(target);
                setFormMode('edit');
                setView('form');
            }
        }
    }, [highlightProductId, products]);


    const STATS = [
        { id: 'out_of_stock', label: 'Out of Stock', count: approvedProducts.filter(p => p.status === 'out_of_stock' || (p.totalStock ?? 0) === 0).length, variant: 'out_of_stock' as const },
        { id: 'expired', label: 'Expired Price', count: approvedProducts.filter(p => p.status === 'expired').length, variant: 'out_of_stock' as const },
        { id: 'update', label: 'Need Update', count: myPending.filter(p => p.status === 'rejected').length, variant: 'expiring' as const },
        { id: 'high_price', label: 'High Price', count: approvedProducts.filter(p => p.status === 'high_price').length, variant: 'high_price' as const },
        { id: 'pending', label: 'KYC Status', count: myPending.filter(p => p.status === 'pending').length > 0 ? `${myPending.filter(p => p.status === 'pending').length} Pending` : 'Verified', variant: 'info' as const },
        { id: 'active', label: 'Active Products', count: approvedProducts.filter(p => (p.totalStock ?? 0) > 0).length, variant: 'success' as const },
        { id: 'all', label: 'All Products', count: approvedProducts.length + myPending.length, variant: 'active' as const },
    ];


    // Navigation Handlers
    const handleAddProduct = () => {
        setSelectedProduct(null);
        setFormMode('add');
        setView('form');
    };

    const handleSelectProductFromSearch = (product: any) => {
        setSelectedProduct(product);
        setFormMode('add');
        setView('form');
    };

    const handleCardClick = (id: string) => {
        setStatusType(id as StatusType);
        setView('status_view');
    };

    const handleBack = () => {
        setView('dashboard');
        setSelectedProduct(null);
    };

    const handleActionFromStatusView = (product: any, action: 'stock' | 'price' | 'edit') => {
        setSelectedProduct(product);
        setFormMode(action);
        setView('form');
    };

    const handleEditProduct = (product: any) => {
        setSelectedProduct(product);
        setFormMode('edit');
        setView('form');
    };

    const handleProductSubmit = () => {
        setStatusType('pending');
        setView('status_view');
    };

    // --- RENDER SUB-COMPONENTS BASED ON VIEW ---

    if (view === 'search') {
        return <WholesalerProductSearch onBack={handleBack} onSelect={handleSelectProductFromSearch} />;
    }

    if (view === 'form') {
        return <WholesalerProductForm onBack={handleBack} onSubmit={handleProductSubmit} product={selectedProduct} mode={formMode} />;
    }

    if (view === 'status_view') {
        return <WholesalerStatusView statusType={statusType} onBack={handleBack} onAction={handleActionFromStatusView} />;
    }

    // --- MAIN DASHBOARD VIEW ---

    return (
        <div className="bg-slate-50 min-h-screen pb-24 relative dark:bg-slate-950 transition-colors duration-300">
            <div className="p-5 space-y-6">
                {/* Catalogue Header */}
                <WholesalerCatalogueHeader onAddProduct={handleAddProduct} />

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {STATS.map((stat) => (
                        <StatusCard
                            key={stat.id}
                            title={stat.label}
                            count={stat.count}
                            variant={stat.variant}
                            onClick={() => handleCardClick(stat.id)}
                        />
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 opacity-70 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search products"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-sm transition-all dark:bg-slate-900 dark:border-slate-800 dark:focus:ring-slate-700 dark:placeholder:text-slate-600 dark:text-white"
                    />
                </div>

                {/* Product List */}
                <div className="space-y-4">
                    {approvedProducts.map((item) => ( // RENDER APPROVED ONLY
                        <WholesalerProductCard
                            key={item.id}
                            product={item}
                            onEdit={handleEditProduct}
                        />
                    ))}
                    {myPending.map((item) => ( // RENDER PENDING PRODUCTS
                        <WholesalerProductCard
                            key={item.id}
                            product={item}
                            onEdit={handleEditProduct}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
