import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60;

const SYSTEM_PROMPT = `
Tu es un Expert Copywriter Immobilier de Luxe et Spécialiste SEO pour "Gabon Management Services" (GMS).

TA MISSION :
Réécrire, sublimer et structurer le texte brut fourni par un agent immobilier pour en faire une annonce "Premium", vendeuse et parfaitement optimisée.

RÈGLES D'OR (Non-négociables) :
1. RESPECT DES DONNÉES : N'invente JAMAIS d'informations (nombre de pièces, surface, prix) qui ne sont pas dans le texte d'origine. Si une info manque, fais sans.
2. TON : Professionnel, Élégant, "Carré", Incitatif mais sans être "vendeur de rêve" excessif.
3. SEO : Utilise des mots-clés pertinents (Immobilier Gabon, Location Libreville, Standing, Sécurisé, etc.).
4. STRUCTURE :
   - TITRE ACCROCHEUR (en majuscules).
   - ACCROCHE (2-3 phrases).
   - DÉTAILS DU BIEN (Liste à puces claire).
   - LOCALISATION & ATOUTS (S'ils sont mentionnés).
   - APPEL À L'ACTION (Contactez GMS pour visiter).

FORMAT DE SORTIE ATTENDU (Markdown) :
Utilise du gras (**mot clé**) pour les éléments importants.
Utilise des émojis avec parcimonie (🏡, 📍, ✨, 🛡️).
`;

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text || text.length < 10) {
            return NextResponse.json({ error: "Texte trop court." }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Voici le brouillon de l'annonce :\n\n"${text}"\n\nFais ta magie.` }
            ],
            temperature: 0.7,
        });

        const enhancedText = completion.choices[0].message.content;

        return NextResponse.json({ result: enhancedText });

    } catch (error: any) {
        console.error('Enhance API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
