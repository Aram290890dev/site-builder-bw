import { getSiteByDomain } from "./data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { SiteTheme } from "@/types/builder";

function googleFontsUrl(theme: SiteTheme): string | null {
  const families = new Set<string>();
  const body = theme.fontFamily ?? "Inter";
  const heading = theme.headingFont ?? body;

  for (const f of [body, heading]) {
    if (f && f !== "system-ui") families.add(f.replace(/ /g, "+"));
  }

  if (families.size === 0) return null;
  const qs = [...families].map((f) => `family=${f}:wght@400;500;600;700`).join("&");
  return `https://fonts.googleapis.com/css2?${qs}&display=swap`;
}

const RADIUS_MAP = { none: "0px", sm: "4px", md: "8px", lg: "16px" } as const;

const LOGO_SIZE_MAP = { sm: "text-base", md: "text-lg", lg: "text-2xl" } as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const site = await getSiteByDomain(domain);
  if (!site) return {};
  return {
    title: site.name,
    description: `Book your stay at ${site.name}`,
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const site = await getSiteByDomain(domain);

  if (!site) return notFound();

  const theme = site.config.theme;
  const accent = theme.primaryColor ?? "#4f46e5";
  const bodyFont = theme.fontFamily ?? "Inter";
  const headingFont = theme.headingFont ?? bodyFont;
  const bodyBg = theme.bodyBgColor ?? "#ffffff";
  const navStyle = theme.navStyle ?? "light";
  const navLogoSize = theme.navLogoSize ?? "md";
  const footerStyle = theme.footerStyle ?? "minimal";
  const footerBg = theme.footerBgColor ?? "#ffffff";
  const footerText = theme.footerTextColor ?? "#a3a3a3";
  const radius = theme.borderRadius ?? "md";

  const customPages = site.config.pages.filter((p) => p.slug !== "/");
  const termsPage = customPages.find((p) => p.slug === "/terms");
  const privacyPage = customPages.find((p) => p.slug === "/privacy");

  const fontsHref = googleFontsUrl(theme);

  const navClasses: Record<typeof navStyle, string> = {
    light: "bg-white/80 backdrop-blur-lg border-b border-neutral-100 text-neutral-900",
    dark: "bg-neutral-900 text-white border-b border-neutral-800",
    transparent: "absolute inset-x-0 top-0 bg-transparent text-white",
  };

  const navLinkClasses: Record<typeof navStyle, string> = {
    light: "text-neutral-600 hover:text-black",
    dark: "text-neutral-300 hover:text-white",
    transparent: "text-white/80 hover:text-white",
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: `'${bodyFont}', system-ui, sans-serif`,
        backgroundColor: bodyBg,
        // @ts-expect-error CSS custom properties
        "--theme-radius": RADIUS_MAP[radius],
        "--theme-accent": accent,
        "--theme-heading-font": `'${headingFont}', system-ui, sans-serif`,
      }}
    >
      {fontsHref && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={fontsHref} />
      )}

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 ${navClasses[navStyle]}${navStyle === "transparent" ? " sticky" : ""}`}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href={`/site/${domain}`}
            className={`font-bold tracking-tight ${LOGO_SIZE_MAP[navLogoSize]}`}
          >
            {site.name}
          </Link>
          <div className="flex items-center gap-5">
            {customPages.map((page) => (
              <Link
                key={page.id}
                href={`/site/${domain}${page.slug}`}
                className={`text-sm transition-colors ${navLinkClasses[navStyle]}`}
              >
                {page.name}
              </Link>
            ))}
            <Link
              href={`/site/${domain}/properties`}
              className={`text-sm transition-colors ${navLinkClasses[navStyle]}`}
            >
              Properties
            </Link>
            <Link
              href={`/site/${domain}/properties`}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white transition-transform hover:scale-105"
              style={{ backgroundColor: accent, borderRadius: RADIUS_MAP[radius] }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {navStyle === "transparent" && <div className="h-14" />}

      {children}

      {/* Footer */}
      <SiteFooter
        siteName={site.name}
        domain={domain}
        accent={accent}
        footerStyle={footerStyle}
        footerBg={footerBg}
        footerText={footerText}
        termsPage={termsPage ? { name: termsPage.name, slug: termsPage.slug } : null}
        privacyPage={privacyPage ? { name: privacyPage.name, slug: privacyPage.slug } : null}
        customPages={customPages.map((p) => ({ name: p.name, slug: p.slug }))}
      />
    </div>
  );
}

function SiteFooter({
  siteName,
  domain,
  accent,
  footerStyle,
  footerBg,
  footerText,
  termsPage,
  privacyPage,
  customPages,
}: {
  siteName: string;
  domain: string;
  accent: string;
  footerStyle: "minimal" | "centered" | "columns";
  footerBg: string;
  footerText: string;
  termsPage: { name: string; slug: string } | null;
  privacyPage: { name: string; slug: string } | null;
  customPages: { name: string; slug: string }[];
}) {
  const copyright = (
    <span style={{ color: footerText }} className="text-sm">
      &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
    </span>
  );

  const legalLinks = (termsPage || privacyPage) && (
    <div className="flex items-center gap-4">
      {termsPage && (
        <Link
          href={`/site/${domain}${termsPage.slug}`}
          className="text-xs transition-colors hover:opacity-80"
          style={{ color: footerText }}
        >
          {termsPage.name}
        </Link>
      )}
      {privacyPage && (
        <Link
          href={`/site/${domain}${privacyPage.slug}`}
          className="text-xs transition-colors hover:opacity-80"
          style={{ color: footerText }}
        >
          {privacyPage.name}
        </Link>
      )}
    </div>
  );

  if (footerStyle === "centered") {
    return (
      <footer className="border-t border-neutral-100 py-10" style={{ backgroundColor: footerBg }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
          <span className="text-lg font-bold" style={{ color: accent }}>{siteName}</span>
          <div className="flex flex-wrap justify-center gap-4">
            {customPages.map((p) => (
              <Link
                key={p.slug}
                href={`/site/${domain}${p.slug}`}
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: footerText }}
              >
                {p.name}
              </Link>
            ))}
            <Link
              href={`/site/${domain}/properties`}
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: footerText }}
            >
              Properties
            </Link>
          </div>
          <div className="h-px w-16 bg-neutral-200" />
          {copyright}
          {legalLinks}
        </div>
      </footer>
    );
  }

  if (footerStyle === "columns") {
    return (
      <footer className="border-t border-neutral-100 py-10" style={{ backgroundColor: footerBg }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
          <div>
            <span className="text-lg font-bold" style={{ color: accent }}>{siteName}</span>
            <p className="mt-2 text-sm" style={{ color: footerText }}>
              Book your perfect stay with us.
            </p>
          </div>
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: footerText }}>
              Pages
            </span>
            <div className="flex flex-col gap-1.5">
              {customPages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/site/${domain}${p.slug}`}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: footerText }}
                >
                  {p.name}
                </Link>
              ))}
              <Link
                href={`/site/${domain}/properties`}
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: footerText }}
              >
                Properties
              </Link>
            </div>
          </div>
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: footerText }}>
              Legal
            </span>
            <div className="flex flex-col gap-1.5">
              {termsPage && (
                <Link
                  href={`/site/${domain}${termsPage.slug}`}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: footerText }}
                >
                  {termsPage.name}
                </Link>
              )}
              {privacyPage && (
                <Link
                  href={`/site/${domain}${privacyPage.slug}`}
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: footerText }}
                >
                  {privacyPage.name}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-neutral-200 px-6 pt-4">
          {copyright}
        </div>
      </footer>
    );
  }

  // minimal (default)
  return (
    <footer className="border-t border-neutral-100 py-8" style={{ backgroundColor: footerBg }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          {copyright}
          {legalLinks}
        </div>
      </div>
    </footer>
  );
}
