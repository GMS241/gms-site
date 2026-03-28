# 🚀 Script de Déploiement GMS - Neo-Nexus & IA
$IP = "130.185.118.198"
$DEST = "root@${IP}:/root/gms-site"

Write-Host "--- Début du transfert des fichiers vers le VPS GMS ($IP) ---" -ForegroundColor Cyan

# Liste des fichiers à transférer
# Note: Vous devrez saisir le mot de passe (28o0Yf2a50Vw9la) si demandé.

# 0. Préparation VPS (Renommage routes)
ssh root@${IP} "mkdir -p '/root/gms-site/app/(public)/properties/[slug]' && rm -rf '/root/gms-site/app/(public)/properties/[id]'"

# 1. Pages et Layouts
scp "app/(public)/page.tsx" "$DEST/app/(public)/page.tsx"
scp "app/(public)/properties/page.tsx" "$DEST/app/(public)/properties/page.tsx"
scp "app/(public)/properties/[slug]/page.tsx" "$DEST/app/(public)/properties/[slug]/page.tsx"
scp "app/admin/blog/page.tsx" "$DEST/app/admin/blog/page.tsx"
scp "app/admin/layout.tsx" "$DEST/app/admin/layout.tsx"
scp "app/(public)/contact/page.tsx" "$DEST/app/(public)/contact/page.tsx"
scp "app/sitemap.ts" "$DEST/app/sitemap.ts"

# 2. Composants
scp "components/admin/PropertyForm.tsx" "$DEST/components/admin/PropertyForm.tsx"
scp "components/features/PropertyCard.tsx" "$DEST/components/features/PropertyCard.tsx"
scp "components/features/Pagination.tsx" "$DEST/components/features/Pagination.tsx"
scp "components/features/ImageGallery.tsx" "$DEST/components/features/ImageGallery.tsx"
scp "components/features/LatestArticles.tsx" "$DEST/components/features/LatestArticles.tsx"
scp "components/features/ContactCTA.tsx" "$DEST/components/features/ContactCTA.tsx"
scp "components/features/AppointmentForm.tsx" "$DEST/components/features/AppointmentForm.tsx"
scp "components/ui/RevealOnScroll.tsx" "$DEST/components/ui/RevealOnScroll.tsx"
scp "components/layout/Header.tsx" "$DEST/components/layout/Header.tsx"
scp "components/ChatWidget.tsx" "$DEST/components/ChatWidget.tsx"

# 3. API et Logique
scp "app/api/ai/enhance-description/route.ts" "$DEST/app/api/ai/enhance-description/route.ts"
scp "app/api/cron/generate-daily-post/route.ts" "$DEST/app/api/cron/generate-daily-post/route.ts"
scp "lib/properties.ts" "$DEST/lib/properties.ts"
scp "types/index.ts" "$DEST/types/index.ts"
scp "next.config.ts" "$DEST/next.config.ts"

# 4. Vidéo et Assets Neo-Nexus
Write-Host "Transfert de la vidéo Neo-Nexus et des patterns..." -ForegroundColor Yellow
scp "video-app/out.mp4" "$DEST/video-app/out.mp4"
scp "public/grid-pattern.svg" "$DEST/public/grid-pattern.svg"

Write-Host "--- Transfert terminé ! ---" -ForegroundColor Green
Write-Host "Connectez-vous maintenant au VPS pour reconstruire :" -ForegroundColor White
Write-Host "ssh root@$IP" -ForegroundColor Yellow
Write-Host "cd /root/gms-site" -ForegroundColor Yellow
Write-Host "docker compose up -d --build" -ForegroundColor Yellow
