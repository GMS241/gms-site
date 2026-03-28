'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [type, setType] = useState(searchParams.get('type') || 'all');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (type && type !== 'all') params.set('type', type);
        if (category && category !== 'all') params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);

        router.push(`/properties?${params.toString()}`);
    };

    useEffect(() => {
        setLocation(searchParams.get('location') || '');
        setType(searchParams.get('type') || 'all');
        setCategory(searchParams.get('category') || 'all');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    return (
        <div className="glass p-6 rounded-2xl mb-12 border border-white/10 relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gms-neon/10 rounded-full blur-[50px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-6">
                <Filter className="text-gms-neon h-5 w-5" />
                <h3 className="text-white font-bold text-lg">Filtrer les résultats</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Location */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Localisation</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gms-cyan" />
                        <input
                            type="text"
                            placeholder="Ville, quartier..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full h-11 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gms-neon focus:ring-1 focus:ring-gms-neon transition-all"
                        />
                    </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gms-neon focus:ring-1 focus:ring-gms-neon transition-all appearance-none cursor-pointer"
                    >
                        <option value="all" className="bg-black text-gray-300">Tout type</option>
                        <option value="Vente" className="bg-black text-white">Acheter</option>
                        <option value="Location" className="bg-black text-white">Louer</option>
                    </select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Catégorie</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gms-neon focus:ring-1 focus:ring-gms-neon transition-all appearance-none cursor-pointer"
                    >
                        <option value="all" className="bg-black text-gray-300">Toutes catégories</option>
                        <option value="Appartement" className="bg-black text-white">Appartement</option>
                        <option value="Villa" className="bg-black text-white">Villa</option>
                        <option value="Maison" className="bg-black text-white">Maison</option>
                        <option value="Immeuble" className="bg-black text-white">Immeuble</option>
                        <option value="Terrain" className="bg-black text-white">Terrain</option>
                        <option value="Bureau" className="bg-black text-white">Bureau</option>
                        <option value="Commerce" className="bg-black text-white">Commerce</option>
                        <option value="Autre" className="bg-black text-white">Autre</option>
                    </select>
                </div>

                {/* Budget */}
                <div className="grid grid-cols-2 gap-2 space-y-2">
                    <div className="space-y-2 col-span-2 flex gap-2">
                        <div className="w-1/2 space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Min (FCFA)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gms-neon focus:ring-1 focus:ring-gms-neon transition-all"
                            />
                        </div>
                        <div className="w-1/2 space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Max (FCFA)</label>
                            <input
                                type="number"
                                placeholder="Illimité"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full h-11 px-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gms-neon focus:ring-1 focus:ring-gms-neon transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Button */}
                <div className="flex items-end">
                    <Button onClick={handleSearch} className="w-full h-11 bg-gms-neon hover:bg-emerald-400 text-black font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all">
                        <Search className="mr-2 h-4 w-4" /> Rechercher
                    </Button>
                </div>
            </div>
        </div>
    );
}
