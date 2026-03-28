'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import BlogForm from '@/components/admin/BlogForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/types';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap the Promise using React.use()
    const { id } = use(params);

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setPost(data);
            } else {
                console.error('Error fetching post:', error);
            }
            setLoading(false);
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gms-neon" />
            </div>
        );
    }

    if (!post) {
        return <div className="p-8 text-white">Article non trouvé.</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <Link href="/admin/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux articles
                </Link>
                <h1 className="text-3xl font-bold text-white">Modifier l&apos;article</h1>
            </div>

            <BlogForm initialData={post} isEditing />
        </div>
    );
}

