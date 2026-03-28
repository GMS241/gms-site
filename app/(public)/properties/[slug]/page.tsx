import { notFound } from 'next/navigation';
import { getProperty } from '@/lib/properties';
import { ImageGallery } from '@/components/features/ImageGallery';
import { ContactForm } from '@/components/features/ContactForm';
import { Bed, Bath, Maximize, MapPin, Check, Building, Layers, Sofa, Utensils, Car, MessageCircle, Phone, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata, ResolvingMetadata } from 'next';

interface PropertyDetailPageProps {
    params: Promise<{ slug: string }>;
}

// FIX: Generate Dynamic Metadata for SEO and Social Media share
export async function generateMetadata(
    { params }: PropertyDetailPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const property = await getProperty(slug);

    if (!property) {
        return {
            title: 'Bien introuvable | Gabon Management Services',
            description: "Ce bien immobilier n'est plus disponible ou a été retiré."
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    // Format price for description
    const formattedPrice = new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(property.price);
    const typeLabel = property.type === 'Location' ? 'à louer' : 'à vendre';
    const periodLabel = property.features.rentalPeriod === 'Day' ? '/jour' : (property.type === 'Location' ? '/mois' : '');

    // Optimize Image for Social Media
    let coverUrl = property.images[0] || 'https://gabonmanagementservices.ga/og-image-property.jpg';
    if (coverUrl.includes('supabase.co')) {
        coverUrl = `${coverUrl}?width=1200&quality=75&resize=contain`;
    }

    return {
        title: `${property.title} à ${property.location}, Gabon | GMS - Gabon Management Services`,
        description: `${property.type} à ${property.location}, Gabon - ${formattedPrice}${periodLabel}. ${property.features.bedrooms} Chambres, ${property.features.bathrooms} SDB. ${property.description?.slice(0, 100)}...`,
        openGraph: {
            title: `${property.title} (${formattedPrice}) | GMS Immobilier Gabon`,
            description: `${property.type} à ${property.location}, Gabon. Découvrez les détails et photos.`,
            url: `https://gabonmanagementservices.ga/properties/${property.slug}`,
            siteName: 'Gabon Management Services - GMS Immobilier',
            images: [
                {
                    url: coverUrl,
                    width: 1200,
                    height: 630,
                    alt: property.title,
                },
                ...previousImages,
            ],
            locale: 'fr_GA',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${property.title} à ${property.location}, Gabon`,
            description: `${property.type} à ${property.location}, Gabon.`,
            images: [coverUrl],
        },
    };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
    const { slug } = await params;
    const property = await getProperty(slug);

    if (!property) {
        notFound();
    }

    // JSON-LD Structured Data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "url": `https://gabonmanagementservices.ga/properties/${property.slug}`,
        "image": property.images,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": property.location,
            "addressCountry": "GA"
        },
        "offers": {
            "@type": "Offer",
            "price": property.price,
            "priceCurrency": "XAF",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-gray-100 pb-20">
            {/* Add JSON-LD to the page */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full">
                <Image
                    src={property.images[0] || '/images/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/40 to-black/30" />

                <div className="absolute top-6 left-4 z-20">
                    <Link href="/properties">
                        <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-md rounded-full">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                        </Button>
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="bg-gms-neon text-black px-3 py-1 rounded-sm text-sm font-bold uppercase tracking-wider box-shadow-glow">
                                        {property.features.category || property.type}
                                    </span>
                                    {property.features.condition && (
                                        <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-sm text-sm font-bold uppercase tracking-wider">
                                            {property.features.condition}
                                        </span>
                                    )}
                                </div>
                                {property.reference && (
                                    <div className="text-gms-magenta font-mono font-bold text-sm mb-1 tracking-widest opacity-80">
                                        RÉF: {property.reference}
                                    </div>
                                )}
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                                    {property.title}
                                </h1>
                                <div className="flex items-center text-gray-300 text-lg">
                                    <MapPin className="h-5 w-5 mr-2 text-gms-cyan" />
                                    {property.location}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    {new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(property.price)}
                                    {property.type === 'Location' && (
                                        <span className="text-lg text-gray-400 font-light block text-right">/ {property.features.rentalPeriod === 'Day' ? 'jour' : 'mois'}</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-black/50 text-white hover:bg-white hover:text-black">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Highlights Grid */}
                        <div className="glass-card p-6 rounded-2xl grid grid-cols-3 md:grid-cols-4 gap-4">
                            <HighlightItem icon={Bed} value={property.features.bedrooms} label="Chambres" color="text-gms-cyan" />
                            <HighlightItem icon={Bath} value={property.features.bathrooms} label="SDB" color="text-gms-purple" />
                            <HighlightItem icon={Maximize} value={property.features.area} label="m²" unit="m²" color="text-gms-neon" />
                            <HighlightItem icon={Layers} value={property.features.floors} label="Étages" color="text-white" />
                            <HighlightItem icon={Building} value={property.features.apartments} label="Appartements" color="text-white" />
                            <HighlightItem icon={Sofa} value={property.features.livingRooms} label="Salons" color="text-white" />
                            <HighlightItem icon={Utensils} value={property.features.kitchens} label="Cuisines" color="text-white" />
                            <HighlightItem icon={Car} value={property.features.parking} label="Parking" color="text-white" />
                        </div>

                        {/* Gallery Preview */}
                        <div className="glass-card p-2 rounded-2xl overflow-hidden">
                            <ImageGallery images={property.images} title={property.title} />
                        </div>

                        {/* Description */}
                        <div className="glass-card p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-gms-magenta rounded-full" /> Description
                            </h2>
                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </div>
                        </div>

                        {/* Amenities */}
                        {property.features.amenities && property.features.amenities.length > 0 && (
                            <div className="glass-card p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-8 bg-gms-neon rounded-full" /> Commodités
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {property.features.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-gms-neon/30 transition-colors">
                                            <div className="h-2 w-2 rounded-full bg-gms-neon box-shadow-glow" />
                                            <span className="text-gray-300 font-medium">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video */}
                        {property.video && (
                            <div className="glass-card p-8 rounded-2xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <span className="w-1 h-8 bg-red-500 rounded-full" /> Vidéo
                                </h2>
                                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                                    <video
                                        src={property.video}
                                        controls
                                        className="w-full h-full"
                                        poster={property.images[0]}
                                    >
                                        Votre navigateur ne supporte pas la lecture de vidéos.
                                    </video>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Agent Card */}
                        <div className="glass-card p-6 rounded-2xl sticky top-24 border-none bg-gradient-to-b from-white/10 to-transparent">
                            <h3 className="text-xl font-bold mb-6 text-center">Intéressé par ce bien ?</h3>

                            <div className="bg-black/40 p-4 rounded-xl mb-6 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-[#25D366]/20 rounded-full flex items-center justify-center text-[#25D366] border border-[#25D366]/50">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Contact Direct</p>
                                        <p className="text-xs text-gms-neon">Réponse rapide garantie</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <a
                                        href={`https://wa.me/24166336529?text=${encodeURIComponent(
                                            `Bonjour, je suis intéressé par votre bien : ${property.title}\n` +
                                            `Localisation : ${property.location}\n` +
                                            `Prix : ${new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(property.price)}\n\n` +
                                            `Est-il toujours disponible ? Merci.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full"
                                    >
                                        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg> WhatsApp
                                        </Button>
                                    </a>
                                    <div className="grid grid-cols-2 gap-2">
                                        <a href="tel:+24166336529" className="w-full">
                                            <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-10">
                                                <Phone className="mr-2 h-4 w-4" /> 066 33...
                                            </Button>
                                        </a>
                                        <a href="tel:+24174007850" className="w-full">
                                            <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-10">
                                                <Phone className="mr-2 h-4 w-4" /> 074 00...
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <h4 className="font-bold mb-4 text-sm uppercase text-gray-400 tracking-wider">Envoyer un message</h4>
                                <ContactForm propertyTitle={property.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HighlightItem({ icon: Icon, value, label, unit, color }: any) {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
            <Icon className={`h-6 w-6 mb-2 ${color} group-hover:scale-110 transition-transform`} />
            <span className="font-bold text-lg text-white">{value} {unit}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
    );
}
