'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Property } from '@/types';
import { X, Upload, Eye, Download, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface PropertyFormProps {
    initialData?: Property;
    mode: 'create' | 'edit';
}

export function PropertyForm({ initialData, mode }: PropertyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [video, setVideo] = useState<string | undefined>(initialData?.video);
    const [uploading, setUploading] = useState(false);
    const [videoUploading, setVideoUploading] = useState(false);
    const [isEnhancing] = useState(false);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };


    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        reference: initialData?.reference || '',
        ownerName: initialData?.ownerName || '',
        ownerPhone: initialData?.ownerPhone || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        location: initialData?.location || '',
        type: initialData?.type || 'Vente',
        status: initialData?.status || 'Disponible',
        bedrooms: initialData?.features.bedrooms || '',
        bathrooms: initialData?.features.bathrooms || '',
        area: initialData?.features.area || '',
        amenities: initialData?.features.amenities ? initialData?.features.amenities.join(', ') : '',
        condition: initialData?.features.condition || '',
        category: initialData?.features.category || 'Appartement',
        floors: initialData?.features.floors || '',
        apartments: initialData?.features.apartments || '',
        livingRooms: initialData?.features.livingRooms || '',
        kitchens: initialData?.features.kitchens || '',
        parking: initialData?.features.parking || '',
        furnished: initialData?.features.furnished || false,
        rentalPeriod: initialData?.features.rentalPeriod || 'Month',
        specialNote: initialData?.features.specialNote || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };



    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setVideoUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('property-videos')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Erreur upload vidéo:', uploadError);
            alert('Erreur lors de l\'upload de la vidéo');
        } else {
            const { data: { publicUrl } } = supabase.storage.from('property-videos').getPublicUrl(filePath);
            setVideo(publicUrl);
        }
        setVideoUploading(false);
    };

    const addWatermark = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new globalThis.Image();
                img.src = e.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw original image
                    ctx.drawImage(img, 0, 0);

                    // Load Logo
                    const logo = new globalThis.Image();
                    logo.src = '/images/logo.png';

                    logo.onload = () => {
                        // Calculate logo properties
                        const logoWidth = img.width * 0.3; // 30% of image width
                        const logoAspectRatio = logo.width / logo.height;
                        const logoHeight = logoWidth / logoAspectRatio;
                        const x = (img.width - logoWidth) / 2;
                        const y = (img.height - logoHeight) / 2;

                        // Draw watermark
                        ctx.save();
                        ctx.globalAlpha = 0.5; // Opacity
                        // ctx.filter = 'blur(2px)'; // Removed blur as requested
                        ctx.drawImage(logo, x, y, logoWidth, logoHeight);
                        ctx.restore();

                        canvas.toBlob((blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error('Canvas to Blob failed'));
                        }, file.type, 0.9); // 90% quality
                    };

                    logo.onerror = () => {
                        // If logo fails, upload without watermark
                        console.warn("Watermark logo failed to load. Uploading original.");
                        resolve(file); // Resolve with original file if logo fails
                    }
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newImages: string[] = [];

        for (const file of files) {
            try {
                // Watermark disabled for now
                // const watermarkedBlob = await addWatermark(file);
                // const fileExt = file.name.split('.').pop();
                // const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                // const watermarkedFile = new File([watermarkedBlob], fileName, { type: file.type });

                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const fileToUpload = file; // Use original file

                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('property-images')
                    .upload(filePath, fileToUpload);

                if (uploadError) {
                    console.error('Erreur upload:', uploadError);
                } else {
                    const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(filePath);
                    newImages.push(publicUrl);
                }
            } catch (error) {
                console.error("Error processing image watermark:", error);
                alert("Erreur lors du traitement de l'image (watermark). Réessayez.");
            }
        }

        setImages(prev => [...prev, ...newImages]);
        setUploading(false);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const propertyData = {
            title: formData.title,
            slug: generateSlug(formData.title),
            description: formData.description,
            price: Number(formData.price),
            location: formData.location,
            type: formData.type,
            status: formData.status,
            images: images,
            video: video,
            features: {
                bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
                area: Number(formData.area),
                amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a !== ''),
                condition: formData.condition || undefined,
                category: formData.category,
                floors: formData.floors ? Number(formData.floors) : undefined,
                apartments: formData.apartments ? Number(formData.apartments) : undefined,
                livingRooms: formData.livingRooms ? Number(formData.livingRooms) : undefined,
                kitchens: formData.kitchens ? Number(formData.kitchens) : undefined,
                parking: formData.parking ? Number(formData.parking) : undefined,
                furnished: Boolean(formData.furnished),
                rentalPeriod: formData.type === 'Location' ? formData.rentalPeriod : undefined,
                specialNote: formData.specialNote || undefined,
            },
            ownerName: formData.ownerName || undefined,
            ownerPhone: formData.ownerPhone || undefined,
        };

        let error;

        if (mode === 'create') {
            // Generate Reference
            const { data: lastProperties } = await supabase
                .from('properties')
                .select('reference')
                .order('created_at', { ascending: false })
                .limit(1);

            let nextNum = 1;
            if (lastProperties && lastProperties.length > 0 && lastProperties[0].reference) {
                const lastRef = lastProperties[0].reference;
                const match = lastRef.match(/GMS-(\d+)/);
                if (match) {
                    nextNum = parseInt(match[1]) + 1;
                }
            }
            const newReference = `GMS-${nextNum.toString().padStart(4, '0')}`;

            const propertyWithRef = { ...propertyData, reference: newReference };

            const { error: insertError } = await supabase.from('properties').insert([propertyWithRef]);
            error = insertError;
        } else {
            const { error: updateError } = await supabase.from('properties').update(propertyData).eq('id', initialData?.id);
            error = updateError;
        }

        if (error) {
            alert('Erreur: ' + error.message);
            setLoading(false);
        } else {
            router.push('/admin/dashboard');
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 glass-card p-8 rounded-xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Référence</label>
                        <Input
                            value={mode === 'create' ? 'Généré automatiquement' : formData.reference || 'Non défini'}
                            disabled
                            className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Titre</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Prix (FCFA)</label>
                        <Input name="price" type="number" value={formData.price} onChange={handleChange} required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Localisation (Optionnel)</label>
                        <Input name="location" value={formData.location} onChange={handleChange} placeholder="Laisser vide si confidentiel" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300">Type de transaction</label>
                            <div className="flex gap-2">
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full h-10 border border-white/10 rounded px-3 bg-black/40 text-white focus:border-gms-neon focus:outline-none">
                                    <option value="Vente" className="bg-gray-900">Vente</option>
                                    <option value="Location" className="bg-gray-900">Location</option>
                                </select>
                                {formData.type === 'Location' && (
                                    <select name="rentalPeriod" value={formData.rentalPeriod} onChange={handleChange} className="w-32 h-10 border border-white/10 rounded px-3 bg-black/40 text-white focus:border-gms-neon focus:outline-none">
                                        <option value="Month" className="bg-gray-900">/ Mois</option>
                                        <option value="Day" className="bg-gray-900">/ Jour</option>
                                    </select>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">Catégorie</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full h-10 border border-white/10 rounded px-3 bg-black/40 text-white focus:border-gms-neon focus:outline-none">
                                <option value="Appartement" className="bg-gray-900">Appartement</option>
                                <option value="Villa" className="bg-gray-900">Villa</option>
                                <option value="Maison" className="bg-gray-900">Maison</option>
                                <option value="Immeuble" className="bg-gray-900">Immeuble</option>
                                <option value="Concession" className="bg-gray-900">Concession</option>
                                <option value="Terrain" className="bg-gray-900">Terrain</option>
                                <option value="Bureau" className="bg-gray-900">Bureau</option>
                                <option value="Commerce" className="bg-gray-900">Commerce</option>
                                <option value="Autre" className="bg-gray-900">Autre</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300">Statut</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full h-10 border border-white/10 rounded px-3 bg-black/40 text-white focus:border-gms-neon focus:outline-none">
                                <option value="Disponible" className="bg-gray-900">Disponible</option>
                                <option value="Vendu" className="bg-gray-900">Vendu</option>
                                <option value="Loué" className="bg-gray-900">Loué</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300">État (Optionnel)</label>
                            <select name="condition" value={formData.condition} onChange={handleChange} className="w-full h-10 border border-white/10 rounded px-3 bg-black/40 text-white focus:border-gms-neon focus:outline-none">
                                <option value="" className="bg-gray-900">-- Non spécifié --</option>
                                <option value="Neuf" className="bg-gray-900">Neuf</option>
                                <option value="Excellent état" className="bg-gray-900">Excellent état</option>
                                <option value="Bon état" className="bg-gray-900">Bon état</option>
                                <option value="Rénové" className="bg-gray-900">Rénové</option>
                                <option value="À rénover" className="bg-gray-900">À rénover</option>
                                <option value="En construction" className="bg-gray-900">En construction</option>
                                <option value="Inachevé" className="bg-gray-900">Inachevé</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-gray-300">Description</label>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={true}
                                className="h-7 px-3 text-xs bg-gray-500/10 border-gray-500/20 text-gray-500 cursor-not-allowed transition-all opacity-50"
                            >
                                <Sparkles className="h-3 w-3 mr-2" />
                                Sublimer avec l&apos;IA
                            </Button>
                        </div>
                        <Textarea name="description" value={formData.description} onChange={handleChange} className="h-32 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" required />

                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Images</label>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="relative">
                                <Button type="button" variant="outline" disabled={uploading} className="border-white/10 text-gray-300 hover:text-white hover:bg-white/10">
                                    {uploading ? 'Upload...' : 'Ajouter photo'}
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div className="flex justify-end mt-4 mb-2">
                                <span className="text-xs text-gray-400 italic bg-white/5 px-2 py-1 rounded border border-white/10">
                                    💡 Survolez les miniatures pour voir en grand ou télécharger avec le logo
                                </span>
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative h-24 w-24 rounded overflow-hidden border border-white/20 group">
                                    <Image src={img} alt="" fill className="object-cover" />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <div className="flex gap-2">
                                            <a href={img} target="_blank" rel="noopener noreferrer" className="p-1 bg-white/10 hover:bg-white/20 rounded-full text-white" title="Voir en grand">
                                                <Eye className="h-4 w-4" />
                                            </a>
                                            <a href={img} download={`image-${idx}.jpg`} className="p-1 bg-white/10 hover:bg-white/20 rounded-full text-white" title="Télécharger">
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-bl z-10"
                                        onClick={() => removeImage(idx)}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-300">Vidéo</label>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="relative">
                                <Button type="button" variant="outline" disabled={videoUploading} className="border-white/10 text-gray-300 hover:text-white hover:bg-white/10">
                                    {videoUploading ? 'Upload Vidéo...' : (video ? 'Changer vidéo' : 'Ajouter vidéo')}
                                </Button>
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleVideoUpload}
                                    disabled={videoUploading}
                                />
                            </div>
                            {video && (
                                <span className="text-xs text-gms-neon flex items-center">
                                    <Upload className="h-3 w-3 mr-1" /> Vidéo ajoutée
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold mb-4 text-white">Caractéristiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Surface (m²)</label>
                        <Input name="area" type="number" value={formData.area} onChange={handleChange} required className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Chambres</label>
                        <Input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Salles de bain</label>
                        <Input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Nombre d'étages</label>
                        <Input name="floors" type="number" value={formData.floors} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Nombre d'appartements</label>
                        <Input name="apartments" type="number" value={formData.apartments} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Salons</label>
                        <Input name="livingRooms" type="number" value={formData.livingRooms} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Cuisines</label>
                        <Input name="kitchens" type="number" value={formData.kitchens} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Parking (places)</label>
                        <Input name="parking" type="number" value={formData.parking} onChange={handleChange} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon" />
                    </div>
                    <div className="flex items-center gap-2 mt-8">
                        <input
                            type="checkbox"
                            name="furnished"
                            id="furnished"
                            checked={Boolean(formData.furnished)}
                            onChange={handleCheckboxChange}
                            className="h-5 w-5 rounded border-gray-500 bg-black/40 text-gms-neon focus:ring-gms-neon accent-gms-neon"
                        />
                        <label htmlFor="furnished" className="text-sm font-medium text-gray-300">Bien Meublé</label>
                    </div>
                    <div className="md:col-span-3">
                        <label className="text-sm font-medium text-gray-300">Commodités (séparées par des virgules)</label>
                        <Input
                            name="amenities"
                            placeholder="Piscine, Vue Mer, Garage..."
                            value={formData.amenities}
                            onChange={handleChange}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold mb-4 text-gms-magenta flex items-center gap-2">
                    Informations Propriétaire <span className="text-xs font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded ml-2">Interne - Ne sera pas affiché</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-white/5 border border-dashed border-white/20">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Nom du Propriétaire</label>
                        <Input
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            placeholder="M. Okili"
                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-magenta"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">Contact / Téléphone</label>
                        <Input
                            name="ownerPhone"
                            value={formData.ownerPhone}
                            onChange={handleChange}
                            placeholder="+241 ..."
                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-magenta"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => router.back()} className="text-gray-400 hover:text-white hover:bg-white/10">Annuler</Button>
                <Button type="submit" disabled={loading} className="bg-gradient-to-r from-gms-neon to-emerald-500 hover:from-emerald-400 hover:to-gms-neon text-black font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                    {loading ? 'Enregistrement...' : (mode === 'create' ? 'Créer le bien' : 'Mettre à jour')}
                </Button>
            </div>
        </form>
    );
}
