// TEMP FLAG — Disable product KYC for testing
export const ENABLE_PRODUCT_KYC = false;

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

import { getProductImageUrl } from '../lib/storage';

// --- TYPES ---
export interface Product {
    id: number | string;
    name: string;
    totalStock: number;
    reservedStock?: number;
    price: number;
    unit?: string;
    brand?: string;
    status: 'active' | 'out_of_stock' | 'high_price' | 'expiring' | 'in_stock' | 'expired';
    image_key?: string;
    img: string;
    category?: string;
    description?: string;
    validityStart?: string;
    validityEnd?: string;
    approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    wholesalerId?: string;
    productId?: string; // master catalogue UUID
    active?: boolean;
}

export interface PendingProduct {
    id: string;
    name: string;
    brand: string;
    category: string;
    image_key: string;
    unit: string | undefined;
    submittedBy: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    createdAt: string;
}

export interface OrderItem {
    id: number | string;
    name: string;
    qty: number;
    price: number;
    img: string;
    productId?: string; // master catalogue UUID
}

export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt?: number; // Timestamp for PLACED status tracking
    assignedWholesalerId?: string | null;
    declinedWholesalers?: string[];
    date: string;
    paymentMethod: string;
    assignedAt?: string;
    lockAt?: string;
}

export type OrderStatus =
    | 'placed'
    | 'accepted'
    | 'packed'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'unfulfillable'
    | 'confirming';


const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    'placed': ['accepted', 'cancelled', 'confirming'],
    'accepted': ['packed', 'cancelled'],
    'packed': ['out_for_delivery', 'cancelled'],
    'out_for_delivery': ['delivered', 'cancelled'],
    'delivered': [],
    'cancelled': [],
    'unfulfillable': [],
    'confirming': ['accepted', 'cancelled', 'unfulfillable']
};


export const isValidStatusTransition = (current: OrderStatus, next: OrderStatus): boolean => {
    if (current === next) return true;
    return VALID_TRANSITIONS[current]?.includes(next) ?? false;
};

export interface WholesalerProfile {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    address?: string;        // Physical/mandi address
    profilePhoto: string;
    kycStatus: 'pending' | 'verified' | 'rejected' | 'incomplete';
    kycDocuments: string[];
    rejectionReason?: string;
    submittedAt?: string;
    pincode: string;
    active: boolean;
}

export interface RetailerProfileType {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    gstNumber: string;
    address?: string;        // Shop address
    profilePhoto: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
}

export const getProfileCompletion = (profile: WholesalerProfile): number => {
    let score = 0;
    // Personal Info (Name, Email, Phone, Photo) -> 30%
    if (profile.fullName && profile.email && profile.phone && profile.profilePhoto) score += 30;

    // Business Info (Business Name) -> 30%
    if (profile.businessName) score += 30;

    // KYC Documents -> 40%
    if (profile.kycDocuments.length > 0) score += 40;

    return score;
};

export interface Notification {
    id: string;
    type: 'ORDER' | 'KYC' | 'PRODUCT' | 'SYSTEM';
    title: string;
    message: string;
    createdAt: number;
    isRead: boolean;
    actionRoute: string;
    actionParams?: any;
}


// Minimum order validation error (shown before any DB write)
export interface MinimumOrderError {
    wholesalerId: string;
    wholesalerName: string;
    subtotal: number;
    minimum: number;
}

// Live cart split summary (one entry per wholesaler in the active cart)
export interface CartSplitGroup {
    wholesalerId: string;
    wholesalerName: string;
    subtotal: number;
}

interface StoreContextType {
    // State
    products: Product[];
    pendingProducts: PendingProduct[];
    orders: Order[];
    currentUserRole: 'wholesaler' | 'retailer' | 'admin' | null;
    isAuthenticated: boolean;
    isSessionLoading: boolean;
    login: (authUid: string, role: 'wholesaler' | 'retailer' | 'admin') => Promise<boolean>;
    logout: () => Promise<void>;

    // Actions
    setRole: (role: 'wholesaler' | 'retailer' | 'admin' | null) => void;
    addProduct: (product: Omit<PendingProduct, 'id' | 'status' | 'submittedBy' | 'createdAt'>) => void;
    createListing: (params: { productId: string | number, price: number, stock: number }) => Promise<void>;
    updateProduct: (id: number | string, updates: Partial<Product>) => void;
    approveProduct: (productId: string | number) => Promise<void>;
    rejectProduct: (productId: string | number, reason: string) => Promise<void>;
    placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    updateOrderLineItem: (orderId: string, itemId: number | string, newQty: number) => void;
    removeOrderLineItem: (orderId: string, itemId: number | string) => void;

    // Profile
    wholesalerProfile: WholesalerProfile;
    updateWholesalerProfile: (updates: Partial<WholesalerProfile>) => void;
    retailerProfile: RetailerProfileType;
    updateRetailerProfile: (updates: Partial<RetailerProfileType>) => void;

    frequentCarts: any[];
    addFrequentCart: (cart: any) => void;
    updateFrequentCart: (id: string, updates: any) => void;

    // Active Cart
    cartItems: OrderItem[];
    cartTotal: number;
    cartTotalQty: number;
    addToCart: (item: Product, qty: number) => void;
    removeFromCart: (id: number | string) => void;
    clearCart: () => void;

    // Stock Logic
    getAvailableStock: (productId: number | string) => number;
    checkStockAvailability: (productId: number | string, qty: number) => boolean;

    // Theme
    darkMode: boolean;
    toggleDarkMode: () => void;

    // Notifications
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;

    // Wholesalers
    wholesalers: Wholesaler[];
    registerWholesaler: (wholesaler: Wholesaler) => void;

    // Master Catalogue (all products from all wholesalers)
    masterCatalogue: Product[];

    // Current User Identity
    authUserId: string | null;
    wholesalerProfileId: string | null;

    // Location gate — true if user needs to set location before dashboard
    isLocationRequired: boolean;
    saveLocation: (lat: number, lng: number) => Promise<void>;

    // Minimum order modal
    isOrderMinimumModal: boolean;
    minimumOrderErrors: MinimumOrderError[];
    dismissMinimumModal: () => void;

    // Live cart split preview
    getGroupedCartSummary: () => CartSplitGroup[];

    fetchOrders: () => Promise<void>;
}



const STORAGE_KEYS = {
    PRODUCTS: 'mandi_products_v1',
    ORDERS: 'mandi_orders_v1',
    NOTIFICATIONS: 'mandi_notifications_v5',
    USERS: 'mandi_users',
    SESSION: 'mandi_session',
    THEME: 'mandi_theme',
    WHOLESALER_PROFILE: 'mandi_wholesaler_profile_v1',
    RETAILER_PROFILE: 'mandi_retailer_profile_v1',
    CART: 'mandi_cart_v1',
    FREQUENT_CARTS: 'mandi_frequent_carts_v1',
    WHOLESALERS: 'mandi_wholesalers_v1'
};

import { Wholesaler } from '../services/mockData';
import { supabase } from '../lib/supabase';

// REMOVED INITIAL_PRODUCTS - Now derived from Wholesalers
// const INITIAL_PRODUCTS: Product[] = ...



