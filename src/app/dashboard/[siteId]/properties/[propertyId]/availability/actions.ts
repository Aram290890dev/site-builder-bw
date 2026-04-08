"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPropertyForAvailability(propertyId: string) {
  return prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, name: true, price: true, currency: true, siteId: true },
  });
}

export async function getAvailability(propertyId: string, year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);

  return prisma.availability.findMany({
    where: {
      propertyId,
      date: { gte: start, lt: end },
    },
    orderBy: { date: "asc" },
  });
}

export async function getBookedDates(propertyId: string, year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);

  return prisma.booking.findMany({
    where: {
      propertyId,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: end },
      checkOut: { gt: start },
    },
    select: { checkIn: true, checkOut: true, status: true, guestName: true },
  });
}

export async function toggleDateAvailability(
  propertyId: string,
  siteId: string,
  dateStr: string,
  available: boolean,
  customPrice?: number | null
) {
  const date = new Date(dateStr + "T00:00:00.000Z");

  await prisma.availability.upsert({
    where: {
      propertyId_date: { propertyId, date },
    },
    update: { available, price: customPrice ?? null },
    create: { propertyId, date, available, price: customPrice ?? null },
  });

  revalidatePath(`/dashboard/${siteId}/properties/${propertyId}/availability`);
  return { success: true };
}

export async function bulkToggleDates(
  propertyId: string,
  siteId: string,
  dates: string[],
  available: boolean
) {
  for (const dateStr of dates) {
    const date = new Date(dateStr + "T00:00:00.000Z");
    await prisma.availability.upsert({
      where: {
        propertyId_date: { propertyId, date },
      },
      update: { available },
      create: { propertyId, date, available },
    });
  }

  revalidatePath(`/dashboard/${siteId}/properties/${propertyId}/availability`);
  return { success: true };
}
