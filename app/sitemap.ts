import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://gabonmanagementservices.ga';

    // 1. Static Routes
    const routes = [
        '',
        '/a-propos',
        '/contact',
        '/vendre',
        '/gerer',
        '/properties',
        '/blog',
        '/mentions-legales',
        '/politique-confidentialite',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 2. Fetch Properties
    const { data: properties } = await supabase
        .from('properties')
        .select('slug, created_at');

    const propertyRoutes = (properties || []).map((prop) => ({
        url: `${baseUrl}/properties/${prop.slug}`,
        lastModified: new Date(prop.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Fetch Blog Posts
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('published', true);

    const blogRoutes = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...propertyRoutes, ...blogRoutes];
}
