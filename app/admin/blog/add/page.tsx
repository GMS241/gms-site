'use client';

import BlogForm from '@/components/admin/BlogForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddBlogPage() {
    return (
        <div>
            <div className="mb-6">
                <Link href="/admin/blog" className="inline-flex items-center text-gray-400 hover:text-gms-neon transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux articles
                </Link>
                <h1 className="text-3xl font-bold text-white">Nouvel Article</h1>
            </div>

            <BlogForm />
        </div>
    );
}
