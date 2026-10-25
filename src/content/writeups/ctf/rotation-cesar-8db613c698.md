---
title: "DÉMO — Rotation César"
summary: "Exemple fictif de challenge cryptographique avec identification d'une substitution alphabétique et décodage reproductible en Python"
publishedAt: "2026-10-26"
tags: ["demonstration", "cryptographie", "python"]
status: "published"
platform: "CTF"
section: "Challenges"
category: "Cryptographie"
difficulty: "Très facile"
os: "Linux"
service: ""
tools: ["Python"]
context: "CTF"
competitionId: "demo-shade-2026"
competitionName: "DEMO SHADE 2026 — Compétition fictive"
challengeCategory: "Cryptographie"
activity: "Compétition CTF"
challengePoints: "150"
flagFound: "simulation"
---

# Rotation César — challenge de démonstration

> **Exercice fictif de SHADE**, créé uniquement pour tester le classement par catégorie, le rendu des commandes et le retour vers la compétition.

## 1. Énoncé simulé

Un message est fourni sous la forme suivante :

```text
FUNEQR
```

L'objectif consiste à retrouver le mot d'origine en identifiant la transformation appliquée aux lettres. Aucun véritable flag de compétition n'est utilisé.

## 2. Analyse

Le texte ne contient que des lettres de l'alphabet latin, sans caractères spéciaux. Une hypothèse raisonnable est un **chiffrement par décalage de César**, qui remplace chaque lettre par une autre à distance constante dans l'alphabet.

Une rotation de treize positions, également appelée ROT13, possède la propriété suivante : appliquer ROT13 deux fois restitue le texte initial.

## 3. Résolution reproductible

```python
import codecs

message = "FUNEQR"
clair = codecs.decode(message, "rot_13")

print(clair)
```

Sortie attendue :

```text
SHADE
```

Le code n'utilise aucune bibliothèque externe et fonctionne dans une installation Python standard.

## 4. Validation

Le mot décodé est cohérent avec le contexte du laboratoire fictif. Cette observation valide l'hypothèse ROT13 pour cet exemple, sans prouver que tous les messages alphabétiques reposent sur une rotation de César.

## 5. Ce que j'en retiens

Un chiffrement classique comme ROT13 est utile pour l'apprentissage, mais n'offre aucune confidentialité réelle. Il permet surtout d'exercer les étapes **observation → hypothèse → test → vérification**.

**Cette note est une démonstration, pas un résultat de compétition réelle.**
