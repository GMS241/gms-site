'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Briefcase, Building, Mail, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        propertiesCount: 0,
        requestsCount: 0,
        messagesCount: 0
    });
    const [recentProperties, setRecentProperties] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentMessages, setRecentMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch Counts
            const { count: propsCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
            const { count: reqsCount } = await supabase.from('seller_requests').select('*', { count: 'exact', head: true }).eq('status', 'new');
            const { count: msgsCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false);

            setStats({
                propertiesCount: propsCount || 0,
                requestsCount: reqsCount || 0,
                messagesCount: msgsCount || 0
            });

            // Fetch Recent Properties (5)
            const { data: props } = await supabase.from('properties').select('id, title, price, status, created_at').order('created_at', { ascending: false }).limit(5);
            if (props) setRecentProperties(props);

            // Fetch Recent Requests (5)
            const { data: reqs } = await supabase.from('seller_requests').select('id, first_name, last_name, property_type, created_at').order('created_at', { ascending: false }).limit(5);
            if (reqs) setRecentRequests(reqs);

            // Fetch Recent Messages (5)
            const { data: msgs } = await supabase.from('messages').select('id, first_name, last_name, message, created_at').order('created_at', { ascending: false }).limit(5);
            if (msgs) setRecentMessages(msgs);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gms-neon"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-white">Tableau de Bord</h1>
                <p className="text-gray-400">Vue d&apos;ensemble de votre activité immobilière</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Properties Card */}
                <div className="group relative overflow-hidden bg-black/40 backdrop-blur-md text-white p-6 rounded-2xl shadow-xl border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-gms-neon/50">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building className="h-24 w-24 text-gms-neon" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="p-2 bg-gms-neon/10 w-fit rounded-lg mb-4 text-gms-neon">
                                <Building className="h-6 w-6" />
                            </div>
                            <p className="text-gray-400 font-medium">Total Biens</p>
                            <h3 className="text-4xl font-bold mt-1 text-white">{stats.propertiesCount}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-sm text-gray-400 group-hover:text-gms-neon transition-colors">
                            Gérer vos biens <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                    </div>
                </div>

                {/* Requests Card */}
                <div className="group relative overflow-hidden bg-black/40 backdrop-blur-md text-white p-6 rounded-2xl shadow-xl border border-white/10 border-l-4 border-l-gms-magenta transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-gms-magenta/10 w-fit rounded-lg mb-4 text-gms-magenta">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                {stats.requestsCount > 0 && (
                                    <span className="bg-gms-magenta text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                                        Nouveau
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 font-medium">Demandes Client</p>
                            <h3 className="text-4xl font-bold mt-1 text-white">{stats.requestsCount}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-sm text-gray-400 group-hover:text-gms-magenta transition-colors">
                            Voir les demandes <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                    </div>
                </div>

                {/* Messages Card */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-xl border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-gms-cyan/50">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="p-2 bg-gms-cyan/10 w-fit rounded-lg mb-4 text-gms-cyan">
                                <Mail className="h-6 w-6" />
                            </div>
                            <p className="text-gray-400 font-medium">Messages Non Lus</p>
                            <h3 className="text-4xl font-bold mt-1 text-white">{stats.messagesCount}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-sm text-gray-400 group-hover:text-gms-cyan transition-colors">
                            Accéder à la messagerie <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Properties Widget */}
                <div className="glass-card rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-bold text-xl text-white flex items-center gap-3">
                            <span className="w-1 h-6 bg-gms-neon rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></span>
                            Derniers Biens
                        </h2>
                        <Link href="/admin/properties">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gms-neon/10 hover:text-gms-neon">
                                Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="divide-y divide-white/10">
                        {recentProperties.map(prop => (
                            <div key={prop.id} className="p-4 hover:bg-white/5 transition-all duration-200 group cursor-default">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-gms-neon transition-colors">{prop.title}</p>
                                        <p className="text-sm text-gms-neon font-medium mt-1">
                                            {new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(prop.price)}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${prop.status === 'Disponible'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                        }`}>
                                        {prop.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentProperties.length === 0 && (
                            <div className="p-12 text-center text-gray-500 bg-white/5">
                                <Building className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>Aucun bien ajouté récemment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Requests Widget */}
                <div className="glass-card rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-bold text-xl text-white flex items-center gap-3">
                            <span className="w-1 h-6 bg-gms-magenta rounded-full shadow-[0_0_10px_rgba(255,0,255,0.5)]"></span>
                            Dernières Demandes
                        </h2>
                        <Link href="/admin/seller-requests">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gms-magenta/10 hover:text-gms-magenta">
                                Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="divide-y divide-white/10">
                        {recentRequests.map(req => (
                            <div key={req.id} className="p-4 hover:bg-white/5 transition-all duration-200">
                                <Link href={`/admin/seller-requests`} className="block">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-white hover:text-gms-magenta transition-colors">{req.first_name} {req.last_name}</p>
                                        <span className="text-xs font-mono text-gray-400 bg-white/10 px-2 py-1 rounded">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className="w-2 h-2 rounded-full bg-gms-magenta shadow-[0_0_5px_rgba(255,0,255,0.5)]"></span>
                                        Vente : <span className="font-medium text-gray-200">{req.property_type}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {recentRequests.length === 0 && (
                            <div className="p-12 text-center text-gray-500 bg-white/5">
                                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>Aucune demande récente.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Messages Widget */}
                <div className="glass-card rounded-2xl shadow-lg border border-white/10 overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="font-bold text-xl text-white flex items-center gap-3">
                            <span className="w-1 h-6 bg-gms-cyan rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]"></span>
                            Derniers Messages
                        </h2>
                        <Link href="/admin/messages">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gms-cyan/10 hover:text-gms-cyan">
                                Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="divide-y divide-white/10">
                        {recentMessages.map(msg => (
                            <div key={msg.id} className="p-4 hover:bg-white/5 transition-all duration-200">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-white">{msg.first_name} {msg.last_name}</p>
                                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-1 bg-white/5 p-2 rounded-lg border border-white/5">
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                        {recentMessages.length === 0 && (
                            <div className="p-12 text-center text-gray-500 bg-white/5">
                                <Mail className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>Aucun message récent.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
