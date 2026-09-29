# Fusion portfolio + live roadmap + GitHub Codespaces lab

This Astro portfolio is deployed on GitHub Pages and connects two interactive experiences:

- **Roadmap** — the live Lumina Academy roadmap is embedded from `https://hackus-mans.github.io/roadmap/`. Changes deployed in the roadmap repository appear automatically inside the portfolio.
- **Linux Lab** — visitors launch a personal GitHub Codespace from this repository. The checked-in `.devcontainer/` config prepares the Linux environment automatically.

## Frontend

```bash
npm ci
npm run dev
npm run build
```

Routes:

- `/` portfolio
- `/roadmap/` live embedded roadmap
- `/terminal/` GitHub Codespaces Linux Lab launcher
- `/case-study/` sample case study

## Linux Lab

Direct Codespaces creation URL:

```text
https://codespaces.new/hackus-mans/portofolio?quickstart=1
```

Environment definition:

```text
.devcontainer/
├── devcontainer.json
├── Dockerfile
├── setup-lab.sh
└── welcome.sh
```

Practice workspace:

```text
lab/
├── README.md
├── check-environment.sh
├── exercises/
├── playground/
└── notes/
```

A Codespace belongs to the GitHub account that creates it. Closing a browser tab does not immediately delete it; the user can stop or delete it through GitHub.

## GitHub Pages

```text
https://hackus-mans.github.io/portofolio/
```
