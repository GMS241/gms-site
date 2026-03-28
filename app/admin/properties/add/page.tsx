import { PropertyForm } from '@/components/admin/PropertyForm';

export default function AddPropertyPage() {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-0">
            <h1 className="text-3xl font-bold mb-8 text-white">Ajouter un nouveau bien</h1>
            <PropertyForm mode="create" />
        </div>
    );
}
