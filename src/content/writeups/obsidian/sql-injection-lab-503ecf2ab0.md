---
title: "SQL Injection Lab"
summary: "Si la base de données exécute l'instruction SQL ci-dessus, tous les utilisateurs de la table des utilisateurs sont renvoyés. Par conséquent, l'attaquant contourne le mécanisme d'authentification de l'application et se connecte en tant que p…"
publishedAt: "2026-03-01"
tags: ["Sécurité Web"]
status: "published"
platform: "TryHackMe"
section: "LABs"
category: "Sécurité Web"
difficulty: ""
os: ""
service: ""
---

#sql

vous pouvez trouvé cet lab. [ici](https://tryhackme.com/room/sqlilab)


# Introduction to SQL Injection: Part 1

## Définition

L'injection SQL est une technique grâce à laquelle les attaquants peuvent exécuter leurs propres instructions SQL malveillantes, généralement appelées charge utile malveillante. Grâce aux instructions SQL malveillantes, les attaquants peuvent voler des informations de la base de données de la victime ; Pire encore, ils pourront peut-être apporter des modifications à la base de données.
Les applications auront souvent besoin de requêtes SQL dynamiques pour pouvoir afficher du contenu en fonction de différentes conditions définies par l'utilisateur. Pour permettre les requêtes SQL dynamiques, les développeurs concatènent souvent les entrées utilisateur directement dans l'instruction SQL. Sans vérification de l'entrée reçue, la concaténation de chaînes devient l'erreur la plus courante conduisant à une vulnérabilité d'injection SQL. Sans vérification des entrées, l'utilisateur peut faire en sorte que la base de données interprète l'entrée de l'utilisateur comme une instruction SQL plutôt que comme des données. En d’autres termes, l’attaquant doit avoir accès à un paramètre qu’il peut contrôler et qui entre dans l’instruction SQL. En contrôlant un paramètre, l'attaquant peut injecter une requête malveillante, qui sera exécutée par la base de données. Si l'application ne nettoie pas l'entrée donnée du paramètre contrôlé par l'attaquant, la requête sera vulnérable aux attaques par injection SQL.

Le code PHP suivant illustre une requête SQL dynamique dans une connexion . Les variables utilisateur et mot de passe de la requête POST sont concaténées directement dans l'état SQL.
```php
$query = "SELECT * FROM users WHERE username='" + $_POST["user"] + "' AND password= '" + $_POST["password"]$ + '";"
```

## Analogie (avec le code si dessus)

Si l'attaquant fournit la valeur <font color="#ffff00">' OR 1=1-- -</font> dans le paramètre name, la requête peut renvoyer plusieurs utilisateurs. La plupart des applications traiteront le premier utilisateur renvoyé, ce qui signifie que l'attaquant peut exploiter cela et se connecter en tant que premier utilisateur renvoyé par la requête. La séquence de <font color="#ffff00">double tiret (--)</font> est un indicateur de <font color="#ff0000">commentaire</font> dans SQL et provoque le commentaire du reste de la requête. En SQL, une chaîne est entourée d'un guillemet simple (') ou d'un guillemet double ("). Le guillemet simple (') dans l'entrée est utilisé pour fermer la chaîne littérale. Si l'attaquant entre<font color="#ffff00"> ' OR 1=1-- -</font> dans le paramètre name et laisse le mot de passe vide, la requête ci-dessus entraînera l'instruction SQL suivante.
```php
SELECT * FROM users WHERE username = '' OR 1=1-- -' AND password = ''
```

Si la base de données exécute l'instruction SQL ci-dessus, tous les utilisateurs de la table des utilisateurs sont renvoyés. Par conséquent, l'attaquant contourne le mécanisme d'authentification de l'application et se connecte en tant que premier utilisateur renvoyé par la requête.




#  **SQL Injection 1: Input Box Non-String**

SQL injection dans des champs qui n'ont pas besoin ou qui ne prenne pas des chaines de caractère, c'est juste ce qu'on appelle des champs d'entré sans chaine de caractère.

par exemple lorsque nous voulons bypassé de l'authentification d'un site web , nous avons tendance a utilisé du booléen blind SQL injection. Si ont devrai l'utilisé dans un cas où le champ d'entrée ne tient pas compte des chaines de caractère , le payload sera par exemple
```sql
1 OR 1=1;--
```

ici on entre la valeur voulu par le champs , ensuite on utilise du booléen (OR 1=1) pour rendre notre requête toujours vrai puis ont termine la requête avec un  `;` puis ont commente le reste 

# **SQL Injection 2: Input Box String**

A la différence du Input BOX Non-String , ici le champs en entré une chaine de caractère. donc le payload deviendra dans cet cas :
```sql
1' OR 1=1;--
```


# **SQL Injection 3 and 4: URL and POST Injection**

il arrive parfois que nos champs de connexion ou autres champs ne nous permettent pas de faire notre injection SQL, pas parce que l'application n'est pas vulnérable a l'injection SQL mais parce que certains contrôles côté client ont été implémentés

Dans ces cas ont peut bien passé par l'URL pour effectué notre Test ou par des champs de mise a jours (POST Injection) si le site en propose.
