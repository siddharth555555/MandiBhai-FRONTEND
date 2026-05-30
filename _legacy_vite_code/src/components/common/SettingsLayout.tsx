import { ArrowLeft } from 'lucide-react';

interface SettingsLayoutProps {
    title: string;
    onBack: () => void;
    children: React.ReactNode;
}

export default function SettingsLayout({ title, onBack, children }: SettingsLayoutProps) {
    return (
        <div className="bg-slate-50 min-h-screen pb-6 dark:bg-slate-900 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white px-4 py-4 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95 dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h1>
            </div>

            <div className="p-4 space-y-6">
                {children}

                {/* Footer */}
                <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Prototype Build</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-600">Version 1.0.2</p>
                </div>
            </div>
        </div>
    );
}
