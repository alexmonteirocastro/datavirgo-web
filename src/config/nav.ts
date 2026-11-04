import type { MessageKey } from "../i18n";
import type { RouteKey } from "../i18n/routes";
import { features, type FeatureKey } from "./features";

export interface NavItem {
  route: RouteKey;
  label: MessageKey;
  /** The item is left out of the build unless this feature is on. */
  requires?: FeatureKey;
  /**
   * When set, the link goes here instead of `route`.
   * Approach stays a nav item and points at the section on About.
   */
  linkTo?: { route: RouteKey; hash: string };
}

export const navItems: readonly NavItem[] = [
  { route: "about", label: "nav.about" },
  {
    route: "approach",
    label: "nav.approach",
    linkTo: { route: "about", hash: "approach" },
  },
  { route: "chart", label: "nav.chart", requires: "chartTool" },
  { route: "blog", label: "nav.blog" },
  { route: "consultations", label: "nav.consultations" },
];

/** The items to render: a gated item is filtered out at build time while its flag is off. */
export function visibleNavItems(
  enabled: Record<FeatureKey, boolean> = features,
): NavItem[] {
  return navItems.filter((item) => !item.requires || enabled[item.requires]);
}
