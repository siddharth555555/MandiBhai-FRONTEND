'use client';
import { useState } from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

import { useStore, getProfileCompletion } from '../../context/StoreContext';
import NotificationBell from '../common/NotificationBell';

export default function WholesalerHeader({ onNavigate }: { onNavigate?: (tab: string, params?: any) => void }) {
    const { wholesalerProfile, updateWholesalerProfile, logout } = useStore();
    const completion = getProfileCompletion(wholesalerProfile);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const isOpen = wholesalerProfile.active;

    const toggleStatus = () => {
        if (isOpen) {
            setShowStatusModal(true);
        } else {
            updateWholesalerProfile({ active: true });
        }
    };

    const confirmChange = () => {
        updateWholesalerProfile({ active: false });
        setShowStatusModal(false);
    };

    return (
        <>
            <header className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-sm safe-area-pt dark:bg-slate-900 dark:border-slate-800 transition-colors duration-300">
                <div className="flex flex-col">
                    <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none bg-white dark:bg-slate-900 dark:text-white">Mandi<span className="text-green-600">Bhai</span></h1>
                    <p className="text-[10px] text-slate-500 font-medium -mt-0.5 dark:text-slate-400">Wholesale Partner</p>
                </div>

                {/* Profile Completion Indicator */}
                <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Profile Completion</span>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${completion}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{completion}%</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5 bg-slate-50 rounded-full p-1.5 pl-4 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">

                        <span className={cn("text-xs font-extrabold tracking-wide", isOpen ? "text-green-600 dark:text-green-400" : "text-slate-400 dark:text-slate-500")}>
                            {isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                        <button
                            onClick={toggleStatus}
                            className={cn(
                                "w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-200 dark:focus:ring-green-900",
                                isOpen ? "bg-green-500 shadow-lg shadow-green-200 dark:shadow-green-900/20" : "bg-slate-200 dark:bg-slate-700"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 shadow-sm",
                                isOpen ? "left-[calc(100%-22px)]" : "left-0.5"
                            )} />
                        </button>
                    </div>
                    <NotificationBell onNavigate={onNavigate} />
                    <button
                        onClick={logout}
                        className="p-1.5 hover:bg-red-50 rounded-full transition-colors group"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>
            </header>

            {/* Change Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-xs shadow-2xl p-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-amber-100 p-2 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Change shop timing?</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            Are you sure you want to change your shop status? This will affect your visibility to customers.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmChange}
                                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
