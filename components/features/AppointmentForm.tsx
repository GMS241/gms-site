'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Loader2, CheckCircle } from 'lucide-react';
import { Property } from '@/types';

export function AppointmentForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form fields
    const [propertyRef, setPropertyRef] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [date, setDate] = useState('');

    // Autocomplete state
    const [suggestions, setSuggestions] = useState<Property[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searching, setSearching] = useState(false);

    // Debounce search
    useEffect(() => {
        const fetchProperties = async () => {
            if (propertyRef.length < 2) {
                setSuggestions([]);
                return;
            }

            setSearching(true);
            const { data, error } = await supabase
                .from('properties')
                .select('reference, title, id')
                .or(`reference.ilike.%${propertyRef}%,title.ilike.%${propertyRef}%`)
                .limit(5);

            if (!error && data) {
                setSuggestions(data as Property[]);
            }
            setSearching(false);
        };

        const timeoutId = setTimeout(fetchProperties, 300);
        return () => clearTimeout(timeoutId);
    }, [propertyRef]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('appointments')
            .insert([
                {
                    property_reference: propertyRef,
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    email: email || null,
                    message: message,
                    appointment_date: date, // ISO string from date input is fine
                    status: 'pending'
                }
            ]);

        if (error) {
            console.error('Error submitting appointment:', error);
            alert('Une erreur est survenue lors de la prise de rendez-vous.');
        } else {
            setSuccess(true);

            // Format URL for WhatsApp redirection
            const formattedDate = new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const whatsappMessage = `*NOUVELLE DEMANDE DE RENDEZ-VOUS GMS* %0A%0A` +
                `*Bien :* ${propertyRef}%0A` +
                `*Client :* ${firstName} ${lastName}%0A` +
                `*Téléphone :* ${phone}%0A` +
                `*Email :* ${email || 'Non renseigné'}%0A` +
                `*Date souhaitée :* ${formattedDate}%0A%0A` +
                `*Message :* ${message}`;

            const whatsappUrl = `https://wa.me/24166336529?text=${whatsappMessage}`; // Using encodeURIComponent is handled by browser/template literal usually, but for line breaks %0A is safer in direct string

            // Detailed encoded version to be safe
            const finalUrl = `https://wa.me/24166336529?text=${encodeURIComponent(`Bonjour GMS, je souhaite confirmer ma demande de rendez-vous :

Nom : ${lastName}
Prénom : ${firstName}
Téléphone : ${phone}
Email : ${email || 'Non renseigné'}
Bien concerné : ${propertyRef}
Date souhaitée : ${formattedDate}

Message : ${message}`)}`;

            // Open WhatsApp in new tab
            window.open(finalUrl, '_blank');

            // Reset form
            setPropertyRef('');
            setFirstName('');
            setLastName('');
            setPhone('');
            setEmail('');
            setMessage('');
            setDate('');
        }
        setLoading(false);
    };

    const selectProperty = (prop: Property) => {
        setPropertyRef(prop.reference || prop.title);
        setShowSuggestions(false);
    };

    if (success) {
        return (
            <div className="text-center py-12 space-y-4">
                <div className="h-16 w-16 bg-gms-neon/20 text-gms-neon rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Demande envoyée !</h3>
                <p className="text-gray-300">
                    Votre demande de rendez-vous a bien été reçue.<br />
                    Nous vous confirmerons le créneau très prochainement.
                </p>
                <Button
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="mt-6 border-gms-neon text-gms-neon hover:bg-gms-neon hover:text-black"
                >
                    Prendre un autre rendez-vous
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <span className="w-1 h-6 bg-gms-cyan rounded-full" /> Prendre un Rendez-vous
            </h2>

            {/* Property Reference with Autocomplete */}
            <div className="relative">
                <label className="text-sm font-medium text-gray-300 mb-1 block">Référence du bien</label>
                <div className="relative">
                    <Input
                        value={propertyRef}
                        onChange={(e) => {
                            setPropertyRef(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                        placeholder="Rechercher par référence ou titre..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-cyan pl-10"
                        required
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    {searching && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-gms-cyan animate-spin" />}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                        {suggestions.map((prop) => (
                            <div
                                key={prop.id}
                                className="px-4 py-3 hover:bg-white/5 cursor-pointer flex flex-col border-b border-white/5 last:border-0"
                                onMouseDown={() => selectProperty(prop)}
                            >
                                <span className="text-white font-medium text-sm">{prop.reference}</span>
                                <span className="text-xs text-gray-400 truncate">{prop.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Prénom</label>
                    <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Votre prénom"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-cyan"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Nom</label>
                    <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Votre nom"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-cyan"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Téléphone Whatsapp</label>
                    <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+241 ..."
                        type="tel"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-cyan"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Email (Optionnel)</label>
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        type="email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-cyan"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Date souhaitée</label>
                <div className="relative">
                    <input
                        type="date" // Simple native date picker as requested
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gms-cyan [color-scheme:dark]"
                        required
                        min={new Date().toISOString().split('T')[0]} // Disable past dates
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Message</label>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Je souhaiterais visiter ce bien..."
                    className="h-24 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-cyan"
                    required
                />
            </div>

            <Button
                type="submit"
                disabled={true}
                className="w-full bg-gray-500/20 text-gray-500 font-bold cursor-not-allowed opacity-50 grayscale transition-all duration-300"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirmer le Rendez-vous'}
            </Button>
        </form>
    );
}
