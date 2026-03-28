'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, CheckCircle, Upload, X, Target, Eye, Handshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SellPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        civility: 'Monsieur',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        propertyType: '',
        propertyAddress: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCivilityChange = (value: string) => {
        setFormData({ ...formData, civility: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newImages: string[] = [];

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `seller_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Erreur upload:', uploadError);
            } else {
                const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(filePath);
                newImages.push(publicUrl);
            }
        }

        setImages(prev => [...prev, ...newImages]);
        setUploading(false);
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('seller_requests')
                .insert([
                    {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        property_type: formData.propertyType,
                        property_address: formData.propertyAddress,
                        description: formData.description,
                        images: images,
                        status: 'new'
                    }
                ]);

            if (error) throw error;

            setIsSuccess(true);
            setFormData({
                civility: 'Monsieur',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                propertyType: '',
                propertyAddress: '',
                description: '',
            });
            setImages([]);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-20 pb-12 bg-[var(--background)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gms-purple/10 pointer-events-none" />
                <div className="glass-card p-8 rounded-2xl shadow-xl max-w-md w-full text-center relative z-10 border border-gms-neon/30">
                    <div className="w-20 h-20 bg-gms-neon/10 text-gms-neon rounded-full flex items-center justify-center mx-auto mb-6 box-shadow-glow border border-gms-neon/50">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Demande Envoyée !</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        Merci pour votre confiance. Notre équipe a bien reçu les informations de votre bien et vous recontactera très rapidement pour une estimation.
                    </p>
                    <Link href="/">
                        <Button className="w-full bg-gms-magenta hover:bg-gms-magenta/90 text-white font-bold">
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 relative overflow-hidden text-gray-100">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gms-purple/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-gms-neon mb-8 transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Retour
                </Link>

                <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gms-magenta/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center leading-tight">
                            Vendez en toute <span className="text-transparent bg-clip-text bg-gradient-to-r from-gms-neon to-gms-cyan">Confiance</span>
                        </h1>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-10 text-center md:text-left relative backdrop-blur-sm">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gms-neon to-gms-cyan rounded-l-xl"></div>
                            <p className="text-lg text-gray-300 leading-relaxed mb-4 font-light">
                                Vous envisagez de vendre votre appartement, maison ou terrain ?
                                <strong className="text-white"> GMS</strong> vous accompagne pour une transaction
                                <span className="text-gms-magenta font-semibold"> rapide, sécurisée et au meilleur prix.</span>
                            </p>
                            <p className="text-gray-400 font-light">
                                Grâce à notre expertise du marché local et notre réseau étendu, nous mettons tout en œuvre pour valoriser votre patrimoine.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <FeatureCard icon={Target} title="Estimation Juste" desc="Prix cohérent avec le marché pour une vente efficace." color="text-gms-neon" />
                            <FeatureCard icon={Eye} title="Visibilité Maximale" desc="Mise en avant sur notre site et nos réseaux sociaux." color="text-gms-cyan" />
                            <FeatureCard icon={Handshake} title="Accompagnement" desc="Suivi personnalisé jusqu'à la signature finale." color="text-gms-magenta" />
                        </div>

                        <p className="text-center text-gray-500 text-sm italic">
                            Remplissez ce formulaire pour une prise de contact sans engagement.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* 1. Vos Coordonnées */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gms-neon/20 text-gms-neon flex items-center justify-center text-sm">1</span>
                                Vos Coordonnées
                            </h2>

                            {/* Civilite */}
                            <div>
                                <label className="block text-sm font-medium mb-3 text-gray-300">Civilité <span className="text-gms-magenta">*</span></label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.civility === 'Madame' ? 'border-gms-magenta' : 'border-gray-500 group-hover:border-gray-300'}`}>
                                            {formData.civility === 'Madame' && <div className="w-3 h-3 rounded-full bg-gms-magenta" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="civility"
                                            value="Madame"
                                            checked={formData.civility === 'Madame'}
                                            onChange={() => handleCivilityChange('Madame')}
                                            className="hidden"
                                        />
                                        <span className={`text-sm ${formData.civility === 'Madame' ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>Madame</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.civility === 'Monsieur' ? 'border-gms-magenta' : 'border-gray-500 group-hover:border-gray-300'}`}>
                                            {formData.civility === 'Monsieur' && <div className="w-3 h-3 rounded-full bg-gms-magenta" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="civility"
                                            value="Monsieur"
                                            checked={formData.civility === 'Monsieur'}
                                            onChange={() => handleCivilityChange('Monsieur')}
                                            className="hidden"
                                        />
                                        <span className={`text-sm ${formData.civility === 'Monsieur' ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>Monsieur</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Nom <span className="text-gms-magenta">*</span></label>
                                    <Input
                                        required
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Votre nom"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Prénom <span className="text-gms-magenta">*</span></label>
                                    <Input
                                        required
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Votre prénom"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Téléphone <span className="text-gms-magenta">*</span></label>
                                    <Input
                                        required
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="066 00 00 00"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Email <span className="text-gms-magenta">*</span></label>
                                    <Input
                                        required
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="exemple@email.com"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Le Bien */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gms-cyan/20 text-gms-cyan flex items-center justify-center text-sm">2</span>
                                Le Bien à Vendre
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Type de bien <span className="text-gms-magenta">*</span></label>
                                    <select
                                        required
                                        name="propertyType"
                                        value={formData.propertyType}
                                        onChange={handleChange}
                                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gms-neon transition-colors"
                                    >
                                        <option value="" className="bg-gray-900">Choisir dans la liste</option>
                                        <option value="Appartement" className="bg-gray-900">Appartement</option>
                                        <option value="Maison" className="bg-gray-900">Maison</option>
                                        <option value="Villa" className="bg-gray-900">Villa</option>
                                        <option value="Terrain" className="bg-gray-900">Terrain</option>
                                        <option value="Immeuble" className="bg-gray-900">Immeuble</option>
                                        <option value="Commerce" className="bg-gray-900">Local Commercial</option>
                                        <option value="Bureau" className="bg-gray-900">Bureau</option>
                                        <option value="Autre" className="bg-gray-900">Autre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-300">Adresse du bien <span className="text-gms-magenta">*</span></label>
                                    <Input
                                        required
                                        name="propertyAddress"
                                        value={formData.propertyAddress}
                                        onChange={handleChange}
                                        placeholder="Quartier, Ville..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Photos du bien (Optionnel)</label>
                                <div className="border border-dashed border-white/20 rounded-lg p-8 text-center hover:bg-white/5 transition-colors relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {uploading ? (
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="h-10 w-10 text-gms-magenta animate-spin mb-2" />
                                            <span className="text-sm text-gray-400">Chargement...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="h-10 w-10 text-gray-500 group-hover:text-gms-neon transition-colors mb-2" />
                                            <p className="text-sm font-medium text-gray-300">Cliquez pour ajouter des photos</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5Mo</p>
                                        </div>
                                    )}
                                </div>
                                {images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {images.map((url, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 group">
                                                <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">Quelques mots sur votre projet <span className="text-gms-magenta">*</span></label>
                                <Textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Décrivez votre bien (état, année, travaux récents...) et vos attentes..."
                                    className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || uploading}
                            className="w-full h-14 text-lg bg-gms-magenta hover:bg-gms-magenta/80 text-white font-bold shadow-[0_4px_20px_rgba(255,0,255,0.3)] hover:shadow-[0_4px_25px_rgba(255,0,255,0.5)] transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...
                                </>
                            ) : (
                                'Valider ma demande'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
    return (
        <div className="p-4 bg-white/5 border border-white/5 rounded-lg hover:border-white/10 hover:bg-white/10 transition-colors group">
            <div className="flex flex-col items-center">
                <Icon className={`h-8 w-8 ${color} mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 font-light">{desc}</p>
            </div>
        </div>
    )
}
