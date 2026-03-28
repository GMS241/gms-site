import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Zap } from 'lucide-react';

// Force dynamic rendering to ensure fresh data
export const revalidate = 0;

async function getPosts() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return posts || [];
}

export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen bg-[var(--background)] pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gms-purple/10 via-background to-background pointer-events-none" />

            {/* Header */}
            <div className="relative py-24 px-4 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gms-neon/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-white/10">
                        <Zap size={16} className="text-gms-neon fill-gms-neon" />
                        <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">Insights & News</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-gms-magenta to-gms-purple">Articles</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Décryptage du marché, conseils d'experts et vision du futur de l'immobilier au Gabon.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 backdrop-blur-sm">
                        <p className="text-2xl text-gray-500 mb-4">Aucun article publié pour le moment.</p>
                        <p className="text-gray-600">Revenez bientôt explorer nos contenus !</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col glass-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-white/5 hover:border-gms-neon/30 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {post.cover_image ? (
                                        <Image
                                            src={post.cover_image}
                                            alt={post.title}
                                            fill
                                            className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-white/5 text-gray-600">Pas d'image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col relative">
                                    <div className="flex items-center text-xs text-app-gray-400 mb-4 gap-4 text-gray-400">
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1 text-gms-cyan" />
                                            {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center">
                                            <User className="h-3 w-3 mr-1 text-gms-purple" />
                                            {post.author}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-gms-neon transition-colors line-clamp-2 leading-tight">
                                        {post.title}
                                    </h2>

                                    {post.excerpt && (
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">{post.excerpt}</p>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-white group-hover:text-gms-neon font-medium text-sm flex items-center transition-colors">
                                            Lire l'article <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
