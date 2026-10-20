---
title: "Redeemer"
summary: "Machine Linux d'introduction permettant de découvrir l'énumération d'un serveur Redis et les commandes de base de redis-cli"
publishedAt: "2026-10-20"
tags: ["Hackthebox", "Redis"]
status: "published"
platform: "Hackthebox"
section: "LABs"
category: "Redis"
difficulty: "very easy"
os: "Linux"
---

## Étape 1 — Reconnaissance

Avant d'interagir avec un service, il faut d'abord vérifier que la cible est joignable puis identifier les ports ouverts.

### Vérifier que la machine est accessible

On commence par tester la connectivité avec la cible :

```bash
ping 10.129.250.178
```

![Pasted image 20260928235653.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260928235653-0584199dfd.png)

Une réponse confirme que la machine est joignable.

### Identifier les ports ouverts

On effectue ensuite un scan Nmap :

```bash
sudo nmap -p- -Pn --disable-arp-ping -sS -n -T5 10.129.250.178
```

![Pasted image 20260928235841.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260928235841-738e289533.png)

Le scan révèle un seul port ouvert :

```text
6379/tcp open  redis
```

Le port `6379/tcp` correspond au service **Redis**.

---

## Étape 2 — Interaction avec Redis

### Qu'est-ce que Redis ?

Redis signifie **Remote Dictionary Server**.

C'est une base de données **NoSQL principalement en mémoire** qui stocke les données sous forme de paires **clé-valeur**.

Contrairement à une base relationnelle comme MySQL ou PostgreSQL, Redis ne fonctionne pas avec des tables composées de lignes et de colonnes. Il manipule différents types de structures comme :

- `string`
- `list`
- `hash`
- `set`
- `sorted set`

Comme les données sont principalement stockées en RAM, Redis est très rapide et est souvent utilisé pour le **cache**, les **sessions**, les files de messages ou le stockage temporaire de données.

Par défaut, Redis écoute sur le port :

```text
6379/tcp
```

### Connexion avec `redis-cli`

L'utilitaire en ligne de commande utilisé pour interagir avec Redis est :

```bash
redis-cli
```

Comme le service tourne sur une machine distante, on utilise l'option `-h` pour spécifier l'hôte :

```bash
redis-cli -h 10.129.250.178
```

![Pasted image 20260929002055.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260929002055-e85a744217.png)

Une fois connecté, on peut vérifier que Redis répond correctement avec :

```redis
PING
```

Réponse attendue :

```text
PONG
```

`PING` permet donc de vérifier que la connexion au serveur Redis est fonctionnelle et que le serveur traite correctement nos commandes.

---

## Étape 3 — Énumération du serveur Redis

Une fois connecté, l'objectif est de comprendre ce que contient le serveur Redis avant d'essayer de récupérer des données.

### Informations sur le serveur

La commande :

```redis
INFO
```

permet d'obtenir des informations et statistiques sur le serveur Redis.

Elle peut notamment révéler :

- la version de Redis ;
- le système d'exploitation ;
- le port utilisé ;
- le temps de fonctionnement ;
- la mémoire utilisée ;
- le nombre de clients connectés ;
- le rôle `master` ou `replica` ;
- l'état de la persistance ;
- les bases contenant des clés ;
- le nombre de clés.

![Pasted image 20260929003457.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260929003457-764ae3f697.png)

Dans notre cas, on retrouve notamment :

```text
redis_version:5.0.7
redis_mode:standalone
os:Linux
tcp_port:6379
```

La section `Keyspace` indique également :

```text
db0:keys=4,expires=0,avg_ttl=0
```

Cela signifie que `db0` contient actuellement **4 clés**.

Pour afficher uniquement cette partie, on peut utiliser :

```redis
INFO keyspace
```

### Les bases logiques Redis

Redis peut séparer ses clés dans plusieurs **bases logiques**.

Elles sont identifiées par un index :

```text
db0
db1
db2
...
```

Une base logique est simplement un espace de clés séparé à l'intérieur du même serveur Redis.

```text
Redis
│
├── db0
│   ├── key1
│   └── key2
│
└── db1
    ├── keyA
    └── keyB
```

Les bases utilisent le même serveur Redis, mais leurs clés sont séparées.

Dans notre cas, `INFO keyspace` montre que `db0` contient des données.

**Sélection de la base**

La commande `SELECT` permet de choisir la base logique sur laquelle on souhaite travailler :

```redis
SELECT 0
```

![Pasted image 20260929004757.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260929004757-51880cc5f8.png)

Redis répond :

```text
OK
```

Les commandes suivantes seront maintenant exécutées sur `db0`.

**Compter les clés**

La commande :

```redis
DBSIZE
```

retourne le nombre de clés présentes dans la base actuellement sélectionnée.

![Pasted image 20260929004941.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260929004941-6d682cd9f6.png)

Dans notre cas :

```text
(integer) 4
```

On confirme donc que `db0` contient bien **4 clés**.

**Lister les clés**

Pour afficher les clés présentes dans cette petite base :

```redis
KEYS *
```

![Pasted image 20260929005054.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260929005054-04a164a1b6.png)

Le caractère `*` agit comme un wildcard et correspond ici à toutes les clés.

> Sur une grosse base Redis en production, `KEYS *` peut être coûteux. Pour une énumération progressive, on préférera généralement `SCAN`. Dans ce lab, `KEYS *` convient parfaitement.

**Lire la valeur d'une clé**

Une fois les clés identifiées, on peut récupérer la valeur d'une clé de type `string` avec :

```redis
GET <key>
```

Dans notre cas :

```redis
GET flag
```

![Pasted image 20260929010027.png](/portofolio/images/writeups/obsidian/redeemer-b54e97b863/pasted-image-20260929010027-ef785b97d3.png)

Redis retourne alors la valeur associée à la clé `flag`.

---

## Chaîne d'énumération

```text
Reconnaissance
      ↓
Nmap
      ↓
6379/tcp - Redis
      ↓
redis-cli
      ↓
PING → PONG
      ↓
INFO
      ↓
db0 contient 4 clés
      ↓
SELECT 0
      ↓
DBSIZE
      ↓
KEYS *
      ↓
GET flag
      ↓
Flag récupéré
```

---

## Commandes importantes

| Commande | Utilité |
|---|---|
| `redis-cli -h <IP>` | Se connecter à un serveur Redis distant |
| `PING` | Vérifier que Redis répond |
| `INFO` | Obtenir les informations et statistiques du serveur |
| `INFO keyspace` | Voir les bases contenant des clés |
| `SELECT <index>` | Sélectionner une base logique |
| `DBSIZE` | Compter les clés de la base courante |
| `KEYS *` | Lister toutes les clés |
| `TYPE <key>` | Identifier le type d'une clé |
| `GET <key>` | Lire une clé de type `string` |

---

## Ce que j'ai appris

Cette machine m'a permis de comprendre :

- ce qu'est Redis ;
- le rôle du port `6379/tcp` ;
- comment utiliser `redis-cli` ;
- comment vérifier qu'un serveur Redis répond ;
- comment récupérer des informations avec `INFO` ;
- le fonctionnement des bases logiques ;
- comment sélectionner une base avec `SELECT` ;
- comment compter et lister les clés ;
- comment lire la valeur d'une clé ;
- l'importance de l'énumération avant toute tentative d'exploitation.
