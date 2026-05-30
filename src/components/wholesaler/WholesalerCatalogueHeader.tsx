'use client';
import { Plus } from 'lucide-react';

interface WholesalerCatalogueHeaderProps {
    onAddProduct: () => void;
}

export default function WholesalerCatalogueHeader({ onAddProduct }: WholesalerCatalogueHeaderProps) {
    return (
        <div className="flex justify-between items-center pointer-events-none select-none">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Catalogue</h2>
            <div
                role="button"
                tabIndex={0}
                onClick={onAddProduct}
                contentEditable={false}
                suppressContentEditableWarning
                data-readonly="true"
                style={{ userSelect: 'none', WebkitUserSelect: 'none', cursor: 'pointer' }}
                className="pointer-events-auto flex items-center gap-2 text-sm font-bold text-green-700 bg-white px-4 py-2 rounded-xl border border-green-600 shadow-sm hover:bg-green-50 transition-colors active:scale-95 overflow-hidden relative z-50 isolate outline-none"
            >
                <Plus className="w-4 h-4 pointer-events-none" />
                <span className="pointer-events-none">Add Product</span>
            </div>
        </div>
    );
}
