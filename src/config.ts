export const site = {
  name: "Joseph Yendoubouame NAKORE",
  shortName: "Joseph NAKORE",
  handle: "hackus-mans",
  location: "Lomé, Togo",
  role: "Étudiant en cybersécurité · Pentest, systèmes, réseaux & SOC",
  headline: "Je transforme l’apprentissage cybersécurité en preuves concrètes.",
  intro:
    "Étudiant en cybersécurité à IPNET Institute of Technology, je développe un profil pratique à l’intersection du pentest, de la sécurité systèmes/réseaux, du Web/API et du SOC. Mon objectif : comprendre les mécanismes, construire des environnements, tester méthodiquement et savoir expliquer ce qui se passe.",
  social: [
    { label: "GitHub", href: "https://github.com/hackus-mans" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/yendoubouame-joseph-nakore/" }
  ],
  proof: [
    { value: "1er Prix", label: "JPOPE 2026", detail: "HoneyShield" },
    { value: "Top 1 ×2", label: "CTF", detail: "résultats en compétition" },
    { value: "Top 3", label: "Cyberbattle", detail: "IPNET" },
    { value: "2024–2027", label: "Licence Cyber", detail: "IPNET Institute of Technology" }
  ],
  capabilities: [
    {
      title: "Pentest & sécurité offensive",
      description: "Reconnaissance, énumération, validation d’hypothèses, exploitation autorisée, élévation de privilèges et reporting.",
      tools: ["Nmap", "Burp Suite", "ffuf", "Gobuster", "linPEAS", "WinPEAS"]
    },
    {
      title: "Systèmes & environnements d’entreprise",
      description: "Compréhension opérationnelle de Linux, Windows, services réseau, permissions, SMB/RDP et fondamentaux Active Directory.",
      tools: ["Linux", "Windows", "SMB", "RDP", "Active Directory", "Bash"]
    },
    {
      title: "Détection & SOC",
      description: "Collecte de télémétrie, corrélation, honeypots, détection réseau et orchestration de réponses dans des labs contrôlés.",
      tools: ["Wazuh", "Suricata", "Cowrie", "Shuffle", "Docker", "Ollama"]
    },
    {
      title: "Web, API & automatisation",
      description: "Analyse de flux HTTP, logique applicative, vulnérabilités Web/API et scripts d’automatisation pour accélérer l’analyse.",
      tools: ["HTTP", "Web/API", "Python", "JavaScript", "JSON", "Git"]
    }
  ],
  projects: [
    {
      index: "01",
      name: "CyberMind X",
      type: "Security Engineering · SOC",
      summary:
        "Un mini-SOC expérimental qui relie collecte, détection, honeypot, SOAR et assistance IA pour analyser les événements et orchestrer des réponses.",
      outcome: "Architecture SOC + IA",
      tags: ["Wazuh", "Suricata", "Cowrie", "Shuffle", "Docker", "Ollama"],
      href: "projects/cybermind-x/"
    },
    {
      index: "02",
      name: "HoneyShield",
      type: "Honeypot · Detection",
      summary:
        "Un projet orienté observation d’activité hostile, télémétrie et aide à l’analyse, récompensé lors de JPOPE 2026.",
      outcome: "1er Prix JPOPE 2026",
      tags: ["Honeypot", "Detection", "Telemetry", "Security + AI"],
      href: "projects/honeyshield/"
    },
    {
      index: "03",
      name: "Labs & CTF",
      type: "Offensive Security · Practice",
      summary:
        "Une pratique continue sur HTB, TryHackMe et en CTF pour transformer les fondamentaux en méthodologie reproductible.",
      outcome: "Top 1 ×2 · Top 3",
      tags: ["HTB", "TryHackMe", "Web", "Linux", "Windows", "CTF"],
      href: "projects/labs-ctf/"
    }
  ],
  certifications: [
    "Fortinet Certified Associate Cybersecurity",
    "Fortinet Certified Fundamentals Cybersecurity",
    "FortiGate 7.6 Operator",
    "Cisco — Cybersecurity & Networking Basics",
    "CPPS — Hack&fix"
  ],
  currentTargets: ["HTB CPTS", "Hackviser CAPT"],
  education: {
    school: "IPNET Institute of Technology",
    program: "Licence professionnelle en Cybersécurité",
    period: "2024–2027",
    location: "Lomé, Togo"
  },
  roadmap: {
    name: "Lumina Academy",
    description:
      "Une roadmap interactive qui structure le passage des fondations systèmes/réseaux vers le pentest Web/API, Linux/Windows PrivEsc, Active Directory, cloud et Red/Purple Team.",
    stats: [
      { value: "22", label: "compétences" },
      { value: "42", label: "liens de prérequis" },
      { value: "6", label: "spécialisations" }
    ]
  }
};
