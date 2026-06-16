# isarauto.com — déploiement GitHub Pages

Site statique : aucun build nécessaire.

## Mettre en ligne (gratuit)

1. Créez un compte sur https://github.com (gratuit).
2. Cliquez sur **New repository** :
   - Nom du repo : `isarauto` (ou ce que vous voulez)
   - Visibilité : **Public** (obligatoire pour Pages gratuit)
3. Sur la page du repo vide, cliquez **uploading an existing file**,
   puis glissez-déposez TOUT le contenu de ce dossier
   (`index.html`, `styles.css`, les dossiers `cars/` et `uploads/`, etc.).
   Cliquez **Commit changes**.
4. Allez dans **Settings → Pages** :
   - Source : **Deploy from a branch**
   - Branch : `main` / dossier `/ (root)` → **Save**
5. Après 1–2 minutes, le site est en ligne sur :
   `https://VOTRE-NOM.github.io/isarauto/`

## Domaine personnalisé (isarauto.com)

Dans **Settings → Pages → Custom domain**, entrez `isarauto.com`,
puis chez votre registrar ajoutez :
- un enregistrement `CNAME` : `www` → `VOTRE-NOM.github.io`
- 4 enregistrements `A` pour l'apex : 185.199.108.153, 185.199.109.153,
  185.199.110.153, 185.199.111.153

Cochez ensuite **Enforce HTTPS**.
