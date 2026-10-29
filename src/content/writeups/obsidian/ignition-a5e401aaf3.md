---
title: "Ignitiion"
summary: "Ignition est une machine Linux de difficulté Very Easy sur Hack The Box, axée sur les bases de l'énumération des applications Web et la résolution des noms de domaine virtuels (Virtual Hosts). La machine héberge un serveur Web Nginx nécessitant une c…"
publishedAt: "2026-10-28"
tags: ["HTTP", "Sécurité Web", "linux", "Nmap", "Curl"]
status: "published"
platform: "Hack The Box"
section: "LABs"
category: "Sécurité Web"
difficulty: "Très facile"
os: "linux"
service: ""
tools: ["Nmap", "Curl"]
---

## 1. Reconnaissance

### 1.1. Énumération des ports et services

J'ai commencé par effectuer un scan Nmap afin d'identifier les ports ouverts et les services exposés par la machine cible.

```
nmap -Pn --disable-arp-ping --min-rate 5000 -sV 10.129.1.27
```

**Explication des paramètres :**

- `-Pn` : considère l'hôte comme actif sans effectuer la découverte initiale habituelle.
    
- `--disable-arp-ping` : désactive la découverte ARP de Nmap.
    
- `--min-rate 5000` : demande un débit minimal d'envoi de 5 000 paquets par seconde pendant les phases concernées.
    
- `-sV` : tente d'identifier les services exécutés et leurs versions.
    

**Résultat :**

```
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.14.2
```

Le scan révèle un service accessible :

- **HTTP (80)** : serveur Web nginx 1.14.2.
    

Les 999 autres ports TCP analysés sont signalés comme fermés.

La présence d'un serveur HTTP m'a orienté vers l'énumération de l'application Web hébergée sur ce service.

![Pasted image 20261028082050.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028082050-5a7d851275.png)

### 1.2. Première tentative d'accès au site Web

Après avoir identifié le service HTTP, j'ai tenté d'accéder au site directement depuis mon navigateur en utilisant l'adresse IP de la machine.

```
http://10.129.1.27/
```

![Pasted image 20261028082422.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028082422-3434165c66.png)

Cependant, le navigateur n'est pas parvenu à afficher le site et a présenté une erreur :

```
DNS_PROBE_FINISHED_NXDOMAIN
```

![Pasted image 20261028082518.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028082518-5cf32ff18f.png)

**Interprétation :**

L'erreur `DNS_PROBE_FINISHED_NXDOMAIN` indique que le navigateur n'a pas réussi à résoudre un nom de domaine en adresse IP.

En observant le navigateur, j'ai remarqué qu'il tentait d'accéder au domaine `ignition.htb` alors que j'avais initialement saisi l'adresse IP de la machine.

Or, Nmap avait déjà confirmé la présence d'un service HTTP accessible sur le port 80.

J'ai donc formulé l'hypothèse suivante :

**Le serveur effectue probablement une redirection HTTP de l'adresse IP vers le domaine** `**ignition.htb**`**.**

Pour confirmer cette hypothèse, j'ai décidé d'examiner directement les en-têtes HTTP retournés par le serveur.

### 1.3. Analyse de la redirection HTTP

Pour examiner la réponse du serveur, j'ai utilisé `curl` :

```
curl -I http://10.129.1.27/
```

**Explication :**

- `curl` : outil permettant d'effectuer des requêtes vers des services réseau, notamment HTTP.
    
- `-I` : envoie une requête HTTP `HEAD` afin de récupérer les en-têtes de la réponse sans télécharger son corps.
    

**Résultat pertinent :**

```
HTTP/1.1 302 Found
Server: nginx/1.14.2
Location: http://ignition.htb/
```

Le serveur retourne un code HTTP `302 Found`, indiquant une redirection temporaire.

L'en-tête `Location` précise l'adresse vers laquelle le client doit être redirigé :

```
http://ignition.htb/
```