const INITIAL_WHOLESALER_PROFILE: WholesalerProfile = {
    fullName: "Amit Agarwal",
    businessName: "Shree Traders",
    email: "amit@shreetraders.in",
    phone: "9999999999",
    address: "Shop 12, Azadpur Mandi, Delhi",
    profilePhoto: "",
    kycStatus: 'pending',
    kycDocuments: ['GSTIN Certificate', 'Trade License'],
    submittedAt: "2026-02-01",
    pincode: "110033",
    active: true
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
    console.log("🏪 [StoreContext] init");
    // Helper to read/write JSON safely
    const getStored = <T,>(key: string, backup: T): T => {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return backup;

            const parsed = JSON.parse(stored);

            // Migration Logic for Products: DEPRECATED - Products are now derived from Wholesalers
            // Left here for reference but effectively logic is moved to wholesaler catalogue initialization if needed.
            return parsed;
        } catch (e) {
            console.error(`Failed to load ${key}`, e);
            return backup;
        }
    };

    const setStored = (key: string, value: any) => {
        try {
            if (key === STORAGE_KEYS.PRODUCTS) return; // Prevent saving legacy products key
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Failed to save ${key}`, e);
        }
    };

    // --- STATE INITIALIZATION WITH PERSISTENCE ---

    // Notifications
    const [notifications, setNotifications] = useState<Notification[]>(() =>
        getStored(STORAGE_KEYS.NOTIFICATIONS, [])
    );
    useEffect(() => setStored(STORAGE_KEYS.NOTIFICATIONS, notifications), [notifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: Date.now(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    // Products - REMOVED STATE, NOW DERIVED
    // const [products, setProducts] = useState<Product[]>(...);

    // --- IN-MEMORY STATE (NO PERSISTENCE FOR: orders, cart, wholesalers, users) ---

    // Orders - SYNCHED WITH DB
    const [orders, setOrders] = useState<Order[]>([]);

    // Pending Products for Admin
    const [pendingProducts] = useState<PendingProduct[]>([]);

    // Wholesalers - IN MEMORY ONLY (seeded below)
    const [wholesalers, setWholesalers] = useState<Wholesaler[]>([]);
    const [masterCatalogue, setMasterCatalogue] = useState<Product[]>([]);


    // Profiles - KEEP PERSISTENCE for user experience
    const [wholesalerProfile, setWholesalerProfile] = useState<WholesalerProfile>(() =>
        getStored(STORAGE_KEYS.WHOLESALER_PROFILE, INITIAL_WHOLESALER_PROFILE)
    );
    useEffect(() => setStored(STORAGE_KEYS.WHOLESALER_PROFILE, wholesalerProfile), [wholesalerProfile]);

    const [retailerProfile, setRetailerProfile] = useState<RetailerProfileType>(() =>
        getStored(STORAGE_KEYS.RETAILER_PROFILE, {
            fullName: '',
            businessName: '',
            email: '',
            phone: '',
            gstNumber: '',
            profilePhoto: '',
            pincode: ''
        })
    );
    useEffect(() => setStored(STORAGE_KEYS.RETAILER_PROFILE, retailerProfile), [retailerProfile]);

    // Cart - IN MEMORY ONLY
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);

    // Frequent Carts - KEEP PERSISTENCE for user experience
    const [frequentCarts, setFrequentCarts] = useState<any[]>(() =>
        getStored(STORAGE_KEYS.FREQUENT_CARTS, [])
    );
    useEffect(() => setStored(STORAGE_KEYS.FREQUENT_CARTS, frequentCarts), [frequentCarts]);




    // --- AUTH STATE ---
    const [currentUserRole, setCurrentUserRole] = useState<'wholesaler' | 'retailer' | 'admin' | null>(null);
    const [authUserId, setAuthUserId] = useState<string | null>(null);
    const [wholesalerProfileId, setWholesalerProfileId] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
    const [isLocationRequired, setIsLocationRequired] = useState<boolean>(false);
    const [isOrderMinimumModal, setIsOrderMinimumModal] = useState<boolean>(false);
    const [minimumOrderErrors, setMinimumOrderErrors] = useState<MinimumOrderError[]>([]);

    // --- SUPABASE AUTH SESSION INIT ---
    useEffect(() => {
        // Wipe legacy session key from pre-OTP era — it can hold stale UUIDs
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem('sb-auth-token'); // old Supabase v1 key

        // 0. DEMO SESSION RESTORE — check before touching Supabase
        const demoUserRaw = localStorage.getItem('demo_user');
        if (demoUserRaw) {
            try {
                const demoUser = JSON.parse(demoUserRaw) as { phone: string; role: 'retailer' | 'wholesaler' | 'admin'; userId: string };
                console.log('🎭 DEMO SESSION RESTORE — calling login() for full profile hydration');
                // Call login() so it fetches retailer/wholesaler profile + location from DB
                // This ensures isLocationRequired is set correctly based on actual DB data
                login(demoUser.userId, demoUser.role).catch((e) => {
                    console.error('🎭 Demo session restore: login() error', e);
                    // Fallback: set state directly
                    setCurrentUserRole(demoUser.role);
                    setAuthUserId(demoUser.userId);
                    setIsAuthenticated(true);
                    setIsSessionLoading(false);
                });
                return; // skip Supabase auth entirely
            } catch (e) {
                localStorage.removeItem('demo_user');
            }
        }


        // 1. Check for existing session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('🔁 SESSION RESTORE', session?.user?.id ?? 'NO SESSION');
            console.log("StoreContext auth session:", session);
            if (session?.user) {
                const storedRole = localStorage.getItem('mandi_auth_role') as 'wholesaler' | 'retailer' | 'admin' | null;
                console.log("StoreContext currentUserRole (stored):", storedRole);
                login(session.user.id, storedRole || 'retailer');
            } else {
                setIsSessionLoading(false);
            }
        });

        // 2. Subscribe to future auth changes (login/logout/token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // Don't override demo session with Supabase sign-out events
            if (localStorage.getItem('demo_user')) return;

            console.log('🔁 AUTH STATE CHANGE', session?.user?.id ?? 'SIGNED OUT');
            if (session?.user) {
                const storedRole = localStorage.getItem('mandi_auth_role') as 'wholesaler' | 'retailer' | 'admin' | null;
                login(session.user.id, storedRole || 'retailer');
            } else {
                // Signed out
                setIsAuthenticated(false);
                setCurrentUserRole(null);
                setAuthUserId(null);
                setWholesalerProfileId(null);
                setIsSessionLoading(false);
            }
        });

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- THEME STATE ---
    const [darkMode, setDarkMode] = useState<boolean>(() =>
        getStored(STORAGE_KEYS.THEME, false)
    );
    useEffect(() => setStored(STORAGE_KEYS.THEME, darkMode), [darkMode]);
    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const fetchOrders = async () => {
        console.log("SESSION STATE", {
            role: currentUserRole,
            authUserId,
            wholesalerProfileId
        });

        if (currentUserRole === 'wholesaler' && !wholesalerProfileId) {
            throw new Error("Invariant failed: Wholesaler missing profile ID");
        }

        if (!authUserId || !currentUserRole) return;

        console.log("📦 FETCHING ORDERS for", currentUserRole, authUserId);

        let query = supabase
            .from('orders')
            .select(`
                id,
                retailer_id,
                wholesaler_id,
                total,
                status,
                created_at,
                items:order_items (
                    product_id,
                    quantity,
                    price,
                    product:products (
                        name,
                        image_key
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (currentUserRole === 'retailer') {
            query = query.eq('retailer_id', authUserId);
        } else if (currentUserRole === 'wholesaler') {
            console.log("FILTERING ORDERS BY", wholesalerProfileId);
            query = query.eq('wholesaler_id', wholesalerProfileId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("❌ Error fetching orders:", error);
            return;
        }

        if (data) {
            if (currentUserRole === 'wholesaler') {
                console.log("W1 ORDERS FETCHED", data);
            }
            console.log("✅ ORDERS FETCHED:", data.length);
            const mappedOrders: Order[] = data.map((o: any) => ({
                id: o.id,
                customerName: 'Retailer',
                customerPhone: '9999999999',
                items: o.items.map((i: any) => ({
                    id: i.product_id,
                    name: i.product?.name || 'Unknown Product',
                    qty: i.quantity,
                    price: i.price,
                    img: getProductImageUrl(i.product?.image_key)
                })),
                total: o.total,
                status: (o.status as string).toLowerCase() as OrderStatus,
                createdAt: new Date(o.created_at).getTime(),
                assignedWholesalerId: o.wholesaler_id,
                date: new Date(o.created_at).toLocaleDateString(),
                paymentMethod: 'UPI'
            }));
            console.log("📊 STATE UPDATED. Orders count:", mappedOrders.length);
            setOrders(mappedOrders);
        }
    };

    useEffect(() => {
        if (!authUserId) return;
        if (currentUserRole === 'wholesaler' && !wholesalerProfileId) return;

        fetchOrders();

        const filterString = currentUserRole === 'wholesaler'
            ? `wholesaler_id=eq.${wholesalerProfileId}`
            : `retailer_id=eq.${authUserId}`;

        console.log("📡 SUBSCRIBING WITH FILTER", filterString);

        // Remove any stale channel with same name before creating a new one
        const existing = supabase.getChannels().find(c => c.topic === 'realtime:orders_realtime');
        if (existing) {
            supabase.removeChannel(existing);
            console.log("🧹 Removed stale orders_realtime channel");
        }
        supabase.getChannels().forEach(c => console.log("ACTIVE CHANNEL:", c.topic));

        const channel = supabase.channel('orders_realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                    filter: filterString
                },
                (payload) => {
                    console.log("🔔 REALTIME ORDER UPDATE PAYLOAD", payload);
                    console.log("🔔 CURRENT PROFILE ID", wholesalerProfileId);
                    fetchOrders();
                }
            )
            .subscribe((status) => {
                console.log("📡 REALTIME STATUS:", status);
            });

        return () => { supabase.removeChannel(channel); };
    }, [authUserId, currentUserRole, wholesalerProfileId]);

    // --- PRODUCTS REALTIME SUBSCRIPTION ---
    useEffect(() => {
        if (!authUserId) return;
        if (currentUserRole === 'wholesaler' && !wholesalerProfileId) return;

        const filterString = currentUserRole === 'wholesaler'
            ? `wholesaler_id=eq.${wholesalerProfileId}`
            : undefined;

        // Remove any stale channel with same name before creating a new one
        const existing = supabase.getChannels().find(c => c.topic === 'realtime:products_realtime');
        if (existing) {
            supabase.removeChannel(existing);
            console.log("🧹 Removed stale products_realtime channel");
        }
        supabase.getChannels().forEach(c => console.log("ACTIVE CHANNEL:", c.topic));

        console.log("📡 PRODUCTS REALTIME SUBSCRIBED", filterString);

        const channelConfig: any = {
            event: 'UPDATE',
            schema: 'public',
            table: 'products',
        };
        if (filterString) channelConfig.filter = filterString;

        const channel = supabase.channel('products_realtime')
            .on(
                'postgres_changes',
                channelConfig,
                (payload) => {
                    const updated = payload.new as any;
                    console.log("🔔 PRODUCT STOCK UPDATE", updated);

                    // Patch in-memory — no network round-trip needed.
                    // products is derived from wholesalers on every render,
                    // so both retailer and wholesaler UIs update instantly.
                    setWholesalers(prev => prev.map(w => ({
                        ...w,
                        catalogue: w.catalogue.map((p: any) =>
                            String(p.id) === String(updated.id)
                                ? {
                                    ...p,
                                    totalStock: updated.stock,
                                    status: updated.active ? 'active' : 'out_of_stock'
                                }
                                : p
                        )
                    })));

                    console.log("📦 PRODUCTS STATE REFRESHED — stock patched for id:", updated.id, "→", updated.stock);
                }
            )
            .subscribe((status) => {
                console.log("📡 PRODUCTS REALTIME STATUS:", status);
            });

        return () => { supabase.removeChannel(channel); };
    }, [authUserId, currentUserRole, wholesalerProfileId]);

    // --- ACTIONS ---

    const placeOrder = async (orderData?: Omit<Order, 'id' | 'date' | 'status'>) => {
        console.log('🚀 [placeOrder] CALLED. User:', authUserId);

        if (!authUserId) {
            addNotification({ type: 'SYSTEM', title: 'Error', message: 'You must be logged in.', actionRoute: 'login' });
            return;
        }

        // Live session cross-check — skip entirely for demo sessions
        const isDemoSession = !!localStorage.getItem('demo_user');
        if (!isDemoSession) {
            const { data: { user: liveUser } } = await supabase.auth.getUser();
            if (!liveUser) {
                console.warn('⚠️ [placeOrder] No live Supabase session. Aborting.');
                alert('Session expired. Please log in again.');
                return;
            } else if (authUserId !== liveUser.id) {
                console.error('❌ [placeOrder] ABORT: stale UUID in React state');
                alert('Session mismatch. Please log out and log in again.');
                return;
            }
        } else {
            console.log('🎭 [placeOrder] Demo session — skipping Supabase live-user check');
        }

        const itemsToProcess = orderData?.items?.length ? orderData.items : cartItems;
        if (!itemsToProcess?.length) {
            console.error('❌ [placeOrder] Abort: empty cart');
            return;
        }

        // ── 1. GROUP BY WHOLESALER ───────────────────────────────────────────
        const grouped = new Map<string, { items: typeof itemsToProcess; subtotal: number }>();
        for (const item of itemsToProcess) {
            // Find the wholesalerId for this product from our synced products state
            const productInfo = products.find(p => p.id === item.id);
            const wId = productInfo?.wholesalerId;

            if (!wId) {
                console.error(`❌ No wholesalerId for ${item.name}`);
                continue;
            }

            const g = grouped.get(wId) ?? { items: [], subtotal: 0 };
            g.items.push(item);
            g.subtotal += item.price * item.qty;
            grouped.set(wId, g);
        }

        if (grouped.size === 0) {
            alert('Error: No valid products in cart.');
            return;
        }

        // ── 2. PRE-FLIGHT VALIDATION ──
        const errors: MinimumOrderError[] = [];
        for (const [wId, group] of grouped) {
            const w = wholesalers.find(w => w.id === wId);
            const minimum = w?.minimum_order_value ?? 0;
            if (group.subtotal < minimum) {
                errors.push({
                    wholesalerId: wId,
                    wholesalerName: w?.name ?? wId,
                    subtotal: group.subtotal,
                    minimum,
                });
            }
        }

        if (errors.length > 0) {
            setMinimumOrderErrors(errors);
            setIsOrderMinimumModal(true);
            return;
        }

        // ── 3. ATOMIC RPC EXECUTION ──────────────────────────────────────────
        try {
            const successIds: string[] = [];

            for (const [wId, group] of grouped) {
                console.log(`📡 Calling atomic RPC for wholesaler ${wId} — ₹${group.subtotal}`);

                const { data: orderId, error: rpcError } = await supabase.rpc('place_order_atomic', {
                    p_retailer_id: authUserId,
                    p_wholesaler_id: wId,
                    p_total: group.subtotal,
                    p_items: group.items.map(item => {
                        // Extra robust: find product in state to get its master productId
                        const masterProduct = products.find(p => p.id === item.id);
                        return {
                            // RPC checks product_listings WHERE product_id = this — must be master UUID
                            product_id: masterProduct?.productId || item.productId || item.id,
                            quantity: item.qty,
                            price: item.price
                        };
                    })
                });

                if (rpcError) {
                    console.error(`❌ [placeOrder] RPC Fail for ${wId}:`, rpcError);
                    throw new Error(rpcError.message);
                }

                if (orderId) successIds.push(orderId);
            }

            console.log('✅ [placeOrder] Success:', successIds);
            clearCart();
            await fetchOrders();
            addNotification({
                type: 'ORDER',
                title: 'Order Placed',
                message: `${successIds.length} order(s) placed successfully.`,
                actionRoute: 'orders'
            });

        } catch (e: any) {
            console.error('❌ [placeOrder] EXCEPTION:', e);
            alert(`Order Failed: ${e.message}`);
        }
    };

    // --- LOAD INITIAL DATA FROM SUPABASE (Wholesalers & Products) ---
    // --- DATA FETCHING PIPELINE ---
    const isCapacitor = !!(window as any).Capacitor;

    const fetchData = useCallback(async () => {
        console.log(`🔌 [fetchData] STARTING | Env: ${isCapacitor ? 'MOBILE' : 'WEB'} | Role: ${currentUserRole} | UID: ${authUserId}`);
        console.log("currentUserRole:", currentUserRole);
        console.log("retailer profile:", retailerProfile);
        console.log("wholesaler profile:", wholesalerProfile);

        try {
            // 1. Fetch Wholesalers
            const { data: wholesalersData, error: wError } = await supabase
                .from('wholesalers')
                .select('*');

            if (wError) {
                console.error("❌ [fetchData] Wholesalers Error:", wError);
                throw wError;
            }

            // 2. Fetch Product Listings
            const { data: listingsData, error: lError } = await supabase
                .from('product_listings')
                .select(`
                    id,
                    price,
                    stock,
                    active,
                    wholesaler_id,
                    product:products (
                        id,
                        name,
                        brand,
                        category,
                        unit,
                        image_key
                    )
                `);

            if (lError) {
                console.error("❌ [fetchData] Listings Error:", lError);
                throw lError;
            }

            console.log(`✅ [fetchData] DB_RESPONSES: Wholesalers[${wholesalersData?.length}] Listings[${listingsData?.length}]`);
            console.log("product listings loaded:", listingsData?.length || 0);

            // 3. Map to State
            const mappedWholesalers: Wholesaler[] = (wholesalersData || []).map((w: any) => {
                const wListings = (listingsData || []).filter((l: any) => l.wholesaler_id === w.id);
                const catalogue = wListings.map((l: any) => ({
                    id: l.id,
                    productId: l.product?.id,
                    name: l.product?.name,
                    brand: l.product?.brand,
                    category: l.product?.category,
                    price: l.price,
                    totalStock: l.stock,
                    reservedStock: 0,
                    status: l.active ? 'active' : 'out_of_stock',
                    image_key: l.product?.image_key,
                    img: getProductImageUrl(l.product?.image_key),
                    wholesalerId: w.id,
                    description: '',
                    unit: l.product?.unit || ''
                }));

                return {
                    id: w.id,
                    name: w.business_name,
                    pincode: w.pincode,
                    rating: w.rating || 0,
                    active: w.active,
                    minimum_order_value: w.minimum_order_value ?? 0,
                    latitude: w.latitude ?? null,
                    longitude: w.longitude ?? null,
                    catalogue: catalogue
                };
            });

            setWholesalers(mappedWholesalers);
            console.log("product listings loaded:", listingsData?.length || 0);

            // 4. Fetch Master Catalogue
            const { data: catData } = await supabase.from('products').select('*');
            if (catData) {
                setMasterCatalogue(catData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand,
                    category: p.category,
                    price: 0,
                    totalStock: 0,
                    reservedStock: 0,
                    status: 'active',
                    image_key: p.image_key,
                    img: getProductImageUrl(p.image_key),
                    unit: p.unit || ''
                })));
            }

        } catch (err: any) {
            console.error("❌ [fetchData] PIPELINE FAILED:", err.message);
        }
    }, [isCapacitor, currentUserRole, authUserId]);

    const initializeApp = useCallback(async () => {
        console.log("🚀 [initializeApp] STARTING");
        console.log("currentUserRole:", currentUserRole);
        console.log("auth session (via getSession):", (await supabase.auth.getSession()).data.session?.user?.id);

        if (!currentUserRole) {
            console.log("⚠️ [initializeApp] No role yet, skipping.");
            return;
        }

        await fetchData();
        await fetchOrders();
        console.log("✅ [initializeApp] COMPLETE");
    }, [currentUserRole, fetchData, fetchOrders]);

    // TRIGGER: Load data whenever identity or role changes
    useEffect(() => {
        if (!currentUserRole) return;
        initializeApp();
    }, [currentUserRole, initializeApp]);

    // Realtime Subscription for Catalogues
    useEffect(() => {
        const channel = supabase.channel('catalogue_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'wholesalers' },
                (payload) => {
                    console.log("🔔 REALTIME WHOLESALER UPDATE", payload);
                    fetchData();
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                (payload) => {
                    console.log("🔔 REALTIME PRODUCT UPDATE", payload);
                    fetchData();
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log("🔔 REALTIME ORDER INSERTED", payload);
                    const newOrder = payload.new as any;
                    // If this order is for the current wholesaler, notify!
                    if (currentUserRole === 'wholesaler' && newOrder.assigned_wholesaler_id === wholesalerProfileId) {
                        addNotification({
                            type: 'ORDER',
                            title: 'New order received',
                            message: `Order #${newOrder.id.substring(0, 8)} recieved.`,
                            actionRoute: 'orders',
                            actionParams: { orderId: newOrder.id }
                        });
                        // Also refresh orders list
                        fetchOrders();
                    }
                }
            )
            .subscribe();

        return () => {
            console.log("🔌 Cleaning up realtime channel");
            supabase.removeChannel(channel);
        };
    }, [authUserId, currentUserRole, fetchData, wholesalerProfileId]);

    // --- DERIVED PRODUCTS ---

    // --- RETAILER PRODUCT DERIVATION ---
    // Single canonical derivation function. Called on every render.
    // Pincode filter is OPTIONAL: empty/null pincode = show ALL active wholesalers.
    const getRetailerVisibleProducts = (): Product[] => {

        // ── Haversine distance (km) between two lat/lng points ──────────────
        const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2
                + Math.cos(lat1 * Math.PI / 180)
                * Math.cos(lat2 * Math.PI / 180)
                * Math.sin(dLng / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };

        console.group("🧪 RETAILER PRODUCT DERIVATION");

        const isDemoMode = !!localStorage.getItem('demo_user');
        let retailerLat = retailerProfile.latitude;
        let retailerLng = retailerProfile.longitude;

        // Step 4: AGGRESSIVE FALLBACK FOR MOBILE
        // If demo mode is active, we MUST show products even if profile hasn't loaded 
        if (isDemoMode) {
            if (!retailerLat || !retailerLng) {
                console.warn("⚠️ Demo user missing coordinates, forcing Delhi fallback");
                retailerLat = 28.4595;
                retailerLng = 77.0266;
            }
        }

        console.log("Retailer profile:", retailerProfile);
        console.log("retailer profile coordinates:", { lat: retailerProfile.latitude, lng: retailerProfile.longitude });
        console.log("wholesaler profile:", wholesalerProfile);
        console.log("Effective coordinates:", { lat: retailerLat, lng: retailerLng });

        // 1. Require retailer location — no location → no products
        if (!retailerLat || !retailerLng) {
            console.log("🚫 Retailer has no location — returning empty product list");
            console.log("Retailer coordinates:", retailerLat, retailerLng);
            console.groupEnd();
            return [];
        }

        console.log("retailer location:", { lat: retailerLat, lng: retailerLng });
        console.log("wholesalers total:", wholesalers.length);

        // EXTRA FALLBACK: If wholesalers list is completely empty, it means fetchData failed or is pending.
        // In demo mode, we can't afford a blank screen.
        if (isDemoMode && wholesalers.length === 0) {
            console.warn("🚨 NO WHOLESALERS IN STATE — Demo mode might be failing to fetch data");
        }

        if (isDemoMode) {
            console.log("🌟 [DERIVATION] DEMO MODE: Bypassing EVERYTHING to show all products.");
            const allDemoProducts = (wholesalers as Wholesaler[]).flatMap(w => w.catalogue || []);
            console.log("🌟 [DERIVATION] DEMO MODE PRODUCTS COUNT:", allDemoProducts.length);
            console.groupEnd();
            return allDemoProducts;
        }

        // 2. Active wholesalers within 20km (Haversine)
        const RADIUS_KM = 20;

        const visibleWholesalers = wholesalers.filter((w: Wholesaler) => {
            if (!w.active) return false;

            if (w.latitude == null || w.longitude == null) {
                console.log(`  SKIP (no coords): ${w.name}`);
                return false;
            }
            const dist = haversineKm(retailerLat, retailerLng, w.latitude, w.longitude);
            console.log(`  ${w.name}: ${dist.toFixed(1)}km ${dist <= RADIUS_KM ? '✅' : '❌'}`);
            return dist <= RADIUS_KM;
        });
        console.log("wholesalers within 20km:", visibleWholesalers.length);

        // 3. Flatten catalogues
        const allProducts = visibleWholesalers.flatMap((w: Wholesaler) => w.catalogue || []);
        console.log("products before stock filter:", allProducts.length);

        // 4. Stock filter
        const inStockProducts = allProducts.filter((p: Product) => {
            const avail = (p.totalStock || 0) - (p.reservedStock || 0);
            if (avail <= 0) console.log(`  REJECTED (no stock): ${p.name}`);
            return avail > 0;
        });

        // 5. CHEAPEST-PRICE DEDUPLICATION
        // ...
        const productMap = new Map<string, Product>();
        for (const p of inStockProducts) {
            const key = p.name.trim().toLowerCase();
            const existing = productMap.get(key);
            if (!existing) {
                productMap.set(key, p);
            } else {
                const existingAvail = (existing.totalStock || 0) - (existing.reservedStock || 0);
                const currentAvail = (p.totalStock || 0) - (p.reservedStock || 0);
                if (p.price < existing.price || (p.price === existing.price && currentAvail > existingAvail)) {
                    productMap.set(key, p);
                }
            }
        }
        const deduplicatedProducts = Array.from(productMap.values());

        console.log('products before dedup:', inStockProducts.length, '| after dedup:', deduplicatedProducts.length);
        console.groupEnd();
        return deduplicatedProducts;
    };

    // --- DERIVED DATA ---
    // Runs on every render.
    const products = (() => {
        if (currentUserRole === 'wholesaler' && wholesalerProfileId) {
            const myWholesaler = wholesalers.find(w => w.id === wholesalerProfileId);
            return (myWholesaler?.catalogue as Product[]) || [];
        }
        const visible = getRetailerVisibleProducts();
        console.log("StoreContext derived products count:", visible.length);
        return visible;
    })();

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const cartTotalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);


    // --- ACTIONS ---

    const login = async (authUid: string, role: 'wholesaler' | 'retailer' | 'admin') => {
        if (!authUid) return false;
        try {
            console.log('🔎 LOGIN SETTING AUTH UID:', authUid);

            // Fetch user entry to get authoritative role
            const { data: userEntry } = await supabase
                .from('users')
                .select('role')
                .eq('id', authUid)
                .maybeSingle();

            // Determine role: prioritize DB role, fallback to UI selection
            const resolvedRole: 'wholesaler' | 'retailer' | 'admin' = (userEntry?.role as any) || role;

            console.log('RESOLVED ROLE:', resolvedRole);
            console.log('currentUserRole:', resolvedRole);

            // Fetch wholesaler profile if applicable
            const { data: wProfile } = await supabase
                .from('wholesalers')
                .select('id, latitude, longitude, business_name, owner_name, email, phone, address, minimum_order_value, pincode, active')
                .eq('user_id', authUid)
                .maybeSingle();

            const profileId = wProfile?.id || null;
            console.log('WHOLESALER PROFILE FOUND:', !!wProfile);

            // ── MAP WHOLESALER PROFILE FIELDS FROM DB ────────────────────────
            if (wProfile) {
                setWholesalerProfile(prev => ({
                    ...prev,
                    businessName: wProfile.business_name ?? prev.businessName,
                    fullName: wProfile.owner_name ?? prev.fullName,
                    email: wProfile.email ?? prev.email,
                    phone: wProfile.phone ?? prev.phone,
                    pincode: wProfile.pincode ?? prev.pincode,
                    active: wProfile.active ?? prev.active,
                    // address is displayed in UI but not in WholesalerProfile interface yet — stored as businessName suffix
                }));
            }

            // ── LOCATION GATE ─────────────────────────────────────────────────
            let locationMissing = false;

            if (resolvedRole === 'wholesaler' && wProfile) {
                // Wholesaler: check their own row's lat/lng
                locationMissing = !wProfile.latitude || !wProfile.longitude;
                console.log('📍 Wholesaler location check:', locationMissing ? '❌ MISSING' : '✅ OK');
            } else if (resolvedRole === 'retailer') {
                // Demo sessions: skip location gate entirely (location is pre-seeded in DB)
                const isDemoAuth = !!localStorage.getItem('demo_user');
                // Retailer: fetch full profile + location check
                const { data: rRow, error: rError } = await supabase
                    .from('retailers')
                    .select('latitude, longitude, full_name, business_name, email, phone, address, gst_number')
                    .eq('id', authUid)
                    .maybeSingle();

                if (rError) console.error("❌ Profile fetch error:", rError);
                console.log("Retailer profile query result:", rRow);

                locationMissing = isDemoAuth ? false : (!rRow?.latitude || !rRow?.longitude);
                console.log('📍 Retailer location check:', locationMissing ? '❌ MISSING' : '✅ OK', isDemoAuth ? '(demo - forced OK)' : '');

                // Map all retailer profile fields from DB into React state
                const DEMO_DEFAULT_LAT = 28.4595;
                const DEMO_DEFAULT_LNG = 77.0266;
                setRetailerProfile(prev => ({
                    ...prev,
                    fullName: rRow?.full_name ?? prev.fullName,
                    businessName: rRow?.business_name ?? prev.businessName,
                    email: rRow?.email ?? prev.email,
                    phone: rRow?.phone ?? prev.phone,
                    gstNumber: rRow?.gst_number ?? prev.gstNumber,
                    address: rRow?.address ?? (prev as any).address,
                    // For demo: use DB location if available, else use default Delhi coords
                    latitude: rRow?.latitude ?? (isDemoAuth ? DEMO_DEFAULT_LAT : prev.latitude),
                    longitude: rRow?.longitude ?? (isDemoAuth ? DEMO_DEFAULT_LNG : prev.longitude),
                }));
            }

            setAuthUserId(authUid);
            setCurrentUserRole(resolvedRole);
            setWholesalerProfileId(profileId);
            setIsAuthenticated(true);
            setIsLocationRequired(locationMissing);
            setIsSessionLoading(false);

            // ⚡ TRIGGER DATA FETCH IMMEDIATELY AFTER LOG IN SUCCESS
            console.log('⚡ [login] SUCCESS - Triggering immediate data fetch');
            fetchData();

            // Persist role so session restore knows which role to use
            localStorage.setItem('mandi_auth_role', resolvedRole);

            return true;
        } catch (e: any) {
            console.error('❌ login() error', e);
            setIsSessionLoading(false);
            return false;
        }
    };

    // ── SAVE LOCATION — called from SetLocation screen ────────────────────────
    const saveLocation = async (lat: number, lng: number) => {
        console.log('📍 SAVE LOCATION START', { lat, lng, role: currentUserRole });

        // ── Demo session: skip Supabase UID check, use authUserId from React state ──
        const isDemoSession = !!localStorage.getItem('demo_user');
        let effectiveUid: string | null = null;

        if (isDemoSession) {
            effectiveUid = authUserId;
            console.log('🎭 saveLocation: demo session — using authUserId directly:', effectiveUid);
        } else {
            const { data: userData } = await supabase.auth.getUser();
            effectiveUid = userData?.user?.id ?? null;
            console.log('📍 AUTH USER:', effectiveUid);
            console.log('📍 UID MATCH:', effectiveUid === authUserId ? '✅ MATCH' : '❌ MISMATCH');
        }

        if (!effectiveUid || !currentUserRole) {
            console.error('❌ saveLocation: no UID — aborting');
            return;
        }

        // ── 2. Write to DB ────────────────────────────────────────────────────
        if (currentUserRole === 'wholesaler' && wholesalerProfileId) {
            const { data, error } = await supabase
                .from('wholesalers')
                .update({ latitude: lat, longitude: lng })
                .eq('id', wholesalerProfileId)
                .select();

            console.log('📍 wholesalers UPDATE result:', { data, error });
            if (error) {
                console.error('❌ saveLocation (wholesaler) failed:', error);
                return;
            }

        } else if (currentUserRole === 'retailer') {
            const { data, error } = await supabase
                .from('retailers')
                .upsert(
                    { id: effectiveUid, latitude: lat, longitude: lng },
                    { onConflict: 'id' }
                )
                .select();

            console.log('📍 retailers UPSERT result:', { data, error });

            if (error) {
                console.error('❌ saveLocation (retailer) UPSERT FAILED:', error);
                console.error('   code:', error.code, '| hint:', error.hint, '| message:', error.message);
                // For demo sessions: still lift the gate and update local state even if DB write fails
                if (!isDemoSession) return;
            }

            // Hydrate into React state immediately so product derivation picks it up
            setRetailerProfile(prev => ({ ...prev, latitude: lat, longitude: lng }));
        } else if (currentUserRole === 'admin') {
            // Admin doesn't need location gate
        }

        // ── 3. Lift gate only on success ──────────────────────────────────────
        setIsLocationRequired(false);
        console.log('✅ Location saved — gate lifted');
    };

    const logout = async () => {
        // Clear both real Supabase session and demo session
        await supabase.auth.signOut().catch(() => { }); // ignore signOut errors for demo sessions
        setIsAuthenticated(false);
        setCurrentUserRole(null);
        setAuthUserId(null);
        setWholesalerProfileId(null);
        localStorage.removeItem('mandi_auth_role');
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem('demo_user'); // clear demo session
    };

    const setRole = (role: 'wholesaler' | 'retailer' | 'admin' | null) => {
        setCurrentUserRole(role);
        // We do strictly enforce DB role, but in dev we might want to toggle UI.
        // However, this will not update the DB ID. 
        // For now, we keep it as a UI toggle but warn.
        console.warn("⚠️ setRole called. This only changes UI state, not DB user.");
    };

    /**
     * FLOW A: Create a listing from an existing Master Catalogue SKU
     */
    const createListing = async (params: { productId: string | number, price: number, stock: number }) => {
        if (currentUserRole !== 'wholesaler' || !wholesalerProfileId) return;

        console.log("🚀 CREATING LISTING FROM CATALOGUE", params);

        const { data, error } = await supabase
            .from('product_listings')
            .insert([{
                product_id: params.productId,
                wholesaler_id: wholesalerProfileId,
                price: params.price,
                stock: params.stock,
                active: true
            }])
            .select();

        if (error) {
            console.error("❌ Failed to create listing", error);
            addNotification({
                type: 'SYSTEM',
                title: 'Listing Failed',
                message: error.message,
                actionRoute: 'catalogue'
            });
        } else {
            console.log("✅ Listing created", data);
            addNotification({
                type: 'PRODUCT',
                title: 'Product Listed',
                message: `Product is now live in your store.`,
                actionRoute: 'catalogue'
            });
        }
    };

    /**
     * FLOW B: Submit a new product for moderation
     */
    const addProduct = async (product: Omit<PendingProduct, 'id' | 'status' | 'submittedBy' | 'createdAt'>) => {
        if (currentUserRole !== 'wholesaler' || !wholesalerProfileId) return;

        console.log("🚀 SUBMITTING NEW PRODUCT FOR MODERATION", product);

        const { data, error } = await supabase
            .from('pending_products')
            .insert([{
                submitted_by: wholesalerProfileId,
                name: product.name,
                brand: product.brand,
                category: product.category,
                image_key: product.image_key,
                unit: product.unit,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) {
            console.error("❌ Failed to submit product", error);
            addNotification({
                type: 'SYSTEM',
                title: 'Submission Failed',
                message: error.message,
                actionRoute: 'catalogue'
            });
        } else {
            console.log("✅ Product submitted for moderation", data);
            addNotification({
                type: 'PRODUCT',
                title: 'Request Submitted',
                message: `${product.name} is awaiting admin moderation.`,
                actionRoute: 'catalogue'
            });
        }
    };


    const updateProduct = async (id: number | string, updates: Partial<Product>) => {
        if (currentUserRole !== 'wholesaler') return;

        console.log("🔄 UPDATING LISTING", { id, updates });

        const dbUpdates: any = {};
        if (updates.price) dbUpdates.price = updates.price;
        if (updates.totalStock !== undefined) dbUpdates.stock = updates.totalStock;
        if (updates.active !== undefined) dbUpdates.active = updates.active;

        const { error } = await supabase
            .from('product_listings')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error("❌ Failed to update listing", error);
            addNotification({
                type: 'SYSTEM',
                title: 'Update Failed',
                message: error.message,
                actionRoute: 'catalogue'
            });
        }
    };


    const approveProduct = async (pendingId: string | number) => {
        if (currentUserRole !== 'admin') return;

        // 1. Get the pending product details
        const { data: pending, error: fError } = await supabase
            .from('pending_products')
            .select('*')
            .eq('id', pendingId)
            .single();

        if (fError || !pending) {
            console.error("❌ Could not find pending product", fError);
            return;
        }

        // 2. Insert into Master Catalogue
        const { error: iError } = await supabase
            .from('products')
            .insert([{
                name: pending.name,
                brand: pending.brand,
                category: pending.category,
                unit: pending.unit,
                image_key: pending.image_key
            }]);

        if (iError) {
            console.error("❌ Failed to add to master catalogue", iError);
            return;
        }

        // 3. Mark as approved
        const { error: uError } = await supabase
            .from('pending_products')
            .update({ status: 'approved' })
            .eq('id', pendingId);

        if (uError) console.error("❌ Failed to update pending status", uError);
        else console.log("✅ Product approved and added to catalogue");
    };

    const rejectProduct = async (pendingId: string | number, reason: string) => {
        if (currentUserRole !== 'admin') return;
        const { error } = await supabase
            .from('pending_products')
            .update({ status: 'rejected', rejection_reason: reason })
            .eq('id', pendingId);
        if (error) console.error("❌ Failed to reject product", error);
    };


    const registerWholesaler = (wholesaler: Wholesaler) => {
        setWholesalers(prev => {
            if (prev.some(w => w.id === wholesaler.id)) return prev;
            return [...prev, wholesaler];
        });
    };

    // SYNC PROFILE FROM REGISTRY (Source of Truth)
    useEffect(() => {
        if (currentUserRole === 'wholesaler' && wholesalerProfileId) {
            const registryEntry = wholesalers.find(w => w.id === wholesalerProfileId);
            if (registryEntry) {
                setWholesalerProfile(prev => {
                    // Only update if there's a difference to avoid infinite loops or unnecessary renders
                    if (
                        prev.businessName !== registryEntry.name ||
                        prev.pincode !== registryEntry.pincode ||
                        prev.active !== registryEntry.active
                    ) {
                        return {
                            ...prev,
                            businessName: registryEntry.name,
                            pincode: registryEntry.pincode,
                            active: registryEntry.active ?? true
                        };
                    }
                    return prev;
                });
            }
        }
    }, [wholesalers, wholesalerProfileId, currentUserRole]);

    // Helper to find a wholesaler who stocks ALL items
    // This logic is used for both initial placement and reassignment.
    // --- ACTIONS ---
    // (placeOrder is defined above)

    // REMOVED DUPLICATE placeOrder


    const updateOrderLineItem = (orderId: string, itemId: number | string, newQty: number) => {
        setOrders(prevOrders => {
            return prevOrders.map(order => {
                if (order.id !== orderId || (order.status as string) !== 'placed') return order;


                const itemIndex = order.items.findIndex(i => i.id === itemId);
                if (itemIndex === -1) return order;

                const item = order.items[itemIndex];
                const qtyDiff = newQty - item.qty;

                setWholesalers(prev => prev.map(w => {
                    // We need to find the wholesaler for this order.
                    // Ideally order stored assignedWholesalerId.
                    if (w.id !== order.assignedWholesalerId) return w;

                    return {
                        ...w,
                        catalogue: w.catalogue.map((p: any) => {
                            if (p.id === itemId) {
                                return { ...p, reservedStock: Math.max(0, (p.reservedStock || 0) + qtyDiff) };
                            }
                            return p;
                        })
                    };
                }));

                const newItems = [...order.items];
                newItems[itemIndex] = { ...item, qty: newQty };

                const newTotal = newItems.reduce((sum, i) => {
                    const p = i.price || 0;
                    return sum + (p * i.qty);
                }, 0);

                return { ...order, items: newItems, total: newTotal };
            });
        });
    };

    const removeOrderLineItem = (orderId: string, itemId: number | string) => {
        setOrders(prevOrders => {
            return prevOrders.map(order => {
                if (order.id !== orderId || (order.status as string) !== 'placed') return order;


                const item = order.items.find(i => i.id === itemId);
                if (!item) return order;

                setWholesalers(prev => prev.map(w => {
                    if (w.id !== order.assignedWholesalerId) return w; // Only update assigned wholesaler

                    return {
                        ...w,
                        catalogue: w.catalogue.map((p: any) => {
                            if (p.id === itemId) {
                                return { ...p, reservedStock: Math.max(0, (p.reservedStock || 0) - item.qty) };
                            }
                            return p;
                        })
                    };
                }));

                const newItems = order.items.filter(i => i.id !== itemId);

                const newTotal = newItems.reduce((sum, i) => {
                    const p = i.price || 0;
                    return sum + (p * i.qty);
                }, 0);

                return { ...order, items: newItems, total: newTotal };
            });
        });
    };

    const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
        console.log("🔄 UPDATING STATUS", { orderId, status });

        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) {
            console.error("❌ Failed to update status", error);
            addNotification({
                type: 'SYSTEM',
                title: 'Update Failed',
                message: error.message,
                actionRoute: 'orders'
            });
        } else {
            // Success - Realtime will update the UI
            addNotification({
                type: 'ORDER',
                title: 'Order Updated',
                message: `Order #${orderId} marked as ${status}`,
                actionRoute: 'order_detail',
                actionParams: { id: orderId }
            });
        }
    };

    const updateWholesalerProfile = async (updates: Partial<WholesalerProfile>) => {
        if (!wholesalerProfileId || currentUserRole !== 'wholesaler') return;

        console.log("🔄 UPDATING WHOLESALER PROFILE", updates);

        const dbUpdates: any = {};
        if (updates.businessName) dbUpdates.business_name = updates.businessName;
        if (updates.pincode) dbUpdates.pincode = updates.pincode;
        if (updates.active !== undefined) dbUpdates.active = updates.active;

        // Check if we are updating by UUID
        const targetId = wholesalerProfileId;

        if (!targetId) {
            console.error("❌ Cannot update profile: No Wholesaler Profile ID");
            return;
        }

        const { error: updateError } = await supabase
            .from('wholesalers')
            .update(dbUpdates)
            .eq('id', targetId);

        if (updateError) {
            console.error("❌ Failed to update wholesaler profile", updateError);
            addNotification({
                type: 'SYSTEM',
                title: 'Update Failed',
                message: updateError.message,
                actionRoute: 'profile'
            });
        } else {
            // Local optimistic update for immediate feedback
            setWholesalerProfile(prev => ({ ...prev, ...updates }));

            addNotification({
                type: 'SYSTEM',
                title: 'Profile Updated',
                message: 'Your profile has been updated.',
                actionRoute: 'profile'
            });
        }
    };

    const updateRetailerProfile = (updates: Partial<RetailerProfileType>) => {
        setRetailerProfile(prev => ({ ...prev, ...updates }));
    };

    const addFrequentCart = (cart: any) => {
        setFrequentCarts(prev => [...prev, { ...cart, id: Date.now().toString() }]);
    };

    const updateFrequentCart = (id: string, updates: any) => {
        setFrequentCarts(prev => prev.map(cart => cart.id === id ? { ...cart, ...updates } : cart));
    };

    const addToCart = (product: Product, qty: number) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            const availableStock = Number(product.totalStock) || 0;

            if (existing) {
                const requestedQty = existing.qty + qty;

                // Remove if quantity would be <= 0
                if (requestedQty <= 0) {
                    return prev.filter(i => i.id !== product.id);
                }

                // Cap at available stock
                const newQty = Math.min(requestedQty, availableStock);

                // Warn if trying to exceed stock
                if (requestedQty > availableStock) {
                    console.warn(`Cannot add more ${product.name}. Only ${availableStock} available in stock.`);
                }

                return prev.map(i => i.id === product.id ? { ...i, qty: newQty } : i);
            }

            // New item
            if (qty <= 0) return prev;

            // Cap at available stock for new items
            const newQty = Math.min(qty, availableStock);

            // Warn if trying to exceed stock
            if (qty > availableStock) {
                console.warn(`Cannot add ${qty} ${product.name}. Only ${availableStock} available in stock.`);
            }

            return [...prev, {
                id: product.id,
                productId: (product as any).productId,
                name: product.name,
                qty: newQty,
                price: product.price,
                img: product.img
            }];
        });
    };

    const removeFromCart = (id: number | string) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => setCartItems([]);

    const getAvailableStock = (productId: number | string): number => {
        // We can just find the product in the current 'products' array since it is derived and has latest data
        const product = products.find(p => p.id === productId);
        if (!product) return 0;
        const total = product.totalStock || 0;
        const reserved = product.reservedStock || 0;
        return Math.max(0, total - reserved);
    };

    const checkStockAvailability = (productId: number | string, qty: number): boolean => {
        return getAvailableStock(productId) >= qty;
    };

    const commitStockForOrder = (order: Order) => {
        if (!order.assignedWholesalerId) return;

        setWholesalers(prev => prev.map(w => {
            if (w.id !== order.assignedWholesalerId) return w;

            return {
                ...w,
                catalogue: w.catalogue.map((p: any) => {
                    const item = order.items.find(i => i.id === p.id);
                    if (item) {
                        const currentTotal = p.totalStock || 0;
                        const currentReserved = p.reservedStock || 0;
                        return {
                            ...p,
                            totalStock: Math.max(0, currentTotal - item.qty),
                            reservedStock: Math.max(0, currentReserved - item.qty)
                        };
                    }
                    return p;
                })
            };
        }));
    };

    const acceptOrder = (orderId: string) => {
        setOrders(prev => prev.map(o => {
            if (o.id !== orderId || o.status !== 'placed') return o;

            return {
                ...o,
                status: 'accepted',
                assignedAt: new Date().toISOString(),
                lockAt: new Date(Date.now() + 15 * 60000).toISOString()
            };
        }));

        const order = orders.find(o => o.id === orderId);
        if (order) commitStockForOrder(order);

        addNotification({
            type: 'ORDER',
            title: 'Order Accepted',
            message: `Order #${orderId.substring(0, 8)} has been accepted.`,
            actionRoute: 'orders'
        });
    };


    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            orders.forEach(order => {
                if (order.status === 'placed' && order.createdAt) {

                    if (now - order.createdAt > 60000) {
                        acceptOrder(order.id);
                    }
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [orders]);

    // Consolidate final return
    return (
        <StoreContext.Provider
            value={{
                wholesalerProfile,
                retailerProfile,
                wholesalers,
                masterCatalogue,
                products,
                pendingProducts,
                currentUserRole,
                isAuthenticated,
                isSessionLoading,
                login,
                logout,
                createListing,
                addProduct,
                updateProduct,
                approveProduct,
                rejectProduct,
                setRole,
                addToCart,
                removeFromCart,
                clearCart,
                cartItems,
                cartTotal,
                cartTotalQty,
                notifications,
                addNotification,
                markAsRead,
                markAllAsRead,
                unreadCount,
                placeOrder,
                orders,
                saveLocation,
                isLocationRequired,
                registerWholesaler,
                authUserId,
                wholesalerProfileId,
                frequentCarts,
                dismissMinimumModal: () => {
                    setIsOrderMinimumModal(false);
                    setMinimumOrderErrors([]);
                },
                getGroupedCartSummary: () => {
                    const grouped = new Map<string, CartSplitGroup>();
                    for (const item of cartItems) {
                        const prod = products.find(p => p.id === item.id);
                        const wId = prod?.wholesalerId;
                        if (!wId) continue;
                        const w = wholesalers.find(w => w.id === wId);
                        const existing = grouped.get(wId) ?? {
                            wholesalerId: wId,
                            wholesalerName: w?.name ?? wId,
                            subtotal: 0,
                        };
                        existing.subtotal += item.price * item.qty;
                        grouped.set(wId, existing);
                    }
                    return Array.from(grouped.values());
                },
                isOrderMinimumModal,
                minimumOrderErrors,
                fetchOrders,
                updateOrderStatus,
                updateOrderLineItem,
                removeOrderLineItem,
                updateWholesalerProfile,
                updateRetailerProfile,

                addFrequentCart,
                updateFrequentCart,
                getAvailableStock,
                checkStockAvailability,
                darkMode,
                toggleDarkMode,
                clearNotifications,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}



export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
