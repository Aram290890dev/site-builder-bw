import type { SiteConfig } from "@/types/builder";
import {
  DEFAULT_LISTING_SETTINGS,
  DEFAULT_DETAIL_SETTINGS,
  DEFAULT_CHECKOUT_SETTINGS,
} from "@/types/builder";

/**
 * Migrate old config format (flat sections) to new multi-page format.
 */
export function migrateConfig(raw: Record<string, unknown>): SiteConfig {
  if (raw.pages && raw.templates) {
    return raw as unknown as SiteConfig;
  }

  const oldSections = (raw.sections as unknown[]) ?? [];
  const theme = (raw.theme as SiteConfig["theme"]) ?? {
    primaryColor: "#4f46e5",
    fontFamily: "Inter",
  };

  return {
    theme,
    pages: [
      {
        id: "home",
        name: "Home",
        slug: "/",
        sections: oldSections as SiteConfig["pages"][0]["sections"],
      },
    ],
    templates: {
      listing: { ...DEFAULT_LISTING_SETTINGS },
      detail: { ...DEFAULT_DETAIL_SETTINGS },
      checkout: { ...DEFAULT_CHECKOUT_SETTINGS },
    },
  };
}
