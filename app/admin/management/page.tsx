'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { CheckCircle, Archive, Phone, Mail, MapPin, Building, Trash2 } from 'lucide-react';

interface ManagementRequest {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    property_type: string;
    address: string;
    description: string;
    status: 'Nouveau' | 'Contacté' | 'Archivé';
    created_at: string;
}

export default function AdminManagementPage() {
    const [requests, setRequests] = useState<ManagementRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        const { data, error } = await supabase
            .from('management_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setRequests(data as ManagementRequest[]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('management_requests')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchRequests();
        }
    };

    const deleteRequest = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;

        const { error } = await supabase
            .from('management_requests')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchRequests();
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Demandes de Gestion</h1>

            <div className="grid gap-6">
                {requests.map((request) => (
                    <div key={request.id} className={`glass-card p-6 rounded-xl shadow-sm border ${request.status === 'Nouveau' ? 'border-gms-neon shadow-[0_0_15px_rgba(57,255,20,0.1)]' : 'border-white/10'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{request.full_name}</h3>
                                <div className="text-sm text-gray-400 flex flex-col gap-1 mt-1">
                                    <span className="flex items-center gap-2 hover:text-gms-neon transition-colors"><Phone className="h-3 w-3" /> {request.phone}</span>
                                    {request.email && <span className="flex items-center gap-2 hover:text-gms-neon transition-colors"><Mail className="h-3 w-3" /> {request.email}</span>}
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${request.status === 'Nouveau' ? 'bg-gms-neon/20 text-gms-neon border-gms-neon/50' :
                                request.status === 'Contacté' ? 'bg-gms-cyan/20 text-gms-cyan border-gms-cyan/50' :
                                    'bg-white/10 text-gray-400 border-white/10'
                                }`}>
                                {request.status}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase">Type de bien</span>
                                <p className="font-medium flex items-center gap-2 text-gray-200"><Building className="h-4 w-4 text-gms-magenta" /> {request.property_type}</p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase">Adresse</span>
                                <p className="font-medium flex items-center gap-2 text-gray-200"><MapPin className="h-4 w-4 text-gms-magenta" /> {request.address}</p>
                            </div>
                        </div>

                        {request.description && (
                            <div className="mb-6">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Message / Description</span>
                                <p className="text-gray-300 mt-1 whitespace-pre-wrap">{request.description}</p>
                            </div>
                        )}

                        <div className="flex gap-2 border-t border-white/10 pt-4">
                            <Button
                                size="sm"
                                variant={request.status === 'Contacté' ? undefined : 'outline'}
                                onClick={() => updateStatus(request.id, 'Contacté')}
                                className={request.status === 'Contacté'
                                    ? 'bg-gms-cyan text-black hover:bg-gms-cyan/90 font-bold'
                                    : 'border-gms-cyan/50 text-gms-cyan hover:bg-gms-cyan/10 hover:text-gms-cyan'}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Marquer comme contacté
                            </Button>
                            <Button
                                size="sm"
                                variant={request.status === 'Archivé' ? 'secondary' : 'outline'}
                                onClick={() => updateStatus(request.id, 'Archivé')}
                                className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                <Archive className="mr-2 h-4 w-4" /> Archiver
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteRequest(request.id)}
                                className="border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/50"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </Button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-right">
                            Reçu le {new Date(request.created_at).toLocaleDateString()} à {new Date(request.created_at).toLocaleTimeString()}
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="text-center py-12 glass-card rounded-xl border border-white/10 border-dashed">
                        <p className="text-gray-400">Aucune demande de gestion pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
