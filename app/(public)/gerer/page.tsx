'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, Building, X, Briefcase, TrendingUp, Shield } from 'lucide-react';
import Image from 'next/image';

export default function ManagementPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        property_type: '',
        address: '',
        description: '',
        furnished: false,
        images: [] as string[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = (e.target as HTMLInputElement).type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);

            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]); // Cleanup
            return newPreviews.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Upload images first
            let uploadedUrls: string[] = [];

            if (files.length > 0) {
                setUploading(true);
                const uploadPromises = files.map(async (file) => {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `mgmt_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from('management-uploads')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('management-uploads')
                        .getPublicUrl(fileName);

                    return publicUrl;
                });

                uploadedUrls = await Promise.all(uploadPromises);
            }

            // Submit form with image URLs
            const { error } = await supabase
                .from('management_requests')
                .insert([{ ...formData, images: uploadedUrls }]);

            if (error) throw error;

            setIsSuccess(true);
            setFormData({ full_name: '', email: '', phone: '', property_type: '', address: '', description: '', furnished: false, images: [] });
            setFiles([]);
            setPreviews([]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error submitting request:', error);
            alert('Une erreur est survenue: ' + error.message);
        } finally {
            setIsLoading(false);
            setUploading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-20 pb-12 bg-[var(--background)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gms-purple/10 pointer-events-none" />

                <div className="glass-card p-8 rounded-2xl shadow-xl max-w-md text-center relative z-10 border border-gms-neon/30">
                    <div className="w-20 h-20 bg-gms-neon/10 text-gms-neon rounded-full flex items-center justify-center mx-auto mb-6 box-shadow-glow border border-gms-neon/50">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Demande Envoyée !</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        Merci de votre confiance. Notre équipe d'experts a bien reçu votre dossier et vous contactera très prochainement.
                    </p>
                    <Button onClick={() => setIsSuccess(false)} className="w-full bg-gms-neon text-black hover:bg-gms-neon/90 font-bold">
                        Nouvelle demande
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gms-purple/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Hero / Intro Section */}
            <div className="py-24 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                            Gérez votre Bien en Toute <span className="text-gms-neon">Sérénité</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">
                            Confiez la gestion de votre patrimoine à GMS. Une approche moderne, transparente et efficace pour maximiser vos revenus locatifs.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <FeaturePill icon={Briefcase} label="Gestion Complète" />
                            <FeaturePill icon={TrendingUp} label="Optimisation Revenus" />
                            <FeaturePill icon={Shield} label="Sécurité Garantie" />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 md:p-12 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-gms-magenta to-transparent" />

                        <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                            <span className="w-1 h-8 bg-gms-magenta rounded-full" /> Détails de votre propriété
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Nom complet</label>
                                    <Input
                                        required
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Votre nom"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Téléphone</label>
                                    <Input
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="074 00 78 51"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email (Optionnel)</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="votre@email.com"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Type de bien</label>
                                <select
                                    required
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:border-gms-neon transition-colors"
                                >
                                    <option value="" className="bg-gray-900">Sélectionnez un type...</option>
                                    <option value="Appartement" className="bg-gray-900">Appartement</option>
                                    <option value="Maison / Villa" className="bg-gray-900">Maison / Villa</option>
                                    <option value="Immeuble" className="bg-gray-900">Immeuble</option>
                                    <option value="Local Commercial" className="bg-gray-900">Local Commercial</option>
                                    <option value="Terrain" className="bg-gray-900">Terrain</option>
                                    <option value="Autre" className="bg-gray-900">Autre</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">État du bien</label>
                                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-md hover:border-gms-neon/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        name="furnished"
                                        checked={formData.furnished}
                                        onChange={handleChange}
                                        id="furnished"
                                        className="w-5 h-5 rounded border-gray-500 text-gms-neon focus:ring-gms-neon bg-black/40 accent-gms-neon cursor-pointer"
                                    />
                                    <label htmlFor="furnished" className="text-white cursor-pointer select-none flex-1">
                                        Ce bien est meublé
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Adresse du bien</label>
                                <Input
                                    required
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Quartier, Ville..."
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Photos du bien (Optionnel)</label>
                                <div className="border border-dashed border-white/20 rounded-lg p-8 hover:bg-white/5 transition-colors text-center cursor-pointer relative group">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="space-y-3 pointer-events-none">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Loader2 className={`h-6 w-6 text-gms-cyan ${uploading ? 'animate-spin' : ''}`} />
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {files.length > 0
                                                ? `${files.length} fichier(s) sélectionné(s)`
                                                : "Cliquez pour déposer vos photos"}
                                        </p>
                                        <p className="text-xs text-gray-600">JPG, PNG, WebP acceptés</p>
                                    </div>
                                </div>

                                {/* Previews */}
                                {previews.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                                        {previews.map((preview, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/50">
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Description / Besoins spécifiques</label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Dites-nous en plus sur votre bien et vos attentes..."
                                    className="h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon transition-colors"
                                />
                            </div>

                            <Button type="submit" disabled={isLoading || uploading} className="w-full text-lg py-6 bg-gms-neon text-black hover:bg-gms-neon/90 font-bold mt-4 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all">
                                {isLoading || uploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Envoyer ma demande'}
                            </Button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Vos informations sont confidentielles et sécurisées.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeaturePill({ icon: Icon, label }: any) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Icon className="h-4 w-4 text-gms-neon" />
            <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
    );
}