**Interprétation :**

Lorsqu'une requête est effectuée directement sur `10.129.1.27`, le serveur répond en demandant au navigateur d'accéder à `ignition.htb`.

Le navigateur tente ensuite de résoudre ce domaine afin d'obtenir l'adresse IP du serveur.

Cependant, notre système ne dispose pas encore d'une correspondance permettant de résoudre ce nom.

La navigation échoue donc pendant la résolution du domaine.

Cela confirme l'hypothèse formulée précédemment.

**À retenir :**

Une redirection HTTP `302` et une erreur DNS correspondent à deux mécanismes différents.

- **HTTP 302** : le serveur indique au client une autre URL.
    
- **DNS_PROBE_FINISHED_NXDOMAIN** : le navigateur ne parvient pas à résoudre le nom de domaine demandé.
    

Le serveur HTTP peut donc être accessible alors que le navigateur ne parvient pas à afficher le site après une redirection.

![Pasted image 20261028102622.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028102622-53c4a60630.png)

### 1.4. Configuration de la résolution locale

Après avoir identifié le domaine attendu, j'ai ajouté une correspondance entre celui-ci et l'adresse IP de la machine dans le fichier `/etc/hosts`.

```
10.129.1.27    ignition.htb
```

**Pourquoi ?**

Sous Linux, le fichier `/etc/hosts` permet d'associer localement des noms d'hôtes à des adresses IP.

Dans notre cas, il permet de définir la correspondance suivante :

```
ignition.htb → 10.129.1.27
```

Ainsi, lorsqu'une application tente de résoudre `ignition.htb`, le système peut utiliser cette association locale plutôt que de dépendre d'un serveur DNS externe.

Il est important de préciser que cette modification ne crée pas un véritable enregistrement DNS public.

Elle définit uniquement une correspondance sur la machine locale.

![Pasted image 20261028082744.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028082744-f12b18d4e2.png)

### 1.5. Vérification de l'accès HTTP

Après avoir configuré la résolution locale, j'ai effectué une nouvelle requête HTTP, cette fois directement vers le domaine.

```
curl -I http://ignition.htb/
```

**Résultat pertinent :**

```
HTTP/1.1 200 OK
Server: nginx/1.14.2
```

Le serveur retourne désormais un code HTTP `200 OK`.

**Interprétation :**

Les deux requêtes effectuées précédemment présentent des comportements différents :

|URL|Code HTTP|Signification|
|---|---|---|
|`http://10.129.1.27/`|`302 Found`|Redirection vers `ignition.htb`|
|`http://ignition.htb/`|`200 OK`|Requête traitée avec succès|

Cette différence confirme que le domaine `ignition.htb` permet d'accéder correctement à l'application.

Elle met également en évidence l'importance du nom d'hôte dans les communications HTTP.

**Comprendre les Virtual Hosts :**

Un serveur Web comme nginx peut héberger plusieurs sites sur une même adresse IP.

Pour déterminer quel site doit traiter une requête HTTP, il peut utiliser l'en-tête `Host`.

Par exemple :

```
GET / HTTP/1.1
Host: ignition.htb
```

Le serveur peut alors sélectionner la configuration correspondant au nom `ignition.htb`.

Ce mécanisme est appelé **Name-Based Virtual Hosting**.

Dans notre cas, les réponses observées sont compatibles avec un routage dépendant du nom d'hôte, même si elles ne prouvent pas à elles seules l'existence de plusieurs sites distincts.

![Pasted image 20261028082947.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028082947-52248787ae.png)

### 1.6. Identification de l'application Web

Après avoir résolu le problème d'accès, j'ai ouvert le domaine dans mon navigateur :

```
http://ignition.htb/
```

La page d'accueil de la boutique **LUMA** s'est affichée.

![Pasted image 20261028083017.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028083017-ee0c4a6c33.png)

**Analyse :**

Le site correspond à une application e-commerce reposant sur Magento.

