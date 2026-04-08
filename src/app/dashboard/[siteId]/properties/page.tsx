import { getPropertiesForSite, getSiteBasic } from "./actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, DollarSign, Pencil, Trash2, Plus, Building2, ExternalLink, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DeletePropertyButton } from "./delete-button";
import { PropertyFormDialog } from "./property-form";

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const [site, properties] = await Promise.all([
    getSiteBasic(siteId),
    getPropertiesForSite(siteId),
  ]);

  if (!site) return notFound();

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage properties for <span className="font-medium text-neutral-700">{site.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/site/${site.subdomain}/properties`}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-lg")}
            >
              <ExternalLink className="mr-1.5 size-3.5" />
              View Public
            </Link>
            <PropertyFormDialog siteId={siteId} mode="create" />
          </div>
        </div>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
            <Building2 className="size-6 text-neutral-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No properties yet</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Add your first property to get started.
          </p>
          <div className="mt-6">
            <PropertyFormDialog siteId={siteId} mode="create" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const images = (property.images as string[]) ?? [];
            const amenities = (property.amenities as string[]) ?? [];
            const symbol = property.currency === "EUR" ? "\u20AC" : "$";

            return (
              <div
                key={property.id}
                className="flex items-center gap-5 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                {/* Thumbnail */}
                <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  {images[0] ? (
                    <img src={images[0]} alt={property.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-300">
                      <Building2 className="size-6" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold truncate">{property.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                    {property.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {property.address}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <DollarSign className="size-3.5" />
                      {symbol}{property.price}/night
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {property.maxGuests} guests
                    </span>
                  </div>
                  {amenities.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {amenities.slice(0, 5).map((a) => (
                        <span key={a} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                          {a}
                        </span>
                      ))}
                      {amenities.length > 5 && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-400">
                          +{amenities.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="shrink-0 text-center">
                  <div className="text-lg font-bold">{property._count.bookings}</div>
                  <div className="text-xs text-neutral-400">bookings</div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/dashboard/${siteId}/properties/${property.id}/availability`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-lg")}
                    title="Manage availability"
                  >
                    <CalendarDays className="size-3.5" />
                  </Link>
                  <PropertyFormDialog
                    siteId={siteId}
                    mode="edit"
                    property={{
                      id: property.id,
                      name: property.name,
                      description: property.description ?? "",
                      address: property.address ?? "",
                      price: property.price,
                      currency: property.currency,
                      maxGuests: property.maxGuests,
                      amenities: amenities,
                      images: images,
                    }}
                  />
                  <DeletePropertyButton propertyId={property.id} siteId={siteId} propertyName={property.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
