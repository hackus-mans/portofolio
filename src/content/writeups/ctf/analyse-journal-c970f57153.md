---
title: "DÉMO — Analyse d'un journal système"
summary: "Write-up fictif de forensique : identifier des événements pertinents dans un petit journal de connexion synthétique"
publishedAt: "2026-10-26"
tags: ["demonstration", "forensics", "linux", "logs"]
status: "published"
platform: "CTF"
section: "Challenges"
category: "Forensics"
difficulty: "Facile"
os: "Linux"
service: ""
tools: ["grep", "awk"]
context: "CTF"
competitionId: "demo-arena-2026"
competitionName: "DEMO-ARENA-2026"
challengeCategory: "Forensics"
activity: "Compétition CTF"
challengePoints: "200"
flagFound: "simulation"
---

# Analyse d'un journal système — démonstration

> **Compétition fictive DEMO ARENA 2026.** Ce write-up utilise des lignes de journal inventées et ne rapporte aucun incident réel.

## 1. Contexte

Un analyste reçoit trois événements synthétiques correspondant à un service de connexion. Le but est d'identifier les erreurs d'authentification et de formuler une observation prudente, sans conclure automatiquement à une compromission.

## 2. Données de test

```text
2026-10-26T10:00:00Z demo-host auth: login failed for trainee
2026-10-26T10:00:07Z demo-host auth: login failed for trainee
2026-10-26T10:00:22Z demo-host auth: login succeeded for trainee
```

Ces événements peuvent être enregistrés dans un fichier local de laboratoire nommé `exemple.log`.

## 3. Tri et inspection

```bash
grep "login failed" exemple.log
```

Ce filtre retourne les deux premières lignes. Il ne permet pas, à lui seul, de déterminer si les tentatives ont été faites par une personne autorisée.

Pour compter le nombre de lignes correspondantes :

```bash
grep -c "login failed" exemple.log
```

**Résultat attendu :** deux échecs d'authentification.

## 4. Interprétation

L'unique fait démontré est la présence de deux échecs suivis d'une réussite dans un journal synthétique. En investigation réelle, il faudrait corréler l'identité, l'adresse source, la chronologie et les événements complémentaires avant d'émettre une hypothèse solide.

## 5. Enseignement

La forensique exige de distinguer les **observations démontrées** des **interprétations**. Cette page sert à tester une seconde compétition, dont la fiche est automatiquement créée à partir de son dossier Obsidian.
