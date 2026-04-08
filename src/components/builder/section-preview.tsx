"use client";

import type { CSSProperties } from "react";
import type { Section, SectionStyle } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import { InlineEditable } from "./inline-editable";
import {
  Images,
  Quote,
  MapPin,
  LayoutGrid,
  Star,
  Users,
  Check,
} from "lucide-react";

/* ─── Style maps (matching the real site renderer exactly) ─── */

const PADDING_MAP = { sm: "2rem 1rem", md: "3rem 1rem", lg: "5rem 1rem", xl: "7rem 1rem" };
const RADIUS_MAP = { none: "0", sm: "0.5rem", md: "0.75rem", lg: "1rem" };
const HEADING_SIZE_MAP = { sm: "1.5rem", md: "1.875rem", lg: "2.25rem", xl: "3rem", "2xl": "3.75rem" };
const HEADING_WEIGHT_MAP = { light: "300", normal: "400", medium: "500", semibold: "600", bold: "700", black: "900" };
const LETTER_SPACING_MAP = { tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em" };
const FONT_MAP = { sans: "system-ui, -apple-system, sans-serif", serif: "Georgia, Cambria, serif", mono: "ui-monospace, monospace", display: "Georgia, Cambria, serif" };
const GRADIENT_DIR_MAP = { "to-b": "to bottom", "to-r": "to right", "to-br": "to bottom right", "to-bl": "to bottom left" };

function getStyleVars(style?: SectionStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};

  if (style.gradient) {
    css.background = `linear-gradient(${GRADIENT_DIR_MAP[style.gradient.direction]}, ${style.gradient.from}, ${style.gradient.to})`;
  } else if (style.backgroundColor) {
    css.backgroundColor = style.backgroundColor;
  }

  if (style.textColor) css.color = style.textColor;
  css.textAlign = style.textAlign ?? "center";
  if (style.padding) css.padding = PADDING_MAP[style.padding];
  if (style.borderRadius) css.borderRadius = RADIUS_MAP[style.borderRadius];
  if (style.fontOverride) css.fontFamily = FONT_MAP[style.fontOverride];
  if (style.backgroundImage) {
    css.backgroundImage = `url(${style.backgroundImage})`;
    css.backgroundSize = "cover";
    css.backgroundPosition = "center";
    css.position = "relative";
  }
  return css;
}

function getHeadingStyle(style?: SectionStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.headingSize) css.fontSize = HEADING_SIZE_MAP[style.headingSize];
  if (style.headingWeight) css.fontWeight = HEADING_WEIGHT_MAP[style.headingWeight];
  if (style.letterSpacing) css.letterSpacing = LETTER_SPACING_MAP[style.letterSpacing];
  return css;
}

function getButtonStyle(style?: SectionStyle, accent?: string): CSSProperties {
  if (!style) return {};
  const a = accent ?? style.accentColor ?? "#4f46e5";
  const css: CSSProperties = {};

  if (style.buttonShape === "pill") css.borderRadius = "9999px";
  else if (style.buttonShape === "square") css.borderRadius = "0";
  else css.borderRadius = "0.5rem";

  if (style.buttonVariant === "outline") {
    css.backgroundColor = "transparent";
    css.color = a;
    css.border = `2px solid ${a}`;
  } else if (style.buttonVariant === "ghost") {
    css.backgroundColor = "transparent";
    css.color = a;
    css.border = "2px solid transparent";
  } else {
    css.backgroundColor = a;
    css.color = "#ffffff";
  }

  if (style.buttonSize === "sm") { css.padding = "0.5rem 1.25rem"; css.fontSize = "0.875rem"; }
  else if (style.buttonSize === "lg") { css.padding = "1rem 2.5rem"; css.fontSize = "1.125rem"; }
  else { css.padding = "0.75rem 2rem"; css.fontSize = "1rem"; }

  return css;
}

interface SectionPreviewProps {
  section: Section;
  themeAccent?: string;
  onUpdate?: (id: string, data: Record<string, unknown>) => void;
}

