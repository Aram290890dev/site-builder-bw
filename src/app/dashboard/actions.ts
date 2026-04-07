"use server";

import { prisma } from "@/lib/db";
import { DEMO_USER_EMAIL } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getSites() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    include: {
      sites: {
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { properties: true, bookings: true } } },
      },
    },
  });

  return user?.sites ?? [];
}

export async function createSite(formData: FormData) {
  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;

  if (!name || !subdomain) {
    return { error: "Name and subdomain are required" };
  }

  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const existing = await prisma.site.findUnique({
    where: { subdomain },
  });

  if (existing) {
    return { error: "Subdomain is already taken" };
  }

  await prisma.site.create({
    data: {
      name,
      subdomain,
      ownerId: user.id,
      config: {
        theme: { primaryColor: "#4f46e5", fontFamily: "Inter" },
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
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSite(siteId: string) {
  await prisma.site.delete({ where: { id: siteId } });
  revalidatePath("/dashboard");
}
