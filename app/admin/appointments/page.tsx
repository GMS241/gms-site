'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { CheckCircle, Archive, Phone, Mail, Calendar, MessageSquare, Home, Trash2 } from 'lucide-react';

interface Appointment {
    id: string;
    property_reference: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    message: string;
    appointment_date: string;
    status: 'pending' | 'confirmed' | 'archived';
    created_at: string;
}

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setAppointments(data as Appointment[]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchAppointments();
        }
    };

    const deleteAppointment = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
            await supabase.from('appointments').delete().eq('id', id);
            setAppointments(appointments.filter((a) => a.id !== id));
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-white">Rendez-vous</h1>

            <div className="grid gap-6">
                {appointments.map((apt) => (
                    <div key={apt.id} className={`glass-card p-6 rounded-xl shadow-sm border ${apt.status === 'pending' ? 'border-gms-neon shadow-[0_0_15px_rgba(57,255,20,0.1)]' : 'border-white/10'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{apt.first_name} {apt.last_name}</h3>
                                <div className="text-sm text-gray-400 flex flex-col gap-1 mt-1">
                                    <span className="flex items-center gap-2 hover:text-gms-neon transition-colors"><Phone className="h-3 w-3" /> {apt.phone}</span>
                                    {apt.email && <span className="flex items-center gap-2 hover:text-gms-neon transition-colors"><Mail className="h-3 w-3" /> {apt.email}</span>}
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${apt.status === 'pending' ? 'bg-gms-neon/20 text-gms-neon border-gms-neon/50' :
                                apt.status === 'confirmed' ? 'bg-gms-cyan/20 text-gms-cyan border-gms-cyan/50' :
                                    'bg-white/10 text-gray-400 border-white/10'
                                }`}>
                                {apt.status === 'pending' ? 'Nouveau' : apt.status === 'confirmed' ? 'Confirmé' : 'Archivé'}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase">Bien concerné</span>
                                <p className="font-medium flex items-center gap-2 text-gray-200"><Home className="h-4 w-4 text-gms-magenta" /> {apt.property_reference}</p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase">Date souhaitée</span>
                                <p className="font-medium flex items-center gap-2 text-gray-200">
                                    <Calendar className="h-4 w-4 text-gms-magenta" />
                                    {new Date(apt.appointment_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {apt.message && (
                            <div className="mb-6">
                                <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2 mb-1">
                                    <MessageSquare className="h-3 w-3" /> Message
                                </span>
                                <p className="text-gray-300 whitespace-pre-wrap pl-4 border-l-2 border-white/10">{apt.message}</p>
                            </div>
                        )}

                        <div className="flex gap-2 border-t border-white/10 pt-4">
                            <Button
                                size="sm"
                                variant={apt.status === 'confirmed' ? undefined : 'outline'}
                                onClick={() => updateStatus(apt.id, 'confirmed')}
                                className={apt.status === 'confirmed'
                                    ? 'bg-gms-cyan text-black hover:bg-gms-cyan/90 font-bold'
                                    : 'border-gms-cyan/50 text-gms-cyan hover:bg-gms-cyan/10 hover:text-gms-cyan'}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Confirmer le RDV
                            </Button>
                            <Button
                                size="sm"
                                variant={apt.status === 'archived' ? 'secondary' : 'outline'}
                                onClick={() => updateStatus(apt.id, 'archived')}
                                className="border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                <Archive className="mr-2 h-4 w-4" /> Archiver
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteAppointment(apt.id)}
                                className="border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/50"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </Button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-right">
                            Reçu le {new Date(apt.created_at).toLocaleDateString()} à {new Date(apt.created_at).toLocaleTimeString()}
                        </div>
                    </div>
                ))}

                {appointments.length === 0 && (
                    <div className="text-center py-12 glass-card rounded-xl border border-white/10 border-dashed">
                        <p className="text-gray-400">Aucun rendez-vous pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
