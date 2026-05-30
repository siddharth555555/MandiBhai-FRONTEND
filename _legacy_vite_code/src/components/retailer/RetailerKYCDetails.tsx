
import { ArrowLeft, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface RetailerKYCDetailsProps {
    onBack: () => void;
    status: string;
    documents: string[];
    submittedAt: string;
}

export default function RetailerKYCDetails({ onBack, status, documents, submittedAt }: RetailerKYCDetailsProps) {
    // Map status to UI
    const getStatusUI = () => {
        switch (status.toLowerCase()) {
            case 'approved':
                return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, label: 'Verified' };
            case 'rejected':
                return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, label: 'Rejected' };
            default:
                return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock, label: 'Pending Approval' };
        }
    };

    const ui = getStatusUI();
    const StatusIcon = ui.icon;

    return (
        <div className="bg-slate-50 min-h-screen dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">KYC Details</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Status Card */}
                <div className={`rounded-xl border ${ui.border} ${ui.bg} p-6 flex flex-col items-center text-center dark:bg-opacity-10 dark:border-opacity-20`}>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 dark:bg-slate-800">
                        <StatusIcon className={`w-6 h-6 ${ui.color}`} />
                    </div>
                    <h2 className={`text-lg font-bold ${ui.color}`}>{ui.label}</h2>
                    <p className="text-sm text-slate-600 mt-1 max-w-xs dark:text-slate-400">
                        {status === 'approved' ? 'Your business is verified. You can now place orders.' :
                            status === 'rejected' ? 'Please re-upload valid documents.' :
                                'Your documents are under review. This usually takes 24-48 hours.'}
                    </p>
                </div>

                {/* Documents List */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 px-1">Submitted Documents</h3>
                    <div className="space-y-3">
                        {documents.map((doc, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg">
                                        <FileText className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800">{doc}</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Uploaded</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline (Static mock for now) */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 px-1">Timeline</h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                <div className="w-0.5 h-full bg-slate-100 my-1" />
                            </div>
                            <div className="pb-4">
                                <p className="text-sm font-bold text-slate-800">Documents Submitted</p>
                                <p className="text-xs text-slate-500">{submittedAt}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Under Review</p>
                                <p className="text-xs text-slate-500">In Progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
