
import { ArrowLeft, Monitor, Sparkles } from 'lucide-react';

export default function RetailerAIPOS({ onBack }: { onBack: () => void }) {
    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">AI-POS</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                        <Monitor className="w-10 h-10 text-orange-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                        <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">Smart Point of Sale</h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto mb-8">
                    Manage your entire store with our AI-powered POS system. Inventory, billing, and customer insights all in one place.
                </p>

                <div className="bg-white border border-slate-200 rounded-xl p-4 w-full max-w-xs shadow-sm">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                    <div className="flex items-center justify-center gap-2 text-orange-600 font-bold bg-orange-50 py-2 rounded-lg">
                        Coming Soon
                    </div>
                </div>
            </div>
        </div>
    );
}
