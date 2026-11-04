import { getCollection, getEntry, render } from "astro:content";
import { defaultLocale } from "../i18n";

/** A page entry and its rendered Markdown. The id is `<locale>/<name>`. */
export async function loadPage(name: string, locale: string = defaultLocale) {
  const id = `${locale}/${name}`;
  const entry = await getEntry("pages", id);
  if (!entry) {
    throw new Error(`Missing pages entry "${id}"`);
  }
  const { Content } = await render(entry);
  return { entry, Content };
}

/**
 * Plain sections of a page body, split on a line that is only `@@`.
 * Home uses this so each blurb can sit in a column next to a real link.
 */
export function slots(
  body: string | undefined,
  expected: number,
  id: string,
): string[] {
  const parts = (body ?? "").split(/\n@@\n/).map((part) => part.trim());
  if (parts.length !== expected || parts.some((part) => part === "")) {
    throw new Error(
      `Page "${id}" must contain ${expected} sections separated by a line with only @@`,
    );
  }
  return parts;
}

/** Testimonial entries for one locale, in stable id order. */
export async function loadTestimonials(locale: string = defaultLocale) {
  const entries = await getCollection("testimonials");
  return entries
    .filter((entry) => entry.id.startsWith(`${locale}/`))
    .sort((a, b) => a.id.localeCompare(b.id));
}
