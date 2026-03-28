
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tavily } from '@tavily/core';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// Initialize Supabase with Service Role to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 300; // 5 minutes timeout for Vercel/Next.js

export async function POST(req: Request) {
    try {
        // 1. Security Check
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1.5. Parse custom topic from request body (optional)
        let customTopic: string | null = null;
        let isManual = false;
        try {
            const body = await req.json();
            customTopic = body.customTopic || null;
            isManual = body.manual || false;
        } catch {
            // No body or invalid JSON - continue with auto mode
        }

        console.log('🚀 Starting blog generation...');
        if (customTopic || isManual) {
            console.log(`📝 ${customTopic ? 'Custom topic' : 'Manual trigger'} requested - Bypassing schedule checks.`);
        } else {
            // 1.6 Check Settings (only for auto-mode)
            const { data: settings } = await supabaseAdmin
                .from('blog_settings')
                .select('*')
                .single();

            if (settings) {
                if (!settings.is_active) {
                    console.log('❌ Automation is disabled in settings. Skipping.');
                    return NextResponse.json({ skipped: true, reason: 'Automation disabled' });
                }

                // 1. GLOBAL CHECK: Have we already run today?
                const lastRunDate = settings.last_run_at ? new Date(settings.last_run_at).getDate() : null;
                const todayDate = new Date().getDate();

                if (lastRunDate === todayDate) {
                    console.log('✅ Already ran today. Skipping.');
                    return NextResponse.json({ skipped: true, reason: 'Already ran today' });
                }

                // Check schedule time (simple hour check)
                const currentHour = new Date().getHours() + 1; // UTC+1 for Gabon
                const scheduledHour = parseInt(settings.schedule_time.split(':')[0]);

                // Allow execution if it's the right hour OR if it's a catch-up (e.g. server restarted) but limit to preventing repeats same day
                // For now, strict hour check to avoid spamming if cron runs frequently
                if (currentHour !== scheduledHour) {
                    // If not the right hour and haven't run, we permit running ONLY if current hour > scheduled hour (catch up) 
                    // BUT for this first iteration, let's keep it simple: strict match or manual trigger
                    // Ideally, we wait for the correct hour.
                    console.log(`⏳ Not time yet. Current hour (UTC+1): ${currentHour}, Scheduled: ${scheduledHour}`);
                    // Strict time enforcement
                    return NextResponse.json({ skipped: true, reason: 'Not scheduled time' });
                }
            }
        }

        // 2. Search for News
        const today = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

        // Use custom topic for search if provided, otherwise use default queries
        const searchQueries = customTopic
            ? [`${customTopic} Gabon immobilier ${today}`, `${customTopic} Libreville actualités`]
            : [
                `Actualités immobilier construction infrastructures Gabon ${today}`,
                `Nouveaux projets immobiliers et urbanisme Libreville Gabon`,
                `Investissement immobilier et économie Gabon actualités récentes`,
                `Législation foncière et droits immobiliers Gabon`
            ];

        let searchContext = "";
        console.log('🔍 Searching web with Tavily...');

        // We run the first query which is the most specific
        try {
            const searchResult = await tvly.search(searchQueries[0], {
                searchDepth: 'advanced',
                maxResults: 5,
            });

            if (searchResult && searchResult.results) {
                searchContext = searchResult.results.map((r: any) => `Title: ${r.title}\nContent: ${r.content}\nSource: ${r.url}`).join("\n\n");
            }
        } catch (err) {
            console.error("Tavily Search Error:", err);
            // Continue without context if search fails
        }

        if (!searchContext || searchContext.length < 100) {
            console.log('⚠️ No specific news found, falling back to general evergreen topics context.');
            searchContext = "Pas d'actualité brûlante détectée. Utiliser les connaissances générales sur le marché immobilier gabonais.";
        }

        // 3. Check Consistency (History)
        const { data: lastPosts } = await supabaseAdmin
            .from('posts')
            .select('title')
            .order('created_at', { ascending: false })
            .limit(5);

        const historyTitles = lastPosts ? lastPosts.map(p => p.title).join(", ") : "Aucun article récent.";

        // 4. Brainstorm & Write (GPT-4o)
        // Rotating categories based on day to ensure variety (only used if no custom topic)
        const categories = [
            { name: "Actualités immobilières", focus: "Nouvelles du marché, projets en cours, annonces officielles" },
            { name: "Guide acheteur", focus: "Conseils pratiques pour acheter une maison ou un terrain au Gabon" },
            { name: "Investissement locatif", focus: "Rendement locatif, stratégies d'investissement, rentabilité" },
            { name: "Quartiers de Libreville", focus: "Focus sur UN quartier spécifique (histoire, prix, avantages)" },
            { name: "Législation foncière", focus: "Droits de propriété, procédures administratives, titres fonciers" },
            { name: "Décoration et rénovation", focus: "Tendances déco, rénovation, valorisation immobilière" },
            { name: "Marché de la location", focus: "Conseils locataires, loyers, baux, droits et devoirs" }
        ];
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const todayCategory = categories[dayOfYear % categories.length];

        // Use custom topic if provided, otherwise use rotating category
        const articleTopic = customTopic || todayCategory.name;
        const articleFocus = customTopic
            ? `Rédige un article complet et informatif sur : "${customTopic}" dans le contexte de l'immobilier au Gabon`
            : todayCategory.focus;

        console.log(`📚 Article topic: ${articleTopic}`);
        console.log('🧠 Generating content with GPT-5-mini...');
        const completion = await openai.chat.completions.create({
            model: "gpt-5-mini",
            messages: [
                {
                    role: "system",
                    content: `Tu es un expert journaliste immobilier au Gabon et SPÉCIALISTE SEO pour le blog "GMS Immo".
          Ta mission : Rédiger un article UNIQUE sur le SUJET : "${articleTopic}"
          Focus : ${articleFocus}
          Date : ${today}
          
          ⚠️ RÈGLE CRITIQUE DE NON-RÉPÉTITION :
          - Ces articles ont DÉJÀ été publiés : [${historyTitles}]
          - Tu DOIS choisir un angle COMPLÈTEMENT DIFFÉRENT
          - NE RÉUTILISE PAS les mêmes quartiers ou thèmes que les articles précédents
          - Sois CRÉATIF et ORIGINAL dans ton approche
          
          EXIGENCES SEO :
          - Mots-clés : "immobilier Gabon", "immobilier Libreville", "${articleTopic.toLowerCase()} Gabon"
          - Titre accrocheur et UNIQUE (pas de formule générique)
          - Sous-titres <h2> variés et spécifiques
          - Utiliser <strong> pour les termes importants
          
          EXIGENCES DE FORMAT :
          - 3500 à 6000 caractères (HTML inclus)
          - Structure : intro (2 <p>), 3-4 sections <h2>, listes <ul><li>, conclusion GMS
          - HTML propre uniquement (<h2>, <p>, <ul>, <li>, <strong>). PAS de markdown.
          
          ${searchContext ? `Contexte d'actualité et recherches web :\n${searchContext}` : 'Pas d\'actualité spécifique - base-toi sur tes connaissances du marché gabonais.'}`
                },
                {
                    role: "user",
                    content: `Génère un article ORIGINAL sur "${articleTopic}" au format JSON : { title, slug, content_html, excerpt, seo_keywords, image_prompt, category }. 
                    
IMPORTANT: 
- Le titre DOIT être UNIQUE et différent de : [${historyTitles}]
- content_html DOIT faire 3500-6000 caractères
- seo_keywords = tableau de 5-8 mots-clés
- category = "${customTopic ? 'Thème personnalisé' : todayCategory.name}"`
                }
            ],
            response_format: { type: "json_object" }
        });

        const aiResponse = JSON.parse(completion.choices[0].message.content || "{}");
        const { title, slug, content_html, excerpt, seo_keywords, image_prompt, category } = aiResponse;

        console.log(`📝 Generated Title: ${title}`);

        // 5. Generate Image (WaveSpeed SeaDream 4.5)
        console.log(`🎨 Generating image with WaveSpeed SeaDream 4.5...`);
        console.log(`   Prompt: ${image_prompt.substring(0, 100)}...`);

        let imageUrl = null;

        try {
            // Submit the image generation task
            const submitResponse = await fetch('https://api.wavespeed.ai/api/v3/bytedance/seedream-v4.5', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.WAVESPEED_API_KEY}`
                },
                body: JSON.stringify({
                    enable_base64_output: false,
                    enable_sync_mode: false,
                    prompt: `Realistic professional photo, journalistic or architectural style. ${image_prompt}. Context: Gabon, Real Estate, Africa. No text on image.`,
                    size: "2048*2048"
                })
            });

            if (!submitResponse.ok) {
                const errorText = await submitResponse.text();
                console.error(`❌ WaveSpeed API Error: ${submitResponse.status} ${submitResponse.statusText}`, errorText);
            } else {
                const submitData = await submitResponse.json();
                console.log('   WaveSpeed Task submitted:', submitData);

                if (submitData.data?.id) {
                    // ... existing polling logic will follow if I match the range correctly
                    const requestId = submitData.data.id;
                    // Re-include the polling logic here to be safe and ensure the block is complete

                    // Poll for result (max 60 seconds, check every 3 seconds)
                    for (let i = 0; i < 20; i++) {
                        await new Promise(resolve => setTimeout(resolve, 3000));

                        const resultResponse = await fetch(`https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.WAVESPEED_API_KEY}`
                            }
                        });

                        const resultData = await resultResponse.json();

                        if (resultData.data?.status === 'completed' && resultData.data?.outputs?.[0]) {
                            imageUrl = resultData.data.outputs[0];
                            console.log('   ✅ Image generated:', imageUrl.substring(0, 80) + '...');
                            break;
                        } else if (resultData.data?.status === 'failed') {
                            console.error('   ❌ Image generation failed:', resultData);
                            break;
                        }
                        console.log(`   ⏳ Waiting for image... (${i + 1}/20)`);
                    }
                } else {
                    console.error('   ❌ No Task ID received from WaveSpeed:', submitData);
                }
            }

        } catch (err) {
            console.error('WaveSpeed Error:', err);
        }

        let finalImagePath = null;

        if (imageUrl) {
            // 6. Upload to Supabase Storage
            console.log('💾 Check/Create bucket...');

            // Ensure bucket exists
            const { data: buckets } = await supabaseAdmin.storage.listBuckets();
            const bucketExists = buckets?.find(b => b.name === 'blog-images');

            if (!bucketExists) {
                console.log('🚧 Bucket not found, creating "blog-images"...');
                await supabaseAdmin.storage.createBucket('blog-images', { public: true });
            }

            console.log('💾 Uploading image to Supabase...');
            const imageResponseBlob = await fetch(imageUrl);
            const arrayBuffer = await imageResponseBlob.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer); // Convert to Node.js Buffer
            const filename = `blog-auto-${Date.now()}.png`;

            const { data: uploadData, error: uploadError } = await supabaseAdmin
                .storage
                .from('blog-images')
                .upload(filename, imageBuffer, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload Error Details:', JSON.stringify(uploadError, null, 2));
                // Fallback to null or external URL if failing
            } else {
                // Get Public URL
                const { data: { publicUrl } } = supabaseAdmin
                    .storage
                    .from('blog-images')
                    .getPublicUrl(filename);
                finalImagePath = publicUrl;
            }
        }

        // 7. Save to Database
        console.log('✅ Saving post to database...');
        const { error: dbError } = await supabaseAdmin.from('posts').insert({
            title,
            slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            content: content_html, // We could append tags here if really needed
            excerpt,
            cover_image: finalImagePath || imageUrl, // Correct column name
            author: 'GMS Assistant', // Correct column name (text)
            published: true,
            // Removed non-existent columns: tags, category
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        if (dbError) {
            console.error('DB Insert Error:', dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        // Update last_run_at if it was an automated run
        if (!customTopic && !isManual) {
            console.log('🕒 Updating last_run_at in settings...');
            await supabaseAdmin.from('blog_settings')
                .update({ last_run_at: new Date().toISOString() })
                .eq('id', 1);
        }

        return NextResponse.json({ success: true, title, image: finalImagePath });

    } catch (error: any) {
        console.error('Global Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
