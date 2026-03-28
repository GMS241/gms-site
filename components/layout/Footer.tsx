import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-[var(--background)] py-16 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-gms-purple/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gms-neon/10 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-gms-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {/* Column 1: Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Gabon Management <br /> Services
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                        L'avenir de l'immobilier au Gabon. <br />
                        Luxe, Innovation, Confiance.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <SocialIcon icon={Facebook} href="https://www.facebook.com/gabonmanagementservices" color="hover:text-blue-500" />
                        <SocialIcon icon={TiktokIcon} href="https://www.tiktok.com/@gabonmanagement.services" color="hover:text-gms-magenta" />
                        <SocialIcon icon={WhatsappIcon} href="https://wa.me/24174007850" color="hover:text-green-500" />
                    </div>
                </div>

                {/* Column 2: Links */}
                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-gms-neon"></span> Navigation
                    </h4>
                    <div className="grid grid-cols-2 gap-x-4">
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Accueil</Link></li>
                            <li><Link href="/properties?type=Vente" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Acheter</Link></li>
                            <li><Link href="/properties?type=Location" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Louer</Link></li>
                            <li><Link href="/vendre" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Vendre</Link></li>
                        </ul>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/gerer" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Faire gérer</Link></li>
                            <li><Link href="/blog" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Articles</Link></li>
                            <li><Link href="/a-propos" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">À Propos</Link></li>
                            <li><Link href="/contact" className="hover:text-gms-neon transition-colors flex items-center gap-2 hover:translate-x-1 duration-300">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-gms-cyan"></span> Contact
                    </h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gms-cyan shrink-0 mt-0.5" />
                            <span>STATION ENGEN DE LIKOUALA, <br /> Nomabakélé, Gabon</span>
                        </li>
                        <li>
                            <a href="tel:+24174007850" className="flex items-center gap-3 hover:text-white transition-colors group">
                                <Phone className="h-5 w-5 text-gms-cyan group-hover:text-gms-neon transition-colors" />
                                +241 74 00 78 50
                            </a>
                        </li>
                        <li>
                            <a href="mailto:gabonmanagementservices@hotmail.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                                <Mail className="h-5 w-5 text-gms-cyan group-hover:text-gms-neon transition-colors" />
                                gabonmanagementservices@hotmail.com
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Newsletter */}
                <div>
                    <h4 className="font-semibold mb-6 text-white uppercase tracking-wider text-sm flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-gms-magenta"></span> Newsletter
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                        Recevez nos dernières exclusivités directement dans votre boîte mail.
                    </p>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Votre email..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gms-magenta focus:ring-1 focus:ring-gms-magenta transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gms-magenta rounded-md text-white hover:bg-gms-pink transition-colors shadow-lg shadow-gms-magenta/20">
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <p>© {new Date().getFullYear()} GMS. Future Real Estate.</p>
                    <span className="hidden md:block text-gray-700">|</span>
                    <p>
                        Site créé par <a href="https://okiliintelligence.com" target="_blank" rel="noopener noreferrer" className="text-gms-neon hover:text-white transition-colors font-semibold">OKILI INTELLIGENCE</a>
                    </p>
                </div>
                <div className="flex gap-6">
                    <Link href="/mentions-legales" className="hover:text-gray-300 transition-colors">Mentions Légales</Link>
                    <Link href="/politique-confidentialite" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon, href, color }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/5 transition-all duration-300 hover:scale-110 hover:bg-white/10 ${color}`}
        >
            <Icon size={18} />
        </a>
    )
}

function TiktokIcon({ size }: { size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
    );
}

function WhatsappIcon({ size }: { size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /> {/* Simplified inner path */}
        </svg>
    );
}
