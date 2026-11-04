/** Outbound links in one place, so changing one needs no component edit. */

/**
 * pages.dev stays out of search indexes until the custom domain is attached (DAV-15).
 * One check for the robots meta tag and for robots.txt.
 */
export function isIndexableHost(hostname: string): boolean {
  return !hostname.endsWith(".pages.dev");
}

/** The Substack publication (ADR-0002). DAV-21 renames the subdomain and adds a `blog.` domain. */
export const substackUrl = "https://baltiskaskronikis.substack.com";

/**
 * PLACEHOLDER: the public URL of the site's source repository, for the AGPL link in the footer.
 * Alexandre will settle the real URL later. The `.invalid` TLD can never resolve.
 */
export const sourceRepoUrl = "https://example.invalid/datavirgo-web-source";
