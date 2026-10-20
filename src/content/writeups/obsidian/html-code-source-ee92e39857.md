---
title: "HTML - Code source"
summary: "Pas de demande connexion pas même de demande d'inscription Juste une demande : Le mot de passe (password)"
publishedAt: "2026-07-10"
tags: ["Sécurité Web"]
status: "published"
platform: "Root-Me"
section: "Challenges"
category: "Sécurité Web"
difficulty: "Facile"
os: ""
service: ""
---

# 1. Objectif

>Dans cet challenge , il était question d'exploité le code source html du site dans le but de retrouver certaines informations sensibles.


# 2.  Connexion au site et les premières analyses

dès lors que nous arrivons sur le site web , nous voyons un champs qui nous demande d'entrer notre mot de passe

![Pasted image 20260710004526.png](/portofolio/images/writeups/obsidian/html-code-source-ee92e39857/pasted-image-20260710004526-09f6a4157b.png)

* Pas de demande connexion
* pas même de demande d'inscription
* Juste une demande :<font color="#ff0000"> Le mot de passe  (password)</font>

Mais une question se pose : De quel mot de passe s'agit t'il si nous ne nous somme pas inscrit sur cet site ou que nous n'avions reçut aucun identifiant concernant cet site .


Eh bien cela nous amène a nos premières analyses

## Analysé le code source de la page

dès qu'un attaquant (hackeur) arrive sur un site web , le premier reflexe est en faite d'analysé le code source de la page avant même de faire sortir ses outils de travail.
Cet petit geste apparemment insignifiant peut révéler assez d'informations sensible. ça peut êtres des clé API , des chemins de répertoires (qui n'étais pas censé être découvert par l'utilisateur final), des mots de passe de test .

Si nous revenons a notre cas , si nous essayons de consulté le code source de notre site , nous avons ceci :

![Capture d'écran 2026-07-10 005654.png](/portofolio/images/writeups/obsidian/html-code-source-ee92e39857/capture-d-ecran-2026-07-10-005654-7f7797094b.png)

Si ont analyse très bien , ont peut voir que le mot de passe qu'on ne demandais étais en faite laissé par le développeur dans le code source.


Donc notre mot de passe demandé était ça en faite 

![Pasted image 20260710010308.png](/portofolio/images/writeups/obsidian/html-code-source-ee92e39857/pasted-image-20260710010308-987febc727.png)


# 3. Remédiation / Bonnes pratiques

Dans notre cas présent, nous somme dans un environnement contrôlé. Mais si nous essayons d'imaginé un seul instant ce qui pouvais y arrivé si nous étions en environnement réel , cela peut en faite causé d'énormes dégât

* Donc il est très important pour les développeur d'évité de laissé  certaines informations sensibles (pouvant nuire a leurs site web)  dans les commentaires de leurs codes
* utilisé des outils tels que GitLeaks, TruffleHog, GitGuardian, Detect Secrets (Yelp) pour détecté des information sensibles oublié dans le code avant de le mettre a disposition du public
