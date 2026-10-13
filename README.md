# Portfolio vierge

Site public : https://hackus-mans.github.io/portofolio/

Le site a été remis à zéro. Aucun ancien projet, résultat, certification, photo ou article ne figure dans cette version. Tu peux désormais ajouter ton contenu toi-même, directement depuis GitHub.

## Modifier ton site sans coder

1. Ouvre ce fichier : https://github.com/hackus-mans/portofolio/blob/main/src/data/contenu.json
2. Clique sur le crayon (« Edit this file »).
3. Modifie les champs du fichier :
   - **titre** : le titre du site ;
   - **sousTitre** : la phrase sous le titre ;
   - **presentation** : ta description personnelle ;
   - **projets** : une liste de projets ;
   - **liens** : tes profils et autres liens.
4. Clique sur **Commit changes**, en choisissant la branche main.
5. Attends que « Deploy Astro portfolio » passe au vert dans GitHub Actions. La mise à jour apparaîtra sur ton site.

### Ajouter un projet

Chaque projet de la liste projets doit avoir ces propriétés :
- **titre** : le nom du projet ;
- **description** : ce que tu as fait ;
- **url** : le lien du projet ;
- **technologies** : un tableau de noms de technologies.

Un lien doit avoir deux propriétés : **nom** et **url**.

Tu peux laisser projets et liens à [] aussi longtemps que tu veux : le site ne montrera pas de cartes vides.

## Modifier la présentation

- Contenu : **src/data/contenu.json**
- Page : **src/pages/index.astro**
- Couleurs et styles : **src/styles/site.css**

Depuis ton ordinateur : git clone https://github.com/hackus-mans/portofolio.git, puis cd portofolio, npm ci, npm run dev.

## Sauvegarde avant la remise à zéro

Une copie complète est conservée sur la branche :
https://github.com/hackus-mans/portofolio/tree/backup/portfolio-before-reset-2026-10-13

L'historique Git n'a pas été effacé. Tout peut être récupéré plus tard si tu changes d'avis.