**Magento** est une plateforme de commerce électronique permettant notamment de gérer :

- Les produits et leurs catégories.
    
- Les commandes et les clients.
    
- Les comptes utilisateurs.
    
- Les paramètres de la boutique.
    
- Les fonctionnalités d'administration.
    

Comme de nombreuses applications Web, Magento possède une interface d'administration distincte de la partie publique du site.

J'ai donc poursuivi l'énumération afin de rechercher des chemins intéressants pouvant donner accès à cette interface.

---

## 2. Énumération de l'application Web

### 2.1. Découverte des répertoires avec FFUF

Après avoir identifié Magento, j'ai utilisé FFUF afin de découvrir les chemins accessibles sur le serveur Web.

```
ffuf -u http://ignition.htb/FUZZ -w /usr/share/wordlists/seclists/Discovery/Web-Content/combined_directories.txt
```

**Explication des paramètres :**

- `ffuf` : outil de fuzzing permettant de tester automatiquement différentes valeurs dans des requêtes HTTP.
    
- `-u` : définit l'URL cible.
    
- `FUZZ` : mot-clé remplacé automatiquement par chaque entrée de la wordlist.
    
- `-w` : indique le chemin du fichier contenant les valeurs à tester.
    
- `combined_directories.txt` : wordlist contenant des noms de chemins Web courants.
    

**Fonctionnement :**

FFUF lit chaque entrée de la wordlist et la place à l'emplacement du mot-clé `FUZZ`.

Par exemple :

```
http://ignition.htb/admin
http://ignition.htb/contact
http://ignition.htb/catalog
http://ignition.htb/setup
```

Pour chaque requête, FFUF examine plusieurs caractéristiques de la réponse HTTP, notamment :

- Le code de statut HTTP.
    
- La taille de la réponse.
    
- Le nombre de mots.
    
- Le nombre de lignes.
    

Ces informations permettent d'identifier des chemins susceptibles de présenter un intérêt pendant l'énumération.

**Résultat important :**

```
admin [Status: 200, Size: 7092, Words: 1551, Lines: 149]
```

Le chemin qui a particulièrement attiré mon attention est :

```
/admin
```

Celui-ci retourne un code HTTP `200 OK`.

**Interprétation :**

Le nom du chemin suggère une interface d'administration, ce qui correspond à notre objectif d'identifier les fonctionnalités administratives de Magento.

Cependant, un code HTTP `200` ne suffit pas à confirmer la nature réelle d'une ressource.

Il est donc nécessaire de consulter son contenu pour valider cette hypothèse.

![Pasted image 20261028104113.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028104113-7eda259baf.png)

### 2.2. Découverte de l'interface d'administration Magento

Après avoir identifié le chemin `/admin`, j'ai tenté d'y accéder directement depuis le navigateur :

```
http://ignition.htb/admin
```

Le serveur a affiché une page de connexion Magento.

![Pasted image 20261028104214.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028104214-10c885269a.png)

**Analyse :**

La page contient un formulaire d'authentification avec deux champs principaux :

- **Username** : nom d'utilisateur.
    
- **Password** : mot de passe.
    

Cela confirme que le chemin `/admin` correspond à une interface de connexion administrative Magento.

La découverte de cette interface ne constitue pas une vulnérabilité en elle-même.

En revanche, elle permet d'identifier un mécanisme d'authentification qu'il est possible d'évaluer dans le cadre du lab.

L'étape suivante consiste donc à déterminer si le compte administrateur utilise des identifiants faibles.

---

## 3. Exploitation — Weak Credentials

### 3.1. Recherche des exigences de mot de passe Magento

Après avoir découvert l'interface d'administration, j'ai recherché les exigences minimales de mot de passe de Magento.

D'après les informations trouvées, la configuration par défaut étudiée exige :

- Un minimum de **7 caractères**.
    
- Au moins **une lettre alphabétique**.
    
- Au moins **un chiffre**.
    

