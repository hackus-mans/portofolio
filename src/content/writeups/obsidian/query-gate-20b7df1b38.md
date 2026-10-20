---
title: "Query Gate"
summary: "Je lance ensuite un scan Nmap avec détection des services et les scripts par défaut :"
publishedAt: "2026-10-01"
tags: ["Bases de données", "mysql", "Linux"]
status: "published"
platform: "Hackviser"
section: "LABs"
category: "Bases de données"
difficulty: "Facile"
os: "Linux"
service: "mysql"
---

## Reconnaissance

Je commence par vérifier que la cible répond :

```bash
ping 172.20.6.54
```

La machine est accessible.

Je lance ensuite un scan Nmap avec détection des services et les scripts par défaut :

```bash
nmap -Pn --disable-arp-ping -n 172.20.6.54 -sV -sC --min-rate 5000
```

Résultat important :

```text
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MySQL 8.0.34
```

Le port `3306/tcp` est ouvert et héberge un serveur **MySQL 8.0.34**.

## Connexion à MySQL

Une première tentative incorrecte :

```bash
mysql 172.20.6.54
```

renvoie :

```text
Can't connect to local server through socket '/run/mysqld/mysqld.sock'
```

L'adresse IP doit être précisée avec `-h` :

```bash
mysql -h 172.20.6.54 -u root -p
```

- `-h` : hostname/IP du serveur MySQL
- `-u` : utilisateur
- `-p` : demande le mot de passe

Cependant, le serveur utilise un certificat TLS auto-signé :

```text
ERROR 2026 (HY000): TLS/SSL error:
self-signed certificate in certificate chain
```

Dans ce lab, la vérification du certificat est désactivée :

```bash
mysql -h 172.20.6.54 -u root -p --disable-ssl-verify-server-cert
```

La connexion fonctionne alors avec l'utilisateur privilégié :

```text
root
```

## Énumération des bases de données

Pour afficher les bases disponibles :

```sql
SHOW DATABASES;
```

Résultat :

```text
detective_inspector
information_schema
mysql
performance_schema
sys
```

Il y a donc **5 bases de données**.

La base intéressante est :

```text
detective_inspector
```

Je la sélectionne avec :

```sql
USE detective_inspector;
```

## Énumération des tables

Une fois dans la base :

```sql
SHOW TABLES;
```

Résultat :

```text
hacker_list
```

La base contient donc une table nommée :

```text
hacker_list
```

## Lecture des données

Pour afficher toutes les lignes de la table :

```sql
SELECT * FROM hacker_list;
```

Parmi les résultats :

```text
| Hackviser | Hackviser | h4ckv1s3r | white-hat |
```

Le hacker de type `white-hat` possède donc le nickname :

```text
h4ckv1s3r
```

## Erreurs intéressantes rencontrées

### `mysql IP` ne signifie pas « se connecter à cette IP »

```bash
mysql 172.20.6.54
```

Sans `-h`, le client tente une connexion au serveur MySQL **local**.

Pour une cible distante :

```bash
mysql -h <IP>
```

### `SHOW DATABASE` est incorrect

J'avais essayé :

```sql
SHOW DATABASE;
```

MySQL retourne une erreur de syntaxe.

La commande correcte est :

```sql
SHOW DATABASES;
```

### `ls` n'est pas une commande SQL

Une fois dans :

```text
MySQL [(none)]>
```

nous ne sommes plus dans Bash.

Cette commande :

```text
ls
```

n'est donc pas valide.

Il faut utiliser les commandes SQL adaptées :

```sql
SHOW DATABASES;
SHOW TABLES;
SELECT * FROM table;
```

## Réponses aux questions

| Question | Réponse |
|---|---|
| Port ouvert | `3306/tcp` |
| Service | `mysql` |
| Utilisateur MySQL le plus privilégié | `root` |
| Paramètre pour spécifier l'hôte | `-h` |
| Nombre de bases | `5` |
| Sélectionner une base | `USE <database>;` |
| Table de `detective_inspector` | `hacker_list` |
| Nickname du white-hat | `h4ckv1s3r` |

## À retenir

La méthodologie utilisée ici est simple :

```text
Nmap
  ↓
Identifier MySQL sur 3306
  ↓
Connexion avec mysql -h
  ↓
Résoudre le problème TLS
  ↓
SHOW DATABASES
  ↓
USE database
  ↓
SHOW TABLES
  ↓
SELECT
  ↓
Identifier l'information recherchée
```

Le point essentiel n'était pas seulement de trouver `h4ckv1s3r`, mais de comprendre la hiérarchie MySQL :

```text
Serveur MySQL
    └── Database
          └── Table
                └── Colonnes
                      └── Lignes / données
```
