import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// In production browser environment, if the URL is insecure (HTTP) while the site is HTTPS,
// we must use the proxy to avoid Mixed Content errors.
// Since we set up a rewrite /supabase-proxy -> http://vps-url
if (
    isBrowser &&
    window.location.protocol === 'https:' &&
    supabaseUrl.startsWith('http:')
) {
    // Use the proxy path. We need to point to the current origin + /supabase-proxy
    // supabase-js handles relative URLs poorly sometimes, best to give full URL
    supabaseUrl = `${window.location.origin}/supabase-proxy`;
}

export const supabase = createClient(supabaseUrl, supabaseKey);
