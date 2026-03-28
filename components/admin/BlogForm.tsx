'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Basic textarea for now, can upgrade to rich text later
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PostInput } from '@/types';

interface BlogFormProps {
    initialData?: any; // Using any to avoid strict Post type issues during edit
    isEditing?: boolean;
}

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<PostInput>({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        cover_image: initialData?.cover_image || '',
        published: initialData?.published || false,
        author: initialData?.author || 'Admin GMS',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Auto-generate slug from title if not manually edited yet (simple check)
        if (e.target.name === 'title' && !isEditing) {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, title: e.target.value, slug }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `blog_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-images') // Ensure this bucket exists
            .upload(filePath, file);

        if (uploadError) {
            console.error('Erreur upload:', uploadError);
            alert('Erreur lors de l\'upload de l\'image');
        } else {
            const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, cover_image: publicUrl }));
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isEditing && initialData?.id) {
                const { error } = await supabase
                    .from('posts')
                    .update({
                        ...formData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('posts')
                    .insert([formData]);

                if (error) throw error;
            }

            router.push('/admin/blog');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving post:', error);
            alert('Erreur lors de la sauvegarde: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 glass-card p-8 rounded-xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content (2 cols) */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Titre de l'article</label>
                        <Input
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Titre accrocheur..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon text-lg font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Slug (URL)</label>
                        <Input
                            required
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="mon-super-article"
                            className="bg-white/5 border-white/10 text-gray-400 font-mono text-sm focus:border-gms-neon"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Contenu de l'article</label>
                        {/* We could implement a Rich Text Editor here later. For now, a tall textarea. */}
                        <Textarea
                            required
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Écrivez votre article ici..."
                            className="min-h-[400px] font-sans text-lg leading-relaxed bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                        />
                    </div>
                </div>

                {/* Sidebar (1 col) */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Image de couverture</label>
                        <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors relative">
                            {formData.cover_image ? (
                                <div className="relative aspect-video w-full rounded-md overflow-hidden mb-2">
                                    <Image src={formData.cover_image} alt="Cover" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="py-8">
                                    {uploading ? (
                                        <Loader2 className="h-8 w-8 text-gms-magenta animate-spin mx-auto mb-2" />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    )}
                                    <p className="text-sm text-gray-500">
                                        {uploading ? 'Upload...' : 'Cliquez pour choisir une image'}
                                    </p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${formData.cover_image ? 'hidden' : ''}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Extrait (Résumé)</label>
                        <Textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Court résumé affiché dans la liste..."
                            className="h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Auteur</label>
                        <Input
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                        />
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                            className="h-4 w-4 text-gms-magenta focus:ring-gms-magenta border-gray-500 bg-gray-900 rounded"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                            Publier immédiatement
                        </label>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <Button type="submit" disabled={isLoading || uploading} className="w-full bg-gradient-to-r from-gms-magenta to-gms-purple hover:from-gms-magenta/90 hover:to-gms-purple/90 text-white font-bold shadow-[0_0_15px_rgba(255,0,255,0.3)]">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {isEditing ? 'Mettre à jour' : 'Créer l\'article'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
