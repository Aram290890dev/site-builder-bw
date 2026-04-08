"use server";

import { prisma } from "@/lib/db";

export interface BookingFormData {
  propertyId: string;
  siteId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes: string;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

export async function createBooking(data: BookingFormData): Promise<BookingResult> {
  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { success: false, error: "Please select valid dates." };
  }

  if (checkIn < now) {
    return { success: false, error: "Check-in date cannot be in the past." };
  }

  if (checkOut <= checkIn) {
    return { success: false, error: "Check-out must be after check-in." };
  }

  if (!data.guestName.trim() || !data.guestEmail.trim()) {
    return { success: false, error: "Name and email are required." };
  }

  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
  });

  if (!property) {
    return { success: false, error: "Property not found." };
  }

  if (data.guests > property.maxGuests) {
    return { success: false, error: `Maximum ${property.maxGuests} guests allowed.` };
  }

  // Check for overlapping confirmed/pending bookings
  const overlapping = await prisma.booking.findFirst({
    where: {
      propertyId: data.propertyId,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });

  if (overlapping) {
    return { success: false, error: "These dates are already booked. Please choose different dates." };
  }

  // Check availability records (blocked dates)
  const blockedDates = await prisma.availability.findMany({
    where: {
      propertyId: data.propertyId,
      available: false,
      date: { gte: checkIn, lt: checkOut },
    },
  });

  if (blockedDates.length > 0) {
    return { success: false, error: "Some of the selected dates are unavailable." };
  }

  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = nights * property.price;

  const booking = await prisma.booking.create({
    data: {
      checkIn,
      checkOut,
      guests: data.guests,
      guestName: data.guestName.trim(),
      guestEmail: data.guestEmail.trim(),
      guestPhone: data.guestPhone.trim() || null,
      notes: data.notes.trim() || null,
      totalPrice,
      propertyId: data.propertyId,
      siteId: data.siteId,
    },
  });

  return { success: true, bookingId: booking.id };
}
