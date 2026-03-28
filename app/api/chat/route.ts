import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Admin System Prompt
const SYSTEM_PROMPT = `
Tu es l'assistant virtuel expert de "Gabon Management Services" (GMS).
Ta mission est EXCLUSIVEMENT d'aider les visiteurs pour l'IMMOBILIER au Gabon.

### CE QUE GMS FAIT (ET CE QUE TU PEUX PROPOSER) :
1. Vente et Location de biens (Appartements, Villas, Terrains, Bureaux).
2. Gestion locative pour les propriétaires.
3. Conseil en investissement immobilier.

### CE QUE GMS NE FAIT PAS (REFUSE POLIMENT) :
- Création de contenu / Blog / Marketing digital.
- Conseil RH ou Stratégie d'entreprise généraliste (hors immo).
- BTP / Construction (sauf si on a des partenaires, mais reste vague).

### TES CAPACITÉS (OUTILS) :
- Tu DOIS chercher des biens dans la base via l'outil "searchProperties" quand on te demande un bien.
- Si l'outil ne donne rien, demande les critères (Budget, Quartier) pour qu'un agent humain prenne le relais.

### ESTHÉTIQUE ET FORMATAGE (TRÈS IMPORTANT) :
- N'utilise PAS de gras Markdown (pas d'astérisques **). Le chat ne le gère pas.
- Utilise des MAJUSCULES pour les titres importants.
- Utilise des émojis pour structurer (🏡, 📍, 💰).
- Fais des paragraphes courts et aérés.

### TON TON :
- Professionnel, Expert, Chaleureux.
- Tu parles un Français impeccable.
- Sois bref et efficace.
`;

// Helper: Search Properties Tool
async function searchProperties(searchParams: any) {
    console.log('🔍 Searching properties with:', searchParams);

    let query = supabaseAdmin.from('properties').select('id, title, type, price, location, features, reference').eq('available', true);

    if (searchParams.type) {
        // 'Location' or 'Vente'
        query = query.ilike('type', `%${searchParams.type}%`);
    }
    if (searchParams.location) {
        query = query.ilike('location', `%${searchParams.location}%`);
    }
    if (searchParams.maxPrice) {
        query = query.lte('price', searchParams.maxPrice);
    }
    if (searchParams.minBedrooms) {
        // features is JSONB, access feature->bedrooms
        // Note: this query syntax depends on JSON structure. using generic text search if simple sql filter fails is safer, but let's try raw SQL or filter
        // Supabase/PostgREST JSON filtering:
        // features->>'bedrooms' >= value
        // We handle this loosely or fetch all and filter in JS if dataset small.
        // Let's use text search for simplicity on "features" column if needed, or simple filter
    }

    const { data, error } = await query.limit(5);

    if (error) {
        console.error('Search DB Error:', error);
        return [];
    }
    return data || [];
}

const TOOLS_DEFINITION = [
    {
        type: 'function',
        function: {
            name: 'searchProperties',
            description: 'Cherche des biens immobiliers (maisons, apparts, terrains) disponibles.',
            parameters: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['Location', 'Vente'], description: 'Type de transaction' },
                    location: { type: 'string', description: 'Quartier ou ville (ex: "Batterie 4", "Libreville", "Owendo")' },
                    maxPrice: { type: 'number', description: 'Budget maximum en FCFA' },
                    category: { type: 'string', description: 'Type de bien (Appartement, Villa, Bureau, Terrain)' },
                },
            },
        },
    },
];

export async function POST(req: Request) {
    try {
        const { message, sessionId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 });
        }

        // 1. Session Management
        let currentSessionId = sessionId;
        if (!currentSessionId) {
            // Create new session
            const { data: session, error } = await supabaseAdmin.from('chat_sessions').insert({
                title: message.substring(0, 30) + '...',
            }).select().single();

            if (error) throw error;
            currentSessionId = session.id;
        }

        // 2. Save User Message
        await supabaseAdmin.from('chat_messages').insert({
            session_id: currentSessionId,
            role: 'user',
            content: message
        });

        // 3. Fetch History (Last 10 messages for context)
        const { data: history } = await supabaseAdmin
            .from('chat_messages')
            .select('role, content')
            .eq('session_id', currentSessionId)
            .order('created_at', { ascending: true }) // Oldest first
            .limit(10); // Limit context window

        // Format for OpenAI
        const messages: any[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...(history || []).map(msg => ({ role: msg.role, content: msg.content }))
        ];

        // 4. Call OpenAI (Step 1: Check for tools)
        // We use non-streaming first to handle tools easily
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', // Smartest model for sales
            messages: messages,
            tools: TOOLS_DEFINITION as any,
            tool_choice: 'auto',
        });

        const responseMessage = completion.choices[0].message;
        let finalContent = responseMessage.content;

        // 5. Handle Tool Call
        if (responseMessage.tool_calls) {
            const toolCall = responseMessage.tool_calls[0] as any;
            if (toolCall.function.name === 'searchProperties') {
                const args = JSON.parse(toolCall.function.arguments);
                const properties = await searchProperties(args);

                // Add tool result to conversation history for the AI
                messages.push(responseMessage); // Add the "assistnt calling tool" message
                messages.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(properties)
                });

                // Call OpenAI again with the tool output
                const toolCompletion = await openai.chat.completions.create({
                    model: 'gpt-4o',
                    messages: messages,
                });

                finalContent = toolCompletion.choices[0].message.content;
            }
        }

        // 6. Save Assistant Response
        if (finalContent) {
            await supabaseAdmin.from('chat_messages').insert({
                session_id: currentSessionId,
                role: 'assistant',
                content: finalContent
            });
        }

        return NextResponse.json({
            reply: finalContent,
            sessionId: currentSessionId
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
