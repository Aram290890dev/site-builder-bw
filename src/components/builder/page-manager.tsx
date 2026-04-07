"use client";

import { useState } from "react";
import type { BuilderPage, Section } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import {
  Plus,
  FileText,
  Phone,
  Users,
  Shield,
  ScrollText,
  File,
} from "lucide-react";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeSection(type: Section["type"], overrides: Record<string, unknown> = {}): Section {
  const def = SECTION_DEFINITIONS[type];
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    data: { ...def.defaultData, ...overrides },
  };
}

interface PagePreset {
  name: string;
  icon: typeof FileText;
  slug: string;
  sections: () => Section[];
}

const PAGE_PRESETS: PagePreset[] = [
  {
    name: "Contact",
    icon: Phone,
    slug: "contact",
    sections: () => [
      makeSection("hero", {
        title: "Get in Touch",
        subtitle: "We'd love to hear from you",
        ctaText: "",
      }),
      makeSection("contact", {
        title: "Send Us a Message",
        email: "hello@example.com",
        phone: "+1 (555) 000-0000",
      }),
      makeSection("map", { title: "Find Us" }),
    ],
  },
  {
    name: "About Us",
    icon: Users,
    slug: "about-us",
    sections: () => [
      makeSection("hero", {
        title: "About Us",
        subtitle: "Our story and what drives us",
        ctaText: "",
      }),
      makeSection("features", {
        title: "Our Values",
        items: ["Hospitality First", "Attention to Detail", "Local Experience", "Sustainable Tourism"],
      }),
      makeSection("testimonials", {
        title: "What Our Guests Say",
        items: [
          { name: "Sarah M.", text: "An unforgettable stay!", rating: 5 },
          { name: "James L.", text: "Incredible hospitality and beautiful property.", rating: 5 },
        ],
      }),
    ],
  },
  {
    name: "Terms & Conditions",
    icon: ScrollText,
    slug: "terms",
    sections: () => [
      makeSection("hero", {
        title: "Terms & Conditions",
        subtitle: "Please read our terms carefully",
        ctaText: "",
      }),
      makeSection("features", {
        title: "Booking Terms",
        items: [
          "Reservations must be made at least 48 hours in advance",
          "Full payment is due at time of booking",
          "Free cancellation up to 7 days before check-in",
          "Check-in: 3:00 PM — Check-out: 11:00 AM",
          "Maximum occupancy must not be exceeded",
          "Pets are not allowed unless stated otherwise",
        ],
      }),
    ],
  },
  {
    name: "Privacy Policy",
    icon: Shield,
    slug: "privacy",
    sections: () => [
      makeSection("hero", {
        title: "Privacy Policy",
        subtitle: "How we handle your information",
        ctaText: "",
      }),
      makeSection("features", {
        title: "What We Collect",
        items: [
          "Name and contact information for bookings",
          "Payment details processed securely via third parties",
          "Usage data to improve our services",
          "We never sell your personal information",
          "You can request data deletion at any time",
          "Cookies are used for essential site functionality",
        ],
      }),
    ],
  },
];

interface Props {
  existingPages: BuilderPage[];
  onAddPage: (page: BuilderPage) => void;
}

export function PageManager({ existingPages, onAddPage }: Props) {
  const [open, setOpen] = useState(false);
  const [customName, setCustomName] = useState("");

  const existingSlugs = new Set(existingPages.map((p) => p.slug));

  function createPage(name: string, slug: string, sections: Section[]) {
    let finalSlug = slug;
    let counter = 1;
    while (existingSlugs.has(`/${finalSlug}`)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const page: BuilderPage = {
      id: `page-${Date.now()}`,
      name,
      slug: `/${finalSlug}`,
      sections,
    };

    onAddPage(page);
    setOpen(false);
    setCustomName("");
  }

  function handlePreset(preset: PagePreset) {
    createPage(preset.name, preset.slug, preset.sections());
  }

  function handleCustom() {
    const name = customName.trim();
    if (!name) return;
    createPage(name, slugify(name), []);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-2 text-xs font-medium text-neutral-400 transition-colors hover:text-indigo-600"
      >
        <Plus className="size-3.5" />
        Add Page
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Presets
            </div>
            <div className="space-y-1">
              {PAGE_PRESETS.map((preset) => {
                const exists = existingSlugs.has(`/${preset.slug}`);
                return (
                  <button
                    key={preset.slug}
                    onClick={() => handlePreset(preset)}
                    disabled={exists}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                      exists
                        ? "cursor-not-allowed text-neutral-300"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <preset.icon className="size-4 shrink-0" />
                    <span>{preset.name}</span>
                    {exists && <span className="ml-auto text-[10px] text-neutral-300">Added</span>}
                  </button>
                );
              })}
              <button
                onClick={() => createPage("Blank Page", `page-${Date.now()}`, [])}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                <File className="size-4 shrink-0" />
                <span>Blank Page</span>
              </button>
            </div>

            <div className="mt-3 border-t border-neutral-100 pt-3">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                Custom Page
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustom()}
                  placeholder="Page name..."
                  className="flex-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-sm outline-none focus:border-indigo-300"
                />
                <button
                  onClick={handleCustom}
                  disabled={!customName.trim()}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
