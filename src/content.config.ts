import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["published", "draft"]).default("published")
});

const writeups = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writeups" }),
  schema: baseSchema.extend({
    platform: z.string().optional(),
    difficulty: z.string().optional(),
    category: z.string().optional(),
    section: z.string().optional(),
    os: z.string().optional(),
    service: z.string().optional(),
    tools: z.array(z.string()).default([]),
    context: z.string().optional(),
    activity: z.string().optional(),
    competitionId: z.string().optional(),
    competitionName: z.string().optional(),
    challengeCategory: z.string().optional(),
    tier: z.string().optional()
  })
});

const labs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/labs" }),
  schema: baseSchema.extend({
    domain: z.string(),
    state: z.enum(["active", "completed", "archived"]).default("completed")
  })
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: baseSchema.extend({
    topic: z.string()
  })
});

const ctf = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ctf" }),
  schema: baseSchema.extend({
    organizer: z.string().optional(),
    team: z.string().optional(),
    rank: z.string().optional(),
    score: z.string().optional(),
    platform: z.string().optional()
  })
});
const homelab = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/homelab" }),
  schema: baseSchema.extend({
    projectId: z.string(),
    projectName: z.string().optional(),
    documentKind: z.string().optional(),
    isProject: z.boolean().default(false),
    domain: z.string().optional(),
    state: z.string().optional(),
    platform: z.string().optional()
  })
});
export const collections = { writeups, labs, notes, ctf, homelab };
