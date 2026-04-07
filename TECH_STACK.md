# BookWise — Tech Stack Reference

A complete guide to every technology used in this project, what it does, and why we chose it.

---

## Core Framework

### Next.js 16 (React 19)
- **What:** Full-stack React framework with server-side rendering, static generation, API routes, and file-based routing.
- **Why:** We use the **App Router** (`src/app/`) which gives us Server Components by default (fast, zero JS shipped to browser), Server Actions (call backend functions directly from components), and file-based routing (create a folder = create a route). React 19 brings improved performance and the `use` hook.
- **Key files:** `src/app/layout.tsx` (root layout), `src/app/page.tsx` (landing page), `src/app/dashboard/` (owner dashboard), `src/app/site/[domain]/` (public sites).

### TypeScript
- **What:** Typed superset of JavaScript.
- **Why:** Catches bugs at compile time. Critical for a builder where we pass JSON configs around — types ensure the config shape is always correct.
- **Key files:** `src/types/builder.ts` (all builder types), `tsconfig.json`.

---

## Styling & UI

### Tailwind CSS v4
- **What:** Utility-first CSS framework. Instead of writing CSS files, you compose classes like `flex items-center gap-2 text-sm`.
- **Why:** Extremely fast to iterate on UI. No CSS files to manage. v4 uses a new engine that's significantly faster than v3.
- **Key file:** `src/app/globals.css` (imports Tailwind + custom tokens).

### shadcn/ui (v4, Base UI)
- **What:** Copy-paste component library built on top of Base UI (by MUI). NOT a package — components are copied into your project so you own and customize them.
- **Why:** High-quality, accessible components (Dialog, Button, Input, Label, etc.) that we fully control. Unlike a library, we can modify any component.
- **Important note:** shadcn/ui v4 uses Base UI instead of Radix. This means some APIs are different — e.g., no `asChild` prop, uses `render` prop instead.
- **Key files:** `src/components/ui/` (button, dialog, input, label, separator, card, badge).

### Lucide React
- **What:** Icon library with 1000+ clean SVG icons as React components.
- **Why:** Lightweight, tree-shakeable (only imports icons you use), consistent style.

### class-variance-authority (CVA)
- **What:** Utility for creating variant-based component styles (e.g., `Button` with `variant="outline"` and `size="sm"`).
- **Why:** Used by shadcn/ui internally for component variants.

### tailwind-merge + clsx
- **What:** `clsx` conditionally joins class names. `tailwind-merge` intelligently merges Tailwind classes (so `px-4 px-2` becomes `px-2`).
- **Why:** Used together in the `cn()` helper (`src/lib/utils.ts`) for clean conditional styling.

---

## Database

### PostgreSQL (hosted on Neon)
- **What:** Relational database. Neon is a serverless Postgres provider with a free tier.
- **Why:** Relational data fits perfectly (users own sites, sites have properties, properties have bookings). Neon gives us a free cloud database with no setup.
- **Connection:** Set `DATABASE_URL` in `.env`. See `.env.example` for the format.

### Prisma 7 (ORM)
- **What:** TypeScript-first ORM. You define your schema in `prisma/schema.prisma`, and Prisma generates a fully typed client.
- **Why:** Type-safe database queries. Migrations. Schema-as-code. Auto-generated TypeScript types from DB schema.
- **Prisma 7 specifics:**
  - The `datasource` block in `schema.prisma` does NOT have a `url` field — the connection URL is passed via the driver adapter at runtime.
  - Uses `@prisma/adapter-pg` (driver adapter pattern) — we create a `pg.Pool` and pass it to `PrismaPg`, then pass that adapter to `new PrismaClient({ adapter })`.
  - Generated client outputs to `src/generated/prisma/` (configured in `schema.prisma`).
  - `postinstall` script runs `prisma generate` automatically after `npm install`.
- **Key files:**
  - `prisma/schema.prisma` — database schema (User, Site, Property, Booking, Availability)
  - `prisma/seed.ts` — seed script with demo data (1 user, 1 site, 3 properties)
  - `src/lib/db/index.ts` — Prisma client singleton
  - `prisma.config.ts` — Prisma config file for the connection URL

### pg (node-postgres)
- **What:** Low-level PostgreSQL driver for Node.js.
- **Why:** Required by `@prisma/adapter-pg`. Prisma 7 uses this under the hood to connect to Postgres.

---

## Drag & Drop

### dnd-kit
- **What:** Modular drag-and-drop toolkit for React. Consists of:
  - `@dnd-kit/core` — core DnD engine (DndContext, sensors, collision detection)
  - `@dnd-kit/sortable` — sortable list functionality (SortableContext, useSortable)
  - `@dnd-kit/utilities` — CSS utilities for transforms
