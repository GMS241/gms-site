import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, BookOpen, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';


export async function LatestArticles() {
    // 1. Fetch Featured Post
    const { data: featuredPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .eq('is_featured', true)
        .limit(1);

    const featuredPost = featuredPosts?.[0];

    // 2. Fetch Latest Posts (excluding the featured one to avoid duplicates)
    let query = supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

    if (featuredPost) {
        query = query.neq('id', featuredPost.id);
    }

    const { data: latestPosts } = await query;

    if ((!latestPosts || latestPosts.length === 0) && !featuredPost) return null;

    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#0a0a0a]">
            {/* Unified Background Effects */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gms-purple/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gms-neon/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-6">
                    <div>
                        <span className="text-gms-neon text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Actualités & Tendances</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            L'Actualité <span className="text-transparent bg-clip-text bg-gradient-to-r from-gms-purple to-gms-magenta">Immobilière</span>
                        </h2>
                    </div>

                    <Link href="/blog">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 transition-all rounded-full px-6">
                            Voir tous les articles <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* FEATURED ARTICLE HERO */}
                {featuredPost && (
                    <div className="mb-16 md:mb-24 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-gms-purple via-gms-magenta to-gms-purple rounded-3xl opacity-20 group-hover:opacity-40 blur-lg transition duration-1000"></div>
                        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-2xl bg-gray-900/40 border border-white/10 backdrop-blur-sm">

                            {/* Text Content */}
                            <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1 relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-br-full blur-2xl"></div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold mb-6 tracking-wide uppercase">
                                        <Star className="h-3 w-3 fill-yellow-400" />
                                        Article à la Une
                                    </div>

                                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight group-hover:text-gms-neon transition-colors duration-300">
                                        {featuredPost.title}
                                    </h3>

                                    <p className="text-gray-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                                        {featuredPost.excerpt || "Une analyse approfondie des tendances actuelles du marché immobilier gabonais. Découvrez les opportunités à ne pas manquer."}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gms-purple to-gms-magenta flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                {featuredPost.author.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-medium">{featuredPost.author}</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(featuredPost.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        <Link href={`/blog/${featuredPost.slug}`}>
                                            <Button className="rounded-full w-12 h-12 p-0 bg-white/10 hover:bg-gms-neon hover:text-black transition-all border border-white/10">
                                                <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Image Content */}
                            <div className="lg:col-span-7 relative h-[400px] lg:h-auto order-1 lg:order-2 overflow-hidden">
                                {featuredPost.cover_image ? (
                                    <Image
                                        src={featuredPost.cover_image}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <BookOpen className="h-16 w-16 text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-900/90 lg:bg-gradient-to-r lg:to-gray-900/90 lg:from-transparent"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* LATEST ARTICLES SEPARATOR */}
                <div className="flex items-center gap-4 mb-8 mt-12 md:mt-16">
                    <div className="h-px bg-white/10 flex-1" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                        <span className="text-gms-neon mr-2">///</span> Plus récents
                    </h3>
                    <div className="h-px bg-white/10 flex-1" />
                </div>

                {/* LATEST ARTICLES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts?.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col glass-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-white/5 hover:border-gms-purple/30 bg-white/[0.02]">
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                {post.cover_image ? (
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-white/5 text-gray-600">
                                        <BookOpen className="h-10 w-10 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-xs font-medium text-gray-300 flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-gms-cyan" />
                                        {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col relative">
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gms-neon transition-colors line-clamp-2 leading-snug">
                                    {post.title}
                                </h3>

                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
                                    <span>{post.author}</span>
                                    <span className="text-gms-purple group-hover:text-white transition-colors flex items-center gap-1 text-xs uppercase font-bold tracking-wider">
                                        Lire <ArrowRight className="h-3 w-3" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
