# NAKORE Cyber Command Center — guide fonctionnel

## Contrat produit

Portfolio de cybersécurité explorable inspiré d'un SOC. Il montre les projets de Joseph NAKORE, des outils et des scénarios d'apprentissage. Ce n'est ni un SIEM réel, ni un inventaire d'actifs, ni une carte géographique d'incidents.

## Signification des éléments

| Élément | Sens / source | Interaction |
|---|---|---|
| Dossiers publiés | Nombre des projets dans la configuration du site | Bouton d'explication et liens des projets |
| Domaines de pratique | Nombre de domaines de compétences dans la configuration | Bouton d'explication |
| Parcours pédagogiques | Nombre d'exercices de sécurité guidés | Bouton d'explication et signaux de lab |
| Flux SOC connectés | 0 : aucun SIEM ou feed public raccordé | Explication explicite |
| Carte | Topologie conceptuelle non géolocalisée | Clic sur nœud, inspecteur |
| Centre | Vue d'ensemble du portfolio | Présente les projets |
| Nœud bleu projet | Projet existant dans le portfolio | Synchronise la fiche et ouvre son étude de cas |
| Nœud bleu outil | Composant décrit dans une expérimentation | Explique son rôle et ses liens |
| Nœud rouge | Scénario pédagogique simulé | Guide d'investigation |
| Petit nœud | Concept, trace ou artefact à examiner | Explication contextuelle |
| Lien entre nœuds | Relation explicitement documentée en français | Inspecteur des relations |
| Filtres | Tous, projets ou scénarios | Masque les nœuds et les liens hors catégorie |
| Zoom | Agrandissement de la topologie | Plus, moins, remise à 100 % |
| Project Intelligence | Liste des cinq vrais projets | Modifie la fiche et sélectionne le nœud |
| Detection Signals | Cinq exercices pédagogiques | Hypothèse, indices, procédure, mitigations |
| Case Study Overview | Dossier réel sélectionné | Ouvre la fiche projet |
| Recherche | Recherche locale dans les projets et scénarios | Résultats filtrés ; Entrée et Échap |
| Préférences | Options locales d'affichage, sans incidence sur la sécurité | Halo, densité, annotations, contraste |

## Provenance et cohérence

- La configuration des projets et capacités réside dans src/config.ts.
- Le graphe sémantique et les exercices sont définis dans src/data/commandData.ts.
- Les liens sont typés : portfolio, implements, investigates, produces, supports. Chaque relation dispose d'une justification consultable.
- Chaque exercice fournit une hypothèse, des observables, une démarche de validation, des protections recommandées, un objectif d'apprentissage et un lien vers le projet pertinent.
- Brute force SSH est relié à MITRE ATT&CK T1110 ; contrôle d'accès objet à CWE-639 et OWASP API1:2023.
- Une connexion échouée, une anomalie HTTP ou un port ouvert ne doivent jamais être présentés comme une intrusion confirmée.
- La carte du monde est un fond visuel, pas une géolocalisation : les positions des nœuds sont illustratives.
- Ne pas fabriquer de métriques de détection, incidents, utilisateurs, certifications ou rendements.
- Aucun événement de navigation, scénario ou recherche n'est envoyé à un SIEM. Les préférences peuvent être conservées uniquement dans le navigateur, avec fonctionnement sans stockage.

## Qualité

Chaque PR doit faire passer npm ci, npm run build, node scripts/verify-dist.mjs, puis Chromium sur ordinateur et mobile.
Tests des liens, de l'inspecteur, des relations, du filtre, du guide, de la recherche, des préférences et du menu mobile.

## Évolutions

Ajouter des preuves techniques réelles et expurgées, les configurations reproductibles, des captures des labs et des résultats mesurés. Une véritable intégration SOC nécessiterait une infrastructure isolée, un contrôle d'accès, de l'audit et une revue de sécurité ; ne pas la simuler comme un flux en direct.
