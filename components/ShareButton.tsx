'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
    title: string;
    url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title: title,
            text: `Découvrez cet article sur GMS Immo : ${title}`,
            url: url,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(url);
                alert('Lien copié dans le presse-papiers !');
            }
        } catch (error) {
            console.error('Erreur de partage:', error);
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                alert('Lien copié dans le presse-papiers !');
            } catch {
                alert('Impossible de partager cet article.');
            }
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2 border-gms-neon/50 text-gms-neon hover:bg-gms-neon hover:text-black transition-all"
            onClick={handleShare}
        >
            <Share2 className="h-4 w-4" /> Partager cet article
        </Button>
    );
}
