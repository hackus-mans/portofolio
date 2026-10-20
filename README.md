# Portfolio Joseph NAKORE

Site : https://hackus-mans.github.io/portofolio/

## Principe

La présentation et les pages du portfolio sont conservées. Les catégories **Writeups**, **Labs**, **Notes** et leur agrégateur **Journal** démarrent sans publication d'exemple. Le propriétaire y ajoute progressivement ses vrais contenus, en autonomie.

## Write-ups automatiques depuis Obsidian

La galerie `/writeups/` affiche les notes publiées par synchronisation sécurisée du dépôt privé `hackus-mans/obsidan.note` (dossier `Pratique`). Le convertisseur s'exécute dans GitHub Actions du dépôt privé : le navigateur public n'accède jamais aux notes privées. La première série de notes historiques reste exclue jusqu'à revue de sécurité. Les nouvelles notes sont éligibles automatiquement après le push Obsidian Git, sauf si `publish: false` est défini ; un contrôle de données sensibles et une compilation Astro doivent réussir avant le transfert. La documentation de configuration et de revue est dans `docs/WRITEUPS-SYNC.md` du dépôt privé.

## Publier un article depuis GitHub

1. Ouvrir [Publier dans mon journal](https://github.com/hackus-mans/portofolio/actions/workflows/publish-content.yml).
2. Cliquer sur **Run workflow** en restant sur la branche **main**.
3. Choisir `writeups`, `labs` ou `notes` puis renseigner le titre, résumé, texte et tags.
4. Valider : l'article apparaîtra automatiquement dans sa rubrique et dans le Journal après le déploiement.

Pour écrire un article long, utiliser l'éditeur de fichiers GitHub. Les répertoires sont :

- `src/content/writeups/` — comptes rendus de challenges autorisés ;
- `src/content/labs/` — laboratoires ;
- `src/content/notes/` — prises de notes.

Les fichiers `.gitkeep` gardent ces dossiers présents tant qu'ils sont vides. Voir `docs/PUBLICATION.md` pour les modèles et champs requis.

## Autres éléments du portfolio

Les pages d'accueil, projets, CTF, certifications, parcours, contact et le design existant ont été conservés. Pour les modifier toi-même :

- `src/config.ts` : identité, compétences et projets ;
- `src/data/caseStudies.ts` : détails de projets ;
- `src/pages/index.astro` : page d'accueil ;
- `src/styles/editorial.css` : style actuel.

Pour développer localement : `npm ci`, `npm run dev`, `npm run build`.

## Sauvegarde

Les anciens fichiers, y compris les trois exemples retirés, sont récupérables dans [backup/portfolio-before-reset-2026-10-13](https://github.com/hackus-mans/portofolio/tree/backup/portfolio-before-reset-2026-10-13). Aucune réécriture de l'historique Git n'a été effectuée.
