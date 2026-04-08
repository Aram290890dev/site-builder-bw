"use server";

import { prisma } from "@/lib/db";
import { requireSiteOwner } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getBookingsForSite(siteId: string) {
  await requireSiteOwner(siteId);

  return prisma.booking.findMany({
    where: { siteId },
    include: { property: { select: { name: true, images: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSiteBasicForBookings(siteId: string) {
  await requireSiteOwner(siteId);

  return prisma.site.findUnique({
    where: { id: siteId },
    select: { id: true, name: true, subdomain: true },
  });
}

export async function updateBookingStatus(
  bookingId: string,
  siteId: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  await requireSiteOwner(siteId);

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
  revalidatePath(`/dashboard/${siteId}/bookings`);
  return { success: true };
}
