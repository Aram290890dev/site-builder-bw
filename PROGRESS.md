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
- "Create New Site" button opens a dialog where you enter a name → subdomain is auto-generated (slugified name).
- Server action `createSite()` creates the site in the database with a default config (home page with hero + property grid sections, plus default template settings for listing/detail/checkout).
- Server action `deleteSite()` deletes a site.
- Clicking "Edit" on a site card navigates to `/dashboard/[siteId]/builder`.

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

**Drag & Drop (Home page tab):**
- Left sidebar lists 8 section types: Hero, Property Grid, Gallery, Testimonials, Contact, Map, Features, CTA.
- Each section type can be dragged from the sidebar onto the canvas (or clicked to append).
- Sections on the canvas can be reordered by dragging.
- Clicking a section opens the right-side editor panel with two tabs:
  - **Content tab:** Edit text fields, data specific to each section type.
  - **Style tab:** Background color, text color, accent color, text alignment, padding (sm/md/lg/xl), corner radius, background image URL, and overlay opacity.
- All style changes apply live to the section preview on the canvas.
- "Save" button persists the config to the database.

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

The preview renders 6 sample property cards with realistic data that updates live.

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

The preview shows a full property detail page with gallery, title, description, amenities, calendar, map placeholder, and booking form.

#### Checkout Page Template
**File:** `src/components/builder/template-editors/checkout-editor.tsx`

Customizable settings:
- **Flow style:** Single-page (all fields at once) or Multi-step (step indicator: Dates → Guest Info → Confirm)
- **Card corners:** None, Small, Medium, Large
- **Show/hide:** Order summary, Property image in summary
- **Colors:** Background, Accent/button color

The preview shows the guest info form and booking summary with live style updates.

---

### 5. Database Schema

**Models:**
- **User** — id, email, name, password, sites[]
- **Site** — id, name, subdomain (unique), config (JSON), published, ownerId, properties[], bookings[]
- **Property** — id, name, description, address, lat/lng, price, currency, images (JSON), amenities (JSON), maxGuests, siteId, bookings[], availability[]
- **Booking** — id, checkIn, checkOut, guests, status (PENDING/CONFIRMED/CANCELLED), guest info, totalPrice, notes, propertyId, siteId
- **Availability** — id, date, available, price override, propertyId (unique per property+date)

**Seed data:** One demo user, one demo site ("Astra Villas"), one demo property.

---

### 6. Config Migration
**File:** `src/lib/config-migrate.ts`

Old site configs had a flat `sections[]` array. New configs have `pages[]` + `templates`. The migration function (`migrateConfig`) runs when loading a site in the builder — if it detects the old format, it wraps sections into a "Home" page and adds default template settings. This ensures backward compatibility.

---

## What's NOT Built Yet

### High Priority (Next Steps)

1. **Public site rendering** — The builder saves configs, but there's no public-facing site yet. Need to:
   - Create `src/app/site/[domain]/` route that reads the config and renders the actual website.
   - Render drag-and-drop pages from section configs.
   - Render template pages (listing, detail, checkout) using template settings + real property data.
   - This is the most important next step — it makes the builder actually useful.

2. **Property management** — CRUD for properties within a site. Currently only the seed has one property. Need:
   - Dashboard page to add/edit/delete properties per site.
   - Image upload (Cloudinary or S3).
   - Amenities editor.
   - Location picker (map integration).

3. **Authentication** — Replace the hardcoded demo user with real auth.
   - Plan: NextAuth.js (Auth.js) with email/password + optional Google OAuth.
   - Login, register, protected routes.

4. **Availability & Calendar** — Let owners manage property availability.
   - Calendar UI to block/unblock dates.
   - Custom pricing per date.
   - Sync with the `Availability` model.

5. **Booking flow** — The checkout page template exists visually, but there's no actual booking logic.
   - Guest fills in dates + info → creates a `Booking` record with status PENDING.
   - Owner sees bookings in dashboard.
   - No payment for MVP — just reservation.

### Medium Priority

6. **Preview mode** — Let owners preview their site before publishing. The "Preview" button in the builder is currently disabled.

7. **Publish/unpublish** — Toggle the `published` flag. Only published sites are publicly visible.

8. **Multiple custom pages** — The config supports multiple pages, but there's no UI to add/rename/delete pages yet. Currently only "Home" exists.

9. **Theme system** — The `SiteTheme` (primary color, font family) exists in config but isn't applied globally yet. Need a theme settings panel.

### Lower Priority

10. **Custom domains** — Currently sites use subdomains. Add support for custom domains.

11. **Payments** — Stripe or similar integration for actual booking payments.

12. **Analytics** — Views, bookings, revenue per site.

13. **Email notifications** — Booking confirmations, reminders.

14. **SEO** — Per-page meta tags, Open Graph images.

15. **Mobile responsive builder** — The builder itself is desktop-only. Template pages should be responsive.

---

## Key Decisions & Context

- **DOM-based builder, not Canvas API** — Sections are real HTML/React components, not drawn on a canvas. This makes styling, accessibility, and responsiveness much easier.
- **JSON config stored in DB** — The entire site design is a single JSON blob on the `Site` model. This makes saving/loading instant and avoids complex relational schemas for layout data.
- **Template pages vs. custom pages** — Drag-and-drop works for landing pages, but data-driven pages (listings, property detail) use a template approach where you customize the design but not the layout. This keeps things manageable while still being deeply customizable.
- **shadcn/ui v4 uses Base UI** — Important: the `asChild` pattern doesn't exist. Use `render` prop instead when composing components.
- **Prisma 7 driver adapter** — No `url` in `datasource` block. Connection is passed via `@prisma/adapter-pg` at runtime. Must use `JSON.parse(JSON.stringify(obj))` when writing complex typed objects to Prisma JSON fields (Prisma's `InputJsonValue` doesn't accept TypeScript interfaces directly).
- **Demo user pattern** — Hardcoded `demo@bookwise.dev` in `src/lib/constants.ts` used everywhere until auth is built. Easy to find-and-replace later.
