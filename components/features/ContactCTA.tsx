'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone } from 'lucide-react';

export function ContactCTA() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background with gradient mesh */}
            <div className="absolute inset-0 bg-[#050505]">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 z-10" />
                <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gms-purple/10 rounded-full blur-[120px] opacity-30 animate-pulse" />
                <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gms-neon/5 rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative z-20">
                <div className="max-w-4xl mx-auto text-center space-y-8 glass-card border border-white/5 p-8 md:p-16 rounded-3xl bg-white/5 backdrop-blur-sm">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Prêt à concrétiser votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-gms-neon to-emerald-400">projet ?</span>
                    </h2>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Que vous souhaitiez acheter, vendre ou faire gérer votre bien, notre équipe d'experts est là pour vous accompagner à chaque étape.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/contact">
                            <Button className="h-14 px-8 text-lg bg-gradient-to-r from-gms-purple to-gms-magenta hover:from-gms-magenta hover:to-gms-purple text-white rounded-full shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-all duration-300 group ring-2 ring-white/10 ring-offset-2 ring-offset-black">
                                <Mail className="mr-2 h-5 w-5" />
                                Nous Contacter
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>

                        <a href="tel:+24174007850">
                            <Button variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:border-gms-neon/50">
                                <Phone className="mr-2 h-5 w-5 text-gms-neon" />
                                +241 74 00 78 50
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
