import { getSiteForBuilder } from "./actions";
import { notFound } from "next/navigation";
import { Builder } from "@/components/builder/builder";
import type { SiteConfig } from "@/types/builder";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const site = await getSiteForBuilder(siteId);

  if (!site) return notFound();

  return (
    <Builder
      siteId={site.id}
      siteName={site.name}
      initialConfig={site.config as unknown as SiteConfig}
    />
  );
}
