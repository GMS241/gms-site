"use client";

import Image from "next/image";
import { useEffect } from "react";

export function MaintenanceOverlay() {
    // Disable scrolling when maintenance mode is active
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-center">
            {/* Frosted Glass Background */}
            <div
                className="absolute inset-0 bg-white/40 backdrop-blur-xl transition-all duration-700 ease-in-out"
                style={{
                    backgroundImage: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.05) 100%)"
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl animate-in fade-in zoom-in duration-1000">
                <div className="mb-8 relative w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl">
                    <Image
                        src="/images/logo.png"
                        alt="GMS Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                    Site en Maintenance
                </h1>

                <div className="w-16 h-1 bg-amber-500 mb-8 rounded-full" />

                <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed font-light px-4">
                    Nous effectuons actuellement des mises à jour pour vous offrir une expérience encore plus exceptionnelle.
                    L'accès au site et au panneau d'administration est temporairement suspendu.
                </p>

                <div className="flex items-center space-x-3 text-gray-500 bg-white/50 px-6 py-3 rounded-full border border-gray-200 backdrop-blur-sm mb-12">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium tracking-wide uppercase">Revenez bientôt</span>
                </div>

                {/* Partner Branding */}
                <div className="flex flex-col items-center space-y-6 pt-10 border-t-2 border-gray-300/50 w-full max-w-md">
                    <div className="relative w-24 h-24 drop-shadow-lg">
                        <Image
                            src="/images/okili-logo.png"
                            alt="Okili Intelligence Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <p className="text-gray-800 text-xl font-medium">
                            Site créé par
                        </p>
                        <a
                            href="https://okili-intelligence.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-900 transition-all transform hover:scale-105 font-black text-4xl md:text-5xl tracking-tight"
                        >
                            OKILI INTELLIGENCE
                        </a>
                        <a
                            href="https://wa.me/24104396660"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 border-2 border-green-500/30 hover:bg-green-50 transition-all font-bold text-2xl md:text-3xl mt-4 flex items-center bg-white/80 px-8 py-3 rounded-full shadow-lg group"
                        >
                            <span className="mr-3 scale-125 group-hover:animate-bounce">
                                <WhatsappIcon size={32} />
                            </span>
                            +241 04 39 66 60
                        </a>
                    </div>
                </div>
            </div>

            {/* Subtle Bottom Accent */}
            <div className="absolute bottom-6 text-gray-500 text-sm font-medium">
                © {new Date().getFullYear()} Gabon Management Service. Tous droits réservés.
            </div>
        </div>
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
            stroke="#25D366"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
    );
}
