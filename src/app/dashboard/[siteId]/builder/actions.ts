"use server";

import { prisma } from "@/lib/db";
import type { SiteConfig } from "@/types/builder";

export async function getSiteForBuilder(siteId: string) {
  return prisma.site.findUnique({
    where: { id: siteId },
    include: { properties: true },
  });
}

export async function saveSiteConfig(siteId: string, config: SiteConfig) {
  await prisma.site.update({
    where: { id: siteId },
    data: { config: JSON.parse(JSON.stringify(config)) },
  });
  return { success: true };
}
