export const site = {
  name: "Joseph Yendoubouame NAKORE",
  shortName: "Joseph NAKORE",
  handle: "hackus-mans",
  location: "Lomé, Togo",
  role: "Étudiant en cybersécurité · Pentest, systèmes, réseaux & SOC",
  headline: "Je cherche à comprendre les systèmes jusque dans leurs failles — pour apprendre à mieux les défendre.",
  intro: "Étudiant en cybersécurité à IPNET Institute of Technology, je développe un profil pratique à l'intersection du pentest, de la sécurité systèmes/réseaux, du Web/API, du SOC, de l'IA et de l'automatisation.",
  social: [
    { label: "GitHub", href: "https://github.com/hackus-mans" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/yendoubouame-joseph-nakore/" }
  ],
  proof: [
    { value: "1er Prix", label: "JPOPE 2026", detail: "HoneyShield" },
    { value: "Top 1 ×2", label: "CTF", detail: "Résultats déclarés" },
    { value: "Top 3", label: "Cyberbattle", detail: "IPNET" },
    { value: "2024—2027", label: "Licence pro", detail: "Cybersécurité" }
  ],
  capabilities: [
    { title:"Sécurité offensive", summary:"Tester les hypothèses. Comprendre les failles.", description:"Reconnaissance, énumération, exploitation autorisée, élévation de privilèges et restitution méthodique.", tools:["Nmap","Burp Suite","ffuf","Linux","Windows","Web / API"] },
    { title:"Détection & SOC", summary:"Relier le comportement à une trace.", description:"Télémétrie hôte et réseau, honeypots, investigation et orchestration de réponses dans des laboratoires.", tools:["Wazuh","Suricata","Cowrie","Shuffle","Docker","SOC"] },
    { title:"Systèmes & réseau", summary:"Comprendre avant de sécuriser.", description:"Administration Linux/Windows, protocoles, permissions, services, SMB/RDP et fondamentaux Active Directory.", tools:["Linux","Windows","TCP/IP","SMB","RDP","Active Directory"] },
    { title:"Engineering, IA & automation", summary:"Construire des outils plutôt que les accumuler.", description:"Python, intégration d'outils, interfaces Web/API, automatisation et expérimentation avec les modèles de langage.", tools:["Python","Bash","JavaScript","Docker","MCP","LLM"] }
  ],
  projects: [
    {
      index:"01",slug:"cybermind-x",name:"CyberMind X",type:"SECURITY ENGINEERING / SOC",
      summary:"Environnement SOC expérimental reliant télémétrie, détection, honeypot, orchestration et assistance IA.",
      outcome:"Architecture expérimentale",status:"Laboratoire en évolution",
      tags:["Wazuh","Suricata","Cowrie","Shuffle","Ollama"],
      href:"projects/cybermind-x/"
    },
    {
      index:"02",slug:"honeyshield",name:"HoneyShield",type:"HONEYPOT / THREAT ANALYSIS",
      summary:"Observation d'activité hostile et analyse de télémétrie dans un environnement contrôlé, récompensé à JPOPE 2026.",
      outcome:"1er Prix JPOPE 2026",status:"Projet présenté",
      tags:["Honeypot","Télémétrie","Analyse","IA"],
      href:"projects/honeyshield/"
    },
    {
      index:"03",slug:"lumina-academy",name:"Lumina Academy",type:"LEARNING PLATFORM / ENGINEERING",
      summary:"Roadmap interactive reliant les fondamentaux systèmes et réseaux aux parcours avancés de cybersécurité.",
      outcome:"Roadmap publique",status:"En développement",
      tags:["Roadmap","Web","Pédagogie","Cybersecurity"],
      href:"projects/lumina-academy/"
    },
    {
      index:"04",slug:"mcp-automation",name:"AI × MCP Automation",type:"AI INTEGRATION / AUTOMATION",
      summary:"Expérimentation déclarée d'une passerelle reliant assistants IA compatibles et messagerie, avec orchestration via MCP.",
      outcome:"Expérimentation personnelle",status:"Capacités à documenter",
      tags:["MCP","Automation","WhatsApp","AI"],
      href:"projects/mcp-automation/"
    },
    {
      index:"05",slug:"labs-ctf",name:"Labs & CTF",type:"OFFENSIVE SECURITY / PRACTICE",
      summary:"Pratique continue sur plateformes d'entraînement, méthodologie d'énumération, validation et documentation.",
      outcome:"Top 1 ×2 · Top 3",status:"En cours",
      tags:["Hack The Box","TryHackMe","Web","Linux","CTF"],
      href:"projects/labs-ctf/"
    }
  ],
  certifications:[
    "Fortinet Certified Associate Cybersecurity",
    "Fortinet Certified Fundamentals Cybersecurity",
    "FortiGate 7.6 Operator",
    "Cisco — Cybersecurity & Networking Basics",
    "CPPS — Hack&fix"
  ],
  currentTargets:["HTB CPTS","Hackviser CAPT"],
  education:{school:"IPNET Institute of Technology",program:"Licence professionnelle en Cybersécurité",period:"2024–2027",location:"Lomé, Togo"},
  roadmap:{
    name:"Lumina Academy",
    description:"Une roadmap interactive qui structure le passage des fondamentaux systèmes/réseaux vers le pentest Web/API, Linux/Windows, Active Directory et les spécialisations offensives et défensives.",
    stats:[{value:"22",label:"compétences"},{value:"42",label:"liens de prérequis"},{value:"6",label:"spécialisations"}]
  }
};
