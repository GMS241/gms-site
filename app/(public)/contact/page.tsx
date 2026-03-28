'use client';

import { ContactForm } from '@/components/features/ContactForm';
import { Mail, MapPin, Phone, Facebook } from 'lucide-react';
import Script from 'next/script';

export default function ContactPage() {

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 relative overflow-hidden text-gray-100">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gms-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Contactez-nous</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Une question ? Un projet immobilier ? Notre équipe d'experts est à votre écoute pour vous accompagner.
                    </p>
                    <div className="h-1 w-20 bg-gradient-to-r from-gms-neon to-gms-magenta rounded-full mx-auto mt-6" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-gms-magenta/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                <span className="w-1 h-6 bg-gms-neon rounded-full" /> Nos Coordonnées
                            </h2>

                            <div className="flex items-start gap-4 group">
                                <div className="h-12 w-12 bg-white/5 border border-white/10 text-gms-neon rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-gms-neon/50 transition-all duration-300">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-white">Téléphone</h3>
                                    <p className="text-gray-500 mb-1 text-sm">Pour toute demande urgente</p>
                                    <a href="tel:+24174007850" className="text-gray-300 font-bold hover:text-gms-neon block transition-colors">+241 74 00 78 50</a>
                                    <a href="tel:+24166336529" className="text-gray-300 font-bold hover:text-gms-neon block transition-colors">+241 66 33 65 29</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="h-12 w-12 bg-white/5 border border-white/10 text-gms-magenta rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-gms-magenta/50 transition-all duration-300">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-white">Email</h3>
                                    <p className="text-gray-500 mb-1 text-sm">Réponse sous 24h</p>
                                    <a href="mailto:gabonmanagementservices@hotmail.com" className="text-gray-300 font-bold hover:text-gms-magenta break-all transition-colors">gabonmanagementservices@hotmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="h-12 w-12 bg-white/5 border border-white/10 text-gms-cyan rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-gms-cyan/50 transition-all duration-300">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-white">Bureau</h3>
                                    <p className="text-gray-300">STATION ENGEN DE LIKOUALA, Nomabakélé, Gabon</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="glass-card p-8 rounded-2xl border border-white/5">
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                                <span className="w-1 h-6 bg-gms-purple rounded-full" /> Suivez-nous
                            </h2>
                            <div className="space-y-6">
                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/gabonmanagementservices"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 group p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-blue-500/50 transition-all duration-300"
                                >
                                    <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Facebook size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">Facebook</h3>
                                        <p className="text-gray-500 text-sm">@gabonmanagementservices</p>
                                    </div>
                                </a>

                                {/* TikTok */}
                                <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                                    <div className="p-1">
                                        <blockquote
                                            className="tiktok-embed"
                                            cite="https://www.tiktok.com/@gabonmanagement.services"
                                            data-unique-id="gabonmanagement.services"
                                            data-embed-type="creator"
                                            style={{ maxWidth: '100%', minWidth: '288px', borderRadius: '12px' }}
                                        >
                                            <section>
                                                <a target="_blank" href="https://www.tiktok.com/@gabonmanagement.services?refer=creator_embed">@gabonmanagement.services</a>
                                            </section>
                                        </blockquote>
                                    </div>
                                    <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-[300px] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-lg">
                            <iframe
                                src="https://maps.google.com/maps?q=0.38828,9.45215&hl=fr&z=15&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 opacity-80 hover:opacity-100 transition-opacity duration-500"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border-2 border-gms-neon/10 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                        </div>
                    </div>

                    {/* Form */}
                    <div className="relative">
                        <div className="glass p-1 rounded-2xl transition-all duration-500">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
