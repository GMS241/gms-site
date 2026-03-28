import { Shield, MapPin, Phone, Mail, FileText, CheckCircle } from 'lucide-react';

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] py-12 relative overflow-hidden text-gray-100">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gms-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white">Mentions Légales</h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-gms-neon to-gms-magenta rounded-full mx-auto mt-6" />
                </div>

                <div className="space-y-8">
                    {/* Éditeur du Site */}
                    <section className="glass-card p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-gms-magenta/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                            <Shield className="text-gms-neon h-6 w-6" />
                            Identité de l'entreprise
                        </h2>

                        <div className="space-y-4 text-gray-300">
                            <p><strong className="text-white">Raison Sociale :</strong> GABON MANAGEMENT SERVICES (GMS)</p>
                            <p><strong className="text-white">Forme Juridique :</strong> Société de Services</p>

                            <div className="flex items-start gap-3 mt-4">
                                <MapPin className="h-5 w-5 text-gms-cyan shrink-0 mt-1" />
                                <div>
                                    <strong className="text-white block">Siège Social (Adresse) :</strong>
                                    STATION ENGEN DE LIKOUALA, Nomabakélé, Gabon
                                    <br />
                                    BP : 3083
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">RCCM</span>
                                    <span className="text-white font-mono font-bold">RG LBV 2018B22269</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">NIF</span>
                                    <span className="text-white font-mono font-bold">046915X</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="flex items-center gap-2 mb-2">
                                    <Phone className="h-4 w-4 text-gms-purple" />
                                    <span className="text-white">Tél :</span> +241 74 00 78 50 / +241 66 33 65 29
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gms-purple" />
                                    <span className="text-white">Email :</span> gabonmanagementservices@hotmail.com
                                </p>
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                <strong>Compte Bancaire (UBA) :</strong> 40025 05802 80201100101 91
                            </div>
                        </div>
                    </section>

                    {/* Hébergement */}
                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <CheckCircle className="text-gms-cyan h-5 w-5" />
                            Hébergement
                        </h2>
                        <p className="text-gray-300">
                            Ce site est hébergé sur une infrastructure dédiée sécurisée.
                            <br />
                            Les données sont stockées et sécurisées conformément aux normes en vigueur.
                        </p>
                    </section>

                    {/* Propriété Intellectuelle */}
                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <FileText className="text-gms-magenta h-5 w-5" />
                            Propriété Intellectuelle
                        </h2>
                        <p className="text-gray-300 mb-4">
                            L'ensemble de ce site relève de la législation gabonaise et internationale sur le droit d'auteur et la propriété intellectuelle.
                            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                        <p className="text-gray-300">
                            Toute reproduction, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé,
                            est interdite, sauf autorisation écrite préalable de Gabon Management Services.
                        </p>
                    </section>

                    {/* Données Personnelles */}
                    <section className="glass-card p-8 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Shield className="text-gms-green h-5 w-5" />
                            Données Personnelles
                        </h2>
                        <p className="text-gray-300 mb-4">
                            En conformité avec les dispositions relatives à la protection des données personnelles, vous disposez d'un droit d'accès,
                            de modification et de suppression des données vous concernant.
                        </p>
                        <p className="text-gray-300">
                            Pour exercer ce droit, vous pouvez nous contacter par email ou par courrier à l'adresse du siège social indiquée plus haut.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
