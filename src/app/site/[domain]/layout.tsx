import { getSiteByDomain } from "./data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

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

  const accent = site.config.theme.primaryColor ?? "#4f46e5";
  const fontFamily = site.config.theme.fontFamily ?? "inherit";
  const customPages = site.config.pages.filter((p) => p.slug !== "/");
  const termsPage = customPages.find((p) => p.slug === "/terms");
  const privacyPage = customPages.find((p) => p.slug === "/privacy");

  return (
    <div className="min-h-screen" style={{ fontFamily }}>
      {/* Site nav */}
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href={`/site/${domain}`}
            className="text-lg font-bold tracking-tight"
          >
            {site.name}
          </Link>
          <div className="flex items-center gap-5">
            {/* Custom pages */}
            {customPages.map((page) => (
              <Link
                key={page.id}
                href={`/site/${domain}${page.slug}`}
                className="text-sm text-neutral-600 transition-colors hover:text-black"
              >
                {page.name}
              </Link>
            ))}
            {/* Properties (always shown) */}
            <Link
              href={`/site/${domain}/properties`}
              className="text-sm text-neutral-600 transition-colors hover:text-black"
            >
              Properties
            </Link>
            <Link
              href={`/site/${domain}/properties`}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white transition-transform hover:scale-105"
              style={{ backgroundColor: accent }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {children}

      {/* Site footer */}
      <footer className="border-t border-neutral-100 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <span className="text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            </span>
            {(termsPage || privacyPage) && (
              <div className="flex items-center gap-4">
                {termsPage && (
                  <Link
                    href={`/site/${domain}${termsPage.slug}`}
                    className="text-xs text-neutral-400 transition-colors hover:text-neutral-600"
                  >
                    {termsPage.name}
                  </Link>
                )}
                {privacyPage && (
                  <Link
                    href={`/site/${domain}${privacyPage.slug}`}
                    className="text-xs text-neutral-400 transition-colors hover:text-neutral-600"
                  >
                    {privacyPage.name}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
