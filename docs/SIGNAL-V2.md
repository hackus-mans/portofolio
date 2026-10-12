# NAKORE // SIGNAL — Portfolio visual redesign

Status: first implementation on the isolated branch \`redesign/signal-v2\`.
Production branch \`main\` is intentionally unchanged.

## Scope of phase 1

- Dedicated \`SignalLayout.astro\` with social metadata, canonical URL, structured person data and skip link.
- A design system in \`src/styles/signal.css\`: colors, type scale, spacing, buttons, grid layouts, project panels, transitions and responsive breakpoints.
- \`SignalNav.astro\`: responsive navigation, semantic anchors and a native \`details\` menu.
- \`SignalHero.astro\`: bold brand, existing portrait asset and a clearly labeled *illustrative* detection pipeline.
- \`SignalLab.astro\`: client-only educational scenario simulator with accessible tabs and keyboard navigation. It does not run commands, execute arbitrary input or contact any targets.
- Rebuilt homepage \`src/pages/index.astro\`, driven by the existing site configuration and Astro content collections.

## Deliberately retained

- Existing project pages and URLs, including CyberMind X, HoneyShield, Labs & CTF.
- Markdown content collections for writeups, labs and technical notes.
- Lumina Academy roadmap embedding and its URL.
- GitHub Pages static deployment workflow.
- Existing \`src/styles/global.css\` for older routes, isolated from the new homepage.

## Design tokens

| Token | Value | Usage |
| --- | --- | --- |
| Background | \`#080b12\` | Dark canvas |
| Raised surface | \`#0f1522\` | Panels |
| Foreground | \`#f5f6fa\` | Primary light text |
| Muted foreground | \`#a2adbe\` | Secondary text |
| Signal accent | \`#99a7ff\` | Links and emphasis |
| Light surface | \`#eeefeb\` | Editorial section |
| Light text | \`#171c29\` | Text on light surface |

Typography uses a system-font fallback chain. A self-hosted font choice can be introduced later without external requests.

## Editorial & security rules

- Never present a simulated event as an actual incident or a lab result.
- Distinguish credentials **in preparation** from certifications obtained.
- Preserve proof and links, and avoid publishing real secrets or personal infrastructure.
- All interactive security demonstrations must be safe browser simulations until a separately isolated backend has been designed and reviewed.

## Validation

Use \`npm ci && npm run build\`, then verify desktop/mobile layout, all links, keyboard navigation (including lab tabs and mobile menu), reduced-motion behavior and project subpages. The existing PR workflow runs the build on pull requests targeting \`main\`.

## Next phases

1. Migrate detail pages gradually onto shared v2 components; retain URLs.
2. Build richer evidence-driven case studies, using real screenshots and sanitized telemetry.
3. Add project search/filtering and optional research indexing.
4. Add safe interactive visualizations with meaningful technical explanations.
