import { defaultLocale } from "./index";

/** Route key to slug, per locale. Components use route keys, never paths. */
export const routes = {
  home: { en: "" },
  about: { en: "about" },
  approach: { en: "approach" },
  consultations: { en: "consultations" },
  testimonials: { en: "testimonials" },
  blog: { en: "blog" },
  chart: { en: "chart" },
  privacy: { en: "privacy" },
} as const satisfies Record<string, Record<string, string>>;

export type RouteKey = keyof typeof routes;

/** The localised slug for a route. A missing locale entry throws, so the build fails. */
export function routeSlug(
  route: RouteKey,
  locale: string = defaultLocale,
): string {
  const slugs: Record<string, string> = routes[route];
  const slug = slugs[locale];
  if (slug === undefined) {
    throw new Error(`No slug for route "${route}" in locale "${locale}"`);
  }
  return slug;
}
