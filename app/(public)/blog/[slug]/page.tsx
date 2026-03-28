import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { ShareButton } from '@/components/ShareButton';
import { Metadata, ResolvingMetadata } from 'next';

// Force dynamic to get fresh data
export const revalidate = 0;

async function getPost(slug: string) {
    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !post) {
        return null;
    }
    return post;
}

async function getOtherPosts(currentSlug: string) {
    const { data: posts } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, cover_image, created_at')
        .eq('published', true)
        .neq('slug', currentSlug)
        .order('created_at', { ascending: false })
        .limit(3);

    return posts || [];
}

function formatContent(content: string) {
    if (!content) return null;

    // 1. Fix missing newlines before numbered items (e.g. "text.1. Title")
    let processed = content.replace(/([.!?])\s*(\d+\.)/g, '$1\n\n$2');

    // 2. Spilt by newlines
    const paragraphs = processed.split(/\n+/);

    return paragraphs.map((p, index) => {
        const trimmed = p.trim();
        if (!trimmed) return null;

        // Detect Numbered Titles (e.g. "1. Qu'est-ce que...")
        if (/^\d+\..+/.test(trimmed)) {
            return <h3 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{trimmed}</h3>;
        }

        // Detect short bold-like lines (could be subtitles)
        if (trimmed.length < 100 && trimmed.endsWith(':')) {
            return <h4 key={index} className="text-xl font-semibold text-gms-neon mt-6 mb-3">{trimmed}</h4>;
        }

        return <p key={index} className="mb-6 leading-relaxed text-gray-300">{trimmed}</p>;
    });
}

// FIX: Generate Dynamic Metadata for SEO and Social Media share
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: 'Article introuvable | Gabon Management Services',
            description: "L'article que vous cherchez n'existe pas ou a été déplacé."
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    // Optimize Image for Social Media (WhatsApp needs < 300KB, Twitter < 5MB)
    // We append specific transformation params if it's a Supabase URL
    let coverUrl = post.cover_image || 'https://gabonmanagementservices.ga/og-image.jpg';
    if (coverUrl.includes('supabase.co')) {
        coverUrl = `${coverUrl}?width=1200&quality=75&resize=contain`;
    }

    return {
        title: `${post.title} | Blog GMS`,
        description: post.excerpt || post.content?.slice(0, 160) || 'Découvrez cet article sur Gabon Management Services.',
        openGraph: {
            title: post.title,
            description: post.excerpt || post.content?.slice(0, 160),
            url: `https://gabonmanagementservices.ga/blog/${post.slug}`,
            siteName: 'Gabon Management Services',
            images: [
                {
                    url: coverUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
                ...previousImages,
            ],
            locale: 'fr_FR',
            type: 'article',
            publishedTime: post.created_at,
            authors: [post.author || 'Équipe GMS'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.content?.slice(0, 160),
            images: [coverUrl],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const otherPosts = await getOtherPosts(slug);
    const shareUrl = `https://gabonmanagementservices.ga/blog/${slug}`;

    return (
        <article className="min-h-screen bg-[var(--background)] pb-20 relative overflow-hidden text-gray-100">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gms-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Image */}
            <div className="relative h-[500px] md:h-[600px] w-full">
                {post.cover_image && (
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[var(--background)]" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                    <div className="container mx-auto max-w-4xl">
                        <Link href="/blog" className="inline-flex items-center text-gray-300 hover:text-gms-neon mb-8 transition-colors group">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour aux articles
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="glass px-3 py-1 rounded-full text-xs font-bold text-gms-neon border border-gms-neon/20 uppercase tracking-wider">
                                Article
                            </span>
                            <span className="flex items-center text-gray-400 text-sm">
                                <Clock className="h-3 w-3 mr-1" /> 5 min de lecture
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
                            {post.title}
                        </h1>

                        <div className="flex items-center text-sm md:text-base gap-6 text-gray-300">
                            <div className="flex items-center gap-3 bg-white/5 pr-4 py-1.5 rounded-full border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gms-magenta to-gms-purple flex items-center justify-center text-white font-bold text-xs">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="font-medium">{post.author}</span>
                            </div>
                            <span className="flex items-center text-gray-400">
                                <Calendar className="h-4 w-4 mr-2 text-gms-cyan" />
                                {new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-12 max-w-3xl relative z-10">
                {/* Excerpt */}
                {post.excerpt && (
                    <div className="text-xl md:text-2xl font-light text-gray-200 mb-12 leading-relaxed border-l-4 border-gms-neon/50 pl-8 py-2 italic bg-gradient-to-r from-white/5 to-transparent rounded-r-xl">
                        {post.excerpt}
                    </div>
                )}

                {/* Main Body - styles defined in globals.css */}
                <div className="article-content text-gray-300 text-lg leading-relaxed">
                    {/* Render HTML content directly if it contains HTML tags, otherwise use formatContent for plain text */}
                    {post.content && post.content.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                        formatContent(post.content)
                    )}
                </div>

                {/* Share Section */}
                <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
                    <p className="text-gray-500 italic">Merci de votre lecture</p>
                    <ShareButton title={post.title} url={shareUrl} />
                </div>

                {/* Similar Articles Section */}
                {otherPosts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                            <span className="w-12 h-1 bg-gradient-to-r from-gms-neon to-gms-cyan rounded-full"></span>
                            Autres articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {otherPosts.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`}
                                    className="group glass rounded-xl overflow-hidden border border-white/10 hover:border-gms-neon/50 transition-all duration-300"
                                >
                                    <div className="relative h-40 w-full">
                                        {article.cover_image ? (
                                            <Image
                                                src={article.cover_image}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gms-purple/30 to-gms-cyan/30" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-semibold line-clamp-2 group-hover:text-gms-neon transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-2">
                                            {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
