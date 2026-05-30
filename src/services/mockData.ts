'use client';

// Interfaces kept for type compatibility
export interface Wholesaler {
    id: string;
    name: string;
    pincode: string;
    rating: number;
    catalogue: any[];
    active?: boolean;
    minimum_order_value?: number; // minimum cart value required per wholesaler
    latitude?: number;
    longitude?: number;
}

export interface Retailer {
    mobile: string;
    name: string;
    pincode: string;
}

// EMPTIED MOCK DATA
export const MOCK_PRODUCTS_W1 = [];
export const MOCK_PRODUCTS_W2 = [];
export const ALL_MOCK_PRODUCTS = [];
export const MOCK_RETAILERS: Retailer[] = [];

// Helper kept to avoid breaking imports (returns undefined)
export const getWholesaler = (_id: string) => undefined;
