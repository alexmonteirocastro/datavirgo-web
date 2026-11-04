import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Page prose lives in Markdown, one folder per locale (ADR-0002): src/content/pages/<locale>/.
// Chrome strings stay in src/i18n/<locale>.json and go through t(); only body prose is here.
// `placeholder` drives the visible placeholder marking; a page with real copy sets it false.
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    placeholder: z.boolean().default(true),
  }),
});

// Testimonials collection (ADR-0002). `features.testimonialsGuard` stays off until DAV-15;
// while off, placeholder or unconsented entries are allowed and stay visibly marked.
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    context: z.string(),
    consent: z.boolean().default(false),
    placeholder: z.boolean().default(true),
  }),
});

export const collections = { pages, testimonials };
