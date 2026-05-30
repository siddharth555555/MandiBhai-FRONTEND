
import { useStore } from '../context/StoreContext';
import { Bell, Search, LogOut } from 'lucide-react';

interface TopbarProps {
    title: string;
}

export default function Topbar({ title }: TopbarProps) {
    const { logout } = useStore();

    return (
        <header className="h-[70px] bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-8">
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                <div className="relative hidden lg:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search SKUs, Sellers, Orders..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm w-[320px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all group">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
                </button>

                <div className="h-8 w-px bg-slate-200"></div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </header>
    );
}
