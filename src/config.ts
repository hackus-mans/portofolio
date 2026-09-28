export const siteConfig={
name:"NAKORE Yendoubouame Joseph",handle:"Hackus Mans",title:"Étudiant en cybersécurité — Pentest, SOC, systèmes & réseaux",
description:"Portfolio de Hackus Mans : projets de cybersécurité, pentest en environnements autorisés, SOC, systèmes, réseaux, labs et write-ups.",
location:"Lomé, Togo",status:"Licence professionnelle en Cybersécurité · 2024–2027",
social:{email:"nakoreyendoubouamejoseph@gmail.com",github:"https://github.com/hackus-mans"},
aboutMe:"Je développe un profil offensif et défensif fondé sur la pratique, la documentation technique et la compréhension des systèmes. Mon objectif est de savoir administrer, analyser, auditer, attaquer dans des environnements autorisés, détecter les compromissions et participer à la réponse aux incidents.",
philosophy:"Compréhension > mémorisation. Raisonnement > copier-coller. Méthodologie > outils. Enumeration > exploitation.",
skills:["Pentest Web / API","Linux","Windows","Réseaux TCP/IP","SOC & SIEM","DFIR","Active Directory","Python","Bash","Cryptographie","CTF / Labs","Documentation technique"],
projects:[
{name:"HoneyShield",label:"Defensive Security",description:"Environnement honeypot conçu pour observer, collecter et analyser des comportements malveillants dans un cadre contrôlé.",skills:["Cowrie","Wazuh","Telemetry","Detection","Threat Analysis"],proof:"Projet primé · JPOPE 2026",link:"",internalLink:""},
{name:"CyberMind X",label:"SOC / Security Automation",description:"Assistant SOC expérimental réunissant collecte de télémétrie, détection, triage, orchestration et synthèse locale assistée par LLM.",skills:["Wazuh","Suricata","Zeek","Cowrie","Shuffle","Ollama"],proof:"En développement",link:"",internalLink:""},
{name:"Cybersecurity Knowledge Base",label:"Offensive Security",description:"Base de connaissances alimentée par mes labs, challenges, machines et write-ups sur des environnements explicitement autorisés.",skills:["Root-Me","TryHackMe","Hack The Box","Hackviser","Obsidian"],proof:"En évolution continue",link:"",internalLink:"work/"}
],
practice:[
{area:"Web Security",detail:"SQL Injection, LFI, analyse du code source, énumération et méthodologie OWASP."},
{area:"Systems",detail:"Linux/Windows, permissions, SMB, NTFS, services distants et privilege escalation en lab."},
{area:"Network Security",detail:"Nmap, TCP/IP, DNS, DHCP, services exposés, segmentation et analyse des flux."},
{area:"Blue Team",detail:"Wazuh, Suricata, Zeek, collecte de logs, détection, triage et investigation."}
],
credentials:[
{title:"Fortinet FortiGate 7.6 Operator",issuer:"Fortinet",date:"2025",status:"Obtenue",link:""},
{title:"Pre Security",issuer:"TryHackMe",date:"2026",status:"Obtenue",link:"https://tryhackme.com/certificate/THM-13KIK7HMPS"},
{title:"Networking Basics",issuer:"Cisco Networking Academy",date:"2025",status:"Obtenue",link:"https://www.credly.com/badges/3c81858a-755e-4681-b381-e96d5eb42559"},
{title:"SQL Injection — Challenge 1",issuer:"Red Team Leaders",date:"2026",status:"Obtenue",link:"https://courses.redteamleaders.com/completion/0031e37f73782002"}
],
inProgress:[{title:"CPTS",issuer:"Hack The Box",detail:"Parcours pratique de pentest et reporting."},{title:"CAPT",issuer:"Hackviser",detail:"Certification pratique offensive en préparation."}],
education:[{school:"IPNET Institute of Technology — Lomé",degree:"Licence professionnelle en Cybersécurité",dateRange:"Oct. 2024 — 2027",achievements:["Orientation : sécurité systèmes/réseaux, SOC et pentest.","Apprentissage renforcé par des labs, CTF et projets personnels.","Construction d’un portfolio de preuves techniques reproductibles."]}],
writeups:[
{title:"Breaking RSA",platform:"TryHackMe",category:"Cryptographie",summary:"Étude d’une mauvaise implémentation RSA et factorisation de Fermat.",tags:["RSA","Cryptographie","Recon"]},
{title:"Local File Inclusion",platform:"Root-Me",category:"Web exploitation",summary:"Analyse d’une vulnérabilité LFI et du rôle de la validation des chemins.",tags:["LFI","Web","Input Validation"]},
{title:"Directory Traversal",platform:"Root-Me",category:"Web exploitation",summary:"Travail sur la manipulation de chemins et l’accès contrôlé aux ressources serveur.",tags:["Traversal","Web","Enumeration"]},
{title:"HTML — Code source",platform:"Root-Me",category:"Web exploitation",summary:"Recherche d’informations sensibles exposées dans le code source côté client.",tags:["HTML","Recon","Information Disclosure"]},
{title:"Hash DCC / DCC2",platform:"Root-Me",category:"Cryptographie",summary:"Manipulation et compréhension de formats de hash Windows dans un challenge contrôlé.",tags:["Hashing","DCC","Password Security"]}
]};
