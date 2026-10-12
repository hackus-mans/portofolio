export type CaseStudy = {
  slug:string;
  question:string;
  overview:string;
  context:string;
  method:string;
  architecture:{name:string;detail:string}[];
  engineering:string[];
  validation:string[];
  result:string;
  caveat:string;
  next:string[];
  external?:{title:string;url:string};
};
export const cases:Record<string,CaseStudy>={
  "cybermind-x":{
    slug:"cybermind-x",
    question:"Comment transformer des événements dispersés en décisions compréhensibles ?",
    overview:"CyberMind X est une expérimentation de chaîne SOC : collecte, observation réseau, honeypot, orchestration et aide à l'analyse par modèle de langage.",
    context:"Les outils de sécurité isolés ont chacun une vue partielle du système. Le projet vise à comprendre leurs interactions, les données produites et les conditions nécessaires à une réponse défendable.",
    method:"Instrumenter un environnement de laboratoire, provoquer des événements autorisés, observer leur passage dans la chaîne puis comparer les observations aux hypothèses.",
    architecture:[
      {name:"01 / HÔTES",detail:"Wazuh — collecte et alertes liées à l'activité des machines."},
      {name:"02 / RÉSEAU",detail:"Suricata — détection fondée sur la visibilité réseau et les signatures."},
      {name:"03 / EXPOSITION CONTRÔLÉE",detail:"Cowrie — observation de tentatives d'interaction avec un service simulé."},
      {name:"04 / ORCHESTRATION",detail:"Shuffle SOAR — conception de workflows et d'actions conditionnelles."},
      {name:"05 / CONTEXTUALISATION",detail:"Ollama / LLM — expérimentation de résumés d'événements, avec vérification humaine."}
    ],
    engineering:[
      "Séparer télémétrie brute, interprétation et décision pour éviter les réponses fondées uniquement sur une synthèse IA.",
      "Faire circuler les identifiants d'événements, les horodatages et les sources au travers des composants.",
      "Conserver un mode d'observation sans action destructrice, puis ne déclencher des réponses qu'après autorisation."
    ],
    validation:[
      "Scénarios de laboratoire : scan réseau contrôlé, tentatives SSH, surveillance d'intégrité de fichiers et événements d'administration.",
      "Pour chaque événement, examiner la source, le signal produit, le délai d'apparition et les informations manquantes.",
      "Archiver les preuves techniques (journaux anonymisés et captures) avant toute présentation comme résultat mesuré."
    ],
    result:"Une architecture d'apprentissage orientée intégration d'outils. Les performances, taux de détection et actions automatisées en production ne sont pas revendiqués.",
    caveat:"Projet expérimental. Les preuves quantitatives et la reproductibilité sur environnements variés doivent être publiées avant toute prétention d'usage en entreprise.",
    next:["Publier une architecture à jour et un guide d'installation reproductible.","Ajouter des jeux de tests annotés et des captures de corrélation.","Mesurer les faux positifs et introduire des validations humaines dans les workflows."]
  },
  "honeyshield":{
    slug:"honeyshield",
    question:"Que peut-on apprendre de l'activité hostile observée dans un environnement maîtrisé ?",
    overview:"HoneyShield est une démarche de honeypot et d'analyse de comportements, distinguée par un premier prix au pôle cybersécurité des JPOPE 2026.",
    context:"Une interaction hostile n'est pas en elle-même une conclusion : elle doit être replacée dans son contexte, liée à des traces et interprétée prudemment.",
    method:"Concevoir une surface d'observation contrôlée, capturer des interactions, classer la télémétrie puis restituer les observations compréhensiblement.",
    architecture:[
      {name:"01 / SURFACE",detail:"Environnement d'interaction exposé de manière contrôlée, sans accès aux services sensibles."},
      {name:"02 / COLLECTE",detail:"Journalisation des connexions et des actions observables."},
      {name:"03 / ANALYSE",detail:"Classification des signaux, exploration de motifs et interprétation assistée."},
      {name:"04 / RESTITUTION",detail:"Synthèse pédagogique des événements et des enseignements de sécurité."}
    ],
    engineering:[
      "Séparer strictement le honeypot des systèmes qui ne font pas partie de l'expérience.",
      "Ne pas traiter automatiquement chaque tentative comme une attaque confirmée.",
      "Limiter la collecte aux données utiles et protéger l'intégrité des traces."
    ],
    validation:[
      "Présenter le contexte de démonstration, les interactions reproduites et les événements correspondants.",
      "Rendre visibles les preuves de la distinction JPOPE 2026 lorsque des pièces publiables seront disponibles."
    ],
    result:"Premier prix JPOPE 2026 déclaré pour HoneyShield ; ce résultat ne vaut pas validation industrielle du dispositif.",
    caveat:"Les détails de déploiement, données collectées et métriques du honeypot ne sont pas encore publiés intégralement dans ce portfolio.",
    next:["Publier le schéma d'isolement de l'environnement.","Ajouter des exemples de télémétrie expurgée de données sensibles.","Documenter la méthode d'évaluation et les limites connues."]
  },
  "lumina-academy":{
    slug:"lumina-academy",
    question:"Comment apprendre la cybersécurité sans empiler des notions sans lien ?",
    overview:"Lumina Academy est une roadmap de formation structurée par dépendances, allant des fondations systèmes et réseaux aux parcours de spécialisation.",
    context:"Les plans d'étude linéaires dissimulent souvent leurs prérequis. Une carte de compétences rend la progression plus explicite et navigable.",
    method:"Structurer les domaines, identifier les prérequis, relier les étapes de formation et proposer des points d'entrée adaptés à différents objectifs.",
    architecture:[
      {name:"01 / FONDATIONS",detail:"Systèmes d'exploitation, réseau et raisonnement technique."},
      {name:"02 / CARTOGRAPHIE",detail:"Nœuds de compétences et relations de prérequis entre notions."},
      {name:"03 / SPÉCIALISATIONS",detail:"Pentest, Web/API, Linux/Windows, Active Directory et parcours offensifs/défensifs."},
      {name:"04 / PUBLICATION",detail:"Application web distincte, intégrée dans le portfolio via lien et iframe."}
    ],
    engineering:[
      "Séparer la progression pédagogique de la simple liste de ressources.",
      "Rendre les transitions entre domaines compréhensibles et révisables.",
      "Conserver une version autonome de la roadmap pour les visiteurs."
    ],
    validation:["Vérifier l'accessibilité de la roadmap et de ses interactions clavier.","Tester les chemins de progression auprès d'apprenants réels et collecter leurs retours."],
    result:"Une roadmap web publiquement consultable, dont le contenu continue d'évoluer.",
    caveat:"Le nombre de parcours et leur adéquation pédagogique doivent être réévalués au fil des nouvelles versions.",
    next:["Relier chaque compétence à des preuves d'apprentissage et exercices.","Ajouter des critères de maîtrise observables.","Étudier la progression sur différents profils d'apprenants."],
    external:{title:"Explorer la roadmap publiée",url:"https://hackus-mans.github.io/roadmap/"}
  },
  "mcp-automation":{
    slug:"mcp-automation",
    question:"Comment orchestrer des assistants et des services sans masquer les risques d'intégration ?",
    overview:"Expérimentation personnelle déclarée autour d'une passerelle MCP entre assistants IA compatibles et messagerie WhatsApp, dans une logique d'automatisation pilotée.",
    context:"Relier une conversation à une action technique nécessite des règles explicites de permission, de traçabilité, d'authentification et de responsabilité.",
    method:"Définir les interfaces et frontières de confiance, explorer l'orchestration des messages et documenter les limites des connecteurs utilisés.",
    architecture:[
      {name:"01 / ENTRÉE",detail:"Messages et commandes reçus via une interface de messagerie."},
      {name:"02 / PASSERELLE",detail:"Serveur ou couche MCP permettant l'interaction avec des outils compatibles."},
      {name:"03 / ORCHESTRATION",detail:"Routage des demandes et politiques d'autorisation selon leur portée."},
      {name:"04 / EXÉCUTION",detail:"Connecteurs de services, résultats et journalisation des opérations."}
    ],
    engineering:[
      "Séparer la génération de texte de l'exécution d'une action au nom d'un utilisateur.",
      "Définir des confirmations pour les opérations sensibles, des limites d'usage et une politique de traitement des données.",
      "Éviter de présenter les capacités imaginées comme disponibles sans démonstration reproductible."
    ],
    validation:["Établir une matrice des capacités effectivement configurées et testées.","Mesurer les échecs, latences et restrictions des intégrations.","Documenter un scénario complet avec captures expurgées."],
    result:"Projet déclaré en cours d'exploration. Aucune garantie de compatibilité universelle ou de fonctionnement autonome n'est affichée.",
    caveat:"Ce portfolio ne constitue pas une preuve d'implémentation fonctionnelle complète. La documentation et les démonstrations doivent venir de tests réels.",
    next:["Publier un diagramme du flux complet.","Écrire un modèle de menace de la passerelle.","Préparer une démonstration limitée, autorisée et reproductible."]
  },
  "labs-ctf":{
    slug:"labs-ctf",
    question:"Comment transformer chaque challenge en compétence transférable ?",
    overview:"Programme personnel de pratique en laboratoire sur Hack The Box, TryHackMe et d'autres environnements autorisés, associé à des compétitions CTF.",
    context:"Un flag ne démontre pas à lui seul une méthode. L'intérêt est de comprendre le chemin, les causes des erreurs et les signaux défensifs associés.",
    method:"Reconnaissance → Énumération → Hypothèses → Validation → Exploitation autorisée → Post-exploitation → Reporting.",
    architecture:[
      {name:"01 / RECONNAISSANCE",detail:"Délimiter le périmètre et inventorier les services réellement exposés."},
      {name:"02 / HYPOTHÈSES",detail:"Transformer l'information collectée en tests ciblés."},
      {name:"03 / VALIDATION",detail:"Observer les résultats et éviter les conclusions hâtives."},
      {name:"04 / REPORTING",detail:"Documenter cause technique, reproduction, impact, trace et mitigation."}
    ],
    engineering:["Faire un bilan après chaque laboratoire et conserver les fausses pistes utiles.","Relier les techniques offensives aux journaux et mesures défensives.","Respecter le périmètre d'autorisation de toutes les plateformes."],
    validation:["Publier des writeups de machines retirées ou des exercices autorisant la divulgation.","Vérifier que les chiffres de compétitions soient accompagnés de sources publiables."],
    result:"Pratique continue et classement Top 1 ×2 en CTF, Top 3 au Cyberbattle IPNET tels que présentés par l'auteur.",
    caveat:"Les classements et volumes de labs sont des éléments déclaratifs tant que les justificatifs correspondants ne sont pas ajoutés.",
    next:["Publier davantage de comptes rendus reproductibles.","Formaliser une grille de progression par domaine.","Ajouter l'analyse défensive à chaque writeup."]
  }
};
