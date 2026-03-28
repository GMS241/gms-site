'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Maximize2, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Update selected image if props change
    useEffect(() => {
        if (images.length > 0) setSelectedImage(images[0]);
    }, [images]);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentIndex = images.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentIndex = images.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[prevIndex]);
    };

    if (!images.length) {
        return (
            <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center rounded-xl">
                <span className="text-gray-400">Aucune image disponible</span>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-xl bg-gray-100 group cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />

                {/* Overlay Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                    <Button variant="secondary" className="gap-2 pointer-events-none">
                        <Maximize2 className="h-4 w-4" /> Agrandir
                    </Button>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative h-20 w-full cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                                selectedImage === image ? "border-gms-neon opacity-100" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                            onClick={() => setSelectedImage(image)}
                        >
                            <Image
                                src={image}
                                alt={`${title} - view ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                    {/* Controls */}
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50 rounded-full hover:bg-white/10 transition-colors"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div className="absolute top-4 left-4 text-white/90 z-50 font-medium text-lg max-w-[80vw] truncate">
                        {images.indexOf(selectedImage) + 1} / {images.length} - {title}
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
                                onClick={handlePrev}
                            >
                                <ChevronLeft className="h-10 w-10" />
                            </button>
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
                                onClick={handleNext}
                            >
                                <ChevronRight className="h-10 w-10" />
                            </button>
                        </>
                    )}

                    {/* Image Container */}
                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={selectedImage}
                            alt={title}
                            fill
                            className="object-contain"
                            priority
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
