# Fusion portfolio + roadmap + ephemeral Linux

The portfolio is an Astro static site deployed to GitHub Pages. It now has two connected interactive experiences:

- **Roadmap** — embeds the live Lumina Academy roadmap from `https://hackus-mans.github.io/roadmap/`. Visitors can use it and keep their own progress in browser storage.
- **Linux Sandbox** — a real browser terminal UI that connects over WebSocket to a separate ephemeral-container gateway.

## Frontend

```bash
npm ci
npm run dev
npm run build
```

Routes:

- `/` portfolio
- `/roadmap/` embedded interactive roadmap
- `/terminal/` real sandbox terminal client
- `/case-study/` sample case study

The public sandbox gateway URL is configured in:

```text
public/runtime-config.js
```

It is deliberately empty until a dedicated sandbox host is deployed.

## Sandbox backend

See `sandbox-server/README.md`.

The sandbox backend is separated from GitHub Pages because a static host cannot create Linux processes or WebSocket-backed disposable containers.

## Security defaults

The public shell is not a shell on the portfolio server. Each visitor receives a separate non-root container with no network, no host mounts, a read-only root filesystem, strict CPU/RAM/PID limits, temporary storage and automatic destruction.

## GitHub Pages

Frontend URL:

```text
https://hackus-mans.github.io/portofolio/
```
