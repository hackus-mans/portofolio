# Refonte intégrale du portfolio — 2026

## Objectif

Reprendre **l'ensemble** du site, et non seulement sa page d'accueil. Le design system s'applique maintenant à toutes les routes : accueil, projets, fiches techniques, writeups, labs, notes, roadmap et page À propos.

## Direction artistique

Identité : **Joseph NAKORE / Security Engineering**

- Fond ivoire \`#f2f2ea\`, surfaces sombres carbone \`#0b0e0c\`, accent volt \`#d5f76b\`
- Typographie éditoriale Space Grotesk, DM Sans et DM Mono avec alternatives système
- Visualisation SVG originale de la chaîne Observer / Analyser / Construire / Défendre
- Grandes compositions typographiques, densité contenue et repères mono
- Variantes de navigation et mise en page mobile
- Respect \`prefers-reduced-motion\`, focus visible et navigation clavier

## Changements structurels

- BaseLayout/Navigation/Footer partagés
- 5 dossiers projets (CyberMind X, HoneyShield, Lumina Academy, MCP Automation et Labs & CTF)
- Détails projets définis dans \`src/data/caseStudies.ts\` : question, architecture, décisions, tests, limites et prochaines étapes
- ArchiveCollection partagé avec recherche locale
- EntryLayout partagé et typographie Markdown
- Palette de commandes \`Ctrl/⌘ + K\` en HTML \`<dialog>\`
- Projet Lumina Academy disponible en iframe et via lien externe
- Conservation de toutes les collections Markdown et de leurs routes
- Suppression des composants anciens non utilisés

## Confiance technique

- Les laboratoires interactifs sont des simulations navigateur.
- Les réalisations non vérifiées sont qualifiées de déclarations, prototypes ou objectifs.
- Ne pas publier de secrets, d'identifiants réels ou de captures non expurgées.
- Les liens externes ouvrent un nouvel onglet lorsque nécessaire.
- Aucun backend nécessaire pour cette version.
- Les performances et WCAG AA requièrent des tests de navigateur supplémentaires avant d'être certifiées.

## Qualité et publication

1. \`npm ci\`
2. \`npm run build\`
3. \`node scripts/verify-dist.mjs\`
4. Vérifier visuellement desktop, mobile et clavier (palette, menu mobile, onglets, recherche).
5. Fusionner la Pull Request seulement une fois les vérifications réalisées.
6. Contrôler GitHub Pages en HTTP et la présence du nouveau design.

## Contenus à enrichir

Le site conserve ses contenus et liens. La prochaine étape éditoriale consistera à ajouter des captures authentiques, des résultats chiffrés sourcés, des démonstrations reproductibles et les attestations publiables.
