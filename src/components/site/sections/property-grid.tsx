import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
import { getHeadingStyle } from "./section-renderer";
import Link from "next/link";
import { MapPin, Users, Star } from "lucide-react";

interface PropertyData {
  id: string;
  name: string;
  address: string | null;
  price: number;
  currency: string;
  maxGuests: number;
  images: unknown;
  amenities: unknown;
}

interface Props {
  section: Section;
  accent: string;
  textColor?: string;
  wrapperStyle: CSSProperties;
  siteSubdomain: string;
  properties: PropertyData[];
}

export function PropertyGridSection({ section, accent, textColor, wrapperStyle, siteSubdomain, properties }: Props) {
  const title = section.data.title as string;
  const cols = (section.data.columns as number) ?? 3;

  return (
    <section className="py-16" style={wrapperStyle}>
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="mb-8 text-3xl font-bold"
          style={{ color: textColor, textAlign: "inherit", ...getHeadingStyle(section.style) }}
        >
          {title}
        </h2>

        {properties.length === 0 ? (
          <p className="text-center text-neutral-400">No properties available yet.</p>
        ) : (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${Math.min(cols, properties.length)}, 1fr)` }}
          >
            {properties.map((property) => {
              const images = (property.images as string[]) ?? [];
              const firstImage = images[0];
              const symbol = property.currency === "EUR" ? "\u20AC" : "$";

              return (
                <Link
                  key={property.id}
                  href={`/site/${siteSubdomain}/properties/${property.id}`}
                  className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                    {firstImage ? (
                      <img src={firstImage} alt={property.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-300 text-sm">No image</div>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold" style={{ color: textColor }}>{property.name}</h3>
                      <div className="flex items-center gap-0.5 text-sm text-amber-500">
                        <Star className="size-3.5 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>
                    {property.address && (
                      <div className="flex items-center gap-1 text-sm text-neutral-500">
                        <MapPin className="size-3.5" />
                        {property.address}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg font-bold" style={{ color: textColor }}>
                        {symbol}{property.price}
                        <span className="text-sm font-normal text-neutral-400">/night</span>
                      </span>
                      <div className="flex items-center gap-1 text-sm text-neutral-400">
                        <Users className="size-3.5" />
                        {property.maxGuests}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
