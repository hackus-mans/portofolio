---
title: "Responder"
summary: "Machine Windows de niveau très facile sur Hack The Box Starting Point, consacrée à l'exploitation d'une vulnérabilité d'inclusion de fichiers dans une application Web, à la capture d'une authentification NetNTLMv2 avec Responder, au cassage du mot de…"
publishedAt: "2026-10-25"
tags: ["StartingPoint", "Windows", "HTTP", "SMB", "NTLM", "HashCracking", "WinRM", "Réseaux & services", "HTTP, WinRM", "Nmap", "Responder", "Evil-WinRM"]
status: "published"
platform: "Hack The Box"
section: "LABs"
category: "Réseaux & services"
difficulty: "Très facile"
os: "Windows"
service: "HTTP, WinRM"
tools: ["Nmap", "Responder", "Evil-WinRM", "John the Ripper"]
---

## 1. Objectif

L'objectif de ce laboratoire est de compromettre une machine Windows en exploitant une faiblesse d'inclusion de fichiers dans une application Web PHP.

L'exploitation doit permettre de provoquer une authentification Windows vers une machine contrôlée, d'intercepter une réponse NetNTLMv2, puis d'effectuer une attaque hors ligne par dictionnaire afin de retrouver le mot de passe associé.

Les identifiants obtenus permettront ensuite d'accéder au système Windows à distance via WinRM et de récupérer le flag situé dans le répertoire d'un utilisateur.

La chaîne d'attaque étudiée est :

**Web Enumeration → File Inclusion → UNC Path → SMB Authentication → NetNTLMv2 Capture → Password Cracking → WinRM Access**


## 2. Reconnaissance et énumération

### 2.1. Identification des ports et services

La première étape consiste à identifier les services exposés par la machine cible afin de déterminer les surfaces d'attaque disponibles.

Pour cela, j'ai utilisé Nmap avec la détection de versions :

```bash
nmap -Pn --disable-arp-ping --min-rate 5000 -sV 10.129.58.231
```

Cette commande permet d'effectuer un scan TCP des 1 000 ports courants, sans vérification préalable de disponibilité par les mécanismes classiques de découverte d'hôtes, puis d'identifier les services et leurs versions.

Les résultats révèlent deux ports ouverts :

| Port     | Service | Informations                      |
| -------- | ------- | --------------------------------- |
| 80/TCP   | HTTP    | Apache 2.4.52, PHP 8.1.1, Windows |
| 5985/TCP | WinRM   | Microsoft HTTPAPI 2.0             |

Le port 80 héberge une application Web utilisant PHP. Il constitue donc notre premier point d'entrée.

Le port 5985 correspond habituellement à WinRM, un mécanisme d'administration distante Windows. Il pourrait permettre l'ouverture d'une session PowerShell si des identifiants valides et autorisés sont obtenus.

![Pasted image 20261025190103.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025190103-0a1463dc9f.png)

**<font color="#ff0000">Enseignement</font> :** un service d'administration exposé n'est pas nécessairement vulnérable. Son intérêt dépend notamment des méthodes d'authentification et des permissions accordées aux comptes.


### 2.2. Résolution du nom de domaine

En accédant au serveur par son adresse IP, j'ai identifié le domaine `unika.htb`.

Toutefois, l'accès direct à ce domaine échouait initialement dans le navigateur.

Ce problème s'explique par l'absence de correspondance entre le nom `unika.htb` et l'adresse IP de la machine dans le système de résolution de noms utilisé par Kali.




![Pasted image 20261025190617.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025190617-e7d051cc23.png)

![Pasted image 20261025190921.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025190921-04c4b8afe5.png)

J'ai donc ajouté cette association dans le fichier `/etc/hosts`  :

```text
10.129.58.231 unika.htb
```

Le fichier `/etc/hosts` permet au système de résoudre localement certains noms d'hôtes sans interroger un serveur DNS.



![Pasted image 20261025191216.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025191216-a515b2f7cd.png)


Après cette modification, le site devient accessible à l'adresse :

```
http://unika.htb/
```

![Pasted image 20261025191401.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025191401-e63c43fea5.png)

**<font color="#9bbb59">Enseignement</font> :** lors d'un pentest Web, la bonne résolution des noms est importante, notamment lorsqu'un serveur utilise des Virtual Hosts et sélectionne son site selon l'en-tête HTTP `Host`.

### 2.3. Identification des technologies Web

