import { getSiteByDomain, getProperty } from "../../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { CheckoutPageSettings } from "@/types/builder";
import { DEFAULT_CHECKOUT_SETTINGS } from "@/types/builder";
import { ChevronLeft } from "lucide-react";

const RADIUS_MAP: Record<string, string> = { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem" };

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ domain: string; propertyId: string }>;
}) {
  const { domain, propertyId } = await params;
  const [site, property] = await Promise.all([
    getSiteByDomain(domain),
    getProperty(propertyId),
  ]);

  if (!site || !property) return notFound();

  const s: CheckoutPageSettings = {
    ...DEFAULT_CHECKOUT_SETTINGS,
    ...site.config.templates?.checkout,
  };

  const symbol = property.currency === "EUR" ? "\u20AC" : "$";
  const radius = RADIUS_MAP[s.cardRadius] ?? "0.75rem";
  const images = (property.images as string[]) ?? [];
  const firstImage = images[0];

  return (
    <main className="min-h-screen py-8" style={{ backgroundColor: s.bgColor }}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Back */}
        <Link
          href={`/site/${domain}/properties/${propertyId}`}
          className="mb-6 inline-flex items-center gap-1 text-sm transition-colors hover:opacity-70"
          style={{ color: s.accentColor }}
        >
          <ChevronLeft className="size-4" />
          Back to property
        </Link>

        <h1 className="mb-8 text-2xl font-bold">Complete Your Booking</h1>

        {/* Multi-step indicator */}
        {s.style === "multi-step" && (
          <div className="mb-10 flex items-center justify-center gap-4">
            {["Dates", "Guest Info", "Confirm"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className="flex size-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: i === 1 ? s.accentColor : "#d4d4d4" }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: i === 1 ? s.accentColor : "#a3a3a3" }}
                >
                  {step}
                </span>
                {i < 2 && <div className="h-px w-10 bg-neutral-200" />}
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Dates */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4" style={{ borderRadius: radius }}>
              <h2 className="text-lg font-semibold">Your Dates</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Check-in</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Check-out</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Guests</label>
                <select
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}
                >
                  {Array.from({ length: property.maxGuests }).map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1} guest{i > 0 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guest Info */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4" style={{ borderRadius: radius }}>
              <h2 className="text-lg font-semibold">Guest Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {["First Name", "Last Name"].map((f) => (
                  <div key={f} className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500">{f}</label>
                    <input
                      type="text"
                      placeholder={f}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                      style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-500">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                    style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Special Requests</label>
                <textarea
                  placeholder="Any special requests or notes..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}
                />
              </div>
            </div>

            <button
              className="w-full rounded-lg py-3.5 text-base font-semibold text-white transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: s.accentColor, borderRadius: radius }}
            >
              Confirm Booking
            </button>
            <p className="text-center text-xs text-neutral-400">
              No payment required. You&apos;ll receive a confirmation email.
            </p>
          </div>

          {/* Order Summary */}
          {s.showOrderSummary && (
            <div className="lg:col-span-2">
              <div className="sticky top-20 rounded-xl border border-neutral-200 bg-white p-6 space-y-4" style={{ borderRadius: radius }}>
                <h3 className="text-base font-semibold">Booking Summary</h3>

                {s.showPropertyImage && firstImage && (
                  <div className="overflow-hidden rounded-lg" style={{ borderRadius: RADIUS_MAP[s.cardRadius] }}>
                    <img src={firstImage} alt={property.name} className="aspect-[16/10] w-full object-cover" />
                  </div>
                )}

                <div>
                  <div className="font-semibold">{property.name}</div>
                  {property.address && (
                    <div className="text-sm text-neutral-500">{property.address}</div>
                  )}
                </div>

                <div className="space-y-2 border-t border-neutral-100 pt-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Check-in</span>
                    <span>Select date</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Check-out</span>
                    <span>Select date</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Guests</span>
                    <span>1</span>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">{symbol}{property.price} x 1 night</span>
                    <span>{symbol}{property.price}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{symbol}{property.price}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
