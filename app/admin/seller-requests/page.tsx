'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Phone, MapPin, Tag, Calendar, CheckCircle, Eye, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SellerRequest {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    property_type: string;
    property_address: string;
    description: string;
    images: string[];
    status: 'new' | 'contacted' | 'archived';
    created_at: string;
}

export default function SellerRequestsPage() {
    const [requests, setRequests] = useState<SellerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('seller_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'archived') => {
        try {
            const { error } = await supabase
                .from('seller_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteRequest = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;

        try {
            const { error } = await supabase
                .from('seller_requests')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setRequests(requests.filter(req => req.id !== id));
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gms-neon" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Demandes de Vente</h1>

            <div className="space-y-6">
                {requests.length === 0 ? (
                    <div className="text-center py-12 glass-card rounded-xl border border-white/10 shadow-sm">
                        <p className="text-gray-400">Aucune demande de vente pour le moment.</p>
                    </div>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className={`glass-card rounded-xl shadow-sm overflow-hidden p-4 md:p-6 transition-all border ${request.status === 'new' ? 'border-gms-neon shadow-[0_0_15px_rgba(57,255,20,0.1)]' : 'border-white/10'}`}>

                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                {/* Info Vendeur & Bien */}
                                <div className="flex-1 space-y-4 min-w-0"> {/* min-w-0 forces flex child to shrink properly */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-white break-words">{request.first_name} {request.last_name}</h3>
                                            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-1 text-sm text-gray-400">
                                                <a href={`mailto:${request.email}`} className="flex items-center hover:text-gms-neon transition-colors break-all">
                                                    <Mail className="h-4 w-4 mr-1 shrink-0" /> {request.email}
                                                </a>
                                                <a href={`tel:${request.phone}`} className="flex items-center hover:text-gms-neon transition-colors whitespace-nowrap">
                                                    <Phone className="h-4 w-4 mr-1 shrink-0" /> {request.phone}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="sm:hidden self-start">
                                            {getStatusBadge(request.status)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 border border-white/10 p-4 rounded-lg">
                                        <div className="flex items-center text-gray-300">
                                            <Tag className="h-4 w-4 mr-2 text-gms-neon shrink-0" />
                                            <span className="font-semibold mr-2 whitespace-nowrap text-white">Type :</span> <span className="truncate">{request.property_type}</span>
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <MapPin className="h-4 w-4 mr-2 text-gms-magenta shrink-0" />
                                            <span className="font-semibold mr-2 whitespace-nowrap text-white">Adresse :</span> <span className="truncate">{request.property_address}</span>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <p className="text-sm text-gray-400 mt-2 italic break-words">"{request.description}"</p>
                                        </div>
                                    </div>

                                    {request.images && request.images.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Photos du bien</p>
                                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                                {request.images.map((img, idx) => (
                                                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border border-white/20 hover:border-gms-neon transition-colors">
                                                        <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions & Status */}
                                <div className="flex flex-col lg:items-end gap-4 lg:min-w-[200px]">
                                    <div className="hidden sm:block self-end">
                                        {getStatusBadge(request.status)}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center lg:justify-end">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(request.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    <div className="flex flex-col w-full gap-2 mt-auto">
                                        {request.status === 'new' && (
                                            <Button
                                                onClick={() => updateStatus(request.id, 'contacted')}
                                                className="w-full bg-gms-cyan/20 text-gms-cyan border border-gms-cyan/50 hover:bg-gms-cyan/30 whitespace-normal h-auto py-2"
                                            >
                                                <Eye className="h-4 w-4 mr-2 shrink-0" /> Marquer comme Vu
                                            </Button>
                                        )}
                                        {request.status !== 'archived' && (
                                            <Button
                                                onClick={() => updateStatus(request.id, 'archived')}
                                                variant="ghost"
                                                className="w-full text-gray-400 hover:text-white border border-white/10 hover:bg-white/10"
                                            >
                                                <Archive className="h-4 w-4 mr-2 shrink-0" /> Archiver
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => deleteRequest(request.id)}
                                            variant="ghost"
                                            className="w-full text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2 shrink-0" /> Supprimer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'new':
            return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gms-neon/20 text-gms-neon border border-gms-neon/50 shadow-[0_0_10px_rgba(57,255,20,0.2)]">Nouveau</span>;
        case 'contacted':
            return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gms-cyan/20 text-gms-cyan border border-gms-cyan/50">Contacté</span>;
        case 'archived':
            return <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-400 border border-white/10">Archivé</span>;
        default:
            return null;
    }
}
