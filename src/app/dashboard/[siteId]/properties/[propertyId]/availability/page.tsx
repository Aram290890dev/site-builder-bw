import { getPropertyForAvailability } from "./actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AvailabilityCalendar } from "./calendar";

export default async function AvailabilityPage({
  params,
}: {
  params: Promise<{ siteId: string; propertyId: string }>;
}) {
  const { siteId, propertyId } = await params;
  const property = await getPropertyForAvailability(propertyId);

  if (!property) return notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-8">
        <Link
          href={`/dashboard/${siteId}/properties`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-black"
        >
          <ArrowLeft className="size-4" />
          Back to Properties
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Availability</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage dates for <span className="font-medium text-neutral-700">{property.name}</span>
        </p>
      </div>

      <AvailabilityCalendar
        propertyId={propertyId}
        siteId={siteId}
        basePrice={property.price}
        currency={property.currency}
      />
    </div>
  );
}
