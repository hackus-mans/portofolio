---
title: "Preignition"
summary: "Preignition est une machine Linux très simple d'utilisation qui permet de s'initier à l'énumération et au fuzzing de répertoires d'applications web. Lorsqu'un point d'accès administrateur vulnérable est découvert, l'application web met en évidence les dangers liés à une configuration incorrecte et à l'utilisation d'identifiants par défaut."
publishedAt: "2026-10-20"
tags: ["Hackthebox", "http"]
status: "published"
platform: "Hackthebox"
section: "LABs"
category: "http"
difficulty: "very easy"
os: "Linux"
---

---

## Reconnaissance

Je commence par vérifier que la cible est accessible :

```bash
ping 10.129.56.7
```

Résultat :

```text
64 bytes from 10.129.56.7: icmp_seq=1 ttl=63 time=218 ms
64 bytes from 10.129.56.7: icmp_seq=2 ttl=63 time=241 ms
```

La machine répond correctement.

Le `TTL=63` peut également suggérer un système Linux, car de nombreux systèmes Linux utilisent un TTL initial de `64`.

> Ce n'est cependant qu'un indice, pas une preuve suffisante pour identifier l'OS.

---

## Énumération des ports

Je recherche ensuite les services TCP exposés :

```bash
nmap -Pn --disable-arp-ping --min-rate 5000 10.129.56.7
```

Résultat :

```text
PORT   STATE SERVICE
80/tcp open  http
```

Un seul port TCP est découvert :

```text
80/tcp → HTTP
```

La surface d'attaque visible est donc principalement le **serveur Web**.

---

## Énumération du service Web

Le premier scan identifie HTTP mais pas précisément le logiciel utilisé.

Je relance donc Nmap uniquement sur le port `80` avec la détection de version :

```bash
nmap -p80 -Pn --disable-arp-ping --min-rate 5000 -sV 10.129.56.7
```

Résultat :

```text
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.14.2
```

Le serveur Web est donc :

```text
nginx 1.14.2
```

L'option :

```text
-sV
```

demande à Nmap d'effectuer de la **service/version detection** afin d'identifier plus précisément le logiciel qui répond derrière un port.

---

## Content Discovery

La page principale ne donnant pas suffisamment d'informations, je cherche des ressources Web qui ne sont pas directement visibles.

HTB présente cette technique comme du **directory brute-forcing**, aussi appelé :

```text
dir busting
```

Même si les questions utilisent **Gobuster**, j'ai utilisé **ffuf**, qui permet d'effectuer le même type d'énumération.

### Première tentative

```bash
ffuf -u http://10.129.56.7/FUZZ -w /usr/share/wordlists/seclists/Discovery/Web-Content/
```

Ici, le chemin donné à `-w` correspond à un **répertoire**, alors que ffuf attend un **fichier contenant une wordlist**.

Je sélectionne donc une wordlist précise :

```bash
ffuf -u http://10.129.56.7/FUZZ -w /usr/share/wordlists/seclists/Discovery/Web-Content/combined_directories.txt
```

Fonctionnement :

```text
http://10.129.56.7/FUZZ
                    │
                    └── remplacé successivement par chaque entrée
                        de la wordlist
```

Par exemple :

```text
admin
login
uploads
admin.php
...
```

---

## Découverte

ffuf retourne notamment :

```text
admin.php    [Status: 200, Size: 999, Words: 132, Lines: 32]
```

La ressource intéressante est donc :

```text
/admin.php
```

avec le code HTTP :

```text
200 OK
```

`200` signifie que le serveur a accepté la requête et retourné normalement la ressource demandée.

URL :

```text
http://10.129.56.7/admin.php
```

Cette page permet finalement d'accéder au contenu recherché et de valider la machine.

---

## Gobuster vs ffuf

HTB demandait notamment :

```bash
gobuster dir ...
```

et l'utilisation de :

```bash
-x php
```

pour rechercher également les fichiers PHP.

Dans mon cas, j'ai utilisé :

```bash
ffuf
```

La logique reste identique :

```text
Wordlist
   ↓
génération de chemins
   ↓
requêtes HTTP
   ↓
analyse des réponses
   ↓
ressources intéressantes
```

Le point important n'est donc pas de mémoriser uniquement **Gobuster**, mais de comprendre le mécanisme de **Web Content Discovery** qu'il automatise.

---

## Réponses importantes

| Élément | Résultat |
|---|---|
| Technique | Directory busting |
| Option Nmap de détection de version | `-sV` |
| Service sur `80/tcp` | HTTP |
| Serveur Web | nginx 1.14.2 |
| Mode Gobuster pour les répertoires | `dir` |
| Extension PHP avec Gobuster | `-x php` |
| Page découverte | `admin.php` |
| Code HTTP | `200` |

---

## Chaîne d'énumération

```text
Ping
  ↓
Machine accessible
  ↓
Scan TCP
  ↓
80/tcp HTTP
  ↓
Détection de version
  ↓
nginx 1.14.2
  ↓
Content Discovery avec ffuf
  ↓
/admin.php
  ↓
HTTP 200
  ↓
Accès à la page cachée
  ↓
Flag
```

## Lessons Learned

Cette machine montre surtout l'importance de ne pas s'arrêter à la page Web visible.

Lorsqu'un serveur HTTP est découvert :

```text
Service Web
   ↓
Identifier la technologie
   ↓
Examiner le contenu visible
   ↓
Énumérer les fichiers/répertoires
   ↓
Analyser les codes HTTP
   ↓
Explorer les ressources intéressantes
```

La découverte de `/admin.php` ne vient pas d'une vulnérabilité complexe : elle vient simplement d'une **bonne énumération**.

> **Enumeration > Exploitation**



## Access to the dashboard

![Pasted image 20261001095306.png](/portofolio/images/writeups/obsidian/preignition-a6da41868d/pasted-image-20261001095306-e5b7b2c496.png)


pour trouvé le flag il faut entré des identifiants par défaut (admin:admin)

![Pasted image 20261001095455.png](/portofolio/images/writeups/obsidian/preignition-a6da41868d/pasted-image-20261001095455-e8bd57fa2c.png)
