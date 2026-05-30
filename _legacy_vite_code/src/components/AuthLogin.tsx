import { useState } from 'react';
import { ArrowRight, Phone, Lock, Leaf, Truck, ShoppingBag, ArrowLeft, Shield, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

type Role = 'retailer' | 'wholesaler' | 'admin';

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
// Hardcoded bypass for stakeholder demos. Real DB UUIDs from public.users.
// Only these phone numbers skip OTP — all others go through Supabase normally.
const DEMO_USERS: Record<string, { role: Role; userId: string }> = {
    '6666666666': { role: 'retailer', userId: 'e3d3d976-60f0-4c20-a631-c71497eb3e8d' },
    '4444444444': { role: 'retailer', userId: 'bd629dee-de06-4c63-9954-a6e1908e97a2' },
    '9999999999': { role: 'wholesaler', userId: 'f88336b5-f78f-4681-8bf7-1f832f923de1' },
    '5555555555': { role: 'admin', userId: '6b1c0c7b-0829-4a95-aca4-83a36751e4db' },
    '1111111111': { role: 'retailer', userId: '6bc1ac24-6ad7-4894-ab80-a95e3f6cedb0' }, // QA → retailer view
};

export default function AuthLogin() {
    const { login } = useStore();
    const [step, setStep] = useState<'role' | 'mobile' | 'otp'>('role');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 5: Clear cached state on mount
    useState(() => {
        localStorage.clear();
        console.log('🧹 LocalStorage cleared on login mount');
    });

    const demoMatch = DEMO_USERS[mobile];

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setStep('mobile');
        setError('');
    };

    // ─── DEMO BYPASS ─────────────────────────────────────────────────────────
    const handleDemoLogin = () => {
        if (!demoMatch) {
            // Step 4: Add fallback if DB lookup fails (Hardcoded fallback for specific demo numbers)
            const fallback = {
                "6666666666": { role: 'retailer' as Role, userId: 'e3d3d976-60f0-4c20-a631-c71497eb3e8d' },
                "9999999999": { role: 'wholesaler' as Role, userId: 'f88336b5-f78f-4681-8bf7-1f832f923de1' },
                "5555555555": { role: 'admin' as Role, userId: '6b1c0c7b-0829-4a95-aca4-83a36751e4db' }
            }[mobile];

            if (fallback) {
                console.log('💡 Using hardcoded fallback for demo login');
                executeLogin(fallback.userId, fallback.role);
            } else {
                setError('Bypass failed: User not found in DB. Ensure test accounts are seeded.');
            }
            return;
        }

        executeLogin(demoMatch.userId, demoMatch.role);
    };

    const executeLogin = (userId: string, role: Role) => {
        setError('');
        setIsLoading(true);

        // 1. Write demo session to localStorage — StoreContext picks this up on next render
        localStorage.setItem('demo_user', JSON.stringify({
            phone: mobile,
            role: role,
            userId: userId,
        }));
        localStorage.setItem('mandi_auth_role', role);

        // 2. Directly call login()
        login(userId, role)
            .then((ok) => {
                if (!ok) {
                    console.warn('⚠️ login() returned false, relying on localStorage restore');
                }
            })
            .catch((err) => {
                console.error('Demo login error:', err);
                setError('Login failed: ' + err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // ─── REAL OTP SEND ────────────────────────────────────────────────────────
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        setIsLoading(true);
        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                phone: '91' + mobile,
                options: { shouldCreateUser: true }
            });
            if (otpError) {
                setError(otpError.message);
                return;
            }
            setStep('otp');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // ─── REAL OTP VERIFY ─────────────────────────────────────────────────────
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }
        setIsLoading(true);
        try {
            const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
                phone: '91' + mobile,
                token: otp,
                type: 'sms'
            });
            if (verifyError) {
                setError(verifyError.message);
                return;
            }
            const authUid = verifyData?.user?.id;
            if (!authUid) {
                setError('Login failed: no user returned');
                return;
            }
            const success = await login(authUid, selectedRole || 'retailer');
            if (!success) setError('Login failed. Please try again.');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-200 rounded-full blur-[80px] opacity-60" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200 rounded-full blur-[80px] opacity-60" />

            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 relative z-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
                        <Leaf className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Mandi Bhai</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {step === 'role' && 'Who are you?'}
                        {step === 'mobile' && 'Enter your mobile number'}
                        {step === 'otp' && 'Verify your phone'}
                    </p>
                </div>

                {/* Back Button */}
                {step !== 'role' && (
                    <button
                        onClick={() => setStep(step === 'otp' ? 'mobile' : 'role')}
                        className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 p-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Step 1: Role Selection */}
                {step === 'role' && (
                    <div className="space-y-4">
                        <button
                            onClick={() => handleRoleSelect('retailer')}
                            className="w-full p-4 border-2 border-slate-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group text-left flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Retailer (Buyer)</h3>
                                <p className="text-xs text-slate-500">I want to buy stock for my shop</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleRoleSelect('wholesaler')}
                            className="w-full p-4 border-2 border-slate-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group text-left flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Wholesaler (Seller)</h3>
                                <p className="text-xs text-slate-500">I supply goods to retailers</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleRoleSelect('admin')}
                            className="w-full p-4 border-2 border-slate-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group text-left flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Admin</h3>
                                <p className="text-xs text-slate-500">Platform operations &amp; moderation</p>
                            </div>
                        </button>

                        <p className="text-xs text-center text-slate-400 pt-2">Select your role to continue</p>
                    </div>
                )}

                {/* Step 2: Mobile Input */}
                {step === 'mobile' && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        {/* Role badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 mb-2">
                            {selectedRole === 'retailer' && <ShoppingBag className="w-3 h-3" />}
                            {selectedRole === 'wholesaler' && <Truck className="w-3 h-3" />}
                            {selectedRole === 'admin' && <Shield className="w-3 h-3" />}
                            {selectedRole === 'retailer' ? 'Retailer' : selectedRole === 'wholesaler' ? 'Wholesaler' : 'Admin'}
                        </div>

                        {/* Phone input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Mobile Number</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-slate-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span className="absolute left-10 top-3.5 text-slate-500 font-medium border-r border-slate-200 pr-2">+91</span>
                                <input
                                    type="text"
                                    value={mobile}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setMobile(val);
                                    }}
                                    className="w-full pl-[4.5rem] pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-bold text-slate-800 tracking-wide"
                                    placeholder="98765 00000"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                        <div className="space-y-3">
                            {/* Normal OTP button — hidden for demo numbers */}
                            {!demoMatch && (
                                <button
                                    type="submit"
                                    disabled={isLoading || mobile.length !== 10}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Sending OTP...' : <><Phone className="w-4 h-4" /> Get OTP <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            )}

                            {/* Demo bypass button — shown ONLY for demo numbers */}
                            {demoMatch && (
                                <>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                                        <p className="text-amber-700 text-xs font-bold">🎭 Demo Account Detected</p>
                                        <p className="text-amber-600 text-xs mt-0.5">Will log in as <span className="font-bold capitalize">{demoMatch.role}</span> instantly</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleDemoLogin}
                                        disabled={isLoading}
                                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-5 h-5" />
                                        {isLoading ? 'Logging in...' : 'Demo Login — No OTP'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                )}

                {/* Step 3: OTP Input */}
                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-sm text-slate-500">OTP sent to <span className="font-bold text-slate-800">+91 {mobile}</span></p>
                            <button type="button" onClick={() => setStep('mobile')} className="text-xs text-green-600 font-bold hover:underline mt-1">Change Number</button>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Enter 6-digit OTP</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-slate-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 6) setOtp(val);
                                    }}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-bold text-slate-800 tracking-[0.5em] text-center text-lg"
                                    placeholder="••••••"
                                    autoFocus
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Verifying...' : 'Login'}
                        </button>
                    </form>
                )}
            </div>

            <p className="mt-8 text-slate-400 text-xs font-medium">By continuing you agree to Terms &amp; Conditions</p>
        </div>
    );
}
