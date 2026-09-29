export const site = {
  name: "YOUR NAME",
  role: "Independent Engineer & Designer",
  intro:
    "A neutral portfolio starter built to present work, thinking, systems and outcomes without locking you into a single visual style.",
  email: "hello@example.com",
  social: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" }
  ],
  skills: ["Systems", "Frontend", "Architecture", "Research", "Automation", "Design"],
  projects: [
    {
      index: "01",
      name: "Atlas",
      type: "Platform redesign",
      summary: "A complex product simplified into a clear, measurable workflow.",
      metric: "−42% task time",
      tags: ["Research", "Architecture", "UI"],
      href: "case-study/"
    },
    {
      index: "02",
      name: "Orbit",
      type: "Developer tooling",
      summary: "A fast internal tool designed around visibility, automation and safe defaults.",
      metric: "3× faster",
      tags: ["DX", "Automation", "Systems"],
      href: "case-study/"
    },
    {
      index: "03",
      name: "Signal",
      type: "Experimental interface",
      summary: "A calm information-dense dashboard balancing speed, hierarchy and motion.",
      metric: "98 Lighthouse",
      tags: ["Astro", "Motion", "Design"],
      href: "case-study/"
    }
  ],
  stack: ["Astro", "TypeScript", "CSS", "Tailwind", "Node.js", "Git"],
  timeline: [
    { year: "01", title: "Understand", text: "Frame the problem, users, constraints and success criteria." },
    { year: "02", title: "Decide", text: "Document trade-offs instead of hiding them behind the final result." },
    { year: "03", title: "Build", text: "Ship the smallest coherent system, then improve from evidence." },
    { year: "04", title: "Measure", text: "Show what changed, what failed and what should happen next." }
  ]
};
