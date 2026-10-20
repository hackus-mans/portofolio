---
title: "Local file Inclusion"
summary: "Dans cet challenge , nous devons accédé au répertoire admin dans le but de récupéré le flag"
publishedAt: "2026-04-27"
tags: ["Sécurité Web"]
status: "published"
platform: "Root-Me"
section: "Challenges"
category: "Sécurité Web"
difficulty: ""
os: ""
service: ""
tools: []
---

Dans cet challenge , nous devons accédé au répertoire admin dans le but de récupéré le flag.

pour y' arrivé nous devons exploité ce qu'on appelle le<font color="#92d050"> Local file Inclusion</font>


# Etape 1 : accédé au site web en question 

il faut juste allez sur le challenge a partir du lien donnée si haut puis on y trouve un bouton comme ceci :
![Pasted image 20260307152750.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307152750-0fc93ab53b.png)

lorsqu'on demarre le challenge on tombe une interface comme ceci :

![Pasted image 20260307152837.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307152837-d4a54f71d4.png)


# Etape 2 : Faire les premières analyse puis exploitation

## le paramètre a exploité 

lorsque nous cliquons sur les différents onglets , on remarque un petit changement dans notre barre de recherche de navigateur 

lorsque je clique sur l'onglet sysadm par exemple on y remarque <font color="#ff0000">sysadm </font>est passé comme valeur au paramètre <font color="#ff0000">file</font>
![Pasted image 20260307153148.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307153148-cedc7c32c6.png)

Et donc , c'est ce paramètre <font color="#ff0000">file</font> là que nous allons exploité ici 

Mais comment alors ? : c'est là que nous allons utilisé la méthode  du local file inclusion Local File Inclusion (LFI)


## Déterminons l'Arboraissance des répertoires 

* Lorsque nous remplaçons la valeur du paramètre file par `../../../../` , on obtient un message qui nous dis que le répertoire `/` n'est pas un répertoire autorisé

![Pasted image 20260307154110.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307154110-c35e7e2685.png)

Donc cela veut dire que nous somme en réalité dans le répertoire racine . on va pas toute suite essayé de by-passé cette restriction , mais nous allons essayé de déterminé les répertoires au quel nous avons accès ou non 

* en replaçant maintenant `../../../../` par `../../../` , on nous dis que nous n'avons pas droit a accédé au répertoire <font color="#ff0000">/challenge</font> , ce qui veut dire que nous somme actuellement dans ce répertoire

![Pasted image 20260307154500.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307154500-63f6c5f44c.png)

toujours pas de by-passe , nous allons encore monté d'un répertoire

* quand ont remplace cette fois ci  `../../../` par `../../` , on  nous dis que nous ne pouvons pas accédé au répertoire <font color="#ff0000">/challenge/web-serveur</font>. ce qui veut dire que nous somme actuellement dans cet répertoire

* Si on monte encore d'un niveau cette fois si avec ../, ne n'obtient pas de message d'erreur , mais une liste de fichier (donc je suis dans un repertoire autorisé)
![Pasted image 20260307155054.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307155054-ea1f6dcf54.png)

et si on remarque bien nous avons un dossier là bas qui s'appelle admin . c'est t'elle qui nous intéresse au faite 


Donc non seulement nous n'avons pas forcé a faire des by-passe d'accès , mais nous avons juste utilisé une méthode de traversé de répertoire.


## Accédons au Dossier  admin pour voir ce qu'il y'a a l'intérieur 

lorsque nous rentrons dans cet dossier (juste en utilisant `../admin` c'est a dire le répertoire actuelle dans le quel nous nous trouvons suivit du dossier au quel on veut accédé  ) on voit qu'il y'a un fichier qui s'appelle <font color="#4bacc6">index.php</font>

![Pasted image 20260307155656.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307155656-c28d2ad783.png)

dès lors qu'on clique sur cet dernier on y va un code , que nous devons analysé 

Après analyse de cet code , on tombe sur une partie comme ceci :
![Pasted image 20260307155829.png](/portofolio/images/writeups/obsidian/local-file-inclusion-4f01c5130c/pasted-image-20260307155829-636bfd6d73.png)

c'est là que ce trouve notre flag a soumettre.
