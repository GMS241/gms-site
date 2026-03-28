# 📘 Guide d'Administration du Site GMS (Gabon Management Services)

Ce document est destiné à l'administrateur du site web GMS. Il détaille les procédures pour gérer le contenu, les biens immobiliers, les rendez-vous et les communications via le panneau d'administration sécurisé.

---

## 🔐 1. Accès à l'Administration

**URL de connexion :** `https://gms-gabon.com/admin/login` (ou le domaine définitif)

1.  Rendez-vous sur la page de connexion.
2.  Entrez votre **adresse email** administrateur.
3.  Entrez votre **mot de passe** sécurisé.
4.  Cliquez sur **"Se connecter"**.

> **Note :** L'interface a été conçue pour être sécurisée et facile à utiliser sur ordinateur et tablette.

---

## 🏠 2. Gestion des Biens Immobiliers

Cette section vous permet d'ajouter, de modifier ou de retirer des biens du site visible par les clients.

### ➤ Ajouter un nouveau bien
1.  Cliquez sur l'onglet **"Ajouter un bien"** ou **"Biens" > "Nouveau"**.
2.  Remplissez le formulaire détaillé :
    *   **Titre :** Nom du bien (ex: "Villa Luxueuse bord de mer").
    *   **Prix :** Montant en FCFA (chiffres uniquement).
    *   **Localisation :** Quartier, Ville.
    *   **Type :** Vente ou Location.
    *   **Description :** Texte attractif décrivant le bien.
    *   **Caractéristiques :** Nombre de chambres, salles de bain, surface (m²).
    *   **Images :** Téléchargez des photos de haute qualité (la première sera l'image principale).
3.  **Informations Internes (Non visibles sur le site)** :
    *   *Nom du propriétaire* (ex: "M. Okili").
    *   *Téléphone propriétaire*.
    *   Ces infos servent à votre suivi interne uniquement.
4.  Cliquez sur **"Publier le bien"**.
    *   Une **Référence unique** (ex: `GMS-0042`) sera générée automatiquement.

### ➤ Gérer les biens existants
*   Allez dans l'onglet **"Biens"**.
*   Vous pouvez **Rechercher** un bien par son titre ou sa référence.
*   **Modifier :** Pour changer le prix, les photos ou le statut (ex: passer de "Disponible" à "Vendu").
*   **Supprimer :** Pour retirer définitivement un bien du site.

---

## 📅 3. Gestion des Rendez-vous

Lorsque qu'un client demande une visite via le site :

1.  Vous recevez une notification dans l'onglet **"Rendez-vous"**.
2.  Le tableau affiche :
    *   Nom du client & Contact (Tél/Email).
    *   Bien concerné (Référence).
    *   Date souhaitée.
3.  **Actions possibles :**
    *   **Confirmer :** Valide le RDV (le statut passe au vert).
    *   **Supprimer 🗑️ :** Si c'est un doublon ou une erreur (avec confirmation de sécurité).
    *   **Archiver :** Pour conserver l'historique sans encombrer la liste principale.

> **📲 Important :** Lorsqu'un client valide sa demande sur le site, une conversation **WhatsApp** s'ouvre automatiquement sur son téléphone avec un message pré-rempli contenant toutes les infos, prêt à être envoyé au numéro GMS (+241 66 33 65 29).

---

## 💬 4. Messagerie & Contacts

L'onglet **"Messagerie"** centralise tous les messages envoyés via le formulaire de contact général.

*   Les nouveaux messages apparaissent avec un badge "Nouveau".
*   Vous pouvez voir le détail de la demande.
*   **Actions :**
    *   **Marquer comme lu :** Pour le suivi.
    *   **Supprimer 🗑️ :** Pour effacer le message définitivement.
    *   Cliquer sur le numéro ou l'email lance directement l'appel ou votre application mail.

---

## 📰 5. Gestion du Blog (Actualités)

Pour améliorer le référencement (SEO) et informer vos clients.

### ➤ Publier un article
1.  Allez dans **"Blog"** > **"Nouvel article"**.
2.  **Titre :** Soyez accrocheur (ex: "Comment bien investir à Libreville en 2026").
3.  **Image de couverture :** Essentielle pour l'esthétique du site.
    *   *Note : Les visages sont automatiquement centrés pour ne pas être coupés.*
4.  **Contenu :** Écrivez votre article. Vous pouvez mettre du gras, des titres, etc.
5.  **Extrait :** Une ou deux phrases d'accroche pour la liste des articles.
6.  Cliquez sur **"Publier"**.

---

## 📥 6. Demandes (Vendre / Gérer)

Deux onglets spécifiques reçoivent les formulaires dédiés :
*   **Ventes :** Propriétaires souhaitant vendre leur bien via GMS.
*   **Gestion :** Propriétaires cherchant une gestion locative.

Ces demandes contiennent souvent des photos envoyées par le client. Vérifiez-les avant de les contacter.

---

## 🤖 7. Assistant IA & Fonctionnalités Premium

Le site GMS intègre plusieurs outils d'Intelligence Artificielle pour automatiser et améliorer vos opérations.

> **⚠️ IMPORTANT - Fonctionnalités Premium**  
> Toutes les fonctionnalités basées sur l'IA sont **PREMIUM** et nécessitent un **abonnement mensuel** pour couvrir les coûts d'API (OpenAI, Tavily, WaveSpeed) et la gestion technique continue.
>
> **Coût estimé mensuel :** ~50-100 USD/mois (selon l'utilisation)  
> **Inclut :** Maintenance des API, support technique, hébergement des services IA

### 🎯 Fonctionnalités IA Disponibles

#### 7.1 Assistant Virtuel (Chatbot)
Un chatbot intelligent disponible sur toutes les pages publiques du site.

**Capacités :**
- Répond aux questions des visiteurs 24/7
- Recherche automatiquement dans votre catalogue de biens
- Fournit des informations sur vos services
- Garde un historique des conversations

**Accès Admin :**
- Menu **"Assistant IA"** → **"Conversations IA"**
- Consultez toutes les discussions des visiteurs
- Analysez les questions fréquentes pour améliorer vos services

#### 7.2 Rédacteur Intelligent (Descriptions de Biens)
Un outil exclusif pour transformer vos notes en annonces professionnelles.

**Comment l'utiliser :**
1. Allez dans **"Assistant IA"** → Cliquez sur **"✨ Rédacteur Intelligent"**
2. Collez votre brouillon (ex: *"villa 4ch pk8, piscine, 450k, dispo suite"*)
3. L'IA génère instantanément une annonce Premium :
   - Titre accrocheur
   - Description structurée et vendeuse
   - Optimisée pour le référencement (SEO)
   - Format professionnel avec émojis

**Règles de l'IA :**
- N'invente JAMAIS d'informations
- Respecte scrupuleusement vos données brutes
- Ton professionnel et élégant

#### 7.3 Génération Automatique d'Articles de Blog
Le système rédige et publie un article immobilier chaque jour automatiquement.

**Fonctionnement :**
- **Heure programmée :** Vous choisissez (par défaut 08h00)
- **Recherche automatique :** L'IA scanne le web pour trouver des actualités immobilières au Gabon
- **Rédaction :** Génère un article unique de 3500-6000 caractères
- **Image :** Crée une illustration réaliste via IA
- **Publication :** L'article apparaît instantanément sur le site

**Paramétrage :**
- Onglet **"Blog"** → Bouton **"⚙️ Automatisation"**
- **Activer/Désactiver** la génération quotidienne
- **Choisir l'heure** de publication
- **Lancer manuellement** un article à la demande

**Avantages SEO :**
- Contenu frais quotidien améliore votre classement Google
- Articles optimisés avec mots-clés immobiliers gabonais
- Augmente le trafic organique vers votre site

---

## 💳 Gestion de l'Abonnement IA

Pour activer ou renouveler votre abonnement aux services IA :

**Contact :**
- **OKILI INTELLIGENCE**
- Email : support@okili-intelligence.com
- Téléphone : +241 74 00 78 50

**Tarification :** Sur devis selon vos besoins (chatbot seul, rédacteur seul, ou pack complet)

---

## 🆘 Support

En cas de problème technique sur le site (bug d'affichage, problème de connexion), contactez le prestataire technique (**OKILI INTELLIGENCE**) :
*   Site web : [okiliintelligence.com](https://okiliintelligence.com)
*   Email : support@okili-intelligence.com

**Pour les opérations techniques avancées (accès VPS, base de données) :**  
Consultez le document : `ACCES_TECHNIQUE_VPS_SUPABASE.md`

---

*Document mis à jour le 09 Janvier 2026 pour Gabon Management Services.*
