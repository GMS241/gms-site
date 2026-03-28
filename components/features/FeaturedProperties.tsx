import { getFeaturedProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/features/PropertyCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export async function FeaturedProperties() {
    const properties = await getFeaturedProperties();

    return (
        <section className="py-16 md:py-24 relative bg-black">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gms-purple/10 to-transparent opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-gms-cyan/10 to-transparent opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-px w-8 bg-gms-neon"></span>
                            <span className="text-gms-neon text-sm font-bold uppercase tracking-widest">Exclusivité</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Biens en <span className="text-transparent bg-clip-text bg-gradient-to-r from-gms-magenta to-gms-pink">Vedette</span></h2>
                        <p className="text-gray-400 text-lg max-w-lg">Découvrez une sélection de propriétés d'exception, alliant confort moderne et design avant-gardiste.</p>
                    </div>

                    <Link href="/properties">
                        <Button variant="ghost" className="text-white hover:text-gms-neon hover:bg-white/5 border border-white/10 px-6 py-6 group">
                            Voir tous les biens <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-400">
                            <p className="text-xl">Aucun bien disponible pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
