import { prisma } from "@/lib/db";
import { getSiteByDomain } from "../../../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Users, MapPin, ArrowRight } from "lucide-react";

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string; propertyId: string }>;
  searchParams: Promise<{ booking?: string }>;
}) {
  const { domain, propertyId } = await params;
  const { booking: bookingId } = await searchParams;

  if (!bookingId) return notFound();

  const [site, booking] = await Promise.all([
    getSiteByDomain(domain),
    prisma.booking.findUnique({
      where: { id: bookingId },
      include: { property: true },
    }),
  ]);

  if (!site || !booking || booking.propertyId !== propertyId) return notFound();

  const property = booking.property;
  const symbol = property.currency === "EUR" ? "\u20AC" : property.currency === "GBP" ? "\u00A3" : "$";
  const nights = Math.ceil(
    (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const images = (property.images as string[]) ?? [];
  const accent = site.config.theme?.primaryColor ?? "#4f46e5";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Success icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="size-10 text-emerald-500" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">Booking Confirmed!</h1>
        <p className="mt-2 text-neutral-500">
          Your reservation at <span className="font-medium text-neutral-700">{property.name}</span> has been submitted.
          You&apos;ll receive a confirmation email shortly.
        </p>

        {/* Booking details card */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm">
          {images[0] && (
            <div className="mb-4 overflow-hidden rounded-xl">
              <img src={images[0]} alt={property.name} className="aspect-[16/9] w-full object-cover" />
            </div>
          )}

          <h2 className="text-lg font-semibold">{property.name}</h2>
          {property.address && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-500">
              <MapPin className="size-3.5" />
              {property.address}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Check-in</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
                <Calendar className="size-3.5 text-neutral-400" />
                {booking.checkIn.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
            <div className="rounded-lg bg-neutral-50 px-3 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Check-out</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
                <Calendar className="size-3.5 text-neutral-400" />
                {booking.checkOut.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-neutral-600">
            <Users className="size-3.5 text-neutral-400" />
            {booking.guests} guest{booking.guests > 1 ? "s" : ""} &middot; {nights} night{nights > 1 ? "s" : ""}
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-neutral-100 pt-4">
            <span className="text-sm text-neutral-500">Total</span>
            <span className="text-xl font-bold">{symbol}{booking.totalPrice.toLocaleString()}</span>
          </div>

          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Status: <span className="font-semibold">Pending</span> — The property owner will confirm your booking soon.
          </div>
        </div>

        {/* Booking reference */}
        <div className="mt-4 text-xs text-neutral-400">
          Booking reference: <span className="font-mono">{booking.id}</span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/site/${domain}/properties`}
            className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ backgroundColor: accent }}
          >
            Browse More Properties
            <ArrowRight className="ml-1.5 size-4" />
          </Link>
          <Link
            href={`/site/${domain}`}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
