"use server";

import { prisma } from "@/lib/db";
import { requireSiteOwner } from "@/lib/session";
import type { SiteConfig } from "@/types/builder";

export async function getSiteForBuilder(siteId: string) {
  await requireSiteOwner(siteId);

  return prisma.site.findUnique({
    where: { id: siteId },
    include: { properties: true },
  });
}

export async function saveSiteConfig(siteId: string, config: SiteConfig) {
  await requireSiteOwner(siteId);

  await prisma.site.update({
    where: { id: siteId },
    data: { config: JSON.parse(JSON.stringify(config)) },
  });
  return { success: true };
}

export async function toggleSitePublish(siteId: string) {
  await requireSiteOwner(siteId);

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { published: true },
  });

  if (!site) return { published: false };

  const published = !site.published;
  await prisma.site.update({
    where: { id: siteId },
    data: { published },
  });

  return { published };
}
