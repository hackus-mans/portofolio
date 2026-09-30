---
title: "SOC Detection Lab — relier événement, télémétrie et détection"
summary: "Un lab défensif pour observer comment des actions contrôlées deviennent des événements exploitables côté SOC."
publishedAt: 2026-09-30
tags: ["SOC", "Wazuh", "Suricata", "Detection", "Telemetry"]
domain: "SOC / Blue Team"
state: "active"
featured: true
status: "published"
---

Ce lab sert à comprendre la chaîne complète entre une action générée dans un environnement contrôlé et ce qu’un analyste peut réellement observer.

## Objectif

Le scénario général est :

Action → télémétrie → règle/détection → alerte → investigation → conclusion

Je veux éviter de traiter l’alerte comme un objet magique. Chaque alerte doit pouvoir être reliée à une source et à un événement observable.

## Scénarios de validation

Les tests restent simples au début :

- découverte réseau contrôlée ;
- tentatives de connexion sur un service de lab ;
- création ou modification d’un utilisateur ;
- modification d’un fichier surveillé ;
- événements réseau visibles par un IDS.

## Ce que je vérifie

Pour chaque test :

- quelle source produit la donnée ;
- quel champ permet de relier l’événement à l’action ;
- si la règle déclenche réellement ;
- ce qui manque pour investiguer correctement ;
- quelle mitigation ou détection complémentaire serait utile.

Le lab évoluera avec de nouveaux scénarios au fur et à mesure que la stack SOC progresse.
