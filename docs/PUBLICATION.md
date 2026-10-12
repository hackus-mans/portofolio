# Une publication utile, même courte

Le journal regroupe automatiquement les notes, labs et writeups, classés par date de publication décroissante. L’accueil montre les six plus récents. Une égalité de date est départagée par l’identifiant du fichier.

## Routine simple

- **Note** : un concept compris, un piège ou une commande expliquée.
- **Lab** : une expérience avec son contexte, son test et ses résultats.
- **Writeup** : une démarche complète sur un exercice publiable.

Un paragraphe utile suffit. Ne pas inventer un résultat ou une activité pour remplir le journal.

## Depuis le téléphone ou le navigateur

Pour une publication courte : **Actions → Publier dans mon journal → Run workflow → main**. Les cinq champs sont le type, le titre, le résumé, le texte et les sujets séparés par des virgules.

Pour un article avec plusieurs paragraphes, aller dans `src/content/notes/`, cliquer **Add file → Create new file**, choisir un nom comme `permissions-linux.md` et coller le modèle ci-dessous. L’éditeur GitHub conserve les retours à la ligne et permet la prévisualisation Markdown. Le texte de l’article commence après le second `---`.

```markdown
---
title: "Comprendre les permissions Linux"
summary: "Le rôle de lecture, écriture et exécution sur un dossier."
publishedAt: 2026-10-13
tags: ["Linux", "Permissions"]
topic: "Linux"
status: "draft"
---

## Observation

Ce que j’ai réellement observé.

## Hypothèse et test

Ce que je cherche à vérifier et la méthode employée.

## Résultat et interprétation

La sortie obtenue, son explication et les limites du test.

## À retenir

La règle que je peux réutiliser.
```

Remplacer la date par celle de la publication et `draft` par `published` une fois prêt. Pour un **lab**, utiliser le dossier `labs` et remplacer `topic` par `domain: "Linux"` et `state: "active"`. Pour un **writeup**, utiliser `writeups` et remplacer `topic` par `platform: "HTB"` (facultatif).

Les brouillons sont exclus des pages générées ; ils ne sont pas confidentiels dans un dépôt public. Une date future ne programme pas une publication : utiliser `draft` pour un contenu qui n’est pas encore prêt.

## Corriger ou retirer

Ouvrir le fichier concerné, cliquer sur le crayon, corriger puis committer. Ajouter `updatedAt: 2026-10-14` pour une révision, en adaptant la date. Conserver `publishedAt` pour ne pas présenter une ancienne note comme nouvelle.

Pour retirer une publication du site, passer son statut à `draft` et committer. Le fichier demeure dans Git.

## Images

Placer l’image dans `public/images/` et l’insérer ainsi :

```markdown
![Description de la capture](/portofolio/images/ma-capture.webp)
```

Utiliser des images compressées et retirer les informations sensibles des captures avant publication.

## Si la publication échoue

Ouvrir l’exécution rouge dans Actions. Un titre déjà utilisé le même jour n’écrase pas la note précédente : modifier la note existante ou choisir un autre titre. Un champ obligatoire vide ou une catégorie invalide est refusé avant le commit. Les erreurs de compilation empêchent également l’ajout automatique.

Le formulaire demande les permissions GitHub de modification du dépôt et l’activation d’Actions. Le workflow de déploiement est appelé explicitement après le commit : les commits du jeton Actions ne déclenchent pas à eux seuls un nouveau workflow `push`.
