/* ─── Section Types (for drag-and-drop pages) ─── */

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

  // Typography
  headingSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  headingWeight?: "light" | "normal" | "medium" | "semibold" | "bold" | "black";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider";
  fontOverride?: "sans" | "serif" | "mono" | "display";

  // Button
  buttonShape?: "rounded" | "pill" | "square";
  buttonVariant?: "solid" | "outline" | "ghost";
  buttonSize?: "sm" | "md" | "lg";

  // Animations
  animation?: "none" | "fade-in" | "slide-up" | "slide-left" | "slide-right" | "zoom-in";
  animationSpeed?: "fast" | "normal" | "slow";

  // Gradient
  gradient?: { from: string; to: string; direction: "to-b" | "to-r" | "to-br" | "to-bl" };

  // Width
  sectionWidth?: "full" | "contained" | "narrow";

  // Divider
  divider?: "none" | "line" | "wave" | "angle" | "dots";
  dividerColor?: string;

  // Visibility
  hidden?: boolean;

  // Custom CSS
  customCSS?: string;
}

export interface Section {
  id: string;
  type: SectionType;
  data: Record<string, unknown>;
  style?: SectionStyle;
}

/* ─── Page Types ─── */

export interface BuilderPage {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
}

/* ─── Template Settings (for auto-generated pages) ─── */

export interface ListingPageSettings {
  layout: "grid" | "list";
  columns: 2 | 3 | 4;
  cardStyle: "minimal" | "bordered" | "shadow" | "elevated";
  cardImageAspect: "square" | "landscape" | "portrait";
  cardImageRadius: "none" | "sm" | "md" | "lg" | "full";
  cardRadius: "none" | "sm" | "md" | "lg";
  showPrice: boolean;
  showLocation: boolean;
  showRating: boolean;
  showAmenities: boolean;
  showGuests: boolean;
  cardBgColor: string;
  cardTextColor: string;
  cardBorderColor: string;
  accentColor: string;
  pageBgColor: string;
  pageTitle: string;
  pageSubtitle: string;
  hoverEffect: "none" | "lift" | "scale" | "glow";
  imageOverlay: boolean;
  pricePosition: "top-right" | "bottom" | "badge";
}

export interface DetailPageSettings {
  galleryStyle: "grid" | "slider" | "masonry";
  galleryImageRadius: "none" | "sm" | "md" | "lg";
  galleryColumns: 2 | 3 | 4;
  showMap: boolean;
  showAmenities: boolean;
  showDescription: boolean;
  showReviews: boolean;
  calendarStyle: "inline" | "popup";
  calendarAccentColor: string;
  calendarBlockedColor: string;
  bookingFormStyle: "card" | "inline" | "sidebar";
  sectionOrder: string[];
  pageBgColor: string;
  textColor: string;
  accentColor: string;
  headingFont: "default" | "serif" | "mono";
  cardRadius: "none" | "sm" | "md" | "lg";
  imageAspect: "auto" | "landscape" | "portrait" | "square";
}

export interface CheckoutPageSettings {
  style: "single-page" | "multi-step";
  accentColor: string;
  bgColor: string;
  cardRadius: "none" | "sm" | "md" | "lg";
  showOrderSummary: boolean;
  showPropertyImage: boolean;
}

/* ─── Site Config ─── */

export interface SiteTheme {
  primaryColor: string;
  fontFamily: string;
  headingFont?: string;
  navStyle?: "light" | "dark" | "transparent";
  navLogoSize?: "sm" | "md" | "lg";
  footerStyle?: "minimal" | "centered" | "columns";
  footerBgColor?: string;
  footerTextColor?: string;
  bodyBgColor?: string;
  borderRadius?: "none" | "sm" | "md" | "lg";
}

export interface SiteConfig {
  theme: SiteTheme;
  pages: BuilderPage[];
  templates: {
    listing: ListingPageSettings;
    detail: DetailPageSettings;
    checkout: CheckoutPageSettings;
  };
  /** @deprecated Use pages[0].sections instead */
  sections?: Section[];
}

/* ─── Builder Page Type (for tab selector) ─── */

export type BuilderTab =
  | { type: "page"; pageId: string }
  | { type: "template"; template: "listing" | "detail" | "checkout" };

/* ─── Defaults ─── */

export const DEFAULT_LISTING_SETTINGS: ListingPageSettings = {
  layout: "grid",
  columns: 3,
  cardStyle: "shadow",
  cardImageAspect: "landscape",
  cardImageRadius: "md",
  cardRadius: "lg",
  showPrice: true,
  showLocation: true,
  showRating: true,
  showAmenities: true,
  showGuests: true,
  cardBgColor: "#ffffff",
  cardTextColor: "#171717",
  cardBorderColor: "#e5e5e5",
  accentColor: "#4f46e5",
  pageBgColor: "#f9fafb",
  pageTitle: "Our Properties",
  pageSubtitle: "Find your perfect stay",
  hoverEffect: "lift",
  imageOverlay: false,
  pricePosition: "bottom",
};

export const DEFAULT_DETAIL_SETTINGS: DetailPageSettings = {
  galleryStyle: "grid",
  galleryImageRadius: "md",
  galleryColumns: 3,
  showMap: true,
  showAmenities: true,
  showDescription: true,
  showReviews: true,
  calendarStyle: "inline",
  calendarAccentColor: "#4f46e5",
  calendarBlockedColor: "#fecaca",
  bookingFormStyle: "sidebar",
  sectionOrder: ["gallery", "description", "amenities", "calendar", "map", "reviews"],
  pageBgColor: "#ffffff",
  textColor: "#171717",
  accentColor: "#4f46e5",
  headingFont: "default",
  cardRadius: "lg",
  imageAspect: "landscape",
};

export const DEFAULT_CHECKOUT_SETTINGS: CheckoutPageSettings = {
  style: "single-page",
  accentColor: "#4f46e5",
  bgColor: "#f9fafb",
  cardRadius: "lg",
  showOrderSummary: true,
  showPropertyImage: true,
};

/* ─── Section Definitions ─── */

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
