import { getSiteByDomain, getProperty } from "../../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { CheckoutPageSettings } from "@/types/builder";
import { DEFAULT_CHECKOUT_SETTINGS } from "@/types/builder";
import { ChevronLeft } from "lucide-react";
import { CheckoutForm } from "./checkout-form";

const RADIUS_MAP: Record<string, string> = { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem" };

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ domain: string; propertyId: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { domain, propertyId } = await params;
  const query = await searchParams;
  const [site, property] = await Promise.all([
    getSiteByDomain(domain),
    getProperty(propertyId),
  ]);

  if (!site || !property) return notFound();

  const s: CheckoutPageSettings = {
    ...DEFAULT_CHECKOUT_SETTINGS,
    ...site.config.templates?.checkout,
  };

  const images = (property.images as string[]) ?? [];
  const radius = RADIUS_MAP[s.cardRadius] ?? "0.75rem";

  return (
    <main className="min-h-screen py-8" style={{ backgroundColor: s.bgColor }}>
      <div className="mx-auto max-w-4xl px-6">
        <Link
          href={`/site/${domain}/properties/${propertyId}`}
          className="mb-6 inline-flex items-center gap-1 text-sm transition-colors hover:opacity-70"
          style={{ color: s.accentColor }}
        >
          <ChevronLeft className="size-4" />
          Back to property
        </Link>

        <h1 className="mb-8 text-2xl font-bold">Complete Your Booking</h1>

        {s.style === "multi-step" && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {["Dates", "Guest Info", "Confirm"].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white sm:size-8 sm:text-sm"
                  style={{ backgroundColor: i === 1 ? s.accentColor : "#d4d4d4" }}
                >
                  {i + 1}
                </div>
                <span
                  className="hidden text-sm font-medium sm:inline"
                  style={{ color: i === 1 ? s.accentColor : "#a3a3a3" }}
                >
                  {step}
                </span>
                {i < 2 && <div className="h-px w-6 bg-neutral-200 sm:w-10" />}
              </div>
            ))}
          </div>
        )}

        <CheckoutForm
          propertyId={property.id}
          siteId={site.id}
          domain={domain}
          maxGuests={property.maxGuests}
          pricePerNight={property.price}
          currency={property.currency}
          propertyName={property.name}
          propertyAddress={property.address}
          propertyImage={images[0] ?? null}
          accentColor={s.accentColor}
          cardRadius={radius}
          showOrderSummary={s.showOrderSummary}
          showPropertyImage={s.showPropertyImage}
          initialCheckIn={query.checkIn ?? ""}
          initialCheckOut={query.checkOut ?? ""}
          initialGuests={query.guests ? Number(query.guests) : 1}
        />
      </div>
    </main>
  );
}
