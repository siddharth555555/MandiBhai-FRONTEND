
import { Bell, Globe, Moon, Shield, FileText, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import SettingsLayout from '../common/SettingsLayout';

export default function RetailerSettings({ onBack }: { onBack: () => void }) {
    const { logout, darkMode, toggleDarkMode } = useStore();

    const handleFeatureClick = (feature: string) => {
        alert(`${feature} settings will be available in the next update!`);
    };

    return (
        <SettingsLayout title="Settings" onBack={onBack}>
            {/* Appearance Section */}
            <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 px-1 dark:text-slate-300">Appearance</h3>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:divide-slate-800">
                    <div
                        className="w-full p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors dark:active:bg-slate-800"
                        onClick={toggleDarkMode}
                    >
                        <div className="flex gap-3 items-center">
                            <Moon className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
                        </div>
                        {/* Toggle Switch */}
                        <div className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${darkMode ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform duration-200 ${darkMode ? 'left-5' : 'left-1'}`} />
                        </div>
                    </div>

                    <button
                        onClick={() => handleFeatureClick('Language')}
                        className="w-full p-4 flex items-center justify-between text-left active:bg-slate-50 transition-colors dark:active:bg-slate-800"
                    >
                        <div className="flex gap-3 items-center">
                            <Globe className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">English</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        </div>
                    </button>

                    {/* Simplified Notifications */}
                    <div className="w-full p-4 flex items-center justify-between">
                        <div className="flex gap-3 items-center">
                            <Bell className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notifications</span>
                        </div>
                        <button
                            className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded dark:bg-slate-800 dark:text-slate-500"
                            onClick={() => alert("Notification preferences coming soon!")}
                        >
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>

            {/* Support & About */}
            <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 px-1 dark:text-slate-300">Support & About</h3>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:divide-slate-800">
                    <button
                        onClick={() => handleFeatureClick('Help')}
                        className="w-full p-4 flex items-center justify-between text-left active:bg-slate-50 transition-colors dark:active:bg-slate-800"
                    >
                        <div className="flex gap-3 items-center">
                            <HelpCircle className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Help Center</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    </button>

                    <button
                        onClick={() => handleFeatureClick('Privacy')}
                        className="w-full p-4 flex items-center justify-between text-left active:bg-slate-50 transition-colors dark:active:bg-slate-800"
                    >
                        <div className="flex gap-3 items-center">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Privacy Policy</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    </button>

                    <button
                        onClick={() => handleFeatureClick('Terms')}
                        className="w-full p-4 flex items-center justify-between text-left active:bg-slate-50 transition-colors dark:active:bg-slate-800"
                    >
                        <div className="flex gap-3 items-center">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Terms of Service</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Account */}
            <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 px-1 dark:text-slate-300">Account</h3>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to sign out?')) {
                                logout();
                            }
                        }}
                        className="w-full p-4 flex items-center gap-3 text-red-600 font-bold hover:bg-red-50 active:bg-red-100 transition-colors dark:hover:bg-red-900/10"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </SettingsLayout>
    );
}
