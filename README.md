# Joseph NAKORE — living cybersecurity portfolio

Astro portfolio deployed on GitHub Pages:

```text
https://hackus-mans.github.io/portofolio/
```

This repository is designed as a long-term platform rather than a static landing page.

## Main sections

- `/projects/` — flagship projects
- `/writeups/` — technical writeups
- `/labs/` — labs and experiments
- `/notes/` — technical notes and checklists
- `/roadmap/` — live embedded Lumina Academy roadmap

## Add content without redesigning the site

Content is managed with Astro Content Collections.

### New writeup

Create:

```text
src/content/writeups/my-writeup.md
```

Frontmatter:

```yaml
---
title: "Title"
summary: "Short description"
publishedAt: 2026-09-30
tags: ["Web", "Linux"]
platform: "HTB"
difficulty: "Medium"
featured: false
status: "published"
---
```

### New lab

Create:

```text
src/content/labs/my-lab.md
```

### New note

Create:

```text
src/content/notes/my-note.md
```

The archive page and individual page are generated automatically at build time.

## Local development

```bash
npm ci
npm run dev
npm run build
```

## Roadmap integration

The portfolio embeds the published roadmap directly from:

```text
https://hackus-mans.github.io/roadmap/
```

Therefore roadmap repository changes become visible in the portfolio after the roadmap deployment completes.
