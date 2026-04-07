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

  return (
    <div className="min-h-screen">
      {/* Site nav */}
      <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href={`/site/${domain}`}
            className="text-lg font-bold tracking-tight"
          >
            {site.name}
          </Link>
          <div className="flex items-center gap-6">
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
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