Ces règles peuvent être modifiées par un administrateur. Elles ne prouvent donc pas à elles seules la politique réellement configurée sur la machine.

![Pasted image 20261028110404.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028110404-ff4f9306d6.png)

**Analyse :**

Ces exigences permettent de filtrer certains mots de passe courants qui ne respectent pas les critères minimaux.

Par exemple :

|Mot de passe|Analyse|
|---|---|
|`123456`|Trop court et aucune lettre|
|`123456789`|Aucune lettre|
|`qwerty`|Trop court et aucun chiffre|
|`12345`|Trop court et aucune lettre|
|`1q2w3e`|Seulement 6 caractères|
|`qwerty123`|Respecte les critères minimaux|

Cependant, il faut distinguer deux notions :

**La complexité minimale d'un mot de passe ne garantit pas sa robustesse.**

Un mot de passe peut contenir des lettres et des chiffres tout en étant très facile à deviner.

C'est particulièrement le cas lorsqu'il figure dans des listes de mots de passe fréquemment utilisés.

### 3.2. Recherche des mots de passe les plus courants de 2023

En suivant l'indice fourni par Hack The Box, j'ai recherché les mots de passe les plus utilisés en 2023.

Cette recherche a permis d'identifier plusieurs mots de passe courants.

Parmi les candidats identifiés, l'un d'entre eux respectait les exigences minimales étudiées pour Magento :

```
qwerty123
```

![Pasted image 20261028110504.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028110504-9f561807fc.png)

**Analyse :**

Le mot de passe `qwerty123` présente les caractéristiques suivantes :

- Il contient **9 caractères**.
    
- Il contient des lettres alphabétiques.
    
- Il contient des chiffres.
    
- Il figure dans les listes de mots de passe fréquemment utilisés.
    

Il respecte donc les critères minimaux identifiés, mais reste prévisible.

Sa structure repose sur une séquence de clavier connue (`qwerty`) suivie d'une suite numérique simple (`123`).

Cette combinaison constitue un candidat pertinent à vérifier manuellement dans le cadre du challenge.

Cette situation illustre une faiblesse fréquente : un mot de passe techniquement conforme à une politique de composition peut rester facilement devinable.

### 3.3. Authentification au compte administrateur

Après avoir identifié ce candidat, je suis retourné sur la page de connexion Magento :

```
http://ignition.htb/admin
```

J'ai utilisé les identifiants suivants :

```
Username : admin
Password : qwerty123
```

![Pasted image 20261028110610.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028110610-51067afa8e.png)

**Interprétation :**

Le nom d'utilisateur `admin` est un identifiant administrateur courant.

Le mot de passe `qwerty123` est également connu pour sa faible robustesse.

Cette combinaison représente donc un risque important lorsqu'elle protège un compte disposant de privilèges élevés.

La capture du formulaire présente aussi un message de déconnexion. Elle documente les champs renseignés, mais la réussite de l'authentification doit être confirmée par l'accès effectif à l'interface administrateur.

### 3.4. Accès au Dashboard Magento

Après l'authentification, j'ai réussi à accéder au tableau de bord administrateur Magento.

![Pasted image 20261028110736.png](/portofolio/images/writeups/obsidian/ignition-a5e401aaf3/pasted-image-20261028110736-9a1d070d1c.png)

**Résultat :**

L'affichage du Dashboard confirme que les identifiants utilisés permettent d'accéder à l'interface administrateur de Magento.

Cela constitue le résultat déterminant de l'exploitation.

La faiblesse identifiée est donc l'utilisation d'un mot de passe administrateur courant et facilement prévisible.

**Portée de l'accès obtenu :**

L'accès démontré concerne l'administration de l'application Magento.

Les captures ne montrent pas l'obtention d'un shell système ou une élévation de privilèges vers le compte `root` de Linux.

---

## 4. Validation du challenge

### 4.1. Questions 1 à 4

