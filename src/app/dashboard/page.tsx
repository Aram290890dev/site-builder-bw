import Link from "next/link";
import { getSites } from "./actions";
import { CreateSiteDialog } from "./create-site-dialog";
import { Badge } from "@/components/ui/badge";
import { Globe, Building2, CalendarDays, Pencil, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const sites = await getSites();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Sites</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your booking websites
          </p>
        </div>
        <CreateSiteDialog />
      </div>

      {sites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}

type SiteWithCounts = Awaited<ReturnType<typeof getSites>>[number];

function SiteCard({ site }: { site: SiteWithCounts }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-100">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50">
          <Globe className="size-5 text-indigo-600" />
        </div>
        <Badge
          className={cn(
            "rounded-full text-xs",
            site.published
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-neutral-100 text-neutral-500 border-neutral-200"
          )}
        >
          {site.published ? "Published" : "Draft"}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-black">{site.name}</h3>
      <p className="mt-1 text-sm text-neutral-400">{site.subdomain}.bookwise.dev</p>

      <div className="mt-4 flex gap-4 border-t border-neutral-100 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Building2 className="size-3.5" />
          {site._count.properties} properties
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <CalendarDays className="size-3.5" />
          {site._count.bookings} bookings
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/dashboard/${site.id}/builder`}
          className={cn(
            buttonVariants({ size: "sm" }),
            "flex-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          )}
        >
          <Pencil className="mr-1.5 size-3.5" />
          Edit
        </Link>
        <Link
          href={`/site/${site.subdomain}`}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex-1 rounded-lg"
          )}
        >
          <ExternalLink className="mr-1.5 size-3.5" />
          View Site
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-20">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
        <Globe className="size-6 text-neutral-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No sites yet</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Create your first booking website to get started.
      </p>
      <div className="mt-6">
        <CreateSiteDialog />
      </div>
    </div>
  );
}
