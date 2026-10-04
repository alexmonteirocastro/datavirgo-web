import type { MessageKey } from "../i18n";
import type { RouteKey } from "../i18n/routes";
import { features, type FeatureKey } from "./features";

export interface NavItem {
  route: RouteKey;
  label: MessageKey;
  /** The item is left out of the build unless this feature is on. */
  requires?: FeatureKey;
}

export const navItems: readonly NavItem[] = [
  { route: "about", label: "nav.about" },
  { route: "approach", label: "nav.approach" },
  { route: "consultations", label: "nav.consultations" },
  { route: "testimonials", label: "nav.testimonials" },
  { route: "blog", label: "nav.blog" },
  { route: "chart", label: "nav.chart", requires: "chartTool" },
];

/** The items to render: a gated item is filtered out at build time while its flag is off. */
export function visibleNavItems(
  enabled: Record<FeatureKey, boolean> = features,
): NavItem[] {
  return navItems.filter((item) => !item.requires || enabled[item.requires]);
}
