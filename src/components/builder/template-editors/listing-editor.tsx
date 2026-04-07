"use client";

import type { ListingPageSettings } from "@/types/builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Users, Wifi } from "lucide-react";

interface Props {
  settings: ListingPageSettings;
  onUpdate: (updates: Partial<ListingPageSettings>) => void;
}

export function ListingTemplateEditor({ settings, onUpdate }: Props) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Settings Panel */}
      <div className="w-80 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white p-4 space-y-5">
        <div>
          <h3 className="text-sm font-semibold">Listings Page</h3>
          <p className="text-xs text-neutral-400">Customize how properties are displayed</p>
        </div>

        <Separator />

        {/* Page Content */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Page Content</Label>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Title</Label>
            <Input value={settings.pageTitle} onChange={(e) => onUpdate({ pageTitle: (e.target as HTMLInputElement).value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Subtitle</Label>
            <Input value={settings.pageSubtitle} onChange={(e) => onUpdate({ pageSubtitle: (e.target as HTMLInputElement).value })} />
          </div>
        </div>

        <Separator />

        {/* Layout */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Layout</Label>
          <div className="flex gap-2">
            {(["grid", "list"] as const).map((v) => (
              <button key={v} onClick={() => onUpdate({ layout: v })} className={`flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-colors ${settings.layout === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                {v}
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Columns</Label>
            <div className="flex gap-2">
              {([2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => onUpdate({ columns: n })} className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors ${settings.columns === n ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Card Style */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Card Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["minimal", "bordered", "shadow", "elevated"] as const).map((v) => (
              <button key={v} onClick={() => onUpdate({ cardStyle: v })} className={`rounded-lg border py-2 text-xs font-medium capitalize transition-colors ${settings.cardStyle === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Image Settings</Label>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Aspect Ratio</Label>
            <div className="flex gap-2">
              {(["square", "landscape", "portrait"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ cardImageAspect: v })} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${settings.cardImageAspect === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Image Corners</Label>
            <div className="flex gap-2">
              {(["none", "sm", "md", "lg", "full"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ cardImageRadius: v })} className={`flex-1 rounded-lg border py-1.5 text-[10px] font-medium uppercase transition-colors ${settings.cardImageRadius === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Card Corners</Label>
            <div className="flex gap-2">
              {(["none", "sm", "md", "lg"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ cardRadius: v })} className={`flex-1 rounded-lg border py-1.5 text-[10px] font-medium uppercase transition-colors ${settings.cardRadius === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Hover Effect</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["none", "lift", "scale", "glow"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ hoverEffect: v })} className={`rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${settings.hoverEffect === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Price Position</Label>
            <div className="flex gap-2">
              {(["bottom", "top-right", "badge"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ pricePosition: v })} className={`flex-1 rounded-lg border py-1.5 text-[10px] font-medium capitalize transition-colors ${settings.pricePosition === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Show/Hide */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Card Info</Label>
          {([
            { key: "showPrice", label: "Price" },
            { key: "showLocation", label: "Location" },
            { key: "showRating", label: "Rating" },
            { key: "showAmenities", label: "Amenities" },
            { key: "showGuests", label: "Max Guests" },
            { key: "imageOverlay", label: "Image Overlay" },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-xs text-neutral-600">{label}</span>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => onUpdate({ [key]: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 accent-indigo-600"
              />
            </label>
          ))}
        </div>

        <Separator />

        {/* Colors */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Colors</Label>
          {([
            { key: "pageBgColor", label: "Page Background" },
            { key: "cardBgColor", label: "Card Background" },
            { key: "cardTextColor", label: "Card Text" },
            { key: "cardBorderColor", label: "Card Border" },
            { key: "accentColor", label: "Accent / Button" },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="color"
                value={settings[key]}
                onChange={(e) => onUpdate({ [key]: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded border border-neutral-200"
              />
              <span className="flex-1 text-xs text-neutral-600">{label}</span>
              <span className="font-mono text-[10px] text-neutral-400">{settings[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: settings.pageBgColor }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8" style={{ textAlign: "center" }}>
            <h1 className="text-2xl font-bold" style={{ color: settings.cardTextColor }}>{settings.pageTitle}</h1>
            <p className="mt-1 text-sm" style={{ color: `${settings.cardTextColor}80` }}>{settings.pageSubtitle}</p>
          </div>
          <ListingPreview settings={settings} />
        </div>
      </div>
    </div>
  );
}

const SAMPLE_PROPERTIES = [
  { name: "Clifftop Villa", location: "Mykonos, Greece", price: 450, rating: 4.9, guests: 8, currency: "EUR" },
  { name: "Mountain Retreat", location: "Aspen, Colorado", price: 320, rating: 4.8, guests: 6, currency: "USD" },
  { name: "Beachfront Bungalow", location: "Bali, Indonesia", price: 180, rating: 4.7, guests: 4, currency: "USD" },
  { name: "City Penthouse", location: "New York, USA", price: 550, rating: 4.9, guests: 4, currency: "USD" },
  { name: "Lake House", location: "Como, Italy", price: 380, rating: 4.8, guests: 6, currency: "EUR" },
  { name: "Desert Oasis", location: "Marrakech, Morocco", price: 210, rating: 4.6, guests: 8, currency: "USD" },
];

const RADIUS_MAP: Record<string, string> = { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem", full: "9999px" };
const ASPECT_MAP: Record<string, string> = { square: "1/1", landscape: "16/10", portrait: "3/4" };

function ListingPreview({ settings }: { settings: ListingPageSettings }) {
  const items = SAMPLE_PROPERTIES.slice(0, settings.columns * 2);

  const cardStyle: React.CSSProperties = {
    backgroundColor: settings.cardBgColor,
    borderRadius: RADIUS_MAP[settings.cardRadius] ?? "0.75rem",
    ...(settings.cardStyle === "bordered" ? { border: `1px solid ${settings.cardBorderColor}` } : {}),
    ...(settings.cardStyle === "shadow" ? { boxShadow: `0 1px 3px ${settings.cardBorderColor}40` } : {}),
    ...(settings.cardStyle === "elevated" ? { boxShadow: `0 4px 12px ${settings.cardBorderColor}60` } : {}),
    overflow: "hidden",
    transition: "all 0.2s",
  };

  return (
    <div
      className={settings.layout === "list" ? "space-y-4" : "grid gap-6"}
      style={settings.layout === "grid" ? { gridTemplateColumns: `repeat(${settings.columns}, 1fr)` } : {}}
    >
      {items.map((prop, i) => (
        <div key={i} style={cardStyle} className="group">
          {/* Image */}
          <div
            className="relative bg-neutral-200"
            style={{
              aspectRatio: settings.layout === "list" ? "16/10" : ASPECT_MAP[settings.cardImageAspect],
              borderRadius: settings.layout === "list" ? undefined : `${RADIUS_MAP[settings.cardImageRadius]} ${RADIUS_MAP[settings.cardImageRadius]} 0 0`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs">
              Property Photo
            </div>
            {settings.imageOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            )}
            {settings.pricePosition === "top-right" && settings.showPrice && (
              <div className="absolute top-2 right-2 rounded-full px-2.5 py-1 text-xs font-semibold text-white" style={{ backgroundColor: settings.accentColor }}>
                {prop.currency === "EUR" ? "€" : "$"}{prop.price}/night
              </div>
            )}
            {settings.pricePosition === "badge" && settings.showPrice && (
              <div className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-xs font-bold text-white bg-black/70">
                {prop.currency === "EUR" ? "€" : "$"}{prop.price}/night
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 space-y-1.5" style={{ color: settings.cardTextColor }}>
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold">{prop.name}</h3>
              {settings.showRating && (
                <div className="flex items-center gap-0.5 text-xs">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span>{prop.rating}</span>
                </div>
              )}
            </div>
            {settings.showLocation && (
              <div className="flex items-center gap-1 text-xs opacity-60">
                <MapPin className="size-3" />
                {prop.location}
              </div>
            )}
            {settings.showAmenities && (
              <div className="flex gap-2 text-xs opacity-50">
                <span className="flex items-center gap-0.5"><Wifi className="size-3" />WiFi</span>
                <span>Pool</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              {settings.pricePosition === "bottom" && settings.showPrice && (
                <span className="text-sm font-bold">{prop.currency === "EUR" ? "€" : "$"}{prop.price}<span className="text-xs font-normal opacity-60">/night</span></span>
              )}
              {settings.showGuests && (
                <div className="flex items-center gap-0.5 text-xs opacity-50">
                  <Users className="size-3" />
                  {prop.guests}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