export function SectionPreview({ section, themeAccent, onUpdate }: SectionPreviewProps) {
  const style = section.style;
  const accent = style?.accentColor ?? themeAccent ?? "#4f46e5";
  const textColor = style?.textColor;
  const wrapperStyle = getStyleVars(style);
  const hStyle = getHeadingStyle(style);
  const bStyle = getButtonStyle(style, accent);

  function updateField(key: string, value: string) {
    onUpdate?.(section.id, { [key]: value });
  }

  switch (section.type) {
    /* ═══════ HERO — matches site hero.tsx ═══════ */
    case "hero": {
      const bgImage = style?.backgroundImage;
      const overlay = style?.backgroundOverlay ?? 0.4;

      return (
        <section
          className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
          style={{
            backgroundColor: style?.backgroundColor ?? "#0f172a",
            ...wrapperStyle,
          }}
        >
          {bgImage && (
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlay})` }} />
          )}
          <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Welcome to Our Properties"
              tag="h1"
              className="text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ color: textColor ?? "#ffffff", ...hStyle }}
            />
            <InlineEditable
              value={(section.data.subtitle as string) ?? ""}
              onChange={(v) => updateField("subtitle", v)}
              placeholder="Find your perfect stay"
              tag="p"
              className="mx-auto mt-4 max-w-xl text-lg"
              style={{ color: textColor ? `${textColor}bb` : "#94a3b8" }}
            />
            <div className="mt-8">
              <InlineEditable
                value={(section.data.ctaText as string) ?? ""}
                onChange={(v) => updateField("ctaText", v)}
                placeholder="Browse Properties"
                tag="span"
                className="inline-block font-semibold"
                style={{
                  backgroundColor: accent,
                  color: "#ffffff",
                  borderRadius: "9999px",
                  padding: "0.75rem 2rem",
                  ...bStyle,
                }}
              />
            </div>
          </div>
        </section>
      );
    }

    /* ═══════ PROPERTY GRID — matches site property-grid.tsx ═══════ */
    case "propertyGrid": {
      const cols = (section.data.columns as number) ?? 3;
      return (
        <section className="py-16" style={wrapperStyle}>
          <div className="mx-auto max-w-6xl px-6">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Our Properties"
              tag="h2"
              className="mb-8 text-3xl font-bold"
              style={{ color: textColor, textAlign: "inherit", ...hStyle }}
            />
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                  <div className="aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-200" />
                  <div className="space-y-1.5 p-4">
                    <div className="flex items-start justify-between">
                      <div className="h-4 w-2/3 rounded bg-neutral-200" />
                      <div className="flex items-center gap-0.5 text-sm text-amber-500">
                        <Star className="size-3.5 fill-current" />
                        <span className="text-xs">4.9</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-400">
                      <MapPin className="size-3.5" />
                      <div className="h-3 w-1/2 rounded bg-neutral-100" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-0.5">
                        <div className="h-5 w-12 rounded bg-neutral-200" />
                        <span className="text-xs text-neutral-400">/night</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-400">
                        <Users className="size-3.5" />
                        <span className="text-xs">4</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ═══════ GALLERY — matches site gallery.tsx ═══════ */
    case "gallery": {
      const images = (section.data.images as string[]) ?? [];
      return (
        <section className="py-16" style={wrapperStyle}>
          <div className="mx-auto max-w-6xl px-6">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Gallery"
              tag="h2"
              className="mb-8 text-3xl font-bold"
              style={{ color: textColor, textAlign: "inherit", ...hStyle }}
            />
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl">
                    <img src={src} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200">
                <div className="text-center text-neutral-400">
                  <Images className="mx-auto size-8" />
                  <p className="mt-2 text-sm">Gallery images will appear here</p>
                </div>
              </div>
            )}
          </div>
        </section>
      );
    }

    /* ═══════ TESTIMONIALS — matches site testimonials.tsx ═══════ */
    case "testimonials": {
      const items = (section.data.items as Array<{ name: string; text: string; rating: number }>) ?? [];
      return (
        <section className="py-16" style={wrapperStyle}>
          <div className="mx-auto max-w-6xl px-6">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="What Our Guests Say"
              tag="h2"
              className="mb-10 text-3xl font-bold"
              style={{ color: textColor, textAlign: "inherit", ...hStyle }}
            />
            {items.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, i) => (
                  <div key={i} className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
                    <Quote className="mb-3 size-6" style={{ color: `${accent}66` }} />
                    <InlineEditable
                      value={item.text}
                      onChange={(v) => {
                        const updated = [...items];
                        updated[i] = { ...item, text: v };
                        onUpdate?.(section.id, { items: updated });
                      }}
                      placeholder="Review text..."
                      tag="p"
                      multiline
                      className="text-base leading-relaxed"
                      style={{ color: textColor ? `${textColor}cc` : "#525252" }}
                    />
                    <div className="mt-4 flex items-center justify-between">
                      <InlineEditable
                        value={item.name}
                        onChange={(v) => {
                          const updated = [...items];
                          updated[i] = { ...item, name: v };
                          onUpdate?.(section.id, { items: updated });
                        }}
                        placeholder="Guest name"
                        tag="span"
                        className="text-sm font-semibold"
                        style={{ color: textColor ?? "#171717" }}
                      />
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = [...items];
                              updated[i] = { ...item, rating: n };
                              onUpdate?.(section.id, { items: updated });
                            }}
                            className={`text-sm ${n <= item.rating ? "text-amber-400" : "text-neutral-200 hover:text-amber-300"}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-400">No reviews yet.</p>
            )}
          </div>
        </section>
      );
    }

    /* ═══════ CONTACT — matches site contact.tsx ═══════ */
    case "contact": {
      const email = section.data.email as string;
      const phone = section.data.phone as string;
      const address = section.data.address as string | undefined;

      return (
        <section className="py-16" style={wrapperStyle}>
          <div className="mx-auto max-w-xl px-6">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Get in Touch"
              tag="h2"
              className="mb-2 text-3xl font-bold"
              style={{ color: textColor, textAlign: "inherit", ...hStyle }}
            />
            {(email || phone || address) && (
              <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: textColor ? `${textColor}99` : "#737373" }}>
                {email && <span>{email}</span>}
                {phone && <span>{phone}</span>}
                {address && <span>{address}</span>}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
                  readOnly
                />
                <input
                  type="email"
                  placeholder={email || "Email address"}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
                  readOnly
                />
              </div>
              {phone && (
                <input
                  type="tel"
                  placeholder={phone}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
                  readOnly
                />
              )}
              <textarea
                placeholder="Your message..."
                rows={5}
                className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none"
                readOnly
              />
              <div
                className="w-full py-3 text-center text-sm font-semibold"
                style={{ backgroundColor: accent, color: "#ffffff", borderRadius: "0.5rem", ...bStyle }}
              >
                Send Message
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ═══════ MAP — matches site map-section.tsx ═══════ */
    case "map":
      return (
        <section className="py-16" style={wrapperStyle}>
          <div className="mx-auto max-w-6xl px-6">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Our Locations"
              tag="h2"
              className="mb-8 text-3xl font-bold"
              style={{ color: textColor, textAlign: "inherit", ...hStyle }}
            />
            <div className="flex h-72 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="text-center text-neutral-400">
                <MapPin className="mx-auto size-10" />
                <p className="mt-2 text-sm">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </section>
      );

    /* ═══════ FEATURES — matches site features.tsx ═══════ */
    case "features": {
      const featureItems = (section.data.items as string[]) ?? [];
      return (
        <section className="py-16" style={wrapperStyle}>
          <div className="mx-auto max-w-4xl px-6">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="What We Offer"
              tag="h2"
              className="mb-8 text-3xl font-bold"
              style={{ color: textColor, textAlign: "inherit", ...hStyle }}
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featureItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3 shadow-sm"
                >
                  <div
                    className="flex size-7 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accent}15` }}
                  >
                    <Check className="size-4" style={{ color: accent }} />
                  </div>
                  <InlineEditable
                    value={item}
                    onChange={(v) => {
                      const updated = [...featureItems];
                      updated[i] = v;
                      onUpdate?.(section.id, { items: updated });
                    }}
                    placeholder="Feature item"
                    tag="span"
                    className="text-sm font-medium"
                    style={{ color: textColor ?? "#374151" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ═══════ CTA — matches site cta.tsx ═══════ */
    case "cta":
      return (
        <section
          className="py-20"
          style={{
            backgroundColor: style?.backgroundColor ?? "#0f172a",
            ...wrapperStyle,
          }}
        >
          <div className="mx-auto max-w-2xl px-6 text-center">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Ready to Book?"
              tag="h2"
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: textColor ?? "#ffffff", ...hStyle }}
            />
            <InlineEditable
              value={(section.data.subtitle as string) ?? ""}
              onChange={(v) => updateField("subtitle", v)}
              placeholder="Reserve your stay today"
              tag="p"
              className="mx-auto mt-3 max-w-md text-lg"
              style={{ color: textColor ? `${textColor}99` : "#94a3b8" }}
            />
            <div className="mt-8">
              <InlineEditable
                value={(section.data.buttonText as string) ?? ""}
                onChange={(v) => updateField("buttonText", v)}
                placeholder="Book Now"
                tag="span"
                className="inline-block font-semibold"
                style={{
                  backgroundColor: accent,
                  color: "#ffffff",
                  borderRadius: "9999px",
                  padding: "0.75rem 2rem",
                  ...bStyle,
                }}
              />
            </div>
          </div>
        </section>
      );

    /* ═══════ FALLBACK ═══════ */
    default: {
      const sType = section.type as string;
      return (
        <div className="flex items-center gap-3 px-6 py-8" style={getStyleVars(style)}>
          <LayoutGrid className="size-5 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-600">
            {(SECTION_DEFINITIONS as Record<string, { label: string }>)[sType]?.label ?? "Unknown Section"}
          </span>
        </div>
      );
    }
  }
}