Une fois le site accessible, j'ai analysé les en-têtes HTTP à l'aide de cURL :

```bash
curl -I http://unika.htb/
```

L'option `-I` demande à cURL de récupérer uniquement les en-têtes de la réponse HTTP.

Le résultat contient notamment :

```http
HTTP/1.1 200 OK
Server: Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1
X-Powered-By: PHP/8.1.1
Content-Type: text/html; charset=UTF-8
```

Ces informations confirment que l'application utilise PHP côté serveur et fonctionne dans un environnement Windows.

L'en-tête `X-Powered-By` expose une information technologique intéressante lors de l'énumération.

![Pasted image 20261025192803.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025192803-dc58588325.png)


### 2.4. Découverte du paramètre `page`

En parcourant l'application, j'ai remarqué que le changement de langue modifie l'URL du site.

L'application utilise un paramètre GET nommé `page` pour sélectionner le contenu à afficher.

Un paramètre contrôlable par l'utilisateur peut devenir une surface d'attaque lorsqu'il est directement utilisé par le serveur pour charger un fichier.

L'hypothèse formulée est donc la suivante :

> Si la valeur du paramètre `page` est transmise à une fonction PHP d'inclusion sans validation suffisante, il pourrait être possible de charger des fichiers non prévus par l'application.

Cette hypothèse doit être validée par des tests, car la présence d'un paramètre `page` ne constitue pas, à elle seule, une vulnérabilité.

![Pasted image 20261025193102.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025193102-ff326dd5e9.png)


## 3. Analyse et exploitation contrôlée

### 3.1. Validation de l'inclusion de fichiers

Afin de vérifier l'hypothèse précédente, j'ai modifié la valeur du paramètre `page` pour référencer un chemin de fichier en dehors du répertoire prévu par l'application.

La réponse du serveur a produit des avertissements PHP mentionnant la fonction `include()` ainsi qu'un chemin situé dans :

```text
C:\xampp\htdocs\index.php
```

Ces avertissements indiquent que le serveur essaie de charger un fichier dont le chemin est influencé par le paramètre utilisateur.

Cela confirme une faiblesse dans le traitement du chemin d'inclusion.

![Pasted image 20261025193314.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025193314-31f7b15871.png)

#### Comprendre la vulnérabilité

En PHP, `include()` permet de charger et d'évaluer un fichier dans le contexte d'exécution du script.

Une implémentation dangereuse pourrait ressembler à ceci :

```php
$page = $_GET['page'];
include($page);
```

Dans cet exemple illustratif, aucune liste blanche ne limite les fichiers pouvant être sélectionnés.

Le flux vulnérable est donc :

**Input utilisateur → Paramètre GET → include() → Accès au système de fichiers**

Une LFI (_Local File Inclusion_) peut permettre d'inclure des fichiers locaux non prévus. Son impact dépend du type de fichier, des permissions du processus et de la configuration PHP.

### 3.2. Limitation de la RFI par HTTP

Une tentative d'inclusion distante utilisant une URL HTTP a également été effectuée.

Cependant, PHP a retourné un avertissement indiquant :

```text
allow_url_include=0
```

La directive `allow_url_include` empêche ici PHP d'inclure directement un fichier distant à travers le wrapper HTTP.

Cette configuration bloque la tentative de RFI par HTTP, mais elle ne garantit pas que le traitement du paramètre `page` soit sécurisé.

La piste suivante consiste donc à étudier le comportement de Windows lorsqu'une application tente d'accéder à un chemin réseau UNC.

![Pasted image 20261025194608.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025194608-d4087ab2ef.png)

### 3.3. Exploitation d'un chemin UNC Windows

Sous Windows, un chemin UNC (_Universal Naming Convention_) permet de désigner une ressource accessible sur un serveur réseau.

Sa structure générale est :

```text
\\SERVEUR\PARTAGE\FICHIER
```

Lorsqu'un programme Windows essaie d'accéder à ce chemin, le système peut établir une connexion SMB avec le serveur distant.

Dans ce laboratoire, le paramètre d'inclusion PHP permet de déclencher une tentative d'accès réseau vers la machine Kali.

L'objectif n'est plus d'exécuter un fichier PHP distant, mais de provoquer une authentification Windows vers un service SMB contrôlé.

Ce comportement établit un lien entre une vulnérabilité Web et le mécanisme d'authentification réseau de Windows.

### 3.4. Capture de l'authentification avec Responder

