
import { supabase } from './supabase';

export const getProductImageUrl = (imageKey: string | null | undefined) => {
    if (!imageKey) return '/assets/product_placeholder.png'; // Local fallback for missing keys

    // If key is already a full URL (legacy safety) or local path
    if (imageKey.startsWith('http') || imageKey.startsWith('/')) return imageKey;

    const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(imageKey);

    return data.publicUrl;
};
