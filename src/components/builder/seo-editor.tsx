"use client";

import type { PageSeo, SiteSeo } from "@/types/builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Search, Globe, Image as ImageIcon } from "lucide-react";

interface PageSeoEditorProps {
  pageName: string;
  pageSlug: string;
  seo: PageSeo;
  siteSeo: SiteSeo;
  onUpdatePage: (updates: Partial<PageSeo>) => void;
  onUpdateSite: (updates: Partial<SiteSeo>) => void;
  onClose: () => void;
}

export function SeoEditor({
  pageName,
  pageSlug,
  seo,
  siteSeo,
  onUpdatePage,
  onUpdateSite,
  onClose,
}: PageSeoEditorProps) {
  const title = seo.metaTitle || siteSeo.siteTitle || pageName;
  const description = seo.metaDescription || siteSeo.siteDescription || "";
  const ogImage = seo.ogImage || siteSeo.ogImage || "";

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">SEO Settings</h3>
          <p className="text-xs text-neutral-400">{pageName} — {pageSlug}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Google Preview */}
        <div className="space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Search Preview</div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 space-y-1">
            <div className="truncate text-sm font-medium text-blue-700">
              {title || "Page Title"}
            </div>
            <div className="truncate text-xs text-emerald-700">
              yoursite.com{pageSlug}
            </div>
            <div className="line-clamp-2 text-xs text-neutral-500">
              {description || "Add a meta description to see how your page appears in search results..."}
            </div>
          </div>
        </div>

        <Separator />

        {/* Page SEO */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            <Search className="size-3" />
            Page SEO
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Meta Title</Label>
            <Input
              value={seo.metaTitle ?? ""}
              onChange={(e) => onUpdatePage({ metaTitle: (e.target as HTMLInputElement).value })}
              placeholder={siteSeo.siteTitle || pageName}
              className="text-xs"
            />
            <p className="text-[10px] text-neutral-400">
              {(seo.metaTitle || "").length}/60 characters
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Meta Description</Label>
            <textarea
              value={seo.metaDescription ?? ""}
              onChange={(e) => onUpdatePage({ metaDescription: e.target.value })}
              placeholder={siteSeo.siteDescription || "Describe this page for search engines..."}
              rows={3}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
            <p className="text-[10px] text-neutral-400">
              {(seo.metaDescription || "").length}/160 characters
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">OG Image URL</Label>
            <Input
              value={seo.ogImage ?? ""}
              onChange={(e) => onUpdatePage({ ogImage: (e.target as HTMLInputElement).value })}
              placeholder={siteSeo.ogImage || "https://..."}
              className="text-xs"
            />
            {ogImage && (
              <div className="relative mt-1 aspect-[1200/630] w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                <img src={ogImage} alt="OG preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Site-wide SEO defaults */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            <Globe className="size-3" />
            Site Defaults
          </div>
          <p className="text-[10px] text-neutral-400">
            These apply to all pages that don&apos;t have their own SEO settings.
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Site Title</Label>
            <Input
              value={siteSeo.siteTitle ?? ""}
              onChange={(e) => onUpdateSite({ siteTitle: (e.target as HTMLInputElement).value })}
              placeholder="My Booking Site"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Site Description</Label>
            <textarea
              value={siteSeo.siteDescription ?? ""}
              onChange={(e) => onUpdateSite({ siteDescription: e.target.value })}
              placeholder="Book your perfect stay..."
              rows={3}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700 outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Default OG Image</Label>
            <Input
              value={siteSeo.ogImage ?? ""}
              onChange={(e) => onUpdateSite({ ogImage: (e.target as HTMLInputElement).value })}
              placeholder="https://..."
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Favicon URL</Label>
            <div className="flex items-center gap-2">
              {siteSeo.favicon && (
                <img src={siteSeo.favicon} alt="favicon" className="size-5 rounded" />
              )}
              <Input
                value={siteSeo.favicon ?? ""}
                onChange={(e) => onUpdateSite({ favicon: (e.target as HTMLInputElement).value })}
                placeholder="https://..."
                className="flex-1 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
