import type { CSSProperties } from "react";
import type { Section, SectionStyle } from "@/types/builder";
import { HeroSection } from "./hero";
import { PropertyGridSection } from "./property-grid";
import { GallerySection } from "./gallery";
import { TestimonialsSection } from "./testimonials";
import { ContactSection } from "./contact";
import { MapSection } from "./map-section";
import { FeaturesSection } from "./features";
import { CTASection } from "./cta";
import { AnimateOnScroll } from "../animate-on-scroll";
import { SectionDivider } from "./section-divider";

const PADDING_MAP = { sm: "2rem 1rem", md: "3rem 1rem", lg: "5rem 1rem", xl: "7rem 1rem" };
const RADIUS_MAP = { none: "0", sm: "0.5rem", md: "0.75rem", lg: "1rem" };
const WIDTH_MAP = { full: "100%", contained: "1200px", narrow: "768px" };
const HEADING_SIZE_MAP = { sm: "1.5rem", md: "1.875rem", lg: "2.25rem", xl: "3rem", "2xl": "3.75rem" };
const HEADING_WEIGHT_MAP = { light: "300", normal: "400", medium: "500", semibold: "600", bold: "700", black: "900" };
const LETTER_SPACING_MAP = { tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em" };
const FONT_MAP = { sans: "system-ui, -apple-system, sans-serif", serif: "Georgia, Cambria, serif", mono: "ui-monospace, monospace", display: "Georgia, Cambria, serif" };
const GRADIENT_DIR_MAP = { "to-b": "to bottom", "to-r": "to right", "to-br": "to bottom right", "to-bl": "to bottom left" };

export function getStyleVars(style?: SectionStyle) {
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
  if (style.backgroundImage) {
    css.backgroundImage = `url(${style.backgroundImage})`;
    css.backgroundSize = "cover";
    css.backgroundPosition = "center";
    css.position = "relative";
  }
  return css;
}

export function getTypographyVars(style?: SectionStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.fontOverride) css.fontFamily = FONT_MAP[style.fontOverride];
  return css;
}

export function getHeadingStyle(style?: SectionStyle): CSSProperties {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.headingSize) css.fontSize = HEADING_SIZE_MAP[style.headingSize];
  if (style.headingWeight) css.fontWeight = HEADING_WEIGHT_MAP[style.headingWeight];
  if (style.letterSpacing) css.letterSpacing = LETTER_SPACING_MAP[style.letterSpacing];
  return css;
}

export function getButtonStyle(style?: SectionStyle, accent?: string): CSSProperties {
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

function OverlayWrapper({ style, children }: { style?: SectionStyle; children: React.ReactNode }) {
  const hasOverlay = style?.backgroundImage && (style.backgroundOverlay ?? 0) > 0;
  if (!hasOverlay) return <>{children}</>;
  return (
    <>
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: `rgba(0,0,0,${style!.backgroundOverlay})` }}
      />
      <div className="relative z-10">{children}</div>
    </>
  );
}

interface Props {
  section: Section;
  siteSubdomain: string;
  isLast?: boolean;
  properties?: Array<{
    id: string;
    name: string;
    address: string | null;
    price: number;
    currency: string;
    maxGuests: number;
    images: unknown;
    amenities: unknown;
  }>;
}

export function SectionRenderer({ section, siteSubdomain, properties, isLast }: Props) {
  if (section.style?.hidden) return null;

  const accent = section.style?.accentColor ?? "#4f46e5";
  const textColor = section.style?.textColor;
  const wrapperStyle = getStyleVars(section.style);
  const typographyStyle = getTypographyVars(section.style);
  const widthMax = section.style?.sectionWidth ? WIDTH_MAP[section.style.sectionWidth] : undefined;
  const customCSS = section.style?.customCSS ? parseCSSText(section.style.customCSS) : undefined;

  const mergedWrapper: CSSProperties = {
    ...wrapperStyle,
    ...typographyStyle,
    ...(customCSS ?? {}),
  };

  const animation = section.style?.animation;
  const animationSpeed = section.style?.animationSpeed ?? "normal";

  let inner: React.ReactNode;

  switch (section.type) {
    case "hero":
      inner = <HeroSection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} siteSubdomain={siteSubdomain} />;
      break;
    case "propertyGrid":
      inner = <OverlayWrapper style={section.style}><PropertyGridSection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} siteSubdomain={siteSubdomain} properties={properties ?? []} /></OverlayWrapper>;
      break;
    case "gallery":
      inner = <OverlayWrapper style={section.style}><GallerySection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} /></OverlayWrapper>;
      break;
    case "testimonials":
      inner = <OverlayWrapper style={section.style}><TestimonialsSection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} /></OverlayWrapper>;
      break;
    case "contact":
      inner = <OverlayWrapper style={section.style}><ContactSection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} /></OverlayWrapper>;
      break;
    case "map":
      inner = <OverlayWrapper style={section.style}><MapSection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} /></OverlayWrapper>;
      break;
    case "features":
      inner = <OverlayWrapper style={section.style}><FeaturesSection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} /></OverlayWrapper>;
      break;
    case "cta":
      inner = <CTASection section={section} accent={accent} textColor={textColor} wrapperStyle={mergedWrapper} siteSubdomain={siteSubdomain} />;
      break;
    default:
      return null;
  }

  const widthWrapper = widthMax ? (
    <div style={{ maxWidth: widthMax, margin: "0 auto" }}>{inner}</div>
  ) : inner;

  const animated = animation && animation !== "none" ? (
    <AnimateOnScroll animation={animation} speed={animationSpeed}>
      {widthWrapper}
    </AnimateOnScroll>
  ) : widthWrapper;

  const divider = section.style?.divider;
  const showDivider = divider && divider !== "none" && !isLast;

  return (
    <>
      {animated}
      {showDivider && (
        <SectionDivider type={divider} color={section.style?.dividerColor ?? "#e5e5e5"} />
      )}
    </>
  );
}

function parseCSSText(css: string): CSSProperties {
  const result: Record<string, string> = {};
  css.split(";").forEach((rule) => {
    const [prop, ...valParts] = rule.split(":");
    if (!prop || valParts.length === 0) return;
    const camel = prop.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    result[camel] = valParts.join(":").trim();
  });
  return result as CSSProperties;
}
