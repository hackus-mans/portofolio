/**
 * FIELD ATLAS — demonstration-only relationship map.
 * All coordinates, synthetic events and diagram links are illustrative.
 * No real-time threat intelligence or production telemetry is collected.
 */
export type AtlasNode = {
  id:string; x:number; y:number; kind:"core"|"defense"|"threat"|"project"|"signal";
  label:string; detail:string; project?:string; size?:number;
};
export const atlasNodes:AtlasNode[] = [
{id:"core",x:555,y:225,kind:"core",label:"NAKORE CORE",detail:"Point de convergence de mes projets : sécurité offensive, détection et automatisation.",size:33},
{id:"cybermind",x:336,y:235,kind:"project",label:"CyberMind X",detail:"Laboratoire SOC, collecte et détection",project:"cybermind-x",size:24},
{id:"honeyshield",x:780,y:184,kind:"project",label:"HoneyShield",detail:"Honeypot et observation d'interactions",project:"honeyshield",size:23},
{id:"lumina",x:676,y:354,kind:"project",label:"Lumina Academy",detail:"Cartographie des compétences cyber",project:"lumina-academy",size:22},
{id:"mcp",x:440,y:375,kind:"project",label:"AI / MCP",detail:"Assistants IA et automatisation",project:"mcp-automation",size:23},
{id:"ctf",x:212,y:352,kind:"project",label:"Labs & CTF",detail:"Pentest autorisé et méthodologies",project:"labs-ctf",size:22},
{id:"threat-1",x:170,y:155,kind:"threat",label:"Brute force SSH",detail:"Scénario simulé de tentatives répétées d'authentification SSH.",size:25},
{id:"threat-2",x:876,y:328,kind:"threat",label:"Access control",detail:"Scénario simulé : accès horizontal non autorisé à un objet.",size:25},
{id:"threat-3",x:936,y:128,kind:"threat",label:"API anomaly",detail:"Scénario de laboratoire : séquence de requêtes inhabituelles.",size:18},
{id:"threat-4",x:588,y:88,kind:"threat",label:"Anomalous auth",detail:"Signal fictif d'authentification anormale.",size:18},
{id:"threat-5",x:129,y:326,kind:"threat",label:"Host exposure",detail:"Vulnérabilité simulée d'un service d'entraînement.",size:18},
{id:"def-1",x:405,y:110,kind:"defense",label:"Suricata",detail:"Observation et détection sur trafic réseau.",size:18},
{id:"def-2",x:725,y:89,kind:"defense",label:"Wazuh",detail:"Télémétrie hôtes et détection.",size:19},
{id:"def-3",x:898,y:232,kind:"defense",label:"SOAR",detail:"Automatisation encadrée des étapes de réponse.",size:19},
{id:"def-4",x:750,y:418,kind:"defense",label:"Telemetry",detail:"Événements bruts et pistes de corrélation.",size:18},
{id:"def-5",x:245,y:82,kind:"defense",label:"Linux logs",detail:"Traces systèmes collectées en environnement de test.",size:16},
{id:"sig-1",x:289,y:176,kind:"signal",label:"T1110",detail:"MITRE ATT&CK : Brute Force.",size:10},
{id:"sig-2",x:240,y:205,kind:"signal",label:"Auth log",detail:"Journal de connexion simulé.",size:9},
{id:"sig-3",x:223,y:120,kind:"signal",label:"SSH",detail:"Service SSH de laboratoire.",size:9},
{id:"sig-4",x:163,y:93,kind:"signal",label:"Source",detail:"Source simulée.",size:7},
{id:"sig-5",x:131,y:218,kind:"signal",label:"Attempt",detail:"Échec de connexion simulé.",size:8},
{id:"sig-6",x:377,y:300,kind:"signal",label:"SIEM",detail:"Source d'événement.",size:9},
{id:"sig-7",x:486,y:293,kind:"signal",label:"Agent",detail:"Agent de collecte.",size:9},
{id:"sig-8",x:597,y:330,kind:"signal",label:"Correlation",detail:"Corrélation d'événements.",size:9},
{id:"sig-9",x:765,y:279,kind:"signal",label:"Port scan",detail:"Scénario de reconnaissance.",size:10},
{id:"sig-10",x:824,y:253,kind:"signal",label:"IDOR",detail:"Contrôle d'accès aux objets.",size:8},
{id:"sig-11",x:940,y:394,kind:"signal",label:"Alert",detail:"Alerte fictive.",size:10},
{id:"sig-12",x:958,y:293,kind:"signal",label:"Probe",detail:"Tentative fictive.",size:8},
{id:"sig-13",x:1008,y:351,kind:"signal",label:"Check",detail:"Vérification fictive.",size:8},
{id:"sig-14",x:943,y:72,kind:"signal",label:"Request",detail:"Requête fictive.",size:8},
{id:"sig-15",x:1003,y:169,kind:"signal",label:"API",detail:"Service web simulé.",size:8},
{id:"sig-16",x:851,y:75,kind:"signal",label:"Traffic",detail:"Trafic simulé.",size:8},
{id:"sig-17",x:617,y:35,kind:"signal",label:"Attempt",detail:"Tentative fictive.",size:7},
{id:"sig-18",x:535,y:42,kind:"signal",label:"Trace",detail:"Trace simulée.",size:7},
{id:"sig-19",x:493,y:141,kind:"signal",label:"Asset",detail:"Ressource de laboratoire.",size:10},
{id:"sig-20",x:830,y:410,kind:"signal",label:"Workflow",detail:"Workflow de réponse simulé.",size:9},
{id:"sig-21",x:686,y:444,kind:"signal",label:"Case",detail:"Fiche de cas.",size:8},
{id:"sig-22",x:391,y:430,kind:"signal",label:"Script",detail:"Script d'automatisation.",size:8},
{id:"sig-23",x:283,y:416,kind:"signal",label:"Exploit",detail:"Test d'exploitation autorisé.",size:8},
{id:"sig-24",x:168,y:408,kind:"signal",label:"Flag",detail:"Résultat de challenge.",size:8},
{id:"sig-25",x:612,y:411,kind:"signal",label:"Curriculum",detail:"Parcours de compétence.",size:8}
];
export type AtlasRelation = "portfolio"|"implements"|"investigates"|"produces"|"supports";
export type AtlasEdge = {from:string;to:string;relation:AtlasRelation;reason:string};
const relationship=(from:string,to:string,relation:AtlasRelation,reason:string):AtlasEdge=>({from,to,relation,reason});
export const atlasEdges:AtlasEdge[]=[
  relationship("core","cybermind","portfolio","CyberMind X fait partie des cinq dossiers du portfolio."),
  relationship("core","honeyshield","portfolio","HoneyShield fait partie des cinq dossiers du portfolio."),
  relationship("core","lumina","portfolio","Lumina Academy fait partie des cinq dossiers du portfolio."),
  relationship("core","mcp","portfolio","AI / MCP fait partie des cinq dossiers du portfolio."),
  relationship("core","ctf","portfolio","Labs & CTF fait partie des cinq dossiers du portfolio."),
  relationship("cybermind","def-1","implements","Le laboratoire CyberMind X utilise Suricata pour la visibilité réseau."),
  relationship("cybermind","def-2","implements","Le laboratoire CyberMind X utilise Wazuh pour les signaux hôtes."),
  relationship("cybermind","def-3","implements","L'orchestration avec Shuffle SOAR est un composant expérimental de CyberMind X."),
  relationship("cybermind","sig-6","supports","Un SIEM regroupe les événements pour aider l'analyste à les interpréter."),
  relationship("cybermind","sig-7","supports","Un agent peut produire des événements qui alimentent l'investigation."),
  relationship("honeyshield","def-4","implements","Un honeypot doit recueillir de la télémétrie contrôlée."),
  relationship("honeyshield","def-5","supports","Les journaux permettent d'examiner les connexions au service simulé."),
  relationship("honeyshield","sig-20","supports","Une réponse à une observation nécessite un workflow explicite et prudent."),
  relationship("mcp","sig-22","implements","Le projet explore l'intégration de scripts et d'outils par MCP."),
  relationship("lumina","sig-25","produces","Lumina Academy structure une progression sous forme de parcours."),
  relationship("lumina","sig-21","produces","Une étude de cas documente l'application d'une compétence."),
  relationship("ctf","sig-23","investigates","Les labs d'exploitation se limitent aux cibles autorisées."),
  relationship("ctf","sig-24","produces","Un flag valide un objectif de challenge, pas une maîtrise complète."),
  relationship("threat-1","honeyshield","investigates","Le honeypot permet d'observer les interactions SSH en laboratoire."),
  relationship("threat-1","cybermind","investigates","Le SOC corrèle les échecs d'authentification pour vérifier une hypothèse de brute force."),
  relationship("threat-1","sig-1","produces","La technique T1110 permet de catégoriser la tentative de brute force."),
  relationship("threat-1","sig-2","produces","Les journaux d'authentification fournissent des événements datés."),
  relationship("threat-1","sig-3","produces","SSH est le service faisant l'objet de l'observation."),
  relationship("sig-3","sig-4","supports","Chaque événement de connexion possède un contexte de source."),
  relationship("sig-2","sig-5","produces","Une tentative refusée est visible dans le journal de test."),
  relationship("threat-2","ctf","investigates","La vérification des accès objet relève de la pratique Web/API en lab."),
  relationship("threat-2","sig-10","produces","Un contrôle d'accès défaillant peut permettre d'accéder à l'objet d'un autre compte."),
  relationship("threat-2","sig-11","produces","La différence de réponse entre deux comptes forme un indice à analyser."),
  relationship("threat-2","sig-12","supports","Une requête de test utilise un compte explicitement autorisé."),
  relationship("threat-2","sig-13","supports","Le contrôle attendu est de refuser l'accès à l'objet non autorisé."),
  relationship("threat-3","ctf","investigates","Une anomalie de requêtes API se valide sur une API d'entraînement."),
  relationship("threat-3","sig-14","produces","Une série de requêtes inhabituelles constitue la matière d'observation."),
  relationship("threat-3","sig-15","supports","L'application API est le périmètre contrôlé du scénario."),
  relationship("threat-3","sig-16","produces","Les journaux d'accès permettent de contextualiser les demandes."),
  relationship("threat-4","cybermind","investigates","La chaîne SOC aide à contextualiser une authentification inhabituelle."),
  relationship("threat-4","sig-17","produces","Une séquence de connexion peut indiquer un comportement anormal."),
  relationship("threat-4","sig-18","produces","Une trace de connexion doit pouvoir être rattachée à un horodatage."),
  relationship("threat-4","sig-19","supports","Le compte et la ressource ciblés déterminent le niveau de risque."),
  relationship("threat-5","ctf","investigates","La recherche d'exposition se fait uniquement sur une machine de lab."),
  relationship("def-1","sig-8","supports","Suricata participe à la détection et à la corrélation réseau."),
  relationship("def-2","sig-7","supports","Wazuh exploite des agents pour observer les hôtes."),
  relationship("def-3","sig-20","supports","Un SOAR peut coordonner une réponse après validation."),
  relationship("def-4","sig-9","produces","La télémétrie permet d'observer un scan réseau de test.")
];
export type LabSignal={
 id:string;nodeId:string;projectSlug:string;time:string;name:string;source:string;
 reference:string;severity:"high"|"medium"|"low";detail:string;
 hypothesis:string;observables:string[];investigation:string[];mitigation:string;learningGoal:string;
};
export const labSignals:LabSignal[]=[
{id:"ssh",nodeId:"threat-1",projectSlug:"cybermind-x",time:"LAB / 01",name:"Échecs répétés d'authentification SSH",
 source:"Linux / honeypot de test",reference:"MITRE T1110",severity:"high",
 detail:"Un ensemble d'échecs SSH rapprochés pourrait évoquer une recherche de mot de passe, mais seul le contexte permet de conclure.",
 hypothesis:"Un acteur ou un script réalise une série de tentatives de connexion non autorisées.",
 observables:["Nombre d'échecs par intervalle et par compte","Adresse source, type de compte, succès éventuel","Événements de connexion du honeypot et de l'hôte"],
 investigation:["Choisir un intervalle et collecter les événements SSH du laboratoire.","Grouper par source, utilisateur et résultat.","Comparer aux tests prévus et aux connexions attendues.","Décrire les conditions qui confirment ou infirment l'hypothèse."],
 mitigation:"Limiter l'accès SSH, utiliser des clés, MFA lorsque disponible et une journalisation vérifiée.",
 learningGoal:"Distinguer un signal de brute force d'un incident confirmé."
},
{id:"object",nodeId:"threat-2",projectSlug:"labs-ctf",time:"LAB / 02",name:"Contrôle d'accès objet / IDOR",
 source:"API de laboratoire / deux comptes",reference:"CWE-639 · OWASP API1:2023",severity:"high",
 detail:"Deux identités de test essaient un objet différent. Une réponse inattendue peut révéler une faille de contrôle d'accès.",
 hypothesis:"L'API vérifie l'authentification mais pas l'autorisation sur l'objet demandé.",
 observables:["Identité de session et propriétaire de l'objet","Identifiant cible et code de réponse","Différences de contenu sans données personnelles réelles"],
 investigation:["Créer deux comptes de test isolés et deux objets appartenant chacun à un compte.","Consulter un objet autorisé depuis son compte propriétaire.","Modifier uniquement l'identifiant d'un objet de test.","Confirmer si l'API bloque ou autorise indûment l'accès."],
 mitigation:"Vérifier côté serveur les autorisations sur chaque objet et ajouter des tests automatiques multi-comptes.",
 learningGoal:"Comprendre la différence entre authentification et autorisation objet."
},
{id:"api",nodeId:"threat-3",projectSlug:"labs-ctf",time:"LAB / 03",name:"Séquence atypique de requêtes API",
 source:"Logs HTTP / API d'entraînement",reference:"OBSERVATION HTTP",severity:"medium",
 detail:"Un pic de requêtes et des erreurs HTTP ne prouvent pas une attaque ; ils motivent une investigation.",
 hypothesis:"Une automatisation de tests ou un client mal configuré génère la séquence atypique.",
 observables:["Nombre de requêtes et codes de statut par fenêtre","Chemin HTTP, compte de test et agent client","Horodatage et environnement d'origine"],
 investigation:["Définir une fenêtre de temps sur les journaux de l'API de test.","Distinguer trafic normal, tests autorisés et erreurs de configuration.","Corréler les requêtes aux scénarios connus.","Documenter une explication alternative avant d'alerter."],
 mitigation:"Contrôler les accès, limiter les abus et ajouter une observation API adaptée au contexte.",
 learningGoal:"Analyser un comportement HTTP sans le qualifier prématurément de malveillant."
},
{id:"auth",nodeId:"threat-4",projectSlug:"cybermind-x",time:"LAB / 04",name:"Connexion inattendue à un compte",
 source:"Wazuh / journaux d'authentification",reference:"AUTHENTICATION ANALYSIS",severity:"medium",
 detail:"Une connexion inhabituelle n'est pas une compromission avérée : horaires, sources et activité doivent être croisés.",
 hypothesis:"Un compte de test est utilisé dans un contexte différent des habitudes prévues.",
 observables:["Compte, hôte, méthode d'authentification","Événements autour de la connexion","Correspondance avec le calendrier de tests"],
 investigation:["Relever le signal avec son horodatage et son hôte.","Comparer aux actions planifiées du laboratoire.","Rechercher une authentification antérieure et une action subséquente.","Conclure avec un niveau d'incertitude explicite."],
 mitigation:"Activer MFA, supervision des authentifications et revue des privilèges selon les risques.",
 learningGoal:"Construire une hypothèse SOC avec un contexte suffisant."
},
{id:"exposure",nodeId:"threat-5",projectSlug:"labs-ctf",time:"LAB / 05",name:"Service de laboratoire exposé",
 source:"Nmap / machine autorisée",reference:"ATTACK SURFACE",severity:"low",
 detail:"Un port ouvert décrit une surface d'exposition, pas une vulnérabilité en soi.",
 hypothesis:"Un service de test accessible possède une configuration pouvant justifier des contrôles supplémentaires.",
 observables:["Protocole, port, version du service si observable","Périmètre d'autorisation et nécessité du service","Configuration et protections pertinentes"],
 investigation:["Définir précisément l'hôte autorisé.","Inventorier les seuls ports et services concernés.","Vérifier la configuration sans perturber le service.","Rédiger une recommandation proportionnée aux faits."],
 mitigation:"Réduire l'exposition, maintenir les services à jour et appliquer le moindre privilège.",
 learningGoal:"Distinguer exposition, mauvaise configuration et vulnérabilité exploitée."
}
];
