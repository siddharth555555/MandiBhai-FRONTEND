
import { useStore } from '../../context/StoreContext';

export default function AdminDashboard() {
    const { logout } = useStore();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
                <button
                    onClick={logout}
                    className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                >
                    Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-slate-500 font-medium mb-1">Pending Approvals</p>
                        <h3 className="text-2xl font-bold text-slate-900">0</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-slate-500 font-medium mb-1">Total Wholesalers</p>
                        <h3 className="text-2xl font-bold text-slate-900">--</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-slate-500 font-medium mb-1">Active Retailers</p>
                        <h3 className="text-2xl font-bold text-slate-900">--</h3>
                    </div>
                </div>

                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="font-semibold text-slate-900">Moderation Queue</h2>
                    </div>
                    <div className="p-12 text-center">
                        <p className="text-slate-400">No products awaiting moderation.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
