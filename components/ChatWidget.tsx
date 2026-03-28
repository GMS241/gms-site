'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load session on mount
    useEffect(() => {
        const storedSession = localStorage.getItem('gms_chat_session_id');
        if (storedSession) {
            setSessionId(storedSession);
            // Optionally fetch history if we wanted to be robust, 
            // but for now we start fresh visually or empty (backend handles context).
            // Ideal: Fetch last messages from API? Maybe later.
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    sessionId: sessionId
                }),
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId);
                localStorage.setItem('gms_chat_session_id', data.sessionId);
            }

            // Display AI Response
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai eu un petit souci de connexion. Réessayez ?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button (DISABLED) */}
            <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in duration-300 grayscale opacity-50 pointer-events-none cursor-not-allowed">
                {!isOpen && (
                    <Button
                        disabled
                        className="h-16 w-16 rounded-full bg-gradient-to-tr from-gms-purple to-gms-magenta shadow-2xl border-2 border-white/20 p-0 overflow-hidden cursor-not-allowed"
                    >
                        <div className="relative h-10 w-10">
                            <Image
                                src="/images/logo.png"
                                alt="GMS"
                                fill
                                className="object-contain filter brightness-0 invert"
                            />
                        </div>
                    </Button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-[#0f0f13]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">

                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-gms-purple/20 to-gms-magenta/20 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/20 shadow-glow overflow-hidden p-1">
                                <Image
                                    src="/images/logo.png"
                                    alt="GMS Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Assistant GMS</h3>
                                <p className="text-xs text-gms-neon flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-gms-neon animate-pulse" /> En ligne
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="text-center mt-10 opacity-70">
                                <Bot className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                                <p className="text-gray-300 text-sm px-6">
                                    Bonjour ! Je suis l'intelligence artificielle de GMS.
                                    Je peux chercher des biens immobiliers pour vous ou répondre à vos questions.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                    <button onClick={() => setInput("Cherche un appartement à louer")} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-gms-cyan transition-colors">
                                        🔍 Appart à louer ?
                                    </button>
                                    <button onClick={() => setInput("Je veux vendre mon terrain")} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-gms-magenta transition-colors">
                                        💰 Vendre un bien
                                    </button>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                {msg.role === 'assistant' && (
                                    <div className="h-8 w-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center mt-1">
                                        <Bot className="h-4 w-4 text-gms-cyan" />
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-gms-purple/80 text-white rounded-tr-sm"
                                            : "bg-[#1A1A1E] border border-white/10 text-gray-200 rounded-tl-sm"
                                    )}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="h-8 w-8 rounded-full bg-gms-purple flex-shrink-0 flex items-center justify-center mt-1 text-xs font-bold text-white">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <div className="h-8 w-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center mt-1">
                                    <Bot className="h-4 w-4 text-gms-cyan" />
                                </div>
                                <div className="bg-[#1A1A1E] border border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-gms-neon" />
                                    <span className="text-xs text-gray-400">Je réfléchis...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black/20 border-t border-white/10">
                        <form
                            className="relative flex items-center gap-2"
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez votre question..."
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-gms-purple/50 focus:ring-1 focus:ring-gms-purple/50 transition-all placeholder:text-gray-600"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-gms-neon text-black hover:bg-white hover:scale-105 transition-all"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                        <p className="text-[10px] text-center text-gray-500 mt-2 font-mono tracking-wide uppercase opacity-70">
                            Powered by <span className="text-gms-magenta font-bold">OKILI INTELLIGENCE</span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