Les premières questions de Hack The Box concernent la reconnaissance du service Web, l'analyse HTTP et la résolution du domaine.

|N°|Question|Réponse|
|---|---|---|
|1|Which service version is found to be running on port 80?|`nginx 1.14.2`|
|2|What is the 3-digit HTTP status code returned when you visit `http://{machine IP}/`?|`302`|
|3|What is the virtual host name the webpage expects to be accessed by?|`ignition.htb`|
|4|What is the full path to the file on a Linux computer that holds a local list of domain name to IP address pairs?|`/etc/hosts`|

### 4.2. Questions 5 et 6

Les dernières questions concernent la découverte de l'interface administrateur et les identifiants utilisés pour y accéder.

|N°|Question|Réponse|
|---|---|---|
|5|Use a tool to brute force directories on the webserver. What is the full URL to the Magento login page?|`http://ignition.htb/admin`|
|6|Look up the password requirements for Magento and also try searching for the most common passwords of 2023. Which password provides access to the admin account?|`qwerty123`|

La plateforme confirme également la validation de l'objectif final avec le message :

```
Root flag owned
```

---

## 5. Analyse de la vulnérabilité

### 5.1. Cause de la compromission

La compromission du compte administrateur repose principalement sur l'utilisation d'identifiants faibles.

Deux éléments ont permis d'atteindre l'objectif :

1. L'interface d'administration Magento était accessible à l'adresse `/admin`.
    
2. Le compte administrateur utilisait un mot de passe courant et facilement prévisible.
    

La découverte de `/admin` ne constitue pas, à elle seule, une faille de sécurité.

La faiblesse réside dans la protection insuffisante du compte administrateur.

**Vulnérabilité identifiée : Weak Administrator Credentials**

**Référence : CWE-521 — Weak Password Requirements**

### 5.2. Chaîne d'accès

```
Reconnaissance réseau
        ↓
Découverte du port 80
        ↓
Identification de nginx 1.14.2
        ↓
Accès HTTP par adresse IP
        ↓
Redirection HTTP 302
        ↓
Découverte de ignition.htb
        ↓
Configuration de /etc/hosts
        ↓
Accès à l'application Magento
        ↓
Énumération des chemins avec FFUF
        ↓
Découverte de /admin
        ↓
Identification du formulaire Magento
        ↓
Recherche des exigences de mot de passe
        ↓
Recherche des mots de passe courants de 2023
        ↓
Identification de qwerty123
        ↓
Authentification admin / qwerty123
        ↓
Accès au Dashboard administrateur
        ↓
Validation du challenge
```

### 5.3. Impact potentiel

Dans un environnement réel, la compromission d'un compte administrateur Magento pourrait permettre, selon les permissions associées au compte :

- La consultation ou la modification des produits.
    
- La gestion des commandes et de certaines informations clients.
    
- La modification des paramètres de la boutique.
    
- L'accès à certaines données sensibles de l'application.
    
- L'exécution d'opérations administratives non autorisées.
    

L'impact exact dépend des permissions réellement accordées au compte compromis.

Dans ce lab, l'impact directement démontré est l'accès au Dashboard administrateur Magento.

### 5.4. Mesures de sécurité

Pour éviter cette classe de vulnérabilités, plusieurs mesures sont recommandées :

- Utiliser des mots de passe longs, uniques et difficilement prévisibles.
    
- Rejeter les mots de passe courants ou présents dans des listes de secrets compromis.
    
- Activer l'authentification multifacteur pour les comptes administrateurs.
    
- Mettre en place des protections contre les tentatives répétées de connexion.
    
- Surveiller les échecs d'authentification et les connexions inhabituelles.
    
- Restreindre l'accès à l'interface d'administration lorsque cela est possible.
    
- Appliquer le principe du moindre privilège.
    

---

## 6. Lessons Learned

Cette machine m'a permis de mettre en pratique plusieurs compétences fondamentales en pentest Web :

