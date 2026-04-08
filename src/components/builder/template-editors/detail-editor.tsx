"use client";

import type { DetailPageSettings } from "@/types/builder";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Wifi, Car, Waves, Wind } from "lucide-react";

const DEVICE_WIDTH = { desktop: "100%", tablet: "768px", mobile: "375px" } as const;
type PreviewDevice = "desktop" | "tablet" | "mobile";

interface Props {
  settings: DetailPageSettings;
  previewDevice: PreviewDevice;
  onUpdate: (updates: Partial<DetailPageSettings>) => void;
}

export function DetailTemplateEditor({ settings, previewDevice, onUpdate }: Props) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Settings Panel */}
      <div className="w-80 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white p-4 space-y-5">
        <div>
          <h3 className="text-sm font-semibold">Property Detail Page</h3>
          <p className="text-xs text-neutral-400">Customize the individual property view</p>
        </div>

        <Separator />

        {/* Gallery */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Gallery</Label>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Style</Label>
            <div className="flex gap-2">
              {(["grid", "slider", "masonry"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ galleryStyle: v })} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${settings.galleryStyle === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Image Corners</Label>
            <div className="flex gap-2">
              {(["none", "sm", "md", "lg"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ galleryImageRadius: v })} className={`flex-1 rounded-lg border py-1.5 text-[10px] font-medium uppercase transition-colors ${settings.galleryImageRadius === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Columns</Label>
            <div className="flex gap-2">
              {([2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => onUpdate({ galleryColumns: n })} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${settings.galleryColumns === n ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Image Aspect</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["auto", "landscape", "portrait", "square"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ imageAspect: v })} className={`rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${settings.imageAspect === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Sections */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Show / Hide Sections</Label>
          {([
            { key: "showDescription", label: "Description" },
            { key: "showAmenities", label: "Amenities" },
            { key: "showMap", label: "Map" },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-xs text-neutral-600">{label}</span>
              <input type="checkbox" checked={settings[key]} onChange={(e) => onUpdate({ [key]: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 accent-indigo-600" />
            </label>
          ))}
        </div>

        <Separator />

        {/* Booking Form */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Booking</Label>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Calendar Style</Label>
            <div className="flex gap-2">
              {(["inline", "popup"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ calendarStyle: v })} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${settings.calendarStyle === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Booking Form Layout</Label>
            <div className="flex gap-2">
              {(["sidebar", "card", "inline"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ bookingFormStyle: v })} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${settings.bookingFormStyle === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Typography</Label>
          <div className="space-y-1.5">
            <Label className="text-xs text-neutral-500">Heading Font</Label>
            <div className="flex gap-2">
              {(["default", "serif", "mono"] as const).map((v) => (
                <button key={v} onClick={() => onUpdate({ headingFont: v })} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium capitalize transition-colors ${settings.headingFont === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
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
        </div>

        <Separator />

        {/* Colors */}
        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Colors</Label>
          {([
            { key: "pageBgColor", label: "Page Background" },
            { key: "textColor", label: "Text" },
            { key: "accentColor", label: "Accent / Buttons" },
            { key: "calendarAccentColor", label: "Calendar Accent" },
            { key: "calendarBlockedColor", label: "Blocked Dates" },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <input type="color" value={settings[key]} onChange={(e) => onUpdate({ [key]: e.target.value })} className="h-7 w-7 cursor-pointer rounded border border-neutral-200" />
              <span className="flex-1 text-xs text-neutral-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div
        className="flex-1 overflow-y-auto p-8"
        style={{ backgroundColor: previewDevice !== "desktop" ? "#e5e5e5" : settings.pageBgColor }}
      >
        <div
          className="mx-auto transition-all duration-300 ease-in-out"
          style={{
            maxWidth: DEVICE_WIDTH[previewDevice],
            backgroundColor: settings.pageBgColor,
            borderRadius: previewDevice !== "desktop" ? "12px" : undefined,
            boxShadow: previewDevice !== "desktop" ? "0 4px 24px rgba(0,0,0,0.12)" : undefined,
            minHeight: previewDevice !== "desktop" ? "70vh" : undefined,
            overflow: previewDevice !== "desktop" ? "hidden" : undefined,
            padding: previewDevice !== "desktop" ? "2rem 1rem" : undefined,
          }}
        >
          <div className={previewDevice === "desktop" ? "max-w-4xl mx-auto" : ""}>
            <DetailPreview settings={settings} compact={previewDevice !== "desktop"} />
          </div>
        </div>
      </div>
    </div>
  );
}

const RADIUS_MAP: Record<string, string> = { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem" };
const ASPECT_MAP: Record<string, string> = { auto: "auto", landscape: "16/10", portrait: "3/4", square: "1/1" };
const FONT_MAP: Record<string, string> = { default: "inherit", serif: "Georgia, serif", mono: "ui-monospace, monospace" };

function DetailPreview({ settings, compact = false }: { settings: DetailPageSettings; compact?: boolean }) {
  const radius = RADIUS_MAP[settings.cardRadius] ?? "0.75rem";
  const imgRadius = RADIUS_MAP[settings.galleryImageRadius] ?? "0.5rem";
  const headingStyle: React.CSSProperties = { fontFamily: FONT_MAP[settings.headingFont], color: settings.textColor };

  const MASONRY_HEIGHTS = [180, 240, 160, 280, 200, 220, 150, 260];
  const galleryCols = compact ? Math.min(settings.galleryColumns, 2) : settings.galleryColumns;
  const imageCount = galleryCols * 2;

  return (
    <div className="space-y-6">
      {/* Gallery */}
      {settings.galleryStyle === "grid" && (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${galleryCols}, 1fr)` }}>
          {Array.from({ length: imageCount }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center bg-neutral-200 text-xs text-neutral-400"
              style={{
                borderRadius: imgRadius,
                aspectRatio: ASPECT_MAP[settings.imageAspect],
                gridColumn: !compact && i === 0 ? `span ${Math.min(2, galleryCols)}` : undefined,
                gridRow: !compact && i === 0 ? "span 2" : undefined,
              }}
            >
              Photo {i + 1}
            </div>
          ))}
        </div>
      )}

      {settings.galleryStyle === "slider" && (
        <div className="relative">
          <div className="flex gap-2 overflow-hidden">
            <div
              className={`flex shrink-0 items-center justify-center bg-neutral-200 text-sm text-neutral-400 ${compact ? "w-full" : "w-[65%]"}`}
              style={{ borderRadius: imgRadius, aspectRatio: ASPECT_MAP[settings.imageAspect === "auto" ? "landscape" : settings.imageAspect] }}
            >
              Photo 1
            </div>
            {!compact && (
              <>
                <div
                  className="flex w-[30%] shrink-0 items-center justify-center bg-neutral-200 text-xs text-neutral-400"
                  style={{ borderRadius: imgRadius, aspectRatio: ASPECT_MAP[settings.imageAspect === "auto" ? "landscape" : settings.imageAspect] }}
                >
                  Photo 2
                </div>
                <div
                  className="flex w-[20%] shrink-0 items-center justify-center bg-neutral-200 text-xs text-neutral-400 opacity-50"
                  style={{ borderRadius: imgRadius, aspectRatio: ASPECT_MAP[settings.imageAspect === "auto" ? "landscape" : settings.imageAspect] }}
                >
                  Photo 3
                </div>
              </>
            )}
          </div>
          {!compact && <div className="pointer-events-none absolute inset-y-0 right-0 w-24" style={{ background: `linear-gradient(to left, ${settings.pageBgColor}, transparent)` }} />}
          <div className="absolute inset-y-0 left-2 flex items-center">
            <div className="flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-md text-xs">&larr;</div>
          </div>
          <div className="absolute inset-y-0 right-2 flex items-center">
            <div className="flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-md text-xs">&rarr;</div>
          </div>
          <div className="mt-3 flex justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="size-2 rounded-full"
                style={{ backgroundColor: i === 0 ? settings.accentColor : `${settings.textColor}30` }}
              />
            ))}
          </div>
        </div>
      )}

      {settings.galleryStyle === "masonry" && (
        <div className="flex gap-2">
          {Array.from({ length: galleryCols }).map((_, colIdx) => (
            <div key={colIdx} className="flex flex-1 flex-col gap-2">
              {Array.from({ length: 3 }).map((_, rowIdx) => {
                const idx = colIdx * 3 + rowIdx;
                return (
                  <div
                    key={rowIdx}
                    className="flex items-center justify-center bg-neutral-200 text-xs text-neutral-400"
                    style={{
                      borderRadius: imgRadius,
                      height: compact ? MASONRY_HEIGHTS[idx % MASONRY_HEIGHTS.length] * 0.6 : MASONRY_HEIGHTS[idx % MASONRY_HEIGHTS.length],
                    }}
                  >
                    Photo {idx + 1}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Content + Booking — stacks vertically when compact */}
      <div className={!compact && settings.bookingFormStyle === "sidebar" ? "grid grid-cols-3 gap-6" : "space-y-6"}>
        {/* Main Content */}
        <div className={!compact && settings.bookingFormStyle === "sidebar" ? "col-span-2 space-y-5" : "space-y-5"}>
          {/* Title */}
          <div>
            <h1 className={`font-bold ${compact ? "text-xl" : "text-2xl"}`} style={headingStyle}>The Clifftop Villa</h1>
            <div className={`mt-1 flex flex-wrap items-center gap-2 ${compact ? "text-xs" : "text-sm"}`} style={{ color: `${settings.textColor}99` }}>
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />Mykonos, Greece</span>
              <span className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" />4.9</span>
              <span>8 guests</span>
            </div>
          </div>

          {/* Description */}
          {settings.showDescription && (
            <div className="rounded-xl p-5" style={{ backgroundColor: `${settings.textColor}08`, borderRadius: radius }}>
              <h2 className="text-lg font-semibold mb-2" style={headingStyle}>About this property</h2>
              <p className="text-sm leading-relaxed" style={{ color: `${settings.textColor}cc` }}>
                A stunning 4-bedroom villa perched on the cliffs of Mykonos with panoramic Aegean views, infinity pool, and private beach access. Perfect for families and groups looking for a luxury Mediterranean escape.
              </p>
            </div>
          )}

          {/* Amenities */}
          {settings.showAmenities && (
            <div>
              <h2 className={`font-semibold mb-3 ${compact ? "text-base" : "text-lg"}`} style={headingStyle}>Amenities</h2>
              <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
                {[
                  { icon: Waves, label: "Pool" },
                  { icon: Wifi, label: "WiFi" },
                  { icon: Car, label: "Parking" },
                  { icon: Wind, label: "AC" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm" style={{ borderRadius: radius, color: settings.textColor }}>
                    <Icon className="size-4" style={{ color: settings.accentColor }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar */}
          {settings.calendarStyle === "inline" && (
            <div>
              <h2 className="text-lg font-semibold mb-3" style={headingStyle}>Availability</h2>
              <div className="rounded-xl border border-neutral-200 p-4" style={{ borderRadius: radius }}>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="py-1 font-medium" style={{ color: `${settings.textColor}80` }}>{d}</div>
                  ))}
                  {Array.from({ length: 28 }).map((_, i) => {
                    const blocked = [5, 6, 7, 15, 16].includes(i);
                    const selected = [10, 11, 12].includes(i);
                    return (
                      <div
                        key={i}
                        className="flex h-8 items-center justify-center rounded-md text-xs"
                        style={{
                          backgroundColor: selected ? settings.calendarAccentColor : blocked ? settings.calendarBlockedColor : "transparent",
                          color: selected ? "#fff" : blocked ? "#dc2626" : settings.textColor,
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
          {settings.showMap && (
            <div>
              <h2 className="text-lg font-semibold mb-3" style={headingStyle}>Location</h2>
              <div className="flex h-48 items-center justify-center rounded-xl bg-neutral-100" style={{ borderRadius: radius }}>
                <MapPin className="size-8 text-neutral-300" />
              </div>
            </div>
          )}
        </div>

        {/* Booking Sidebar / Card */}
        <div className={!compact && settings.bookingFormStyle === "sidebar" ? "" : !compact && settings.bookingFormStyle === "card" ? "max-w-sm mx-auto" : ""}>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3" style={{ borderRadius: radius }}>
            <div className="flex items-baseline gap-1">
              <span className={`font-bold ${compact ? "text-xl" : "text-2xl"}`} style={{ color: settings.textColor }}>€450</span>
              <span className="text-sm" style={{ color: `${settings.textColor}80` }}>/night</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-neutral-200 px-3 py-2">
                <div className="text-[10px] font-medium uppercase" style={{ color: `${settings.textColor}60` }}>Check-in</div>
                <div className="text-xs" style={{ color: settings.textColor }}>Select date</div>
              </div>
              <div className="rounded-lg border border-neutral-200 px-3 py-2">
                <div className="text-[10px] font-medium uppercase" style={{ color: `${settings.textColor}60` }}>Check-out</div>
                <div className="text-xs" style={{ color: settings.textColor }}>Select date</div>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 px-3 py-2">
              <div className="text-[10px] font-medium uppercase" style={{ color: `${settings.textColor}60` }}>Guests</div>
              <div className="text-xs" style={{ color: settings.textColor }}>1 guest</div>
            </div>
            <button className="w-full rounded-lg py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: settings.accentColor, borderRadius: radius }}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
