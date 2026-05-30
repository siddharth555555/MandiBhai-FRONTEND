import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 1. HARD STOP
if (!rawUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials missing in .env');
}

// 2. Strip trailing slash — WebSocket URL breaks with trailing slash
const supabaseUrl = rawUrl.replace(/\/$/, '');

// 3. VALIDATION GUARD
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    throw new Error('INVALID SUPABASE URL — must look like: https://xxxx.supabase.co');
}

if (supabaseAnonKey.startsWith('sb_secret_') || supabaseAnonKey.startsWith('service_role')) {
    throw new Error('FORBIDDEN — do not use service_role key in frontend.');
}

// 4. RUNTIME DIAGNOSTIC
console.log('🔐 SUPABASE INIT');
console.log(`   URL  : ${supabaseUrl}`);
console.log(`   KEY  : ${supabaseAnonKey.substring(0, 20)}...`);
console.log(`   KEY FORMAT: ${supabaseAnonKey.startsWith('eyJ') ? 'JWT (legacy)' : supabaseAnonKey.startsWith('sb_publishable_') ? 'Publishable (new)' : 'UNKNOWN'}`);
console.log("SUPABASE URL", import.meta.env.VITE_SUPABASE_URL);
console.log("Running inside Capacitor:", !!(window as any).Capacitor);
try {
    const keyPayload = JSON.parse(atob(supabaseAnonKey.split('.')[1]));
    console.log(`   KEY ROLE: ${keyPayload.role}`);
    if (keyPayload.role === 'service_role') {
        console.error('🚨 FATAL: service_role key is being used in the frontend! Replace with anon key immediately.');
    }
} catch { /* JWT decode failed — non-JWT key format */ }

// 5. CREATE CLIENT
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// 6. ACTIVE CHANNELS MONITOR
setTimeout(() => {
    const channels = supabase.getChannels();
    console.log('📡 ACTIVE CHANNELS after 3s:', channels.map(c => c.topic));
}, 3000);
