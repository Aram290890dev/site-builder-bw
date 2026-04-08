"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_LISTING_SETTINGS,
  DEFAULT_DETAIL_SETTINGS,
  DEFAULT_CHECKOUT_SETTINGS,
} from "@/types/builder";

export async function getSites() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      sites: {
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { properties: true, bookings: true } } },
      },
    },
  });

  return dbUser?.sites ?? [];
}

export async function createSite(formData: FormData) {
  const user = await requireUser();

  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;

  if (!name || !subdomain) {
    return { error: "Name and subdomain are required" };
  }

  const existing = await prisma.site.findUnique({
    where: { subdomain },
  });

  if (existing) {
    return { error: "Subdomain is already taken" };
  }

  const config = {
    theme: { primaryColor: "#4f46e5", fontFamily: "Inter" },
    pages: [
      {
        id: "home",
        name: "Home",
        slug: "/",
        sections: [
          {
            id: "hero-1",
            type: "hero",
            data: {
              title: `Welcome to ${name}`,
              subtitle: "Your perfect getaway awaits",
              ctaText: "Browse Properties",
            },
          },
          {
            id: "properties-1",
            type: "propertyGrid",
            data: { title: "Our Properties", columns: 3 },
          },
        ],
      },
    ],
    templates: {
      listing: DEFAULT_LISTING_SETTINGS,
      detail: DEFAULT_DETAIL_SETTINGS,
      checkout: DEFAULT_CHECKOUT_SETTINGS,
    },
  };

  await prisma.site.create({
    data: {
      name,
      subdomain,
      ownerId: user.id,
      config: JSON.parse(JSON.stringify(config)),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSite(siteId: string) {
  const user = await requireUser();

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { ownerId: true },
  });

  if (!site || site.ownerId !== user.id) {
    return { error: "Not authorized" };
  }

  await prisma.site.delete({ where: { id: siteId } });
  revalidatePath("/dashboard");
}
