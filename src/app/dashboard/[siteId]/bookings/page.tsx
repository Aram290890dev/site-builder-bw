import { getBookingsForSite, getSiteBasicForBookings } from "./actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, Phone, Users, Building2 } from "lucide-react";
import { StatusButtons } from "./status-button";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-neutral-50 text-neutral-400 border-neutral-200",
};

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const [site, bookings] = await Promise.all([
    getSiteBasicForBookings(siteId),
    getBookingsForSite(siteId),
  ]);

  if (!site) return notFound();

  const totalRevenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-black"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage bookings for <span className="font-medium text-neutral-700">{site.name}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-2xl font-bold">{pendingCount}</div>
          <div className="mt-0.5 text-xs text-neutral-500">Pending</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-2xl font-bold text-emerald-600">{confirmedCount}</div>
          <div className="mt-0.5 text-xs text-neutral-500">Confirmed</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
          <div className="mt-0.5 text-xs text-neutral-500">Revenue</div>
        </div>
      </div>

      {/* Bookings list */}
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <CalendarDays className="size-6 text-neutral-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Bookings will appear here when guests reserve properties.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const images = (booking.property.images as string[]) ?? [];
            const nights = Math.ceil(
              (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={booking.id}
                className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                {/* Property thumbnail */}
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  {images[0] ? (
                    <img src={images[0]} alt={booking.property.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-300">
                      <Building2 className="size-5" />
                    </div>
                  )}
                </div>

                {/* Booking details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{booking.guestName}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500">{booking.property.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base font-bold">${booking.totalPrice.toLocaleString()}</div>
                      <div className="text-[10px] text-neutral-400">{nights} night{nights > 1 ? "s" : ""}</div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3" />
                      {booking.checkIn.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {booking.checkOut.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" />
                      {booking.guestEmail}
                    </span>
                    {booking.guestPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" />
                        {booking.guestPhone}
                      </span>
                    )}
                  </div>

                  {booking.notes && (
                    <p className="mt-2 text-xs italic text-neutral-400">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3">
                    <StatusButtons bookingId={booking.id} siteId={siteId} currentStatus={booking.status} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
