import { Home, Key, TrendingUp, ShieldCheck, Zap, Globe, Lightbulb, Calculator, FileCheck, PenTool, Hammer, RefreshCw } from 'lucide-react';

export function Services() {
    const services = [
        {
            icon: <Lightbulb className="h-8 w-8 text-yellow-400" />,
            title: "Conseils",
            description: "Stratégies immobilières sur mesure pour optimiser vos investissements.",
            image: "/images/services/advice.png"
        },
        {
            icon: <Calculator className="h-8 w-8 text-gms-neon" />,
            title: "Estimation",
            description: "Valorisation précise et réaliste de vos biens par nos experts.",
            image: "/images/services/valuation.png"
        },
        {
            icon: <FileCheck className="h-8 w-8 text-blue-400" />,
            title: "Régularisation",
            description: "Gestion administrative complète pour sécuriser vos titres fonciers.",
            image: "/images/services/legal-land.png"
        },
        {
            icon: <PenTool className="h-8 w-8 text-gms-magenta" />,
            title: "Conception",
            description: "Architecture visionnaire et plans 3D pour vos projets futurs.",
            image: "/images/services/design.png"
        },
        {
            icon: <Hammer className="h-8 w-8 text-orange-500" />,
            title: "Construction",
            description: "Réalisation de vos projets avec des standards de qualité internationaux.",
            image: "/images/services/construction.png"
        },
        {
            icon: <RefreshCw className="h-8 w-8 text-gms-cyan" />,
            title: "Réfection",
            description: "Rénovation moderne pour donner une seconde vie à votre patrimoine.",
            image: "/images/services/renovation.png"
        },
        {
            icon: <Home className="h-8 w-8 text-gms-neon" />,
            title: "Vente & Achat",
            description: "Propriétés d'exception et investissements stratégiques sécurisés.",
            image: "/images/services/sales.png"
        },
        {
            icon: <Key className="h-8 w-8 text-gms-cyan" />,
            title: "Location Premium",
            description: "Accès exclusif aux biens les plus demandés du marché.",
            image: "/images/services/rental.png"
        },
        {
            icon: <TrendingUp className="h-8 w-8 text-gms-magenta" />,
            title: "Gestion de Patrimoine",
            description: "Maximisez vos rendements avec notre gestion locative 360°.",
            image: "/images/services/management.png"
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-emerald-400" />,
            title: "Juridique & Fiscal",
            description: "Accompagnement complet pour des transactions sans risques.",
            image: "/images/services/legal.png"
        },
        {
            icon: <Globe className="h-8 w-8 text-blue-400" />,
            title: "Réseau International",
            description: "Visibilité mondiale pour votre propriété.",
            image: "/images/services/international.png"
        }
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-[var(--background)]">
            {/* Decorative Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gms-purple/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-20 mb-12">
                <div className="text-center md:mb-20">
                    <span className="text-gms-cyan text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Notre Expertise</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                        L'Excellence Immobilière <br /> Réinventée
                    </h2>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg font-light">
                        11 piliers d'expertises pour transformer vos ambitions en réalité.
                    </p>
                </div>
            </div>

            {/* Infinite Scroll Carousel */}
            <div className="w-full relative z-20 overflow-hidden">
                <div className="flex w-max animate-scroll">
                    {[...services, ...services].map((service, index) => (
                        <div
                            key={index}
                            className="w-[260px] mx-3 group relative rounded-xl overflow-hidden min-h-[320px] border border-white/5 transition-all duration-500 hover:border-gms-neon/50 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] flex-shrink-0"
                        >
                            {/* Background & Overlay */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gray-900" />
                                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br from-[var(--color-gms-purple)] to-[var(--color-gms-cyan)] group-hover:opacity-30 transition-opacity duration-500`} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

                            {/* Content */}
                            <div className="relative z-20 p-6 h-full flex flex-col justify-start transform transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="mb-4 p-2 w-fit rounded-lg bg-white/10 backdrop-blur-md border border-white/10 group-hover:bg-gms-neon/20 group-hover:border-gms-neon/50 transition-colors duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gms-neon transition-colors">{service.title}</h3>
                                <p className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
