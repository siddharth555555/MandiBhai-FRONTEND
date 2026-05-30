
import {
    LayoutDashboard,
    ClipboardCheck,
    BookOpen,
    Store,
    Users,
    Package,
    ChevronRight
} from 'lucide-react';

interface SidebarProps {
    activePage: string;
    onPageChange: (page: string) => void;
}

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'moderation', label: 'Product Moderation', icon: ClipboardCheck },
    { id: 'catalogue', label: 'Catalogue', icon: BookOpen },
    { id: 'wholesalers', label: 'Wholesalers', icon: Store },
    { id: 'retailers', label: 'Retailers', icon: Users },
    { id: 'orders', label: 'Orders', icon: Package },
];

export default function Sidebar({ activePage, onPageChange }: SidebarProps) {
    return (
        <aside className="w-[260px] h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">Mandi Bhai</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 px-0.5">
                    Operations Portal
                </p>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onPageChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${activePage === item.id
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activePage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                        <span className="text-sm font-semibold">{item.label}</span>
                        {activePage === item.id && <ChevronRight className="w-4 h-4 ml-auto text-white/50" />}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-300">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Admin Operations</p>
                        <p className="text-xs text-slate-500 truncate lowercase">internal_ops</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
