import { prisma } from "@/lib/db";
import { migrateConfig } from "@/lib/config-migrate";
import type { SiteConfig } from "@/types/builder";

export async function getSiteByDomain(domain: string) {
  const site = await prisma.site.findUnique({
    where: { subdomain: domain },
    include: {
      properties: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!site) return null;

  const config = migrateConfig(site.config as Record<string, unknown>);

  return { ...site, config };
}

export async function getProperty(propertyId: string) {
  return prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      site: true,
      availability: {
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
      },
      bookings: {
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
          checkOut: { gt: new Date() },
        },
        select: { checkIn: true, checkOut: true },
      },
    },
  });
}

export type SiteWithProperties = NonNullable<Awaited<ReturnType<typeof getSiteByDomain>>>;
export type PropertyWithDetails = NonNullable<Awaited<ReturnType<typeof getProperty>>>;
