"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Property } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const images = property.images && property.images.length > 0 ? property.images : ['/images/placeholder-property.jpg'];

    useEffect(() => {
        if (images.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [images.length, isHovered]);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <Card
            className="glass-card border-none overflow-hidden group hover:-translate-y-2 transition-all duration-300 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                {images.map((img, index) => {
                    // Optimization: Only render current and adjacent images to avoid heavy server-side processing
                    const isVisible = index === currentImageIndex;
                    const isNear = Math.abs(index - currentImageIndex) <= 1 ||
                        (currentImageIndex === 0 && index === images.length - 1) ||
                        (currentImageIndex === images.length - 1 && index === 0);

                    if (!isNear) return null;

                    return (
                        <div
                            key={`${img}-${index}`}
                            className={cn(
                                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                                isVisible ? "opacity-100 z-0" : "opacity-0 -z-10"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${property.title} - image ${index + 1}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={(e) => {
                                    // Fallback to placeholder on error
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-property.jpg';
                                }}
                            />
                        </div>
                    );
                })}

                {/* Navigation Arrows (Visible on hover) */}
                {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button
                            onClick={prevImage}
                            className="p-1 rounded-full bg-black/50 text-white hover:bg-gms-neon hover:text-black transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="p-1 rounded-full bg-black/50 text-white hover:bg-gms-neon hover:text-black transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* Image Dots Indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentImageIndex(index);
                                }}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                    index === currentImageIndex
                                        ? "bg-gms-neon w-4 shadow-[0_0_8px_rgba(57,255,20,0.8)]"
                                        : "bg-white/40 hover:bg-white/70"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 pointer-events-none" />

                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                    <span className="bg-gms-neon/90 backdrop-blur-md text-black px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider w-fit shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                        {property.features.category || property.type}
                    </span>
                    <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider text-white w-fit ${property.type === 'Vente' ? 'bg-gms-purple/90' : 'bg-gms-cyan/90 text-black'}`}>
                        {property.type}
                    </span>
                </div>

                {/* Price Tag Floating */}
                <div className="absolute bottom-4 right-4 text-right z-30 pointer-events-none">
                    <p className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
                        {new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(property.price)}
                    </p>
                    {property.type === 'Location' && (
                        <span className="text-xs text-gray-300 font-medium">/ {property.features.rentalPeriod === 'Day' ? 'jour' : 'mois'}</span>
                    )}
                </div>
            </div>

            <CardContent className="p-5 relative z-10">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gms-neon transition-colors line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gms-magenta" />
                        <span className="line-clamp-1">{property.location}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 mb-4">
                    {property.features.bedrooms && (
                        <div className="flex flex-col items-center justify-center p-2 rounded bg-white/5">
                            <Bed className="h-5 w-5 text-gms-cyan mb-1" />
                            <span className="text-xs text-gray-300">{property.features.bedrooms} Ch.</span>
                        </div>
                    )}
                    {property.features.bathrooms && (
                        <div className="flex flex-col items-center justify-center p-2 rounded bg-white/5">
                            <Bath className="h-5 w-5 text-gms-purple mb-1" />
                            <span className="text-xs text-gray-300">{property.features.bathrooms} SDB</span>
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center p-2 rounded bg-white/5">
                        <Maximize className="h-5 w-5 text-gms-pink mb-1" />
                        <span className="text-xs text-gray-300">{property.features.area} m²</span>
                    </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2 h-10 mb-2">
                    {property.description}
                </p>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Link href={`/properties/${property.slug || property.id}`} className="w-full">
                    <Button className="w-full bg-white/10 hover:bg-gms-neon hover:text-black text-white border border-white/20 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                        Voir Détails <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