Pour observer et recevoir la tentative d'authentification SMB, j'ai utilisé Responder sur l'interface VPN :

```bash
sudo responder -I tun0
```

Responder fournit notamment des services réseau capables de recevoir certaines authentifications Windows.

L'option `-I` indique l'interface à utiliser. Dans notre cas, `tun0` correspond à l'interface VPN permettant de communiquer avec la machine HTB.

Après le déclenchement du chemin UNC depuis l'application Web, Responder a enregistré une tentative d'authentification :

```text
[SMB] NTLMv2-SSP Client    : 10.129.95.234
[SMB] NTLMv2-SSP Username  : RESPONDER\Administrator
[SMB] NTLMv2-SSP Hash      : Administrator::RESPONDER:...
```

![Pasted image 20261025194710.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025194710-fa524b2b59.png)
![Pasted image 20261025194810.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025194810-eab798f3d9.png)

#### Comment Responder a-t-il obtenu cette réponse ?

Pour comprendre, il faut connaître le fonctionnement de l'authentification NTLM.

**NTLM (NT LAN Manager)** est une technologie d'authentification Windows. Elle permet à un ordinateur ou à un utilisateur de prouver son identité auprès d'un service sans lui transmettre directement son mot de passe.

NTLMv2 utilise un mécanisme appelé **challenge-response**, c'est-à-dire une authentification par défi et réponse.

Dans notre cas, les événements se déroulent ainsi :

**Étape 1 — Windows demande une connexion SMB**

À cause du chemin UNC transmis à l'application PHP, le serveur Windows essaie de contacter Kali.

**Étape 2 — Responder envoie un challenge**

Responder reçoit la connexion et transmet une valeur aléatoire à Windows.

Cette valeur s'appelle un _challenge_. Elle sert à empêcher qu'une ancienne réponse d'authentification soit simplement réutilisée dans une nouvelle session.

**Étape 3 — Windows calcule une réponse**

Windows ne renvoie pas son mot de passe.

Il utilise une clé cryptographique dérivée du mot de passe, le challenge reçu et d'autres données de négociation pour calculer une réponse NetNTLMv2.

**Étape 4 — Responder capture la réponse**

Windows envoie cette réponse au serveur SMB de Responder, qui l'enregistre.

La réponse contient les informations nécessaires pour tenter de vérifier des mots de passe candidats hors ligne.

Le mot de passe n'est toujours pas connu à ce stade.

#### Quelle différence entre un hash NT et une réponse NetNTLMv2 ?

Un **hash NT** est une valeur cryptographique dérivée du mot de passe Windows.

Une **réponse NetNTLMv2** est calculée pendant une authentification réseau à partir d'une clé dérivée du hash NT et des données du challenge.

Autrement dit :

- Le hash NT est lié directement au mot de passe du compte.
    
- La réponse NetNTLMv2 est liée au mot de passe, mais également à une négociation d'authentification particulière.
    

C'est pourquoi les deux formats ne doivent pas être confondus dans John the Ripper.

#### Pourquoi pouvons-nous retrouver un mot de passe sans le connaître ?

Responder dispose du challenge envoyé et de la réponse renvoyée par Windows.

John the Ripper peut prendre un mot de passe candidat, reproduire les opérations cryptographiques NTLMv2 et comparer le résultat avec la réponse capturée.

Si les résultats correspondent, le candidat a été vérifié avec succès.

Cette opération se déroule **hors ligne**, directement sur Kali.

Il n'est donc pas nécessaire d'envoyer chaque tentative au serveur Windows.

#### Et LLMNR/NBT-NS dans tout ça ?

Responder est souvent utilisé pour répondre frauduleusement à des demandes de résolution de noms LLMNR ou NBT-NS.

Toutefois, dans ce laboratoire, cette technique n'était pas nécessaire.

Nous avons directement fourni l'adresse IP de Kali dans un chemin UNC. Windows pouvait donc contacter notre serveur SMB sans devoir découvrir son adresse par LLMNR ou NBT-NS.

**À retenir :** ce laboratoire démontre qu'une faiblesse d'inclusion Web peut provoquer une connexion SMB vers un serveur distant et exposer une réponse d'authentification Windows. Ce n'est pas le mot de passe qui est transmis directement, mais une réponse cryptographique qui peut être analysée hors ligne.


### 3.5. Identification et préparation du hash

