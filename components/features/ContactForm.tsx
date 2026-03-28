'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Need to create Input
import { Textarea } from '@/components/ui/textarea'; // Need to create Textarea

interface ContactFormProps {
    propertyTitle?: string;
}

export function ContactForm({ propertyTitle }: ContactFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: propertyTitle ? `Bonjour, je suis intéressé par le bien : ${propertyTitle}.` : '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('messages')
                .insert([
                    {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        message: formData.message,
                        property_title: propertyTitle || null,
                        read: false
                    }
                ]);

            if (error) throw error;

            setIsSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: propertyTitle ? `Bonjour, je suis intéressé par le bien : ${propertyTitle}.` : '',
            });

            // Reset success info after 5 seconds if desired, or keep it.
            // For now, let's keep the user on the form but show success state.

        } catch (error) {
            console.error('Error sending message:', error);
            alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white/5 border border-gms-neon/30 p-8 rounded-xl text-center space-y-4">
                <div className="w-16 h-16 bg-gms-neon/20 rounded-full flex items-center justify-center mx-auto text-gms-neon border border-gms-neon/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Message Envoyé !</h3>
                <p className="text-gray-300">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                </p>
                <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-4 border-gms-neon/50 text-gms-neon hover:bg-gms-neon/10"
                >
                    Envoyer un autre message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-transparent p-0">
            <h3 className="text-xl font-bold mb-4 text-white">Contacter l'agence</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Prénom</label>
                    <Input
                        name="firstName"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Nom</label>
                    <Input
                        name="lastName"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Téléphone (WhatsApp)</label>
                <Input
                    name="phone"
                    placeholder="+241 ..."
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="vous@exemple.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Message</label>
                <Textarea
                    name="message"
                    placeholder="Votre message..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gms-neon"
                />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-gms-neon text-black hover:bg-gms-neon/90 font-bold">
                {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
        </form>
    );
}
