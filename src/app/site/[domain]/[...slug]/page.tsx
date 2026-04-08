import { getSiteByDomain } from "../data";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/site/sections/section-renderer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; slug: string[] }>;
}): Promise<Metadata> {
  const { domain, slug } = await params;
  const site = await getSiteByDomain(domain);
  if (!site) return {};

  const slugPath = `/${slug.join("/")}`;
  const page = site.config.pages.find((p) => p.slug === slugPath);
  if (!page) return {};

  const pageSeo = page.seo;
  const siteSeo = site.config.seo;

  return {
    title: pageSeo?.metaTitle || page.name,
    description: pageSeo?.metaDescription || siteSeo?.siteDescription || undefined,
    ...(pageSeo?.ogImage || siteSeo?.ogImage
      ? { openGraph: { images: [{ url: pageSeo?.ogImage || siteSeo?.ogImage || "" }] } }
      : {}),
  };
}

export default async function DynamicSitePage({
  params,
}: {
  params: Promise<{ domain: string; slug: string[] }>;
}) {
  const { domain, slug } = await params;
  const site = await getSiteByDomain(domain);

  if (!site) return notFound();

  const slugPath = `/${slug.join("/")}`;
  const page = site.config.pages.find((p) => p.slug === slugPath);

  if (!page) return notFound();

  if (page.sections.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-neutral-400">
        This page has no content yet. Open the builder to add sections.
      </div>
    );
  }

  const visibleSections = page.sections.filter((s) => !s.style?.hidden);

  return (
    <main>
      {visibleSections.map((section, i) => (
        <SectionRenderer
          key={section.id}
          section={section}
          siteSubdomain={domain}
          properties={site.properties}
          isLast={i === visibleSections.length - 1}
        />
      ))}
    </main>
  );
}
