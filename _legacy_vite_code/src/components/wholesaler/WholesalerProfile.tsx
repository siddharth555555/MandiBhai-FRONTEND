import { useState, useRef } from 'react';
import {
    Truck,
    History,
    BarChart2,
    Monitor,
    User,
    Store,
    Mail,
    Phone,
    Camera,
    FileText,
    Sparkles,
    X,
    Settings
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { useStore, getProfileCompletion } from '../../context/StoreContext';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function WholesalerProfile({ onNavigate }: { onNavigate?: (tab: string, params?: any) => void }) {
    const { wholesalerProfile, updateWholesalerProfile } = useStore();
    const completion = getProfileCompletion(wholesalerProfile);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showAiPosModal, setShowAiPosModal] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);
    const kycInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // Simulator: Append new dummy files to list
            const newDocs = Array.from(files).map(f => f.name);
            updateWholesalerProfile({
                kycDocuments: [...wholesalerProfile.kycDocuments, ...newDocs],
                rejectionReason: undefined // Clear rejection on new upload
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateWholesalerProfile({ profilePhoto: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQuickAction = (actionId: string) => {
        if (!onNavigate) return;

        switch (actionId) {
            case 'deliveries':
                onNavigate('deliveries');
                break;
            case 'history':
                onNavigate('orders', { filter: 'Delivered' });
                break;
            case 'analytics':
                onNavigate('analytics');
                break;
            case 'ai-pos':
                setShowAiPosModal(true);
                break;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24 font-sans relative dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white px-4 py-3 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 safe-area-pt dark:bg-slate-900 dark:border-slate-800">
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Profile</h1>
                <button
                    onClick={() => onNavigate && onNavigate('settings')}
                    className="p-1 -mr-1 hover:bg-slate-50 rounded-full transition-colors active:scale-95 dark:hover:bg-slate-800"
                >
                    <Settings className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 dark:bg-slate-900 dark:border-slate-800">
                    <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                        <img
                            src={wholesalerProfile.profilePhoto}
                            alt={wholesalerProfile.fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md relative z-10 bg-slate-100 dark:border-slate-800"
                        />
                        <div className="absolute bottom-0 right-0 z-20 bg-green-600 rounded-full p-1 border-2 border-white shadow-sm group-hover:scale-110 transition-transform dark:border-slate-800">
                            <Camera className="w-3 h-3 text-white" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800 leading-tight dark:text-white">{wholesalerProfile.fullName}</h2>
                        <p className="text-sm text-slate-500 mb-2 truncate dark:text-slate-400">{wholesalerProfile.businessName}</p>

                        <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{completion}% Complete</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 px-1 dark:text-slate-300">Quick Actions</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { id: 'deliveries', label: 'Deliveries', icon: Truck, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
                            { id: 'history', label: 'Order History', icon: History, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
                            { id: 'analytics', label: 'Analytics', icon: BarChart2, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
                            { id: 'ai-pos', label: 'Mandi AI', icon: Monitor, bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
                        ].map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleQuickAction(action.id)}
                                className="flex flex-col items-center gap-2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm active:scale-95 transition-transform dark:bg-slate-900 dark:border-slate-800"
                            >
                                <div className={cn("p-2 rounded-lg", action.bg)}>
                                    <action.icon className={cn("w-5 h-5", action.text)} />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight dark:text-slate-400">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* KYC Status */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">KYC Status</h3>
                        <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-md border",
                            wholesalerProfile.kycStatus === 'verified' ? "text-green-600 bg-green-50 border-green-100 dark:bg-green-900/20 dark:text-green-500 dark:border-green-900/30" :
                                wholesalerProfile.kycStatus === 'pending' ? "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:text-amber-500 dark:border-amber-900/30" :
                                    "text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:text-red-500 dark:border-red-900/30"
                        )}>
                            {wholesalerProfile.kycStatus.toUpperCase()}
                        </span>
                    </div>
                    <div className="p-4">
                        <div className="flex gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 dark:bg-green-900/20">
                                <FileText className="w-5 h-5 text-green-600 dark:text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Documents Submitted</h4>
                                <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">
                                    {wholesalerProfile.kycDocuments.length > 0
                                        ? `${wholesalerProfile.kycDocuments.length} documents uploaded`
                                        : "No documents uploaded yet"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowKycModal(true)}
                            className="w-full py-2.5 bg-green-50 text-green-700 font-semibold text-sm rounded-lg hover:bg-green-100 transition-colors dark:bg-slate-800 dark:text-green-400 dark:hover:bg-slate-700"
                        >
                            {wholesalerProfile.kycStatus === 'rejected' ? 'Resolve Issues' : 'View Submission Details'}
                        </button>
                    </div>
                </div>

                {/* Personal Information */}
                <div>
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Personal Information</h3>
                        <button className="text-xs font-bold text-green-600 hover:text-green-700 disabled:opacity-50 dark:text-green-400 dark:hover:text-green-300">Edit</button>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:divide-slate-800">
                        {[
                            { icon: User, label: 'Full Name', value: wholesalerProfile.fullName },
                            { icon: Store, label: 'Business Name', value: wholesalerProfile.businessName },
                            { icon: Mail, label: 'Email', value: wholesalerProfile.email },
                            { icon: Phone, label: 'Phone', value: wholesalerProfile.phone },
                            { icon: Store, label: 'Address', value: (wholesalerProfile as any).address || '—' },
                        ].map((item, idx) => (
                            <div key={idx} className="p-4 flex gap-4">
                                <item.icon className="w-5 h-5 text-slate-400 mt-0.5 dark:text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-400 font-medium dark:text-slate-500">{item.label}</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-0.5 dark:text-slate-200">{item.value || '—'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>

            {/* AI POS Modal */}
            {showAiPosModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative dark:bg-slate-900">
                        <button
                            onClick={() => setShowAiPosModal(false)}
                            className="absolute top-3 right-3 p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold mb-1">Mandi AI Agent</h2>
                            <p className="text-indigo-100 text-sm">Next Generation Store Management</p>
                        </div>

                        <div className="p-6 text-center">
                            <p className="text-slate-600 font-medium mb-1 dark:text-slate-300">
                                We are working hard to bring AI capabilities to your store!
                            </p>
                            <p className="text-xs text-slate-400 mb-6 dark:text-slate-500">
                                Automated inventory, smart pricing, and voice-controlled ledger coming soon.
                            </p>
                            <button
                                onClick={() => setShowAiPosModal(false)}
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800"
                            >
                                Notify Me When Ready
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* KYC Modal */}
            {showKycModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 dark:bg-slate-900">
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 dark:bg-slate-900 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">KYC Verification</h2>
                            <button onClick={() => setShowKycModal(false)} className="p-1 bg-slate-100 rounded-full hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        <div className="p-5 flex-1 overflow-y-auto">
                            {wholesalerProfile.kycStatus === 'rejected' && (
                                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <X className="w-5 h-5 text-red-600 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-bold text-red-800">Verification Failed</h3>
                                            <p className="text-sm text-red-600 mt-1">{wholesalerProfile.rejectionReason || "Documents were blurred. Please re-upload clear copies."}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Submitted Documents</h3>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                        {wholesalerProfile.submittedAt ? new Date(wholesalerProfile.submittedAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {wholesalerProfile.kycDocuments.map((doc, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                                                <FileText className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 flex-1 truncate dark:text-slate-300">{doc}</span>
                                            {wholesalerProfile.kycStatus === 'verified' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                                        </div>
                                    ))}
                                </div>

                                {wholesalerProfile.kycStatus === 'rejected' && (
                                    <div className="mt-8">
                                        <button
                                            onClick={() => kycInputRef.current?.click()}
                                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center justify-center gap-2"
                                        >
                                            <Camera className="w-5 h-5" />
                                            Upload New Documents
                                        </button>
                                        <input
                                            type="file"
                                            multiple
                                            ref={kycInputRef}
                                            className="hidden"
                                            onChange={handleKycFileChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
