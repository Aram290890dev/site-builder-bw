# BookWise — Progress & Business Logic

What has been built, how it works, and what comes next.

---

## What is BookWise?

A **site builder for property owners** that lets them create booking websites for their vacation rentals, hotels, or Airbnb-style listings. Think Squarespace or Wix, but purpose-built for property bookings.

**Key idea:** One owner can create multiple sites, each site can have multiple properties. The builder lets them customize both drag-and-drop pages (landing page) and template-driven pages (listings, property detail, checkout) with deep visual control.

---

## What Has Been Built

### 1. Marketing Landing Page
**File:** `src/app/page.tsx`

A public-facing landing page at `/` that markets BookWise itself. Includes:
- Sticky navbar
- Hero section with CTA
- Features section (3 cards: Drag & Drop Builder, Template Library, Booking Engine)
- How It Works (3 steps)
- Preview mockup
- Call-to-action section
- Footer

**Colors:** Primarily black/white with indigo (#4f46e5) as the accent color. Generated images used throughout.

---

### 2. Owner Dashboard
**Files:** `src/app/dashboard/`

The dashboard at `/dashboard` where owners manage their sites.

**How it works:**
- Uses a hardcoded demo user (`demo@bookwise.dev`) since auth isn't built yet.
- Server action `getSites()` fetches all sites for this demo user.
- Each site shows as a card with name, subdomain, property count, booking count, and published status.
- Each card has two buttons: **"Edit"** (opens the builder) and **"View Site"** (opens the public site in a new tab).
- "Create New Site" button opens a dialog where you enter a name → subdomain is auto-generated (slugified name).
- Server action `createSite()` creates the site in the database with a default config (home page with hero + property grid sections, plus default template settings for listing/detail/checkout).
- Server action `deleteSite()` deletes a site.

---

### 3. Site Builder — Drag & Drop (Custom Pages)
**Files:** `src/components/builder/`

The builder at `/dashboard/[siteId]/builder` is the core feature.

**Architecture:**
- Sites are stored as a JSON `config` field on the `Site` model.
- The config contains `pages` (drag-and-drop pages) and `templates` (settings for auto-generated pages).
- The builder reads this config, lets the user edit it visually, then saves it back to the database.

**Config structure (`SiteConfig`):**
```typescript
{
  theme: { primaryColor, fontFamily },
  pages: [
    { id: "home", name: "Home", slug: "/", sections: [...] }
  ],
  templates: {
    listing: { ...ListingPageSettings },
    detail: { ...DetailPageSettings },
    checkout: { ...CheckoutPageSettings }
  }
}
```

**Builder toolbar:** Has a "View Site" button that opens the public site in a new tab, plus a "Save" button that persists the config to the database.

**Drag & Drop (Home page tab):**
- Left sidebar lists 8 section types: Hero, Property Grid, Gallery, Testimonials, Contact, Map, Features, CTA.
- Each section type can be dragged from the sidebar onto the canvas (or clicked to append).
- Sections on the canvas can be reordered by dragging.
- Clicking a section opens the right-side editor panel with two tabs:
  - **Content tab:** Edit text fields, data specific to each section type.
  - **Style tab:** Background color, text color, accent color, text alignment, padding (sm/md/lg/xl), corner radius, background image URL, and overlay opacity.
- All style changes apply live to the section preview on the canvas.

**Section types and their editable content:**
| Section | Content Fields |
|---------|---------------|
| Hero | title, subtitle, CTA text |
| Property Grid | title, columns |
| Gallery | title, images (array) |
| Testimonials | title, items (name + text + rating) |
| Contact | title, email, phone |
| Map | title |
| Features | title, items (list of strings) |
| CTA | title, subtitle, button text |

---

### 4. Site Builder — Template Pages (Listings, Detail, Checkout)

These are data-driven pages — their content comes from the database (properties, bookings), but owners can deeply customize the **visual design**.

#### Listings Page Template
**File:** `src/components/builder/template-editors/listing-editor.tsx`

Customizable settings (all saved in config, all update the live preview):
- **Layout:** Grid or List view
- **Columns:** 2, 3, or 4
- **Card style:** Minimal (clean), Bordered (visible border), Shadow (subtle shadow), Elevated (strong shadow)
- **Image aspect ratio:** Square, Landscape, Portrait
- **Image corners:** None, Small, Medium, Large, Full (circular)
- **Card corners:** None, Small, Medium, Large
- **Hover effect:** None, Lift (translateY), Scale (grow), Glow (shadow glow)
- **Price position:** Bottom (in card body), Top-right (badge on image), Badge (overlay on image bottom)
- **Show/hide toggles:** Price, Location, Rating, Amenities, Max Guests, Image Overlay
- **Colors:** Page background, Card background, Card text, Card border, Accent/button color
- **Page title and subtitle:** Editable text

#### Property Detail Page Template
**File:** `src/components/builder/template-editors/detail-editor.tsx`

Customizable settings:
- **Gallery style:** Grid (standard with featured image), Slider (carousel with arrows + dots), Masonry (Pinterest-style staggered heights)
- **Gallery image corners:** None, Small, Medium, Large
- **Gallery columns:** 2, 3, or 4
- **Image aspect ratio:** Auto, Landscape, Portrait, Square
- **Show/hide sections:** Description, Amenities, Map, Reviews
- **Calendar style:** Inline (always visible) or Popup
- **Calendar colors:** Accent color (selected dates), Blocked dates color
- **Booking form layout:** Sidebar (right column), Card (centered), Inline (full width)
- **Heading font:** Default (sans), Serif, Mono
- **Card corners:** None, Small, Medium, Large
- **Colors:** Page background, Text, Accent/buttons, Calendar accent, Blocked dates

#### Checkout Page Template
**File:** `src/components/builder/template-editors/checkout-editor.tsx`

Customizable settings:
- **Flow style:** Single-page (all fields at once) or Multi-step (step indicator: Dates → Guest Info → Confirm)
- **Card corners:** None, Small, Medium, Large
- **Show/hide:** Order summary, Property image in summary
- **Colors:** Background, Accent/button color

---

### 5. Public Site Rendering
**Files:** `src/app/site/[domain]/`, `src/components/site/`

The builder configs are now rendered as real public websites that visitors can see.

**How it works:**
1. Visitor goes to `/site/[subdomain]` (e.g., `/site/astra-villas`)
2. Server component looks up the site by subdomain in the database
3. Reads the JSON config and renders it as production HTML — no builder UI, no editing chrome

**Routes:**
| URL | What it renders |
|-----|----------------|
| `/site/[domain]` | Home page — renders drag-and-drop sections as real website |
| `/site/[domain]/[...slug]` | Any custom page (about-us, contact, terms, etc.) by slug from config |
| `/site/[domain]/properties` | Listing page — all properties styled with listing template settings |
| `/site/[domain]/properties/[id]` | Property detail — gallery, description, amenities, calendar, booking form |
| `/site/[domain]/checkout/[id]` | Checkout — guest info form, booking summary |

**Shared layout** (`layout.tsx`): Every public site page has a sticky navbar with the site name, links to all custom pages, a "Properties" link, and a "Book Now" button. The footer shows copyright + links to Terms and Privacy pages if they exist. Colors use the site's theme.

**Section renderers** (`src/components/site/sections/`): 8 production-quality components that render each section type as real, styled HTML:
- **Hero** — full-width with background image support, overlay, and CTA linking to properties
- **Property Grid** — renders actual property cards from the database with images, prices, ratings, linking to detail pages
- **Gallery** — image grid or empty state
- **Testimonials** — review cards with ratings
- **Contact** — functional form (client component)
- **Map** — placeholder for future map integration
- **Features** — amenity list with check icons
- **CTA** — call-to-action with button linking to properties

**Template page rendering**: The listing, detail, and checkout pages read the template settings from the config and apply them to real data:
- Listing page applies card style, columns, image borders, hover effects, colors, show/hide toggles
- Detail page applies gallery style (grid/slider/masonry), amenities, calendar, booking form layout
- Checkout page applies flow style (single/multi-step), form styling, order summary

**Data fetching** (`data.ts`): `getSiteByDomain()` fetches site + properties by subdomain. `getProperty()` fetches a single property with availability.

---

### 6. Database Schema

**Models:**
- **User** — id, email, name, password, sites[]
- **Site** — id, name, subdomain (unique), config (JSON), published, ownerId, properties[], bookings[]
- **Property** — id, name, description, address, lat/lng, price, currency, images (JSON), amenities (JSON), maxGuests, siteId, bookings[], availability[]
- **Booking** — id, checkIn, checkOut, guests, status (PENDING/CONFIRMED/CANCELLED), guest info, totalPrice, notes, propertyId, siteId
- **Availability** — id, date, available, price override, propertyId (unique per property+date)

**Seed data:** One demo user, one demo site ("Astra Villas"), three demo properties (Clifftop Villa, Mountain Retreat Cabin, Beachfront Bungalow).

---

### 7. Config Migration
**File:** `src/lib/config-migrate.ts`

Old site configs had a flat `sections[]` array. New configs have `pages[]` + `templates`. The migration function (`migrateConfig`) runs when loading a site in the builder or rendering a public page — if it detects the old format, it wraps sections into a "Home" page and adds default template settings. This ensures backward compatibility.

---

### 8. Multi-Page Builder
**Files:** `src/components/builder/page-manager.tsx`, `src/components/builder/builder.tsx`, `src/app/site/[domain]/[...slug]/page.tsx`

Owners can now create unlimited drag-and-drop pages beyond just "Home".

**How it works:**
- The builder tab bar shows all pages from `config.pages`, plus a **"+ Add Page"** button.
- Clicking "+ Add Page" opens a popover with:
  - **Presets:** Contact (hero + contact form + map), About Us (hero + values + testimonials), Terms & Conditions, Privacy Policy — each pre-populated with relevant sections.
  - **Blank Page:** empty canvas.
  - **Custom page:** enter any name, slug is auto-generated.
- Already-added presets show "Added" and are disabled (no duplicates).
- Each non-Home page tab has a **kebab menu** (three dots) with Rename and Delete. Home page cannot be deleted.
- Renaming happens inline — clicking Rename turns the tab into an editable input.
- All pages are drag-and-drop with the same section types, styles, and editor as Home.

**Public rendering:**
- Custom pages render via a catch-all route at `/site/[domain]/[...slug]`.
- The catch-all matches the page slug from the config and renders its sections using the same `SectionRenderer`.
- Specific routes (`/properties`, `/checkout`) take priority over the catch-all (Next.js route resolution).

**Navbar/Footer:**
- The public site navbar automatically lists all custom pages as links.
- The footer shows Terms and Privacy links if those pages exist.

---

### 9. Authentication
**Files:** `src/lib/auth.ts`, `src/lib/session.ts`, `src/middleware.ts`, `src/app/(auth)/`

Real authentication using **Auth.js (NextAuth v5)** with email/password credentials.

**How it works:**
- **Auth.js** configured with Credentials provider — validates email + bcrypt-hashed password against the `User` model.
- **JWT strategy** — session stored in a signed cookie, no database sessions needed.
- **Register page** (`/register`) — creates account with name, email, hashed password, then auto-signs in and redirects to dashboard.
- **Login page** (`/login`) — email/password form, redirects to dashboard on success.
- **Middleware** (`src/middleware.ts`) — protects all `/dashboard` routes (redirects to `/login` if unauthenticated). Also redirects logged-in users away from `/login` and `/register` to `/dashboard`.
- **Session helpers** (`src/lib/session.ts`):
  - `requireUser()` — gets current session user or throws "Unauthorized".
  - `requireSiteOwner(siteId)` — verifies the current user owns the given site or throws "Forbidden".
- **All dashboard actions** now use `requireUser()` or `requireSiteOwner()` instead of the old hardcoded demo user. This means every server action verifies ownership before reading/writing data.
- **User menu** in dashboard header — shows initials + name, dropdown with email and "Sign out" button.
- **Landing page** updated — "Get Started" buttons link to `/register`, navbar has "Sign In" link to `/login`.
- **Seed script** updated — demo user's password is now bcrypt-hashed.

---

### 10. Global Theme Panel
**Files:** `src/components/builder/theme-editor.tsx`, `src/components/builder/builder.tsx`, `src/app/site/[domain]/layout.tsx`, `src/types/builder.ts`

A "Theme" button (Palette icon) in the builder toolbar opens a right-side panel for editing site-wide visual settings.

**Theme settings:**
- **Colors:** Primary/accent color (10 presets + custom picker), body background color (8 presets + custom picker).
- **Typography:** Body font and heading font (independent) — curated list of 10 fonts: Inter, DM Sans, Poppins, Space Grotesk, Outfit, Playfair Display, Lora, Merriweather, JetBrains Mono, System Default. Google Fonts are auto-loaded via `<link>` tag.
- **Navbar:** Style (light / dark / transparent) with visual previews. Logo size (SM / MD / LG).
- **Footer:** Style variants (minimal / centered / columns) with visual previews. Custom background and text colors.
- **Global Rounding:** Border radius preset (none / sm / md / lg) with visual shape indicators.

**How it works in the builder:**
- Clicking the "Theme" button toggles the ThemeEditor panel open (replaces section editor in the right panel).
- All changes write to `config.theme` and persist when saved.
- The panel groups controls into Colors, Typography, Navbar, Footer, and Global Rounding sections.

**How it works on the public site:**
- The site layout reads all theme fields from `site.config.theme`.
- Navbar renders in three styles: light (white bg, dark text), dark (dark bg, white text), transparent (no bg, absolute positioned with spacer div).
- Footer renders in three layouts: minimal (copyright + legal links in a row), centered (logo + nav links + copyright stacked), columns (3-column grid with branding, pages, legal).
- Google Fonts are injected as a `<link>` tag based on selected body and heading fonts.
- Body background, accent color, heading font, and border radius are applied via inline styles and CSS custom variables (`--theme-radius`, `--theme-accent`, `--theme-heading-font`).

**All new theme fields are optional with sensible defaults — existing sites need zero migration.**

---

## What's NOT Built Yet

### High Priority (Next Steps)

1. **Publish/unpublish** — Toggle the `published` flag. Only published sites should be publicly visible. Currently all sites render regardless of status.

2. **Responsive public site** — Public site pages use responsive layouts but could be improved, especially the navbar (needs a mobile hamburger menu for sites with many pages).

### Medium Priority

### Lower Priority

9. **Custom domains** — Currently sites use `/site/[subdomain]`. Add support for `[subdomain].bookwise.dev` and custom domains.

10. **Payments** — Stripe or similar integration for actual booking payments.

11. **Analytics** — Views, bookings, revenue per site dashboard.

12. **Email notifications** — Booking confirmations, reminders to owners and guests.

13. **SEO** — Per-page meta tags, Open Graph images. (Basic metadata already works via `generateMetadata` on public site pages.)

14. **Reviews system** — Currently testimonials are hardcoded in builder sections. Need a real reviews model where guests can leave reviews after bookings.

15. **Mobile builder** — The builder itself is desktop-only. Consider a simplified mobile editing experience.

---

## Key Decisions & Context

- **DOM-based builder, not Canvas API** — Sections are real HTML/React components, not drawn on a canvas. This makes styling, accessibility, and responsiveness much easier.
- **JSON config stored in DB** — The entire site design is a single JSON blob on the `Site` model. This makes saving/loading instant and avoids complex relational schemas for layout data.
- **Two renderers, one config** — Builder components (`src/components/builder/`) and public site components (`src/components/site/`) are completely separate but read the same JSON config. Builder = editing mode, public site = production website.
- **Template pages vs. custom pages** — Drag-and-drop works for landing pages, but data-driven pages (listings, property detail) use a template approach where you customize the design but not the layout. This keeps things manageable while still being deeply customizable.
- **Server Components for public pages** — All public site pages are Server Components (zero JS to browser) except the contact form which needs `"use client"` for the form handler.
- **shadcn/ui v4 uses Base UI** — Important: the `asChild` pattern doesn't exist. Use `render` prop instead when composing components.
- **Prisma 7 driver adapter** — No `url` in `datasource` block. Connection is passed via `@prisma/adapter-pg` at runtime. Must use `JSON.parse(JSON.stringify(obj))` when writing complex typed objects to Prisma JSON fields (Prisma's `InputJsonValue` doesn't accept TypeScript interfaces directly).
- **Auth.js with JWT** — Uses NextAuth v5 (Auth.js) with Credentials provider and JWT sessions. Every dashboard action calls `requireUser()` or `requireSiteOwner()` before touching data. Middleware redirects unauthenticated users to `/login`.
- **Config migration** — `migrateConfig()` in `src/lib/config-migrate.ts` upgrades old flat-section configs to the new multi-page + templates format. Run on every load (builder + public site) for backward compatibility.
