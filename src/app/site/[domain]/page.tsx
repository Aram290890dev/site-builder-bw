import { getSiteByDomain } from "./data";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/site/sections/section-renderer";

export default async function SiteHomePage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const site = await getSiteByDomain(domain);

  if (!site) return notFound();

  const homePage = site.config.pages.find((p) => p.slug === "/") ?? site.config.pages[0];

  if (!homePage || homePage.sections.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-neutral-400">
        This site has no content yet. Open the builder to get started.
      </div>
    );
  }

  const visibleSections = homePage.sections.filter((s) => !s.style?.hidden);

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
