import { getSiteForBuilder } from "./actions";
import { notFound } from "next/navigation";
import { Builder } from "@/components/builder/builder";
import { migrateConfig } from "@/lib/config-migrate";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const site = await getSiteForBuilder(siteId);

  if (!site) return notFound();

  const config = migrateConfig(site.config as Record<string, unknown>);

  return (
    <Builder
      siteId={site.id}
      siteName={site.name}
      siteSubdomain={site.subdomain}
      initialConfig={config}
      initialPublished={site.published}
    />
  );
}
