'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] relative overflow-hidden px-4">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gms-purple/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-gms-magenta/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-block relative w-24 h-24 mb-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
                        <Image
                            src="/images/logo.png"
                            alt="GMS"
                            fill
                            className="object-contain p-2 hover:scale-105 transition-transform duration-500"
                            priority
                        />
                    </div>
                </div>

                <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Bon retour</h1>
                        <p className="text-gray-400 text-sm">Connectez-vous à l'espace administration</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-sm border border-red-500/20 mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-gms-neon transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon/50 focus:bg-white/10 transition-all rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Mot de passe</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-gms-neon transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-gms-neon/50 focus:bg-white/10 transition-all rounded-lg"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-gms-neon to-gms-green text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300 mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Se connecter <ArrowRight className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500">
                            Gabon Management Services &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
