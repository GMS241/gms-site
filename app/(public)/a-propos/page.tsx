import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Target, User, TrendingUp, Handshake } from 'lucide-react';

export const metadata = {
    title: 'À Propos - Gabon Management Service',
    description: 'Découvrez Gabon Management Service, votre partenaire de confiance pour la gestion, la vente et la location immobilière au Gabon.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden text-gray-100">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gms-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gms-magenta/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Hero Section */}
            <div className="relative py-24 px-4 overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-white/10">
                        <User size={16} className="text-gms-neon fill-gms-neon" />
                        <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">Notre Vision</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Notre Histoire & <span className="text-transparent bg-clip-text bg-gradient-to-r from-gms-magenta to-gms-purple">Ambition</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Une approche pragmatique, moderne et factuelle de l'immobilier au Gabon. <br />
                        Nous redéfinissons les standards de confiance.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <section className="py-20 container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Qui sommes-nous ?
                        </h2>
                        <div className="space-y-4 text-gray-400 leading-relaxed text-lg font-light">
                            <p>
                                <strong className="text-white">GABON MANAGEMENT SERVICES</strong> est une agence qui vous accompagne de manière factuelle dans toutes vos transactions immobilières, qu'il s'agisse d'achat, de vente ou de location.
                            </p>
                            <p>
                                Notre approche se distingue par son <span className="text-gms-neon">pragmatisme</span> et sa <span className="text-gms-cyan">rigueur</span>. Nous ne nous contentons pas de faciliter les transactions ; nous intervenons également dans la <strong>gestion de patrimoine</strong> afin de protéger et valoriser vos intérêts sur le long terme.
                            </p>
                            <p>
                                Que vous soyez propriétaire, investisseur ou locataire, nous mettons un point d'honneur à sécuriser chaque étape de votre projet immobilier avec transparence et professionnalisme.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ValueCard
                            icon={Shield}
                            title="Protection"
                            description="Sécurisation totale de vos intérêts et de votre patrimoine."
                            color="text-gms-magenta"
                            borderColor="group-hover:border-gms-magenta/50"
                        />
                        <ValueCard
                            icon={Target}
                            title="Factuel"
                            description="Une approche réaliste basée sur des données concrètes du marché."
                            color="text-gms-neon"
                            borderColor="group-hover:border-gms-neon/50"
                        />
                        <div className="sm:col-span-2">
                            <ValueCard
                                icon={CheckCircle}
                                title="Accompagnement 360°"
                                description="De la transaction à la gestion locative et patrimoniale, nous sommes à vos côtés."
                                color="text-gms-cyan"
                                borderColor="group-hover:border-gms-cyan/50"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/5">
                        <div className="md:w-2/5 min-h-[500px] relative bg-gradient-to-b from-gray-900 to-black overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gms-purple/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                            <Image
                                src="/images/founder3.png"
                                alt="Yeyet Davy Gérald"
                                fill
                                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 z-10"
                            />
                        </div>
                        <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center relative">

                            <h3 className="text-3xl font-bold text-white mb-1">Yeyet Davy Gérald</h3>
                            <p className="text-gms-magenta font-medium mb-8">Gérant</p>

                            <blockquote className="text-xl text-gray-300 italic font-light relative leading-relaxed">
                                <span className="text-6xl text-white/10 absolute -top-4 -left-2">"</span>
                                Chez Gabon Management Services, nous croyons que l'immobilier doit être géré avec la plus grande rigueur. Notre mission est de vous offrir une tranquillité d'esprit totale en protégeant vos actifs et en vous guidant avec des conseils factuels et transparents.
                                <span className="text-6xl text-white/10 absolute -bottom-8 -right-2">"</span>
                            </blockquote>

                            <div className="mt-8 flex gap-4">
                                <div className="h-1 w-20 bg-gradient-to-r from-gms-neon to-transparent rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 relative z-10 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
                        Notre Équipe
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Une équipe d'experts passionnés à votre service.
                    </p>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-white/5">
                    <div className="md:w-2/5 min-h-[500px] relative bg-gradient-to-b from-gray-900 to-black overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gms-purple/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                        <Image
                            src="/images/res-vente.png"
                            alt="Aboghe Tarabey Kristy Chanelle"
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 z-10"
                        />
                    </div>
                    <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center relative">

                        <h3 className="text-3xl font-bold text-white mb-1">Aboghe Tarabey Kristy Chanelle</h3>
                        <p className="text-gms-magenta font-medium mb-8">Responsable Vente</p>

                        <div className="text-xl text-gray-300 font-light relative leading-relaxed">
                            <span className="text-6xl text-white/10 absolute -top-8 -left-4">"</span>
                            <p className="relative z-10 italic">
                                Mon engagement est de transformer vos opportunités de vente en succès concrets. Avec une approche rigoureuse et factuelle, je vous accompagne à chaque étape pour garantir la meilleure valorisation de votre patrimoine.
                            </p>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="h-1 w-20 bg-gradient-to-r from-gms-neon to-transparent rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/5 mt-12">
                    <div className="md:w-2/5 min-h-[500px] relative bg-gradient-to-b from-gray-900 to-black overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gms-purple/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                        <Image
                            src="/images/responsable-location.jpg"
                            alt="Mamboundou Murielle Marietta"
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 z-10"
                        />
                    </div>
                    <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center relative">

                        <h3 className="text-3xl font-bold text-white mb-1">Mamboundou Murielle Marietta</h3>
                        <p className="text-gms-magenta font-medium mb-8">Responsable Location</p>

                        <div className="text-xl text-gray-300 font-light relative leading-relaxed">
                            <span className="text-6xl text-white/10 absolute -top-8 -left-4">"</span>
                            <p className="relative z-10 italic">
                                La clé d'une location réussie réside dans l'équilibre et le respect mutuel. Je veille à ce que chaque partie trouve sa satisfaction, dans un cadre clair et sécurisé.
                            </p>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="h-1 w-20 bg-gradient-to-r from-gms-neon to-transparent rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-white/5 mt-12">
                    <div className="md:w-2/5 min-h-[500px] relative bg-gradient-to-b from-gray-900 to-black overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gms-purple/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                        <Image
                            src="/images/juriste-new.png"
                            alt="BAHENI MOYIMAMBA MARTINE MARINA"
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 z-10"
                        />
                    </div>
                    <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center relative">

                        <h3 className="text-3xl font-bold text-white mb-1">BAHENI MOYIMAMBA MARTINE MARINA</h3>
                        <p className="text-gms-magenta font-medium mb-8">Juriste</p>

                        <div className="text-xl text-gray-300 font-light relative leading-relaxed">
                            <span className="text-6xl text-white/10 absolute -top-8 -left-4">"</span>
                            <p className="relative z-10 italic">
                                Le droit est le socle de la confiance. Mon rôle est de garantir la sécurité juridique de vos transactions et de veiller à la conformité de chaque dossier pour une sérénité absolue.
                            </p>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="h-1 w-20 bg-gradient-to-r from-gms-neon to-transparent rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 container mx-auto px-4 text-center relative z-10">
                <div className="max-w-3xl mx-auto glass p-12 rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à concrétiser votre projet ?</h2>
                    <p className="text-gray-400 text-lg mb-8 font-light">
                        Que vous soyez propriétaire, acheteur ou locataire, nous avons la solution adaptée à vos besoins.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="bg-gms-magenta hover:bg-gms-magenta/90 text-white w-full sm:w-auto font-bold px-8 shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-all">
                                Nous Contacter
                            </Button>
                        </Link>
                        <Link href="/properties">
                            <Button variant="outline" size="lg" className="border-white/10 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto border-gms-neon/30 hover:border-gms-neon transition-all">
                                Voir nos biens
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon: Icon, title, description, color, borderColor }: any) {
    return (
        <div className={`p-6 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 ${borderColor}`}>
            <Icon className={`h-10 w-10 mb-4 ${color}`} />
            <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">{description}</p>
        </div>
    );
}
