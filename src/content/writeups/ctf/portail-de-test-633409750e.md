---
title: "DÉMO — Portail de test HTTP"
summary: "Exemple fictif de write-up Web : observer des réponses HTTP et expliquer pourquoi un contrôle d'accès côté client ne suffit pas"
publishedAt: "2026-10-26"
tags: ["demonstration", "web", "http", "controle-acces"]
status: "published"
platform: "CTF"
section: "Challenges"
category: "Sécurité Web"
difficulty: "Facile"
os: "Linux"
service: ""
tools: ["curl", "Navigateur", "Python"]
context: "CTF"
competitionId: "demo-shade-2026"
competitionName: "DEMO SHADE 2026 — Compétition fictive"
challengeCategory: "Web"
activity: "Compétition CTF"
challengePoints: "100"
flagFound: "simulation"
---

# Portail de test HTTP — write-up de démonstration

> **Challenge fictif.** Aucune application réelle n'a été attaquée. Les requêtes et les résultats ci-dessous sont des données illustratives destinées à tester l'affichage SHADE.

## 1. Contexte du challenge

Un service Web d'entraînement affiche un bouton « Administration » uniquement après une validation côté navigateur. Le défi consiste à expliquer pourquoi ce mécanisme n'est pas, à lui seul, un contrôle d'autorisation fiable.

**Objectif pédagogique :** distinguer le rendu de l'interface des décisions de sécurité prises par le serveur.

## 2. Reconnaissance

Dans un environnement de laboratoire fictif, on pourrait examiner les en-têtes d'un service de démonstration :

```bash
curl -i http://127.0.0.1:8080/
```

Exemple de réponse illustrative :

```http
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-store
```

Une réponse HTTP `200` pour la page d'accueil ne démontre aucune vulnérabilité. Elle confirme seulement que la ressource demandée a été servie.

## 3. Hypothèse et démarche

Le bouton d'administration peut être masqué par l'interface sans que les contrôles d'accès soient appliqués sur le serveur. La démarche correcte consiste à vérifier, **sur un environnement explicitement autorisé**, que chaque requête sensible est soumise à une validation d'identité et de rôle côté serveur.

Le scénario de démonstration oppose deux résultats possibles :

| Situation | Comportement attendu |
| --- | --- |
| Utilisateur autorisé | Accès accordé après vérification |
| Utilisateur sans rôle approprié | Accès refusé par le serveur |

## 4. Conclusion

La visibilité d'un bouton n'est pas une mesure de sécurité. La protection réelle repose sur des vérifications serveur, une gestion de session appropriée et des contrôles d'accès testés.

## 5. Enseignement

Toujours distinguer **authentification**, **autorisation** et **présentation de l'interface**. Le présent article sert exclusivement à vérifier le template CTF et la publication croisée avec Write-ups.
