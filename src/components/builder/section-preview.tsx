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
} from "lucide-react";

const PADDING_MAP = { sm: "1.5rem", md: "3rem", lg: "4.5rem", xl: "6rem" };
const RADIUS_MAP = { none: "0", sm: "0.5rem", md: "0.75rem", lg: "1rem" };
const HEADING_SIZE_MAP = { sm: "1.25rem", md: "1.75rem", lg: "2.25rem", xl: "2.75rem", "2xl": "3.25rem" };
const HEADING_WEIGHT_MAP = { light: "300", normal: "400", medium: "500", semibold: "600", bold: "700", black: "900" };
const LETTER_SPACING_MAP = { tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em" };
const FONT_MAP = { sans: "system-ui, sans-serif", serif: "Georgia, serif", mono: "monospace", display: "Georgia, serif" };
const GRADIENT_DIR_MAP = { "to-b": "to bottom", "to-r": "to right", "to-br": "to bottom right", "to-bl": "to bottom left" };

function getWrapperStyle(style?: SectionStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};

  if (style.gradient) {
    css.background = `linear-gradient(${GRADIENT_DIR_MAP[style.gradient.direction]}, ${style.gradient.from}, ${style.gradient.to})`;
  } else if (style.backgroundColor) {
    css.backgroundColor = style.backgroundColor;
  }

  if (style.textColor) css.color = style.textColor;
  if (style.textAlign) css.textAlign = style.textAlign;
  if (style.padding) css.padding = `${PADDING_MAP[style.padding]} 2rem`;
  if (style.borderRadius) css.borderRadius = RADIUS_MAP[style.borderRadius];
  if (style.fontOverride) css.fontFamily = FONT_MAP[style.fontOverride];
  if (style.backgroundImage) {
    css.backgroundImage = `url(${style.backgroundImage})`;
    css.backgroundSize = "cover";
    css.backgroundPosition = "center";
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
  else css.borderRadius = "9999px";

  if (style.buttonVariant === "outline") {
    css.backgroundColor = "transparent";
    css.color = a;
    css.border = `2px solid ${a}`;
  } else if (style.buttonVariant === "ghost") {
    css.backgroundColor = "transparent";
    css.color = a;
  } else {
    css.backgroundColor = a;
    css.color = "#ffffff";
  }

  if (style.buttonSize === "sm") { css.padding = "0.5rem 1.25rem"; css.fontSize = "0.875rem"; }
  else if (style.buttonSize === "lg") { css.padding = "0.875rem 2.5rem"; css.fontSize = "1.125rem"; }
  else { css.padding = "0.625rem 1.75rem"; css.fontSize = "1rem"; }

  return css;
}

interface SectionPreviewProps {
  section: Section;
  themeAccent?: string;
  onUpdate?: (id: string, data: Record<string, unknown>) => void;
}

export function SectionPreview({ section, themeAccent, onUpdate }: SectionPreviewProps) {
  const style = section.style;
  const wrapperStyle = getWrapperStyle(style);
  const accent = style?.accentColor ?? themeAccent ?? "#4f46e5";
  const textColor = style?.textColor;
  const hStyle = getHeadingStyle(style);
  const bStyle = getButtonStyle(style, accent);

  function updateField(key: string, value: string) {
    onUpdate?.(section.id, { [key]: value });
  }

  switch (section.type) {
    case "hero":
      return (
        <div
          className="relative overflow-hidden text-center"
          style={{
            backgroundColor: style?.backgroundColor ?? "#eef2ff",
            padding: style?.padding ? undefined : "4rem 2rem",
            ...wrapperStyle,
          }}
        >
          {style?.backgroundImage && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${style.backgroundOverlay ?? 0.4})` }}
            />
          )}
          <div className="relative mx-auto max-w-2xl">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Welcome to Our Properties"
              tag="h2"
              style={{ color: textColor ?? "#1e1b4b", fontSize: "2.25rem", fontWeight: "700", lineHeight: "1.2", ...hStyle }}
            />
            <InlineEditable
              value={(section.data.subtitle as string) ?? ""}
              onChange={(v) => updateField("subtitle", v)}
              placeholder="Find your perfect stay"
              tag="p"
              className="mt-4"
              style={{ color: textColor ? `${textColor}bb` : "#6b7280", fontSize: "1.125rem", lineHeight: "1.6" }}
            />
            <div className="mt-6">
              <InlineEditable
                value={(section.data.ctaText as string) ?? ""}
                onChange={(v) => updateField("ctaText", v)}
                placeholder="Browse Properties"
                tag="span"
                className="inline-block font-medium"
                style={{ backgroundColor: accent, color: "#fff", borderRadius: "9999px", padding: "0.75rem 2rem", ...bStyle }}
              />
            </div>
          </div>
        </div>
      );

    case "propertyGrid": {
      const cols = (section.data.columns as number) ?? 3;
      return (
        <div style={{ padding: style?.padding ? undefined : "3rem 2rem", ...wrapperStyle }}>
          <div className="mx-auto max-w-4xl">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Our Properties"
              tag="h3"
              style={{ color: textColor, fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem", ...hStyle }}
            />
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: cols }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                  <div className="h-36 bg-gradient-to-br from-neutral-100 to-neutral-200" />
                  <div className="p-4">
                    <div className="h-4 w-3/4 rounded bg-neutral-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-neutral-100" />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="h-5 w-16 rounded-full" style={{ backgroundColor: `${accent}20` }} />
                      <div className="h-3 w-12 rounded bg-neutral-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "gallery": {
      const images = (section.data.images as string[]) ?? [];
      return (
        <div style={{ padding: style?.padding ? undefined : "3rem 2rem", ...wrapperStyle }}>
          <div className="mx-auto max-w-4xl">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Gallery"
              tag="h3"
              style={{ color: textColor, fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem", ...hStyle }}
            />
            <div className="grid grid-cols-3 gap-3">
              {(images.length > 0 ? images.slice(0, 6) : [null, null, null, null, null, null]).map((img, i) => (
                <div key={i} className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                  {img ? (
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Images className="size-8 text-neutral-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "testimonials": {
      const items = (section.data.items as Array<{ name: string; text: string; rating: number }>) ?? [];
      return (
        <div style={{ padding: style?.padding ? undefined : "3rem 2rem", ...wrapperStyle }}>
          <div className="mx-auto max-w-4xl">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="What Our Guests Say"
              tag="h3"
              className="text-center"
              style={{ color: textColor, fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem", ...hStyle }}
            />
            <div className="grid gap-4" style={{ gridTemplateColumns: items.length > 1 ? "repeat(auto-fit, minmax(250px, 1fr))" : "1fr" }}>
              {items.map((item, i) => (
                <div key={i} className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm">
                  <Quote className="mb-3 size-5" style={{ color: `${accent}44` }} />
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
                    style={{ color: textColor ? `${textColor}cc` : "#525252", fontSize: "0.9375rem", fontStyle: "italic", lineHeight: "1.6" }}
                  />
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-50 pt-3">
                    <InlineEditable
                      value={item.name}
                      onChange={(v) => {
                        const updated = [...items];
                        updated[i] = { ...item, name: v };
                        onUpdate?.(section.id, { items: updated });
                      }}
                      placeholder="Guest name"
                      tag="span"
                      style={{ color: textColor ?? "#737373", fontSize: "0.8125rem", fontWeight: "500" }}
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
                          className={`text-sm transition-colors ${n <= item.rating ? "text-amber-400" : "text-neutral-200 hover:text-amber-300"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "contact":
      return (
        <div style={{ padding: style?.padding ? undefined : "3rem 2rem", ...wrapperStyle }}>
          <div className="mx-auto max-w-lg text-center">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Get in Touch"
              tag="h3"
              style={{ color: textColor, fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem", ...hStyle }}
            />
            <p className="mb-6 text-sm" style={{ color: textColor ? `${textColor}88` : "#9ca3af" }}>
              We&apos;d love to hear from you. Send us a message.
            </p>
            <div className="space-y-3 text-left">
              <input
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none"
                placeholder="Your Name"
                readOnly
              />
              <input
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none"
                placeholder="Email Address"
                readOnly
              />
              <textarea
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none"
                placeholder="Your message..."
                rows={4}
                readOnly
              />
              <div
                className="flex items-center justify-center py-3 text-sm font-medium"
                style={{ backgroundColor: accent, color: "#fff", borderRadius: "0.5rem", ...bStyle }}
              >
                Send Message
              </div>
            </div>
          </div>
        </div>
      );

    case "map":
      return (
        <div style={{ padding: style?.padding ? undefined : "3rem 2rem", ...wrapperStyle }}>
          <div className="mx-auto max-w-4xl">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Our Locations"
              tag="h3"
              style={{ color: textColor, fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem", ...hStyle }}
            />
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100">
              <div className="flex flex-col items-center gap-2 text-neutral-300">
                <MapPin className="size-10" />
                <span className="text-sm font-medium">Map Preview</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "features": {
      const featureItems = (section.data.items as string[]) ?? [];
      return (
        <div style={{ padding: style?.padding ? undefined : "3rem 2rem", ...wrapperStyle }}>
          <div className="mx-auto max-w-4xl">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="What We Offer"
              tag="h3"
              style={{ color: textColor, fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem", ...hStyle }}
            />
            <div className="grid grid-cols-2 gap-3">
              {featureItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}15` }}>
                    <div className="size-2.5 rounded-full" style={{ backgroundColor: accent }} />
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
                    style={{ color: textColor ?? "#525252", fontSize: "0.9375rem" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "cta":
      return (
        <div
          className="overflow-hidden text-center"
          style={{
            backgroundColor: style?.backgroundColor ?? "#171717",
            padding: style?.padding ? undefined : "4rem 2rem",
            ...wrapperStyle,
          }}
        >
          <div className="mx-auto max-w-2xl">
            <InlineEditable
              value={(section.data.title as string) ?? ""}
              onChange={(v) => updateField("title", v)}
              placeholder="Ready to Book?"
              tag="h3"
              style={{ color: textColor ?? "#ffffff", fontSize: "2rem", fontWeight: "700", lineHeight: "1.2", ...hStyle }}
            />
            <InlineEditable
              value={(section.data.subtitle as string) ?? ""}
              onChange={(v) => updateField("subtitle", v)}
              placeholder="Reserve your stay today"
              tag="p"
              className="mt-3"
              style={{ color: textColor ? `${textColor}99` : "#9ca3af", fontSize: "1.125rem", lineHeight: "1.6" }}
            />
            <div className="mt-6">
              <InlineEditable
                value={(section.data.buttonText as string) ?? ""}
                onChange={(v) => updateField("buttonText", v)}
                placeholder="Book Now"
                tag="span"
                className="inline-block font-medium"
                style={{ backgroundColor: accent, color: "#fff", borderRadius: "9999px", padding: "0.75rem 2rem", ...bStyle }}
              />
            </div>
          </div>
        </div>
      );

    default: {
      const sType = section.type as string;
      return (
        <div className="flex items-center gap-3 px-6 py-8" style={wrapperStyle}>
          <LayoutGrid className="size-5 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-600">
            {(SECTION_DEFINITIONS as Record<string, { label: string }>)[sType]?.label ?? "Unknown Section"}
          </span>
        </div>
      );
    }
  }
}