- **Why:** The most modern and performant React DnD library. Highly composable — we use it for both reordering sections on the canvas AND dragging new sections from the sidebar.
- **How it works in our builder:**
  1. `DndContext` wraps both the sidebar and canvas.
  2. Sidebar items use `useDraggable` with IDs prefixed `sidebar-` (e.g., `sidebar-hero`).
  3. Canvas sections use `useSortable` for reordering.
  4. On `onDragEnd`, we check if the dragged item came from the sidebar (prefix check) → if so, we create a new section. Otherwise, we reorder.

---

## Utilities

### dotenv
- **What:** Loads `.env` file variables into `process.env`.
- **Why:** Used in the seed script and Prisma client to load `DATABASE_URL`.

### tsx
- **What:** TypeScript executor for Node.js. Run `.ts` files directly without compiling.
- **Why:** Used for `npm run db:seed` — runs `prisma/seed.ts` directly.

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Marketing landing page
│   ├── layout.tsx                # Root layout (html, body, fonts)
│   ├── globals.css               # Tailwind imports + theme tokens
│   ├── dashboard/                # Owner dashboard
│   │   ├── page.tsx              # Site list (Edit + View Site buttons)
│   │   ├── layout.tsx            # Dashboard layout (header)
│   │   ├── actions.ts            # Server actions (getSites, createSite, deleteSite)
│   │   ├── create-site-dialog.tsx# New site dialog
│   │   └── [siteId]/
│   │       └── builder/
│   │           ├── page.tsx      # Builder entry (server component, fetches config)
│   │           └── actions.ts    # Builder server actions (getSiteForBuilder, saveSiteConfig)
│   │
│   └── site/[domain]/            # Public-facing sites (rendered from config)
│       ├── layout.tsx            # Shared site layout (navbar + footer)
│       ├── page.tsx              # Home page (renders drag-and-drop sections)
│       ├── data.ts               # Data fetching (getSiteByDomain, getProperty)
│       ├── properties/
│       │   ├── page.tsx          # Listing page (template-driven, real data)
│       │   └── [propertyId]/
│       │       └── page.tsx      # Property detail page (gallery, amenities, calendar, booking)
│       └── checkout/
│           └── [propertyId]/
│               └── page.tsx      # Checkout page (guest form, order summary)
│
├── components/
│   ├── ui/                       # shadcn/ui components (Button, Dialog, Input, etc.)
│   ├── builder/                  # Builder-specific components
│   │   ├── builder.tsx           # Main builder with DnD, tabs, state management
│   │   ├── section-sidebar.tsx   # Draggable section type list
│   │   ├── sortable-section.tsx  # Sortable canvas section wrapper
│   │   ├── section-preview.tsx   # Section visual preview (applies styles)
│   │   ├── section-editor.tsx    # Content + style editing panel
│   │   └── template-editors/     # Template page customizers
│   │       ├── listing-editor.tsx
│   │       ├── detail-editor.tsx
│   │       └── checkout-editor.tsx
│   ├── site/                     # Public site renderers
│   │   └── sections/             # Production section components
│   │       ├── section-renderer.tsx  # Routes section type → component
│   │       ├── hero.tsx
│   │       ├── property-grid.tsx
│   │       ├── gallery.tsx
│   │       ├── testimonials.tsx
│   │       ├── contact.tsx       # "use client" (has form onSubmit)
│   │       ├── map-section.tsx
│   │       ├── features.tsx
│   │       └── cta.tsx
│   └── shared/                   # (Future) shared components
│
├── lib/
│   ├── db/index.ts               # Prisma client singleton
│   ├── utils.ts                  # cn() helper
│   ├── constants.ts              # Demo user email constant
│   └── config-migrate.ts         # Migrates old flat config → multi-page config
│
├── types/
│   └── builder.ts                # All builder TypeScript types + defaults
│
└── generated/prisma/             # Auto-generated Prisma client (do not edit)
```

---

## Key Architectural Patterns

### Builder vs. Public Site (two renderers, one config)
The builder components (`src/components/builder/`) and public site components (`src/components/site/`) are **completely separate codebases** that both read the same JSON config. The builder shows editing UI (drag handles, sidebars, editors). The public site renders production HTML with no editing chrome. Think Google Docs vs. exported PDF.

### Server Components by default
Public site pages (`src/app/site/`) are all Server Components — they fetch data and render on the server. Only interactive pieces (like the contact form) use `"use client"`. This means zero JavaScript shipped to the browser for most pages.

### Config migration
When loading a site, `migrateConfig()` detects old config formats and upgrades them. This ensures sites created before multi-page support still work.

---

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server on localhost:3000 |
| `npm run build` | Production build (also catches type errors) |
| `npm run db:seed` | Seed database with demo user, site, and 3 properties |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma db push` | Push schema changes to the database |
| `npx prisma studio` | Open visual database browser |
