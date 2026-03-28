import { PropertyForm } from '@/components/admin/PropertyForm';
import { getProperty } from '@/lib/properties';
import { notFound } from 'next/navigation';

interface EditPropertyPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
    const { id } = await params;
    const property = await getProperty(id);

    if (!property) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Modifier le bien</h1>
            <PropertyForm mode="edit" initialData={property} />
        </div>
    );
}
