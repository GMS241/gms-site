'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash } from 'lucide-react';
import Image from 'next/image';

export default function PropertiesListPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProperties = useCallback(async () => {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProperties(data as Property[]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return;

        const { error } = await supabase.from('properties').delete().eq('id', id);
        if (!error) {
            fetchProperties();
        } else {
            alert('Erreur: ' + error.message);
        }
    }

    const filteredProperties = properties.filter(property => {
        const matchesType = filterType === 'All' || property.type === filterType;
        const matchesStatus = filterStatus === 'All' || property.status === filterStatus;
        const matchesSearch = searchTerm === '' ||
            (property.reference && property.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
            property.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesStatus && matchesSearch;
    });

    if (loading) return <div>Chargement des biens...</div>

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">Gestion des Biens Immobiliers</h1>
                <Link href="/admin/properties/add">
                    <Button className="bg-gms-neon text-black hover:bg-gms-neon/90 font-medium shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                        <Plus className="mr-2 h-4 w-4" /> Nouveau Bien
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-xl border border-white/10 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Rechercher (Réf ou Titre)</label>
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ex: GMS-0001..."
                        className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon"
                    />
                </div>
                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Filtrer par Type</label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full rounded-md border border-white/10 bg-black/40 text-white p-2 focus:border-gms-neon focus:ring-gms-neon focus:outline-none"
                    >
                        <option value="All" className="bg-gray-900">Tous les types</option>
                        <option value="Vente" className="bg-gray-900">Vente</option>
                        <option value="Location" className="bg-gray-900">Location</option>
                    </select>
                </div>
                <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Filtrer par Statut</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full rounded-md border border-white/10 bg-black/40 text-white p-2 focus:border-gms-neon focus:ring-gms-neon focus:outline-none"
                    >
                        <option value="All" className="bg-gray-900">Tous les statuts</option>
                        <option value="Disponible" className="bg-gray-900">Disponible</option>
                        <option value="Vendu" className="bg-gray-900">Vendu</option>
                        <option value="Loué" className="bg-gray-900">Loué</option>
                    </select>
                </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 font-semibold text-gray-300">Image</th>
                                <th className="p-4 font-semibold text-gray-300">Référence</th>
                                <th className="p-4 font-semibold text-gray-300">Titre</th>
                                <th className="p-4 font-semibold text-gray-300">Prix</th>
                                <th className="p-4 font-semibold text-gray-300">Type</th>
                                <th className="p-4 font-semibold text-gray-300">Statut</th>
                                <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredProperties.map((property) => (
                                <tr key={property.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 w-24">
                                        <div className="relative h-16 w-16 rounded overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                            {property.images[0] && (
                                                <Image src={property.images[0]} alt="" fill className="object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gms-magenta font-mono font-bold text-sm tracking-widest whitespace-nowrap">
                                        {property.reference || '-'}
                                    </td>
                                    <td className="p-4 font-medium text-white">{property.title}</td>
                                    <td className="p-4 text-gms-neon font-bold whitespace-nowrap">
                                        {new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(property.price)}
                                        {property.type === 'Location' && (
                                            <span className="text-sm font-normal text-gray-400">
                                                {property.features?.rentalPeriod === 'Day' ? ' / jour' : ' / mois'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-sm whitespace-nowrap border border-white/10">{property.type}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm font-medium whitespace-nowrap border ${property.status === 'Disponible' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        <Link href={`/admin/properties/${property.id}/edit`}>
                                            <Button size="sm" variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10"><Pencil className="h-4 w-4" /></Button>
                                        </Link>
                                        <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300 hover:bg-red-500/20 border-red-500/30" onClick={() => handleDelete(property.id)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProperties.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        Aucun bien trouvé correspondant à vos critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
