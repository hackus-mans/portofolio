# NAKORE Cyber Intelligence

A professional cybersecurity portfolio styled as a blue/red SOC dashboard, built in Astro. The graph is an interactive educational visualization, not a real-time threat feed.

- Unified dark sidebar and routing for home, articles, labs, writeups and case studies.
- SVG network of the user's actual projects and simulated threat-scenario nodes.
- Interactive filters, keyboard-accessible graph nodes, zoom and context inspector.
- Project Intelligence widget selects real case studies.
- Simulated event feed opens a detailed educational explanation.
- Search filters project and simulation rows.

## Verification

npm ci && npm run build && node scripts/verify-dist.mjs

Any real SOC telemetry integration would require a separate authenticated security-reviewed backend. Do not present the static demo as live observation.
