import { getSiteByDomain, getProperty } from "../../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { DetailPageSettings } from "@/types/builder";
import { DEFAULT_DETAIL_SETTINGS } from "@/types/builder";
import { MapPin, Star, Users, Check, ChevronLeft } from "lucide-react";
import { GallerySlider } from "@/components/site/gallery-slider";
import { BookingWidget } from "@/components/site/booking-widget";
import type { Metadata } from "next";

const RADIUS_MAP: Record<string, string> = { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem" };
const ASPECT_MAP: Record<string, string> = { auto: "auto", landscape: "16/10", portrait: "3/4", square: "1/1" };
const FONT_MAP: Record<string, string> = { default: "inherit", serif: "Georgia, serif", mono: "ui-monospace, monospace" };
const MASONRY_HEIGHTS = [280, 360, 240, 320, 260, 300];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; propertyId: string }>;
}): Promise<Metadata> {
  const { propertyId } = await params;
  const property = await getProperty(propertyId);
  if (!property) return {};
  return {
    title: property.name,
    description: property.description ?? `Book ${property.name}`,
  };
}

export default async function PropertyDetailPage({
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

  const s: DetailPageSettings = {
    ...DEFAULT_DETAIL_SETTINGS,
    ...site.config.templates?.detail,
  };

  const images = (property.images as string[]) ?? [];
  const amenities = (property.amenities as string[]) ?? [];
  const symbol = property.currency === "EUR" ? "\u20AC" : "$";
  const radius = RADIUS_MAP[s.cardRadius] ?? "0.75rem";
  const imgRadius = RADIUS_MAP[s.galleryImageRadius] ?? "0.5rem";
  const headingStyle: React.CSSProperties = { fontFamily: FONT_MAP[s.headingFont], color: s.textColor };
  const blockedDays = [5, 6, 7, 15, 16];

  return (
    <main className="min-h-screen" style={{ backgroundColor: s.pageBgColor }}>
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Back link */}
        <Link
          href={`/site/${domain}/properties`}
          className="mb-6 inline-flex items-center gap-1 text-sm transition-colors hover:opacity-70"
          style={{ color: s.accentColor }}
        >
          <ChevronLeft className="size-4" />
          All Properties
        </Link>

        {/* Gallery */}
        {images.length > 0 ? (
          <GalleryView images={images} style={s} imgRadius={imgRadius} />
        ) : (
          <div className="mb-8 flex h-64 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            No images available
          </div>
        )}

        {/* Content + Sidebar */}
        <div className={s.bookingFormStyle === "sidebar" ? "mt-8 grid gap-8 lg:grid-cols-3" : "mt-8 space-y-8"}>
          {/* Main */}
          <div className={s.bookingFormStyle === "sidebar" ? "lg:col-span-2 space-y-8" : "space-y-8"}>
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold" style={headingStyle}>{property.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm" style={{ color: `${s.textColor}99` }}>
                {property.address && (
                  <span className="flex items-center gap-1"><MapPin className="size-4" />{property.address}</span>
                )}
                <span className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" />4.9</span>
                <span className="flex items-center gap-1"><Users className="size-4" />{property.maxGuests} guests</span>
              </div>
            </div>

            {/* Description */}
            {s.showDescription && property.description && (
              <div className="rounded-xl p-6" style={{ backgroundColor: `${s.textColor}06`, borderRadius: radius }}>
                <h2 className="text-xl font-semibold mb-3" style={headingStyle}>About this property</h2>
                <p className="text-base leading-relaxed" style={{ color: `${s.textColor}cc` }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {s.showAmenities && amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4" style={headingStyle}>Amenities</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {amenities.map((a) => (
                    <div
                      key={a}
                      className="flex items-center gap-3 rounded-lg border border-neutral-100 px-4 py-3"
                      style={{ borderRadius: radius, color: s.textColor }}
                    >
                      <Check className="size-4 shrink-0" style={{ color: s.accentColor }} />
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar */}
            {s.calendarStyle === "inline" && (
              <div>
                <h2 className="text-xl font-semibold mb-4" style={headingStyle}>Availability</h2>
                <div className="rounded-xl border border-neutral-200 p-5" style={{ borderRadius: radius }}>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <div key={d} className="py-2 text-xs font-medium" style={{ color: `${s.textColor}60` }}>{d}</div>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => {
                      const blocked = blockedDays.includes(i);
                      return (
                        <div
                          key={i}
                          className="flex h-10 items-center justify-center rounded-lg text-sm"
                          style={{
                            backgroundColor: blocked ? s.calendarBlockedColor : "transparent",
                            color: blocked ? "#dc2626" : s.textColor,
                            opacity: blocked ? 0.7 : 1,
                          }}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            {s.showMap && (
              <div>
                <h2 className="text-xl font-semibold mb-4" style={headingStyle}>Location</h2>
                <div className="flex h-64 items-center justify-center rounded-2xl bg-neutral-100" style={{ borderRadius: radius }}>
                  <div className="text-center text-neutral-400">
                    <MapPin className="mx-auto size-10" />
                    <p className="mt-2 text-sm">
                      {property.address ?? "Map coming soon"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar / card */}
          <div className={s.bookingFormStyle === "inline" ? "max-w-xl mx-auto w-full" : s.bookingFormStyle === "card" ? "max-w-sm mx-auto" : ""}>
            <BookingWidget
              domain={domain}
              propertyId={property.id}
              price={property.price}
              currency={property.currency}
              maxGuests={property.maxGuests}
              accentColor={s.accentColor}
              textColor={s.textColor}
              radius={radius}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── Gallery Component ─── */

function GalleryView({
  images,
  style: s,
  imgRadius,
}: {
  images: string[];
  style: DetailPageSettings;
  imgRadius: string;
}) {
  if (s.galleryStyle === "slider") {
    return (
      <GallerySlider
        images={images}
        accentColor={s.accentColor}
        imgRadius={imgRadius}
        aspectRatio={ASPECT_MAP[s.imageAspect === "auto" ? "landscape" : s.imageAspect]}
      />
    );
  }

  if (s.galleryStyle === "masonry") {
    const cols = s.galleryColumns;
    const columns: string[][] = Array.from({ length: cols }, () => []);
    images.forEach((img, i) => columns[i % cols].push(img));

    return (
      <div className="flex gap-2">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-1 flex-col gap-2">
            {col.map((img, rowIdx) => (
              <div key={rowIdx} className="overflow-hidden" style={{ borderRadius: imgRadius, height: MASONRY_HEIGHTS[(colIdx * 3 + rowIdx) % MASONRY_HEIGHTS.length] }}>
                <img src={img} alt={`Photo ${colIdx * 3 + rowIdx + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Grid (default)
  const cols = s.galleryColumns;
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {images.map((img, i) => (
        <div
          key={i}
          className="overflow-hidden"
          style={{
            borderRadius: imgRadius,
            aspectRatio: ASPECT_MAP[s.imageAspect === "auto" ? "landscape" : s.imageAspect],
            gridColumn: i === 0 && images.length > 1 ? `span ${Math.min(2, cols)}` : undefined,
            gridRow: i === 0 && images.length > 1 ? "span 2" : undefined,
          }}
        >
          <img src={img} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