Après avoir récupéré la réponse d'authentification, j'ai cherché à en identifier le format avec Name-That-Hash.

Lors de ma première tentative, j'avais uniquement copié une partie hexadécimale de la réponse, en supprimant les champs d'identité.

Cette erreur a entraîné une mauvaise identification du format.

Une réponse NetNTLMv2 destinée à John the Ripper respecte généralement la structure suivante :

```text
USERNAME::DOMAIN:CHALLENGE:NT_PROOF:BLOB
```

Le nom d'utilisateur, le domaine, le challenge et les autres champs sont nécessaires pour que le logiciel interprète correctement les données.

Après avoir reconstitué la ligne complète, Name-That-Hash a identifié le format **NetNTLMv2**.

![Pasted image 20261025195127.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025195127-65e0093f46.png)


![Pasted image 20261025195407.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025195407-f4e96edb04.png)

**nseignement :** un outil d'identification de hash ne peut fournir un résultat fiable que si l'entrée respecte le format attendu.

### 3.6. Attaque hors ligne avec John the Ripper

Une fois le format correctement identifié, j'ai utilisé John the Ripper avec la wordlist `rockyou.txt`.

```bash
john --format=netntlmv2 \
  --wordlist=/usr/share/wordlists/rockyou.txt \
  hash.txt
```

L'option `--format=netntlmv2` sélectionne le format correspondant à la réponse NTLMv2 capturée.

Le paramètre `--wordlist` fournit la liste des mots de passe candidats.

John calcule la réponse attendue pour chaque candidat à partir des informations présentes dans la capture, puis vérifie si elle correspond à la réponse enregistrée.

Dans ce laboratoire, le mot de passe associé au compte `Administrator` a été retrouvé :

```text
badminton
```


![Pasted image 20261025195636.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025195636-dcbd4ea10f.png)


#### Pourquoi ma première tentative avait échoué

Initialement, j'avais utilisé le format :

```bash
--format=NT
```

Or, celui-ci correspond aux hashs NT et non aux réponses NetNTLMv2.

Ensuite, John indiquait :

```text
No password hashes loaded
```

Le problème provenait de la structure incomplète du hash enregistré dans `hash.txt`.

Après correction des données et utilisation de `--format=netntlmv2`, John a pu charger correctement la réponse.

Cette étape m'a appris qu'en cas d'erreur, il faut vérifier **la nature des données et leur structure avant de modifier les options des outils**.

### 3.7. Accès distant avec WinRM

Le scan Nmap initial avait révélé le port 5985 ouvert.

Ce port est généralement utilisé par WinRM (_Windows Remote Management_), un service d'administration distante utilisant WS-Management.

Grâce aux identifiants récupérés, j'ai essayé d'ouvrir une session PowerShell avec Evil-WinRM :

```bash
evil-winrm -i 10.129.58.231 \
  -u Administrator \
  -p 'badminton'
```

La connexion a réussi dans le laboratoire, confirmant que les identifiants étaient valides et autorisés pour cet accès distant.

### 3.8. Exploration du système et récupération du flag

Une fois connecté, j'ai exploré les répertoires des utilisateurs Windows avec les commandes PowerShell habituelles.

Le dossier `C:\Users` contenait notamment les profils :

```text
Administrator
mike
Public
```

En examinant le répertoire de l'utilisateur `mike`, j'ai trouvé un fichier `flag.txt` dans son dossier `Desktop`.

Le contenu a été affiché avec :

```powershell
cat C:\Users\mike\Desktop\flag.txt
```

La commande `cat` est un alias de `Get-Content` dans Windows PowerShell.

La récupération du flag a confirmé l'atteinte de l'objectif du laboratoire.

![Pasted image 20261025200909.png](/portofolio/images/writeups/obsidian/responder-8a77bd0b2a/pasted-image-20261025200909-c73c66e109.png)

## 4. Résultats et enseignements

### 4.1. Résultat final

La machine HTB Responder a été compromise en partant d'une fonctionnalité Web insuffisamment sécurisée.

La faiblesse d'inclusion de fichiers a permis de déclencher une authentification SMB vers un système contrôlé. La réponse NetNTLMv2 a ensuite été utilisée pour retrouver le mot de passe du compte Administrator, ce qui a rendu possible une connexion distante par WinRM.

L'exploitation montre comment une vulnérabilité initialement située dans une application Web peut avoir des conséquences sur l'authentification et l'administration du système Windows.

### 4.2. Vulnérabilité et impact

