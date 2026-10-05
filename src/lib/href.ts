import { getRelativeLocaleUrl } from "astro:i18n";
import { defaultLocale } from "../i18n";
import { routeSlug, type RouteKey } from "../i18n/routes";

/** A localised internal link from a route key. No component writes a path by hand. */
export function href(route: RouteKey, locale: string = defaultLocale): string {
  return getRelativeLocaleUrl(locale, routeSlug(route, locale));
}
