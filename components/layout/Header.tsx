'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Home, Search, Key, Briefcase, Info, FileText, Mail, ChevronRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Acheter', href: '/properties?type=Vente', icon: Search },
    { label: 'Louer', href: '/properties?type=Location', icon: Key },
    { label: 'Vendre', href: '/vendre', icon: Briefcase },
    { label: 'Faire gérer', href: '/gerer', icon: LogIn },
    { label: 'À Propos', href: '/a-propos', icon: Info },
    { label: 'Articles', href: '/blog', icon: FileText },
    { label: 'Contact', href: '/contact', icon: Mail },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const isHome = pathname === '/';

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 border-b border-white/5",
                scrolled || !isHome || isOpen ? "bg-black/80 backdrop-blur-md shadow-lg shadow-gms-purple/5" : "bg-transparent border-transparent"
            )}
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group z-50">
                    <div className={cn("relative transition-all duration-300", (scrolled || !isHome) && !isOpen ? "scale-90" : "scale-100")}>
                        <Image
                            src="/images/logo.png"
                            alt="Gabon Management Services"
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                        <div className="absolute -inset-2 bg-gms-purple/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden xl:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 overflow-hidden",
                                    isActive
                                        ? "text-gms-neon bg-white/10"
                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {/* Animated background glow on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-gms-purple/20 to-gms-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <Icon className={cn(
                                    "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-gms-neon" : "text-gray-400 group-hover:text-gms-cyan"
                                )} />

                                <span className="relative font-medium tracking-wide text-sm z-10">
                                    {item.label}
                                </span>

                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gms-neon rounded-t-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="tel:+24174007850"
                        className={cn(
                            "flex items-center gap-2 text-sm font-bold transition-colors border border-white/10 rounded-full px-4 py-2 hover:bg-white/5 hover:border-gms-magenta/50",
                            (scrolled || !isHome) && !isOpen ? "text-gray-300 hover:text-white" : "text-white"
                        )}
                    >
                        <Phone className="h-4 w-4 text-gms-magenta" />
                        <span className="tracking-widest">+241 74 00 78 50</span>
                    </a>
                    <Link href="/vendre">
                        <Button className="bg-gradient-to-r from-gms-purple to-gms-magenta hover:from-gms-magenta hover:to-gms-purple text-white shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_25px_rgba(255,0,255,0.5)] transition-all duration-300 border-none">
                            Déposer un bien
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button - Z-index high to stay above overlay */}
                <div className="xl:hidden flex items-center z-50">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn("hover:bg-white/10 transition-colors", isOpen ? "text-white" : "text-white")}
                    >
                        {isOpen ? <X className="h-8 w-8 animate-in spin-in-90" /> : <Menu className="h-8 w-8 animate-in fade-in" />}
                    </Button>
                </div>
            </div>

            {/* Premium Full Screen Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#050505]/95 backdrop-blur-2xl z-40 animate-in slide-in-from-right-10 duration-300 flex flex-col pt-24 px-6 overflow-y-auto">

                    {/* Background Ambience */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gms-purple/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gms-neon/10 rounded-full blur-[100px] pointer-events-none" />

                    <nav className="flex flex-col gap-2 relative z-10 w-full max-w-md mx-auto">
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-4">Menu Principal</p>
                            {navItems.slice(0, 5).map((item, idx) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "group flex items-center justify-between p-4 mb-2 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 active:scale-95",
                                        pathname === item.href ? "border-gms-purple/50 bg-gms-purple/10" : ""
                                    )}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                            pathname === item.href ? "bg-gms-purple text-white" : "bg-white/10 text-gray-400 group-hover:text-white"
                                        )}>
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <span className={cn(
                                            "text-lg font-medium",
                                            pathname === item.href ? "text-white" : "text-gray-200"
                                        )}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <ChevronRight className={cn(
                                        "h-5 w-5 transition-transform group-hover:translate-x-1",
                                        pathname === item.href ? "text-gms-purple" : "text-gray-600"
                                    )} />
                                </Link>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {navItems.slice(5).map((item, idx) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 text-center"
                                >
                                    <item.icon className="h-6 w-6 text-gms-cyan mb-2" />
                                    <span className="text-sm text-gray-300">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto pb-10 flex flex-col gap-4">
                            <Link href="/vendre" onClick={() => setIsOpen(false)}>
                                <Button className="w-full bg-gradient-to-r from-gms-purple to-gms-magenta py-7 text-lg rounded-xl shadow-xl shadow-gms-purple/20 hover:shadow-gms-purple/40 border border-white/20">
                                    Déposer un bien / Vendre
                                </Button>
                            </Link>

                            <a href="tel:+24174007850" className="flex items-center justify-center gap-3 text-white/80 hover:text-white py-2">
                                <span className="h-8 w-8 rounded-full bg-gms-neon/20 flex items-center justify-center">
                                    <Phone className="h-4 w-4 text-gms-neon" />
                                </span>
                                <span className="font-mono text-lg">+241 74 00 78 50</span>
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
