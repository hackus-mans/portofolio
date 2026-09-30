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
    difficulty: z.string().optional()
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

export const collections = { writeups, labs, notes };
