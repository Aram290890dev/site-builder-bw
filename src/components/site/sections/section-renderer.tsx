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

const PADDING_MAP = { sm: "2rem 1rem", md: "3rem 1rem", lg: "5rem 1rem", xl: "7rem 1rem" };
const RADIUS_MAP = { none: "0", sm: "0.5rem", md: "0.75rem", lg: "1rem" };

export function getStyleVars(style?: SectionStyle) {
  if (!style) return {};
  const css: CSSProperties = {};
  if (style.backgroundColor) css.backgroundColor = style.backgroundColor;
  if (style.textColor) css.color = style.textColor;
  if (style.textAlign) css.textAlign = style.textAlign;
  if (style.padding) css.padding = PADDING_MAP[style.padding];
  if (style.borderRadius) css.borderRadius = RADIUS_MAP[style.borderRadius];
  if (style.backgroundImage) {
    css.backgroundImage = `url(${style.backgroundImage})`;
    css.backgroundSize = "cover";
    css.backgroundPosition = "center";
  }
  return css;
}

interface Props {
  section: Section;
  siteSubdomain: string;
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

export function SectionRenderer({ section, siteSubdomain, properties }: Props) {
  const accent = section.style?.accentColor ?? "#4f46e5";
  const textColor = section.style?.textColor;
  const wrapperStyle = getStyleVars(section.style);

  switch (section.type) {
    case "hero":
      return <HeroSection section={section} accent={accent} textColor={textColor} wrapperStyle={wrapperStyle} siteSubdomain={siteSubdomain} />;
    case "propertyGrid":
      return <PropertyGridSection section={section} textColor={textColor} wrapperStyle={wrapperStyle} siteSubdomain={siteSubdomain} properties={properties ?? []} />;
    case "gallery":
      return <GallerySection section={section} textColor={textColor} wrapperStyle={wrapperStyle} />;
    case "testimonials":
      return <TestimonialsSection section={section} accent={accent} textColor={textColor} wrapperStyle={wrapperStyle} />;
    case "contact":
      return <ContactSection section={section} accent={accent} textColor={textColor} wrapperStyle={wrapperStyle} />;
    case "map":
      return <MapSection section={section} textColor={textColor} wrapperStyle={wrapperStyle} />;
    case "features":
      return <FeaturesSection section={section} accent={accent} textColor={textColor} wrapperStyle={wrapperStyle} />;
    case "cta":
      return <CTASection section={section} accent={accent} textColor={textColor} wrapperStyle={wrapperStyle} siteSubdomain={siteSubdomain} />;
    default:
      return null;
  }
}
