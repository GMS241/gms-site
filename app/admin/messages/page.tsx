'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Mail, Phone, CheckCircle, Trash2 } from 'lucide-react';

interface Message {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    message: string;
    property_title?: string;
    created_at: string;
    read: boolean;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = useCallback(async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setMessages(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const markAsRead = async (id: string) => {
        await supabase.from('messages').update({ read: true }).eq('id', id);
        fetchMessages();
    };

    const deleteMessage = async (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            await supabase.from('messages').delete().eq('id', id);
            setMessages(messages.filter((m) => m.id !== id));
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Messagerie</h1>

            <div className="glass-card rounded-xl shadow-sm border border-white/10 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        Aucun message reçu pour le moment.
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`p-4 md:p-6 hover:bg-white/5 transition-colors ${!msg.read ? 'bg-gms-neon/5 border-l-4 border-l-gms-neon' : ''}`}>
                                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-lg text-white flex items-center flex-wrap gap-2">
                                            {msg.first_name} {msg.last_name}
                                            {!msg.read && <span className="inline-block bg-gms-neon text-black text-xs px-2 py-0.5 rounded-full shrink-0 font-bold shadow-[0_0_10px_rgba(57,255,20,0.5)]">Nouveau</span>}
                                        </h3>
                                        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm text-gray-400 mt-1">
                                            <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-gms-neon transition-colors break-all">
                                                <Mail className="h-4 w-4 shrink-0" /> {msg.email}
                                            </a>
                                            <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-gms-neon transition-colors whitespace-nowrap">
                                                <Phone className="h-4 w-4 shrink-0" /> {msg.phone}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 md:text-right shrink-0">
                                        <div className="mb-2">
                                            {new Date(msg.created_at).toLocaleDateString()} à {new Date(msg.created_at).toLocaleTimeString()}
                                        </div>
                                        {!msg.read && (
                                            <Button size="sm" variant="ghost" className="text-gms-cyan hover:bg-gms-cyan/10 hover:text-gms-cyan justify-start md:justify-end" onClick={() => markAsRead(msg.id)}>
                                                <CheckCircle className="h-4 w-4 mr-1" /> Lu
                                            </Button>
                                        )}
                                        <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start md:justify-end ml-2" onClick={() => deleteMessage(msg.id)}>
                                            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                                        </Button>
                                    </div>
                                </div>

                                {msg.property_title && (
                                    <div className="mb-2 inline-block bg-white/10 text-gray-300 text-xs px-2 py-1 rounded border border-white/10">
                                        Intéressé par : <strong className="text-white">{msg.property_title}</strong>
                                    </div>
                                )}

                                <p className="text-gray-300 bg-white/5 border border-white/5 p-4 rounded-lg whitespace-pre-wrap break-words">
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
