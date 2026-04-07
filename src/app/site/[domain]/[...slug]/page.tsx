import { getSiteByDomain } from "../data";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/site/sections/section-renderer";

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

  return (
    <main>
      {page.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          siteSubdomain={domain}
          properties={site.properties}
        />
      ))}
    </main>
  );
}
