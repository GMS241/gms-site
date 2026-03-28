import { Shield, Lock, Eye, Server, UserCheck, Cookie } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] py-12 relative overflow-hidden text-gray-100">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gms-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gms-magenta/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Politique de Confidentialité</h1>
                    <p className="text-gray-400 text-lg">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                    <div className="h-1 w-20 bg-gradient-to-r from-gms-neon to-gms-magenta rounded-full mx-auto mt-6" />
                </div>

                <div className="space-y-8">

                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                            <Shield className="text-gms-neon h-6 w-6" />
                            Introduction
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Chez <strong>Gabon Management Services (GMS)</strong>, la confidentialité de vos données est une priorité absolue.
                            Cette politique détaille comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site et nos services.
                        </p>
                    </section>

                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Eye className="text-gms-cyan h-5 w-5" />
                            Données collectées
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-2">
                            <li><strong>Informations d'identification :</strong> Nom, prénom, adresse email, numéro de téléphone.</li>
                            <li><strong>Données relatives aux biens :</strong> Informations sur les propriétés que vous souhaitez vendre ou faire gérer.</li>
                            <li><strong>Données de connexion :</strong> Adresse IP, type de navigateur (à des fins statistiques et de sécurité).</li>
                            <li><strong>Messages :</strong> Contenu des communications que vous nous adressez via nos formulaires.</li>
                        </ul>
                    </section>

                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Server className="text-gms-magenta h-5 w-5" />
                            Utilisation des données
                        </h2>
                        <p className="text-gray-300 mb-4">Vos données sont utilisées exclusivement pour :</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-2">
                            <li>Vous fournir les services demandés (gestion immobilière, vente, location).</li>
                            <li>Répondre à vos demandes de contact et de rendez-vous.</li>
                            <li>Améliorer votre expérience sur notre site.</li>
                            <li>Vous informer des nouvelles opportunités (si vous avez accepté de recevoir nos communications).</li>
                        </ul>
                    </section>

                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Lock className="text-gms-purple h-5 w-5" />
                            Sécurité des données
                        </h2>
                        <p className="text-gray-300">
                            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles avancées pour protéger vos données contre tout accès non autorisé,
                            perte ou altération. Vos informations sont stockées sur des bases de données sécurisées.
                        </p>
                    </section>

                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Cookie className="text-yellow-400 h-5 w-5" />
                            Cookies
                        </h2>
                        <p className="text-gray-300">
                            Notre site peut utiliser des cookies pour améliorer la navigation et mesurer l'audience.
                            Vous avez la possibilité de configurer votre navigateur pour refuser les cookies, bien que cela puisse affecter certaines fonctionnalités du site.
                        </p>
                    </section>

                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <UserCheck className="text-gms-green h-5 w-5" />
                            Vos droits
                        </h2>
                        <p className="text-gray-300 mb-4">
                            Conformément à la réglementation en vigueur, vous disposez des droits suivants concernant vos données personnelles :
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-2">
                            <li>Droit d'accès et de rectification.</li>
                            <li>Droit à l'effacement (« droit à l'oubli »).</li>
                            <li>Droit à la limitation du traitement.</li>
                            <li>Droit d'opposition.</li>
                        </ul>
                        <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-gray-300">
                                Pour exercer ces droits, contactez-nous à : <br />
                                <a href="mailto:gabonmanagementservices@hotmail.com" className="text-gms-neon hover:underline font-bold">gabonmanagementservices@hotmail.com</a>
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
