"use client";

import type { CSSProperties } from "react";
import type { Section, SectionStyle } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import {
  ImageIcon,
  LayoutGrid,
  Images,
  Quote,
  Mail,
  MapPin,
  List,
  MousePointerClick,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  image: ImageIcon,
  grid: LayoutGrid,
  images: Images,
  quote: Quote,
  mail: Mail,
  "map-pin": MapPin,
  list: List,
  "mouse-pointer-click": MousePointerClick,
};

const PADDING_MAP = { sm: "1rem", md: "2rem", lg: "3rem", xl: "5rem" };
const RADIUS_MAP = { none: "0", sm: "0.5rem", md: "0.75rem", lg: "1rem" };
const HEADING_SIZE_MAP = { sm: "0.875rem", md: "1.125rem", lg: "1.25rem", xl: "1.5rem", "2xl": "1.75rem" };
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
  if (style.padding) css.padding = PADDING_MAP[style.padding];
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

  if (style.buttonSize === "sm") { css.padding = "0.375rem 1rem"; css.fontSize = "0.75rem"; }
  else if (style.buttonSize === "lg") { css.padding = "0.625rem 1.75rem"; css.fontSize = "0.875rem"; }

  return css;
}

interface SectionPreviewProps {
  section: Section;
}

export function SectionPreview({ section }: SectionPreviewProps) {
  const def = SECTION_DEFINITIONS[section.type];
  const Icon = ICON_MAP[def.icon] ?? LayoutGrid;
  const title = (section.data.title as string) ?? def.label;
  const style = section.style;
  const wrapperStyle = getWrapperStyle(style);
  const accent = style?.accentColor ?? "#4f46e5";
  const textColor = style?.textColor;
  const hStyle = getHeadingStyle(style);
  const bStyle = getButtonStyle(style, accent);

  switch (section.type) {
    case "hero":
      return (
        <div
          className="relative overflow-hidden rounded-lg p-8 text-center"
          style={{
            backgroundColor: style?.backgroundColor ?? "#eef2ff",
            ...wrapperStyle,
          }}
        >
          {style?.backgroundImage && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${style.backgroundOverlay ?? 0.4})` }}
            />
          )}
          <div className="relative">
            <h2
              className="text-2xl font-bold"
              style={{ color: textColor ?? "#1e1b4b", ...hStyle }}
            >
              {section.data.title as string}
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: textColor ? `${textColor}99` : "#6b7280" }}
            >
              {section.data.subtitle as string}
            </p>
            <div
              className="mt-4 inline-block px-6 py-2 text-sm font-medium"
              style={{ backgroundColor: accent, color: "#fff", borderRadius: "9999px", ...bStyle }}
            >
              {section.data.ctaText as string}
            </div>
          </div>
        </div>
      );

    case "propertyGrid": {
      const cols = (section.data.columns as number) ?? 3;
      return (
        <div style={wrapperStyle}>
          <h3 className="mb-3 text-lg font-semibold" style={{ color: textColor, ...hStyle }}>
            {title}
          </h3>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="mb-2 h-20 rounded-md bg-neutral-200" />
                <div className="h-3 w-2/3 rounded bg-neutral-200" />
                <div className="mt-1 h-2 w-1/2 rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "gallery":
      return (
        <div style={wrapperStyle}>
          <h3 className="mb-3 text-lg font-semibold" style={{ color: textColor, ...hStyle }}>
            {title}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex h-20 items-center justify-center rounded-lg bg-neutral-100">
                <Images className="size-5 text-neutral-300" />
              </div>
            ))}
          </div>
        </div>
      );

    case "testimonials": {
      const items = (section.data.items as Array<{ name: string; text: string; rating: number }>) ?? [];
      const firstItem = items[0];
      return (
        <div style={wrapperStyle}>
          <h3 className="mb-3 text-lg font-semibold" style={{ color: textColor, ...hStyle }}>
            {title}
          </h3>
          {firstItem && (
            <div className="rounded-lg bg-neutral-50 p-4">
              <Quote className="mb-2 size-5" style={{ color: `${accent}66` }} />
              <p className="text-sm italic text-neutral-600">&ldquo;{firstItem.text}&rdquo;</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">— {firstItem.name}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={`text-xs ${n <= firstItem.rating ? "text-amber-400" : "text-neutral-200"}`}>★</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {items.length > 1 && (
            <p className="mt-2 text-xs text-neutral-400">+{items.length - 1} more review{items.length > 2 ? "s" : ""}</p>
          )}
        </div>
      );
    }

    case "contact":
      return (
        <div style={wrapperStyle}>
          <h3 className="mb-3 text-lg font-semibold" style={{ color: textColor, ...hStyle }}>
            {title}
          </h3>
          <div className="space-y-2">
            <div className="h-9 rounded-lg border border-neutral-200 bg-neutral-50 px-3 flex items-center text-xs text-neutral-400">
              {(section.data.email as string) || "Email address"}
            </div>
            <div className="h-9 rounded-lg border border-neutral-200 bg-neutral-50 px-3 flex items-center text-xs text-neutral-400">
              {(section.data.phone as string) || "Phone number"}
            </div>
            <div className="h-20 rounded-lg border border-neutral-200 bg-neutral-50 px-3 pt-2 text-xs text-neutral-400">
              Message...
            </div>
            <div
              className="h-9 flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: accent, color: "#fff", borderRadius: "0.5rem", ...bStyle }}
            >
              Send Message
            </div>
          </div>
        </div>
      );

    case "map":
      return (
        <div style={wrapperStyle}>
          <h3 className="mb-3 text-lg font-semibold" style={{ color: textColor, ...hStyle }}>
            {title}
          </h3>
          <div className="flex h-40 items-center justify-center rounded-lg bg-neutral-100">
            <MapPin className="size-8 text-neutral-300" />
          </div>
        </div>
      );

    case "features": {
      const featureItems = (section.data.items as string[]) ?? [];
      return (
        <div style={wrapperStyle}>
          <h3 className="mb-3 text-lg font-semibold" style={{ color: textColor, ...hStyle }}>
            {title}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {featureItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm"
                style={{ color: textColor ?? "#525252" }}
              >
                <div className="size-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                {item || "Feature item"}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "cta":
      return (
        <div
          className="overflow-hidden rounded-lg p-8 text-center"
          style={{
            backgroundColor: style?.backgroundColor ?? "#171717",
            ...wrapperStyle,
          }}
        >
          <h3
            className="text-xl font-bold"
            style={{ color: textColor ?? "#ffffff", ...hStyle }}
          >
            {section.data.title as string}
          </h3>
          <p
            className="mt-1 text-sm"
            style={{ color: textColor ? `${textColor}99` : "#9ca3af" }}
          >
            {section.data.subtitle as string}
          </p>
          <div
            className="mt-4 inline-block px-6 py-2 text-sm font-medium"
            style={{ backgroundColor: accent, color: "#fff", borderRadius: "9999px", ...bStyle }}
          >
            {section.data.buttonText as string}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center gap-3 p-4" style={wrapperStyle}>
          <Icon className="size-5 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-600">{def.label}</span>
        </div>
      );
  }
}
