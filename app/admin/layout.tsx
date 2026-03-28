'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Building, LogOut, Mail, Users, Plus, Home, FileText, Briefcase, Menu, X, Calendar, Sparkles } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin/login');
            }
            setLoading(false);
        };

        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    }

    const pathname = usePathname();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    // Hide sidebar on login page
    if (pathname === '/admin/login') {
        return (
            <>
                {children}
            </>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex text-white overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gms-purple/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gms-neon/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-black/50 backdrop-blur-md border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="p-6 flex flex-col items-center border-b border-white/10 relative">
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative w-40 h-16 mb-2">
                        <Image
                            src="/images/logo.png"
                            alt="GMS Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Panneau d&apos;administration</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link onClick={() => setSidebarOpen(false)} href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <LayoutDashboard className="h-5 w-5" />
                        Tableau de bord
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <Building className="h-5 w-5 text-gms-neon" />
                        Biens
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} href="/admin/seller-requests" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <Users className="h-5 w-5 text-gms-magenta" />
                        Ventes
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} href="/admin/management" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <Briefcase className="h-5 w-5 text-gms-neon" />
                        Gestion
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} href="/admin/appointments" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <Calendar className="h-5 w-5 text-gms-cyan" />
                        Rendez-vous
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} href="/admin/blog" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <FileText className="h-5 w-5 text-gms-neon" />
                        Blog
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} href="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <Mail className="h-5 w-5 text-gms-magenta" />
                        Messagerie
                    </Link>

                    <Link onClick={() => setSidebarOpen(false)} href="/admin/properties/add" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 hover:text-gms-neon transition-colors text-gray-300">
                        <Plus className="h-5 w-5 text-gms-neon" />
                        Ajouter un bien
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-white/5 text-gray-500 hover:text-white mt-8 transition-colors">
                        <Home className="h-5 w-5" />
                        Voir le site
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <Button variant="ghost" onClick={handleLogout} className="w-full flex items-center justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto flex flex-col h-screen relative z-10">
                <header className="md:hidden bg-black/80 backdrop-blur-md text-white p-4 flex justify-between items-center z-30 sticky top-0 border-b border-white/10">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-white hover:bg-white/10">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gms-neon to-gms-cyan">GMS Admin</span>
                    <Button size="sm" variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><LogOut className="h-4 w-4" /></Button>
                </header>
                <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
