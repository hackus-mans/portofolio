# Joseph NAKORE — Cybersecurity Engineering portfolio

**Site officiel :** https://hackus-mans.github.io/portofolio/

Portfolio Astro statique construit comme une archive professionnelle et technique : travaux de sécurité offensive/défensive, architecture de projets, méthodologies, labs, articles, IA et automatisation.

## Structure

- \`/\` — présentation, sélection de projets, compétences et laboratoire simulé
- \`/about/\` — parcours et approche
- \`/projects/\` — cinq dossiers de projets documentés
- \`/writeups/\` — writeups Markdown
- \`/labs/\` — labs Markdown
- \`/notes/\` — documentation technique Markdown
- \`/roadmap/\` — intégration de Lumina Academy

Le code des études de cas se trouve dans \`src/data/caseStudies.ts\`. Les données synthétiques du portfolio se trouvent dans \`src/config.ts\`.

## Démarrage local

\`\`\`bash
npm ci
npm run dev
npm run build
node scripts/verify-dist.mjs
\`\`\`

## Publier du contenu

Le site utilise Astro Content Collections. Pour publier un nouveau writeup :

\`src/content/writeups/mon-article.md\`

\`\`\`yaml
---
title: "Titre"
summary: "Résumé court"
publishedAt: 2026-10-12
tags: ["Web", "Linux"]
platform: "HTB"
difficulty: "Fondation"
featured: false
status: "published"
---
\`\`\`

Les labs se placent dans \`src/content/labs/\` avec \`domain\` et \`state\`. Les notes se placent dans \`src/content/notes/\` avec \`topic\`.

Les collections créent automatiquement les pages individuelles et alimentent les index du site. Les archives disposent d'une recherche locale sans backend.

## Navigation rapide

Cliquer sur **Explorer** ou utiliser \`Ctrl/⌘ + K\` (ou \`/\` hors d'un champ texte) pour naviguer vers les projets et ressources.

## Démonstrations

La zone Interactive Field Lab est une **simulation uniquement dans le navigateur**. Elle ne lance aucune commande et ne touche aucune cible. Les conclusions sur les projets sont présentées avec leurs limites et leur niveau réel de preuve.

## Architecture et maintenance

- Astro et TypeScript
- CSS partagé dans \`src/styles/global.css\`
- Layout commun : \`src/layouts/BaseLayout.astro\`
- Navigation et pied de page communs : \`src/components/Nav.astro\` et \`src/components/Footer.astro\`
- Publications gérées avec Content Collections dans \`src/content/\`
- Publication GitHub Pages via \`.github/workflows/deploy-astro.yml\`
- Vérification des routes et des ressources via \`scripts/verify-dist.mjs\`

Voir \`docs/REBUILD.md\` pour la philosophie, la migration et les éléments à compléter.