- **Reconnaissance :** identifier les services exposés avec Nmap et sélectionner une surface d'attaque.
    
- **HTTP :** comprendre le fonctionnement du code `302 Found` et l'importance de l'en-tête `Location`.
    
- **DNS :** distinguer une erreur de résolution de noms d'un problème de connectivité réseau.
    
- **Virtual Hosts :** comprendre le rôle du champ HTTP `Host` dans le routage des requêtes.
    
- **Directory Fuzzing :** utiliser FFUF pour découvrir les chemins accessibles sur un serveur Web.
    
- **Magento :** identifier une application e-commerce et son interface d'administration.
    
- **Weak Credentials :** comprendre qu'un mot de passe courant peut rester vulnérable même lorsqu'il respecte certaines règles minimales de composition.
    

### Difficulté importante rencontrée

La principale difficulté rencontrée concernait l'accès initial au site Web.

Malgré la présence d'un serveur HTTP accessible sur le port 80, le navigateur retournait :

```
DNS_PROBE_FINISHED_NXDOMAIN
```

Cette erreur pouvait laisser penser que le serveur Web était inaccessible.

Cependant, l'analyse des en-têtes HTTP a révélé une redirection vers `ignition.htb`.

Cette découverte a permis d'identifier la véritable cause du problème : l'impossibilité de résoudre localement le nom de domaine utilisé par la redirection.

La configuration de `/etc/hosts` a ensuite permis de résoudre le problème et de poursuivre l'énumération.

**Cette expérience m'a appris qu'il faut distinguer :**

- Un service réseau inaccessible.
    
- Une redirection HTTP.
    
- Une erreur de résolution de noms.
    
- Une réponse HTTP provenant de l'application.
    
- Un chemin inexistant ou non autorisé.
    

Elle m'a également montré l'importance de comprendre les résultats d'un outil avant de poursuivre avec une nouvelle technique.

### Point méthodologique à retenir

La progression sur cette machine repose sur une succession d'observations et d'hypothèses validées :

|Observation|Hypothèse|Validation|
|---|---|---|
|Port 80 ouvert|Application Web accessible|Accès HTTP|
|Erreur DNS après accès par IP|Redirection vers un domaine|`curl -I`|
|`Location: http://ignition.htb/`|Domaine attendu par l'application|Configuration de `/etc/hosts` et réponse `200 OK`|
|Présence de Magento|Existence possible d'une interface admin|Fuzzing avec FFUF|
|Chemin `/admin` découvert|Interface administrative|Vérification dans le navigateur|
|Mot de passe courant conforme aux critères minimaux|Identifiants administrateur potentiellement faibles|Authentification manuelle|
|Dashboard accessible|Accès administrateur obtenu|Observation de l'interface|

Cette démarche illustre un principe fondamental du pentest :

**Observation → Hypothèse → Test → Résultat → Interprétation.**

---

## 7. Conclusion

La machine Ignition illustre l'importance de la reconnaissance et de l'énumération dans un test d'intrusion Web.

Le scan Nmap m'a d'abord permis d'identifier un serveur nginx sur le port 80. L'analyse des réponses HTTP a ensuite révélé une redirection vers le domaine `ignition.htb`.

Après avoir configuré la résolution locale, j'ai pu accéder à l'application Magento et identifier son interface d'administration grâce au Directory Fuzzing avec FFUF.

La recherche des exigences de mot de passe Magento et des mots de passe les plus courants de 2023 m'a finalement permis d'identifier les identifiants faibles du compte administrateur et d'accéder au Dashboard.

Cette machine démontre qu'une mauvaise gestion des identifiants peut compromettre un compte privilégié sans nécessiter l'exploitation d'une vulnérabilité logicielle complexe.

**La principale leçon de ce lab est qu'une énumération méthodique, associée à une bonne compréhension des protocoles Web et des mécanismes d'authentification, permet d'identifier et de valider efficacement une faiblesse de sécurité.**
