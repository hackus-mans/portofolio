# Joseph NAKORE — Portfolio cybersécurité

**Site :** https://hackus-mans.github.io/portofolio/

Une constellation interactive pour explorer mes projets, et un journal pour documenter mes apprentissages. Astro génère un site statique ; le contenu est conservé dans Git, sans base de données à administrer.

## Publier au quotidien, depuis GitHub

1. Ouvrir [Publier dans mon journal](https://github.com/hackus-mans/portofolio/actions/workflows/publish-content.yml).
2. Cliquer **Run workflow**, conserver la branche **main**.
3. Choisir `notes`, `labs` ou `writeups`, puis remplir le titre, le résumé, le texte Markdown et les sujets.
4. Cliquer **Run workflow** et attendre la réussite de la publication et du déploiement.

Le contenu apparaît automatiquement dans sa rubrique, dans le **Journal**, et parmi les trois publications les plus récentes sur l’accueil. Le compteur de publications se recalcule. Il n’y a pas de fichier d’accueil à modifier.

**Pour un long texte :** créer un fichier `.md` dans `src/content/notes/`, `src/content/labs/` ou `src/content/writeups/` avec l’éditeur GitHub, puis le committer sur `main`. Le champ texte du formulaire Actions est un champ chaîne ; pour conserver confortablement les paragraphes, préférer l’éditeur de fichiers. Voir [le guide et les modèles](docs/PUBLICATION.md).

## Publier depuis son ordinateur

```bash
npm ci
npm run new -- notes "Comprendre les permissions Linux" "Ce que le bit setgid change sur un dossier."
npm run dev
```

`npm run new` crée un brouillon daté avec un plan à compléter et indique son chemin. Remplacer `status: "draft"` par `status: "published"` quand le contenu est prêt, puis committer et pousser sur `main`.

```bash
npm run build
node scripts/verify-dist.mjs
node --test scripts/new-entry.test.mjs
```

## Où modifier quoi ?

| Contenu | Fichier ou dossier |
| --- | --- |
| Notes, labs, writeups | `src/content/` |
| Présentation, compétences, liste des projets | `src/config.ts` |
| Études de cas détaillées | `src/data/caseStudies.ts` |
| Relations de la constellation et scénarios | `src/data/commandData.ts` |
| Apparence de l’accueil | `src/styles/command.css` |

Les brouillons sont absents du **site**, mais leurs fichiers restent visibles dans ce dépôt public. Ne jamais y écrire de secrets ou de données confidentielles.

La carte et les scénarios sont pédagogiques : aucun flux SOC réel ni commande exécutée sur une cible. Les positions sont illustratives.
