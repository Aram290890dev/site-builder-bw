"use server";

import { prisma } from "@/lib/db";
import { requireSiteOwner } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getPropertiesForSite(siteId: string) {
  await requireSiteOwner(siteId);

  return prisma.property.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookings: true } },
    },
  });
}

export async function getSiteBasic(siteId: string) {
  await requireSiteOwner(siteId);

  return prisma.site.findUnique({
    where: { id: siteId },
    select: { id: true, name: true, subdomain: true },
  });
}

export interface PropertyFormData {
  name: string;
  description: string;
  address: string;
  price: number;
  currency: string;
  maxGuests: number;
  amenities: string[];
  images: string[];
}

export async function createProperty(siteId: string, data: PropertyFormData) {
  await requireSiteOwner(siteId);

  await prisma.property.create({
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      price: data.price,
      currency: data.currency,
      maxGuests: data.maxGuests,
      amenities: data.amenities,
      images: data.images,
      siteId,
    },
  });

  revalidatePath(`/dashboard/${siteId}/properties`);
  return { success: true };
}

export async function updateProperty(
  propertyId: string,
  siteId: string,
  data: PropertyFormData
) {
  await requireSiteOwner(siteId);

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address || null,
      price: data.price,
      currency: data.currency,
      maxGuests: data.maxGuests,
      amenities: data.amenities,
      images: data.images,
    },
  });

  revalidatePath(`/dashboard/${siteId}/properties`);
  return { success: true };
}

export async function deleteProperty(propertyId: string, siteId: string) {
  await requireSiteOwner(siteId);

  await prisma.property.delete({ where: { id: propertyId } });
  revalidatePath(`/dashboard/${siteId}/properties`);
  return { success: true };
}
