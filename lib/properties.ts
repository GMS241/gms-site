import { supabase } from './supabase';
import type { Property } from '@/types';

export interface PropertyFilters {
    type?: string;
    category?: string;
    location?: string;
    budget?: string; // e.g. "min-max" or just max? User asked for Min/Max inputs.
    minPrice?: number;
    maxPrice?: number;
}

export interface GetPropertiesResult {
    properties: Property[];
    totalCount: number;
}

export const getProperties = async (
    filters?: PropertyFilters,
    page: number = 1,
    pageSize: number = 9
): Promise<GetPropertiesResult> => {
    let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

    if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
    }

    if (filters?.category && filters.category !== 'all') {
        query = query.contains('features', { category: filters.category });
    }

    if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
        .order('created_at', { ascending: false })
        .range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching properties:', error);
        return { properties: [], totalCount: 0 };
    }

    return {
        properties: data as Property[],
        totalCount: count || 0
    };
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
    // Top 3-6 properties
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching featured properties:', error);
        return [];
    }

    return data as Property[];
}

export const getProperty = async (slugOrId: string): Promise<Property | null> => {
    // 1. Try by slug
    const { data: slugData } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slugOrId)
        .maybeSingle();

    if (slugData) return slugData as Property;

    // 2. Try by ID (Fallback for legacy links or until all slugs are populated)
    // We check if slugOrId looks like a UUID to avoid unnecessary DB errors
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    if (isUuid) {
        const { data: idData } = await supabase
            .from('properties')
            .select('*')
            .eq('id', slugOrId)
            .maybeSingle();

        if (idData) return idData as Property;
    }

    // 3. Try by Reference (Legacy support)
    const { data: refData } = await supabase
        .from('properties')
        .select('*')
        .eq('reference', slugOrId)
        .maybeSingle();

    return refData as Property | null;
};
