'use client';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function SetLocation() {
    const { saveLocation, currentUserRole, logout } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');
    const [showManual, setShowManual] = useState(false);

    const handleGPS = () => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported by this browser.');
            setShowManual(true);
            return;
        }
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                await saveLocation(pos.coords.latitude, pos.coords.longitude);
                setLoading(false);
            },
            (err) => {
                setLoading(false);
                setError(`GPS error: ${err.message}. Please enter coordinates manually.`);
                setShowManual(true);
            },
            { timeout: 10000, maximumAge: 0 }
        );
    };

    const handleManual = async () => {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            setError('Please enter valid latitude (−90 to 90) and longitude (−180 to 180).');
            return;
        }
        setLoading(true);
        setError(null);
        await saveLocation(lat, lng);
        setLoading(false);
    };

    const roleLabel = currentUserRole === 'wholesaler' ? 'your store' : 'your area';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl text-white">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-400/40 flex items-center justify-center text-3xl">
                        📍
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-center mb-2">Set Your Location</h1>
                <p className="text-slate-300 text-center text-sm mb-8">
                    We need {roleLabel}'s location to show nearby{' '}
                    {currentUserRole === 'wholesaler' ? 'retailers' : 'wholesalers'} within 20 km.
                </p>

                {/* GPS Button */}
                {!showManual && (
                    <button
                        onClick={handleGPS}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 active:scale-95 transition-all font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span>🛰️</span>
                        )}
                        {loading ? 'Detecting location…' : 'Use my current location'}
                    </button>
                )}

                {/* Manual toggle */}
                {!showManual && (
                    <button
                        onClick={() => setShowManual(true)}
                        className="w-full text-sm text-slate-400 hover:text-white transition-colors py-2"
                    >
                        Enter coordinates manually →
                    </button>
                )}

                {/* Manual inputs */}
                {showManual && (
                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 28.6139"
                                value={manualLat}
                                onChange={e => setManualLat(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                placeholder="e.g. 77.2090"
                                value={manualLng}
                                onChange={e => setManualLng(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-400"
                            />
                        </div>
                        <button
                            onClick={handleManual}
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 active:scale-95 transition-all font-semibold text-white disabled:opacity-50"
                        >
                            {loading ? 'Saving…' : 'Save Location'}
                        </button>
                        <button
                            onClick={() => setShowManual(false)}
                            className="w-full text-sm text-slate-400 hover:text-white transition-colors py-1"
                        >
                            ← Try GPS instead
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
                )}

                {/* Logout */}
                <button
                    onClick={logout}
                    className="mt-6 w-full text-xs text-slate-500 hover:text-slate-300 transition-colors py-1"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}
