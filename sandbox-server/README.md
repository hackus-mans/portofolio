# Portfolio ephemeral Linux sandbox

This service is the runtime behind the portfolio's real terminal.

## Security model

Every browser session gets a new disposable container with:

- non-root UID 1000
- no network
- no host mounts
- read-only root filesystem
- all Linux capabilities dropped
- `no-new-privileges`
- 256 MB RAM limit
- 0.5 CPU limit
- 64 PID limit
- temporary `/home/guest` and `/tmp`
- 15 minute absolute TTL
- 5 minute idle TTL
- immediate cleanup after the WebSocket disconnects

Do **not** run this service on the same host as sensitive production workloads. Prefer a dedicated VPS and a rootless container runtime (rootless Docker or Podman).

## Local setup

Build the sandbox image:

```bash
cd sandbox-server
docker build -t portfolio-sandbox:latest sandbox-image
```

Install and start the gateway:

```bash
npm install
cp .env.example .env
set -a
. ./.env
set +a
npm start
```

Test:

```bash
curl http://127.0.0.1:8787/api/health
```

For local browser testing, `ALLOWED_ORIGINS` already supports Astro on localhost by default.

## Production

1. Use a dedicated VPS.
2. Install a rootless container runtime.
3. Build `portfolio-sandbox:latest`.
4. Run the gateway as an unprivileged service.
5. Put Caddy/Nginx in front of it for HTTPS + WebSocket proxying.
6. Set `PUBLIC_BASE_URL=https://terminal.your-domain.tld`.
7. Restrict `ALLOWED_ORIGINS=https://hackus-mans.github.io`.
8. Put the final HTTPS gateway URL in `public/runtime-config.js` in the portfolio.

The frontend intentionally treats the sandbox as offline until that URL is configured.

## Runtime API

- `GET /api/health`
- `POST /api/sessions`
- `DELETE /api/sessions/:id`
- `WS /ws/:id?token=...`

The session token is random, ephemeral and never persisted.
