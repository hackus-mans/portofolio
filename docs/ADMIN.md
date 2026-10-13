# NAKORE Studio — guide du portail administrateur

Portail : https://hackus-mans.github.io/portofolio/admin/

## Connexion

Ce site est hébergé sur GitHub Pages, sans serveur privé d'authentification.
Pour publier, utilise un jeton personnel GitHub fine-grained, créé sur https://github.com/settings/personal-access-tokens/new .
Configure Resource owner : hackus-mans, repository access : Only select repositories → portofolio ;
permissions : Contents → Read and write. Choisis une expiration courte, par exemple sept jours.
Colle uniquement ce jeton dans le formulaire de connexion (jamais ton mot de passe GitHub).
Le jeton est gardé en mémoire pendant la session, envoyé directement à l'API GitHub par HTTPS,
non sauvegardé dans localStorage, sessionStorage, cookie ou dans le dépôt.

Attention : l'interface HTML /admin est accessible publiquement ; l'accès en écriture est
protégé par GitHub, pas par une session serveur. Pour une authentification classique et privée,
il faudrait un backend OAuth avec cookies HttpOnly et des vérifications serveur.

## Écrire depuis l'administration

- Writeups, Labs et Notes : titre, résumé, texte Markdown, tags, brouillon/publié.
- Projets : titre, résumé, catégorie, technologies, problème, architecture, résultats et lien.
- CTF : compétition, classement, année et lien de preuve.
- Certifications : organisme, statut obtenu/en préparation, date et lien de vérification.
- Images : PNG, JPEG ou WebP, jusqu'à 1,5 Mo ; code Markdown à copier.

Le bouton Enregistrer crée ou modifie un fichier du dépôt. Ensuite, le déploiement Astro
doit réussir pour que la nouvelle version soit visible sur le site public.
Consulte les déploiements : https://github.com/hackus-mans/portofolio/actions/workflows/deploy-astro.yml

Les brouillons ne sont pas affichés sur les pages publiques, mais les fichiers restent lisibles
dans le dépôt GitHub public. Ne publie jamais de secret, token, flag sensible, identité privée
ou image contenant des informations confidentielles.

## Structure et restrictions de la première version

Les articles vivent dans src/content/writeups, src/content/labs et src/content/notes.
Les projets, compétitions et certifications créés dans le portail sont dans src/data/adminContent.json.
Les cinq projets historiques du portfolio sont conservés dans src/config.ts et src/data/caseStudies.ts ;
ils restent consultables mais doivent encore être modifiés dans le dépôt directement.

Si une protection de branche empêche de committer sur main, GitHub refusera l'opération ;
ce portail ne contourne pas les règles du dépôt.

## Vérification

CI : compilation Astro, analyse des routes, tests Chromium et tests d'API GitHub simulée.
Aucun véritable jeton ou publication de démonstration n'est utilisé pour les tests.
