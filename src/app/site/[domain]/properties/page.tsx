import { getSiteByDomain } from "../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ListingPageSettings } from "@/types/builder";
import { DEFAULT_LISTING_SETTINGS } from "@/types/builder";
import { MapPin, Star, Users, Wifi } from "lucide-react";

const RADIUS_MAP: Record<string, string> = { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem", full: "9999px" };
const ASPECT_MAP: Record<string, string> = { square: "1/1", landscape: "16/10", portrait: "3/4" };

const HOVER_CLASSES: Record<string, string> = {
  none: "",
  lift: "transition-transform duration-200 hover:-translate-y-1",
  scale: "transition-transform duration-200 hover:scale-[1.02]",
  glow: "transition-shadow duration-200 hover:shadow-xl",
};

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const site = await getSiteByDomain(domain);

  if (!site) return notFound();

  const s: ListingPageSettings = {
    ...DEFAULT_LISTING_SETTINGS,
    ...site.config.templates?.listing,
  };

  const cardRadius = RADIUS_MAP[s.cardRadius] ?? "0.75rem";
  const imgRadius = `${RADIUS_MAP[s.cardImageRadius] ?? "0.5rem"} ${RADIUS_MAP[s.cardImageRadius] ?? "0.5rem"} 0 0`;

  function getCardStyle(): React.CSSProperties {
    const base: React.CSSProperties = {
      backgroundColor: s.cardBgColor,
      borderRadius: cardRadius,
      overflow: "hidden",
    };
    if (s.cardStyle === "bordered") base.border = `1px solid ${s.cardBorderColor}`;
    if (s.cardStyle === "shadow") base.boxShadow = `0 1px 3px ${s.cardBorderColor}40`;
    if (s.cardStyle === "elevated") base.boxShadow = `0 4px 16px ${s.cardBorderColor}60`;
    return base;
  }

  return (
    <main className="min-h-screen py-12" style={{ backgroundColor: s.pageBgColor }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: s.cardTextColor }}>
            {s.pageTitle}
          </h1>
          {s.pageSubtitle && (
            <p className="mt-2 text-lg" style={{ color: `${s.cardTextColor}80` }}>
              {s.pageSubtitle}
            </p>
          )}
        </div>

        {/* Grid / List */}
        {site.properties.length === 0 ? (
          <div className="py-24 text-center text-neutral-400">
            <p className="text-lg">No properties available yet.</p>
          </div>
        ) : (
          <div
            className={s.layout === "list" ? "space-y-6" : "grid gap-6"}
            style={s.layout === "grid" ? { gridTemplateColumns: `repeat(${s.columns}, 1fr)` } : {}}
          >
            {site.properties.map((property) => {
              const images = (property.images as string[]) ?? [];
              const firstImage = images[0];
              const amenities = (property.amenities as string[]) ?? [];
              const symbol = property.currency === "EUR" ? "\u20AC" : "$";

              return (
                <Link
                  key={property.id}
                  href={`/site/${domain}/properties/${property.id}`}
                  className={`group block ${HOVER_CLASSES[s.hoverEffect]}`}
                  style={getCardStyle()}
                >
                  {s.layout === "list" ? (
                    <div className="flex">
                      {/* Image */}
                      <div className="relative w-72 shrink-0 bg-neutral-100" style={{ aspectRatio: "16/10" }}>
                        {firstImage ? (
                          <img src={firstImage} alt={property.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-neutral-300 text-sm">No image</div>
                        )}
                        {s.imageOverlay && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
                        {s.pricePosition === "top-right" && s.showPrice && (
                          <div className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: s.accentColor }}>
                            {symbol}{property.price}/night
                          </div>
                        )}
                        {s.pricePosition === "badge" && s.showPrice && (
                          <div className="absolute bottom-3 left-3 rounded-md px-2.5 py-1 text-xs font-bold text-white bg-black/70">
                            {symbol}{property.price}/night
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-center p-5 space-y-2" style={{ color: s.cardTextColor }}>
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold">{property.name}</h3>
                          {s.showRating && (
                            <div className="flex items-center gap-1 text-sm"><Star className="size-4 fill-amber-400 text-amber-400" />4.9</div>
                          )}
                        </div>
                        {s.showLocation && property.address && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: `${s.cardTextColor}80` }}><MapPin className="size-3.5" />{property.address}</div>
                        )}
                        {s.showAmenities && amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs" style={{ color: `${s.cardTextColor}60` }}>
                            {amenities.slice(0, 4).map((a) => (
                              <span key={a} className="flex items-center gap-1"><Wifi className="size-3" />{a}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 pt-1">
                          {s.pricePosition === "bottom" && s.showPrice && (
                            <span className="text-lg font-bold">{symbol}{property.price}<span className="text-sm font-normal" style={{ color: `${s.cardTextColor}60` }}>/night</span></span>
                          )}
                          {s.showGuests && (
                            <span className="flex items-center gap-1 text-sm" style={{ color: `${s.cardTextColor}60` }}><Users className="size-3.5" />{property.maxGuests} guests</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Image */}
                      <div className="relative bg-neutral-100" style={{ aspectRatio: ASPECT_MAP[s.cardImageAspect], borderRadius: imgRadius }}>
                        {firstImage ? (
                          <img src={firstImage} alt={property.name} className="h-full w-full object-cover" style={{ borderRadius: imgRadius }} />
                        ) : (
                          <div className="flex h-full items-center justify-center text-neutral-300 text-sm">No image</div>
                        )}
                        {s.imageOverlay && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" style={{ borderRadius: imgRadius }} />}
                        {s.pricePosition === "top-right" && s.showPrice && (
                          <div className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: s.accentColor }}>
                            {symbol}{property.price}/night
                          </div>
                        )}
                        {s.pricePosition === "badge" && s.showPrice && (
                          <div className="absolute bottom-3 left-3 rounded-md px-2.5 py-1 text-xs font-bold text-white bg-black/70">
                            {symbol}{property.price}/night
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-4 space-y-2" style={{ color: s.cardTextColor }}>
                        <div className="flex items-start justify-between">
                          <h3 className="text-base font-semibold">{property.name}</h3>
                          {s.showRating && (
                            <div className="flex items-center gap-0.5 text-sm"><Star className="size-3.5 fill-amber-400 text-amber-400" />4.9</div>
                          )}
                        </div>
                        {s.showLocation && property.address && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: `${s.cardTextColor}70` }}><MapPin className="size-3.5" />{property.address}</div>
                        )}
                        {s.showAmenities && amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 text-xs" style={{ color: `${s.cardTextColor}50` }}>
                            {amenities.slice(0, 3).map((a) => (
                              <span key={a} className="flex items-center gap-1"><Wifi className="size-3" />{a}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          {s.pricePosition === "bottom" && s.showPrice && (
                            <span className="text-base font-bold">{symbol}{property.price}<span className="text-sm font-normal" style={{ color: `${s.cardTextColor}60` }}>/night</span></span>
                          )}
                          {s.showGuests && (
                            <span className="flex items-center gap-1 text-sm" style={{ color: `${s.cardTextColor}50` }}><Users className="size-3.5" />{property.maxGuests}</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
