export type SectionType =
  | "hero"
  | "propertyGrid"
  | "gallery"
  | "testimonials"
  | "contact"
  | "map"
  | "features"
  | "cta";

export interface SectionStyle {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  textAlign?: "left" | "center" | "right";
  padding?: "sm" | "md" | "lg" | "xl";
  borderRadius?: "none" | "sm" | "md" | "lg";
  backgroundImage?: string;
  backgroundOverlay?: number;
}

export interface Section {
  id: string;
  type: SectionType;
  data: Record<string, unknown>;
  style?: SectionStyle;
}

export interface SiteTheme {
  primaryColor: string;
  fontFamily: string;
}

export interface SiteConfig {
  theme: SiteTheme;
  sections: Section[];
}

export const SECTION_DEFINITIONS: Record<
  SectionType,
  { label: string; description: string; icon: string; defaultData: Record<string, unknown> }
> = {
  hero: {
    label: "Hero Banner",
    description: "Large banner with title, subtitle, and CTA",
    icon: "image",
    defaultData: {
      title: "Welcome to Our Properties",
      subtitle: "Find your perfect stay",
      ctaText: "Browse Properties",
    },
  },
  propertyGrid: {
    label: "Property Grid",
    description: "Grid of property listing cards",
    icon: "grid",
    defaultData: { title: "Our Properties", columns: 3 },
  },
  gallery: {
    label: "Image Gallery",
    description: "Photo gallery with lightbox",
    icon: "images",
    defaultData: { title: "Gallery", images: [] },
  },
  testimonials: {
    label: "Testimonials",
    description: "Guest reviews and testimonials",
    icon: "quote",
    defaultData: {
      title: "What Our Guests Say",
      items: [
        { name: "Sarah M.", text: "An unforgettable stay!", rating: 5 },
      ],
    },
  },
  contact: {
    label: "Contact Form",
    description: "Contact form with email and phone",
    icon: "mail",
    defaultData: { title: "Get in Touch", email: "", phone: "" },
  },
  map: {
    label: "Location Map",
    description: "Interactive map showing property locations",
    icon: "map-pin",
    defaultData: { title: "Our Locations" },
  },
  features: {
    label: "Features / Amenities",
    description: "List of property features and amenities",
    icon: "list",
    defaultData: {
      title: "What We Offer",
      items: ["Pool", "WiFi", "Kitchen", "Parking"],
    },
  },
  cta: {
    label: "Call to Action",
    description: "CTA section with button",
    icon: "mouse-pointer-click",
    defaultData: {
      title: "Ready to Book?",
      subtitle: "Reserve your stay today",
      buttonText: "Book Now",
    },
  },
};
