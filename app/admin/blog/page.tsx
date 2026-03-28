'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data as Post[]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);



    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (!error) {
            fetchPosts();
        } else {
            alert('Erreur: ' + error.message);
        }
    }

    const togglePublish = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('posts')
            .update({ published: !currentStatus })
            .eq('id', id);

        if (!error) {
            fetchPosts();
        } else {
            console.error('Error toggling publish status:', error);
        }
    };

    if (loading) return <div className="p-8 text-white">Chargement des articles...</div>

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">


            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">Gestion des Articles de Blog</h1>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link href="/admin/blog/add">
                        <Button className="bg-gms-neon text-black hover:bg-gms-neon/90 w-full md:w-auto font-medium shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                            <Plus className="mr-2 h-4 w-4" /> Nouvel Article
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="glass-card rounded-xl shadow-sm overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 font-semibold text-gray-300">Image</th>
                                <th className="p-4 font-semibold text-gray-300">Titre</th>
                                <th className="p-4 font-semibold text-gray-300">Auteur</th>
                                <th className="p-4 font-semibold text-gray-300">Statut</th>
                                <th className="p-4 font-semibold text-gray-300">Date</th>
                                <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 w-24">
                                        <div className="relative h-16 w-16 rounded overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                            {post.cover_image && (
                                                <Image src={post.cover_image} alt="" fill className="object-cover" sizes="64px" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium">
                                        <div className="max-w-[200px] md:max-w-xs break-words text-white">
                                            {post.title}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">/{post.slug}</div>
                                    </td>
                                    <td className="p-4 text-gray-300 whitespace-nowrap">{post.author}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => togglePublish(post.id, post.published)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border whitespace-nowrap transition-colors ${post.published
                                                ? 'bg-gms-neon/20 text-gms-neon border-gms-neon/50 hover:bg-gms-neon/30'
                                                : 'bg-white/10 text-gray-400 border-white/10 hover:bg-white/20 hover:text-white'
                                                }`}
                                        >
                                            {post.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                            {post.published ? 'Publié' : 'Brouillon'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        <Link href={`/admin/blog/${post.id}/edit`}>
                                            <Button size="sm" variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10"><Pencil className="h-4 w-4" /></Button>
                                        </Link>
                                        <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border-red-500/30" onClick={() => handleDelete(post.id)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">
                                        Aucun article de blog. Commencez par en rédiger un.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
