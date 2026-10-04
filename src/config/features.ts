export type FeatureKey = "chartTool" | "testimonialsGuard";

/**
 * Launch-time feature flags (ADR-0002). Flip a value here, nowhere else.
 *
 * chartTool: gates the chart-tool nav item, the home section and the /chart route.
 *   Off at launch. DAV-23 turns it on.
 * testimonialsGuard: placeholder or unconsented testimonials fail the build when on.
 *   This ticket only adds the value. DAV-15 sets it to true before the custom domain goes live.
 */
export const features: Record<FeatureKey, boolean> = {
  chartTool: false,
  testimonialsGuard: false,
};