**Cause racine :** absence de contrôle suffisamment strict sur les chemins de fichiers chargés par l'application PHP.

**Impact observé :** déclenchement d'une authentification réseau Windows et exposition d'une réponse NetNTLMv2.

**Impact obtenu dans le lab :** récupération d'un mot de passe faible, authentification distante via WinRM et accès au flag.

Les facteurs qui ont rendu la chaîne d'attaque possible sont la faiblesse de l'inclusion, l'accès SMB sortant, l'authentification Windows déclenchée, la faiblesse du mot de passe et la disponibilité de WinRM.

### 4.3. Remédiations

Plusieurs mesures permettraient de réduire cette surface d'attaque :

- Remplacer les chemins contrôlés par l'utilisateur par une liste blanche de fichiers autorisés.
    
- Éviter de transmettre directement des paramètres GET aux fonctions `include()` et `require()`.
    
- Réduire les permissions du compte exécutant l'application Web.
    
- Restreindre les connexions SMB sortantes inutiles depuis les serveurs Web.
    
- Limiter l'utilisation de NTLM lorsque cela est possible et privilégier les mécanismes d'authentification modernes.
    
- Utiliser des mots de passe robustes et limiter les comptes autorisés à utiliser WinRM.
    
- Désactiver l'affichage des erreurs techniques détaillées pour les utilisateurs externes tout en conservant une journalisation exploitable.
    

### 4.4. Erreurs rencontrées

Ce laboratoire m'a permis d'identifier plusieurs erreurs méthodologiques.

**Erreur 1 — Lancer une énumération sans vérifier la résolution du domaine**

Le navigateur ne pouvait pas accéder à `unika.htb` tant que l'association avec l'adresse IP n'avait pas été ajoutée à `/etc/hosts`.

**Erreur 2 — Confondre inclusion HTTP et accès réseau UNC**

L'inclusion distante par HTTP était bloquée par la configuration PHP, mais la tentative d'accès à une ressource UNC pouvait encore provoquer une authentification SMB.

**Erreur 3 — Utiliser Name-That-Hash sur une donnée incomplète**

La suppression des champs d'identité a entraîné une mauvaise interprétation du format.

**Erreur 4 — Employer le mauvais format dans John the Ripper**

Le format `NT` n'était pas adapté à une réponse NetNTLMv2.

**Erreur 5 — Confondre commandes Linux et PowerShell**

Lors de l'exploration Windows, j'ai tenté d'utiliser `touch`, qui n'était pas disponible dans cette session PowerShell. Pour créer un fichier, j'aurais pu utiliser `New-Item`. Pour lire le flag, `Get-Content` convenait.

### 4.5. Compétences acquises

À l'issue de ce laboratoire, je dois être capable de :

- Identifier les services exposés par un serveur Windows.
    
- Examiner les en-têtes HTTP et identifier les technologies serveur.
    
- Reconnaître une surface d'inclusion de fichiers.
    
- Distinguer une LFI, une inclusion distante HTTP et une inclusion de chemin UNC.
    
- Expliquer pourquoi un chemin UNC peut déclencher une connexion SMB.
    
- Comprendre le fonctionnement général de l'authentification NTLMv2.
    
- Distinguer un hash NT d'une réponse NetNTLMv2.
    
- Diagnostiquer les erreurs de format rencontrées avec John the Ripper.
    
- Comprendre le rôle de WinRM et d'Evil-WinRM.
    
- Documenter une chaîne d'exploitation avec des preuves techniques.
    

### 4.6. Conclusion personnelle

Ce laboratoire m'a permis de comprendre qu'une exploitation réussie résulte souvent de l'enchaînement de plusieurs mécanismes plutôt que d'une seule vulnérabilité.

La découverte la plus importante a été de comprendre qu'un paramètre PHP vulnérable pouvait amener Windows à effectuer une authentification SMB vers un serveur contrôlé.

J'ai également appris que la récupération d'une réponse NetNTLMv2 ne correspond pas à la récupération immédiate d'un mot de passe, et que le succès de John the Ripper dépend à la fois du bon format, de l'intégrité des données et de la qualité des candidats testés.

**Ce que je dois maintenant savoir refaire sans assistance :** énumérer une application Web, formuler et vérifier une hypothèse d'inclusion, analyser une réponse d'authentification Windows, identifier le format cryptographique approprié et expliquer chaque transition de la chaîne d'attaque.
