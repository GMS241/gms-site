'use client';

import Image from 'next/image';
import { Search, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Hero() {
    const router = useRouter();
    const [type, setType] = useState('Vente');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (type) params.set('type', type);

        router.push(`/properties?${params.toString()}`);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-bg.png"
                    alt="Immobilier Gabon"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[var(--background)]" />

                {/* Animated Orbs/Glows */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gms-purple/30 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gms-neon/10 rounded-full blur-[120px] animate-float" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">

                {/* Agency Name */}
                <div className="relative mb-6 md:mb-8 group w-full max-w-lg md:max-w-none">
                    <div className="absolute -inset-1 bg-gradient-to-r from-gms-neon/0 via-gms-neon/50 to-gms-neon/0 blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" />
                    <div className="relative bg-black/80 border border-gms-neon/20 px-4 md:px-8 py-2 md:py-3 rounded-lg md:transform md:-skew-x-12 md:hover:skew-x-0 transition-transform duration-500">
                        <h2 className="text-xl md:text-5xl font-black italic tracking-wider text-gms-neon md:transform md:skew-x-12 md:hover:skew-x-0 transition-transform duration-500 uppercase drop-shadow-[0_0_15px_rgba(57,255,20,0.8)]">
                            Gabon Management Services
                        </h2>
                    </div>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full glass mb-6 md:mb-8 animate-float">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gms-neon animate-ping" />
                    <span className="text-xs md:text-sm font-medium text-gms-neon tracking-wider uppercase">L'Avenir de l'Immobilier au Gabon</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-2xl">
                    Trouvez Votre <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gms-neon to-gms-cyan">Espace Idéal</span>
                </h1>

                <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl font-light leading-relaxed px-4">
                    Une expérience immobilière réinventée. Luxe, technologie et simplicité à portée de main.
                </p>

                {/* Glass Pill Search Bar */}
                <div className="glass p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2 w-full max-w-3xl shadow-[0_0_50px_rgba(57,255,20,0.15)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(57,255,20,0.25)] border border-white/10">

                    {/* Type Select */}
                    <div className="relative w-full md:w-auto min-w-[140px]">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gms-neon">
                            <Home size={18} />
                        </div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full h-12 pl-10 pr-8 bg-transparent text-white outline-none appearance-none cursor-pointer font-medium hover:bg-white/5 rounded-xl md:rounded-full transition-colors border-b md:border-b-0 border-white/10 md:border-none"
                        >
                            <option value="Vente" className="bg-black text-white">Acheter</option>
                            <option value="Location" className="bg-black text-white">Louer</option>
                        </select>
                    </div>

                    <div className="hidden md:block w-px h-8 bg-white/20" />

                    {/* Location Input */}
                    <div className="relative flex-1 w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gms-cyan">
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Ville, Quartier (ex: Sablière)..."
                            className="w-full h-12 pl-10 pr-4 bg-transparent text-white placeholder:text-gray-500 outline-none rounded-xl md:rounded-full hover:bg-white/5 transition-colors border-b md:border-b-0 border-white/10 md:border-none"
                        />
                    </div>

                    {/* Search Button */}
                    <Button
                        size="lg"
                        className="w-full md:w-auto rounded-xl md:rounded-full bg-gradient-to-r from-gms-neon to-emerald-500 hover:from-emerald-400 hover:to-gms-neon text-black font-bold px-8 h-12 shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] transition-all duration-300 transform hover:scale-105"
                        onClick={handleSearch}
                    >
                        <Search className="mr-2 h-5 w-5" /> Explorer
                    </Button>
                </div>
            </div>
        </section>
    );
}
