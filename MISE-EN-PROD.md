# TikLive — Mise en production (vrais comptes + tiklive.eu/reseau)

L'application a deux modes :

- **Mode démo** (par défaut) : tout est stocké dans le navigateur, aucun compte réel.
- **Mode cloud** : comptes réels (email + mot de passe), publications, likes,
  abonnements, commentaires et messages privés stockés dans une base de données
  Supabase, partagés entre tous les utilisateurs.

Le mode cloud s'active automatiquement dès que les deux secrets Supabase sont
configurés (étape 2). Voici les 3 étapes à faire une seule fois.

---

## Étape 1 — Créer la base de données (Supabase, gratuit)

1. Va sur <https://supabase.com> → **Start your project** → connecte-toi avec
   GitHub.
2. **New project** : choisis un nom (ex. `tiklive`), un mot de passe de base de
   données (garde-le quelque part), une région (Europe West — Paris ou
   Francfort), plan **Free**.
3. Une fois le projet créé, ouvre **SQL Editor** (menu de gauche) →
   **New query** → colle tout le contenu du fichier
   [`supabase/schema.sql`](supabase/schema.sql) de ce dépôt → **Run**.
   Cela crée les tables (profils, publications, likes, abonnements, messages…),
   les règles de sécurité et le stockage des photos.
4. Recommandé : dans **Authentication → Sign In / Up → Email**, désactive
   **Confirm email**. Sinon chaque nouvel inscrit devra cliquer un lien de
   confirmation reçu par email avant de pouvoir se connecter.
5. Récupère tes deux clés dans **Project Settings → API** :
   - **Project URL** (ex. `https://abcdefgh.supabase.co`)
   - **anon / public key** (une longue chaîne commençant par `eyJ…`)

> La clé « anon » est faite pour être publique : la sécurité est assurée par
> les règles RLS du schéma (chacun ne peut modifier que ses propres données).

## Étape 2 — Brancher le site sur la base

Dans le dépôt GitHub `roidesloutres08/Tiklive-site-` :

1. **Settings → Secrets and variables → Actions → onglet Secrets** →
   **New repository secret** (deux fois) :
   - Nom : `NEXT_PUBLIC_SUPABASE_URL` — Valeur : ta Project URL
   - Nom : `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Valeur : ta clé anon
2. Relance un déploiement : **Actions → Deploy to GitHub Pages → Run workflow**
   (branche `claude/app-showcase-site-G5HIK`).

Dès ce déploiement, le site affiche l'écran « Créer mon compte » et tout est
enregistré en base. 🎉

## Étape 3 — Servir le site sur tiklive.eu/reseau

1. **Chez ton registrar** (là où tu as acheté tiklive.eu), ajoute ces
   enregistrements DNS :

   | Type  | Nom | Valeur              |
   | ----- | --- | ------------------- |
   | A     | @   | `185.199.108.153`   |
   | A     | @   | `185.199.109.153`   |
   | A     | @   | `185.199.110.153`   |
   | A     | @   | `185.199.111.153`   |
   | CNAME | www | `roidesloutres08.github.io` |

2. Dans le dépôt GitHub : **Settings → Pages → Custom domain** → saisis
   `tiklive.eu` → **Save**. Attends la vérification DNS (peut prendre de
   quelques minutes à quelques heures) puis coche **Enforce HTTPS**.
3. **Settings → Secrets and variables → Actions → onglet Variables** →
   **New repository variable** :
   - Nom : `PAGES_CUSTOM_DOMAIN` — Valeur : `tiklive.eu`
4. Relance le workflow **Deploy to GitHub Pages**.

Le site est alors construit pour vivre sous `/reseau` :
**https://tiklive.eu/reseau/** (et `https://tiklive.eu/` y redirige).
Tant que la variable n'est pas définie, le site reste accessible sur
<https://roidesloutres08.github.io/Tiklive-site-/>.

---

## Ce qui est réel en mode cloud

- Comptes : inscription email + mot de passe, connexion, déconnexion.
- Profils : nom, bio, couleur d'avatar modifiables (le nom d'utilisateur est
  fixé à l'inscription).
- Publications : photos téléversées dans le stockage Supabase, vidéos par URL ;
  suppression possible par l'auteur.
- Likes, favoris, abonnements, commentaires : partagés entre tous les
  utilisateurs, comptabilisés en temps réel.
- Messages privés : réels entre comptes inscrits.
- Notifications : générées à partir des vrais likes/commentaires/abonnements
  reçus.

Les créateurs et vidéos de démonstration (maya.dance, leo_gaming…) restent
visibles pour que le site ne paraisse pas vide au lancement ; on peut les
retirer plus tard en vidant `SEED_POSTS`/`SEED_USERS` dans `lib/seed.ts`.
