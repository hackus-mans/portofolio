# FIELD ATLAS — Direction créative V4

## Objectif
Un portfolio vécu comme un observatoire de cybersécurité : une carte des domaines de compétences reliée à cinq études de cas réelles (plusieurs encore expérimentales). Il privilégie un objet interactif utilisable à une succession de cartes marketing.

## Direction ECC
- **Purpose:** permettre à un recruteur de comprendre le profil en 30 secondes, et à un professionnel d'inspecter la méthode.
- **Audience:** recrutement, communauté offensive/défensive, mentors académiques et entreprises.
- **Tone:** expérimental, typographique, scientifique, précis.
- **Memorable idea:** graphe orbital original reliant attaque, signaux et défense, puis explorateur qui active un dossier et relie à son étude de cas.
- **Constraints:** Astro + GitHub Pages, statique, mobile, navigation clavier, aucun résultat de sécurité fictif présenté comme réel.

## Risques et état
- Les constellations sont **conceptuelles**, pas de la télémétrie réseau réellement collectée.
- L'explorateur ne lance pas de commandes et n'attaque aucun service.
- Les projets utilisent les données de \`src/config.ts\`, leurs pages détaillées restent accessibles.
- Aucun chiffre de détection/ROI n'est inventé.
- Cette branche est une **proposition non déployée** ; valider le rendu visuel et le parcours mobile avant de fusionner.

## Qualité attendue
- \`npm ci && npm run build\`
- Vérification de l'absence de régression des anciennes routes (via \`scripts/verify-dist.mjs\`)
- Vérification visuelle à 1440px, 768px, 390px, 375px
- Contrôle des interactions souris et clavier, lien vers dossier correspondant, focus, contraste et reduced-motion.
- Pas de fusion sans validation éditoriale.
