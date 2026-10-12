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
export const atlasEdges:[string,string][]=[
["core","cybermind"],["core","honeyshield"],["core","lumina"],["core","mcp"],["core","ctf"],
["core","def-1"],["core","def-2"],["core","def-3"],["core","def-4"],
["cybermind","threat-1"],["honeyshield","threat-2"],["honeyshield","threat-3"],["cybermind","threat-4"],["ctf","threat-5"],
["cybermind","def-1"],["cybermind","def-2"],["honeyshield","def-3"],["mcp","def-4"],
["ctf","mcp"],["honeyshield","lumina"],["def-1","def-2"],["def-3","def-4"],
["threat-1","sig-1"],["threat-1","sig-2"],["threat-1","sig-3"],["threat-1","sig-4"],["threat-1","sig-5"],
["threat-2","sig-10"],["threat-2","sig-11"],["threat-2","sig-12"],["threat-2","sig-13"],
["threat-3","sig-14"],["threat-3","sig-15"],["threat-3","sig-16"],
["threat-4","sig-17"],["threat-4","sig-18"],["threat-4","sig-19"],
["threat-5","ctf"],["cybermind","sig-6"],["core","sig-7"],["core","sig-8"],["honeyshield","sig-9"],
["mcp","sig-22"],["ctf","sig-23"],["ctf","sig-24"],["lumina","sig-25"],["lumina","sig-21"],["honeyshield","sig-20"],
["sig-1","sig-2"],["sig-3","sig-4"],["sig-10","sig-11"],["sig-20","sig-11"],["sig-8","sig-9"]
];
export const labSignals=[
{time:"SIM / 01",name:"Échecs d'authentification SSH",source:"Linux / honeypot",technique:"T1110",severity:"high",detail:"Dans un environnement de laboratoire, analyser fréquence, identifiants et origine des tentatives d'authentification."},
{time:"SIM / 02",name:"Exécution PowerShell suspecte",source:"Windows / test contrôlé",technique:"T1059",severity:"high",detail:"Étudier les journaux de processus, la ligne de commande et le contexte de l'exécution."},
{time:"SIM / 03",name:"Modification de fichier sensible",source:"Wazuh / file integrity",technique:"T1565",severity:"medium",detail:"Corréler la modification à l'utilisateur, l'horodatage et la politique d'intégrité."},
{time:"SIM / 04",name:"Mouvement latéral hypothétique",source:"Windows / SMB lab",technique:"T1021",severity:"high",detail:"Observer authentification, communication inter-hôtes et permissions de comptes dans un laboratoire autorisé."},
{time:"SIM / 05",name:"Analyse d'une requête API",source:"Web / authorization test",technique:"T1190",severity:"low",detail:"Vérifier les contrôles d'accès objet par objet et comparer deux sessions de test."}
];
