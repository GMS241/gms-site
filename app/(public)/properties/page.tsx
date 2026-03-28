import { getProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/features/PropertyCard';
import { SearchFilters } from '@/components/features/SearchFilters';
import { Pagination } from '@/components/features/Pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Biens Immobiliers au Gabon | GMS - Gabon Management Services',
    description: 'Vente et location de villas, appartements et terrains à Libreville, Akanda et à travers le Gabon. Trouvez votre prochain chez-vous avec GMS Immobilier.',
};

interface PropertiesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ITEMS_PER_PAGE = 9;

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
    const params = await searchParams;
    const currentPage = params.page ? Number(params.page) : 1;

    const filters = {
        location: params.location as string,
        type: params.type as string,
        category: params.category as string,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    };

    const { properties, totalCount } = await getProperties(filters, currentPage, ITEMS_PER_PAGE);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-[var(--background)] py-20 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black -z-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gms-purple/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Nos Biens <span className="text-transparent bg-clip-text bg-gradient-to-r from-gms-neon to-gms-cyan">Immobiliers</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Explorez notre catalogue exclusif de propriétés. Du luxe urbain aux retraites paisibles.
                    </p>
                </div>

                <SearchFilters />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/20">
                            <div className="text-6xl mb-4">🛸</div>
                            <p className="text-xl text-gray-300 font-bold mb-2">Aucun bien trouvé</p>
                            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Section */}
                {properties.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                )}
            </div>
        </div>
    );
}
