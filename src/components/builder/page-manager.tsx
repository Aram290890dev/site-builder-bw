"use client";

import { useState, useRef, useEffect } from "react";
import type { BuilderPage, Section } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import {
  Plus,
  Phone,
  Users,
  Shield,
  ScrollText,
  File,
  X,
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
  icon: typeof Phone;
  slug: string;
  sections: () => Section[];
}

const PAGE_PRESETS: PagePreset[] = [
  {
    name: "Contact",
    icon: Phone,
    slug: "contact",
    sections: () => [
      makeSection("hero", { title: "Get in Touch", subtitle: "We'd love to hear from you", ctaText: "" }),
      makeSection("contact", { title: "Send Us a Message", email: "hello@example.com", phone: "+1 (555) 000-0000" }),
      makeSection("map", { title: "Find Us" }),
    ],
  },
  {
    name: "About Us",
    icon: Users,
    slug: "about-us",
    sections: () => [
      makeSection("hero", { title: "About Us", subtitle: "Our story and what drives us", ctaText: "" }),
      makeSection("features", { title: "Our Values", items: ["Hospitality First", "Attention to Detail", "Local Experience", "Sustainable Tourism"] }),
      makeSection("testimonials", { title: "What Our Guests Say", items: [{ name: "Sarah M.", text: "An unforgettable stay!", rating: 5 }, { name: "James L.", text: "Incredible hospitality.", rating: 5 }] }),
    ],
  },
  {
    name: "Terms & Conditions",
    icon: ScrollText,
    slug: "terms",
    sections: () => [
      makeSection("hero", { title: "Terms & Conditions", subtitle: "Please read our terms carefully", ctaText: "" }),
      makeSection("features", { title: "Booking Terms", items: ["Reservations must be made at least 48 hours in advance", "Full payment is due at time of booking", "Free cancellation up to 7 days before check-in", "Check-in: 3:00 PM — Check-out: 11:00 AM", "Maximum occupancy must not be exceeded", "Pets are not allowed unless stated otherwise"] }),
    ],
  },
  {
    name: "Privacy Policy",
    icon: Shield,
    slug: "privacy",
    sections: () => [
      makeSection("hero", { title: "Privacy Policy", subtitle: "How we handle your information", ctaText: "" }),
      makeSection("features", { title: "What We Collect", items: ["Name and contact information for bookings", "Payment details processed securely via third parties", "Usage data to improve our services", "We never sell your personal information", "You can request data deletion at any time", "Cookies are used for essential site functionality"] }),
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
  const modalRef = useRef<HTMLDivElement>(null);

  const existingSlugs = new Set(existingPages.map((p) => p.slug));

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function createPage(name: string, slug: string, sections: Section[]) {
    let finalSlug = slug;
    let counter = 1;
    while (existingSlugs.has(`/${finalSlug}`)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    onAddPage({
      id: `page-${Date.now()}`,
      name,
      slug: `/${finalSlug}`,
      sections,
    });
    setOpen(false);
    setCustomName("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex size-7 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-neutral-400 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
        title="Add page"
      >
        <Plus className="size-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div
            ref={modalRef}
            className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-300/30">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold">Add a new page</h3>
                  <p className="mt-0.5 text-xs text-neutral-400">Choose a template or start blank</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex size-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {PAGE_PRESETS.map((preset) => {
                    const exists = existingSlugs.has(`/${preset.slug}`);
                    return (
                      <button
                        key={preset.slug}
                        onClick={() => createPage(preset.name, preset.slug, preset.sections())}
                        disabled={exists}
                        className={`group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
                          exists
                            ? "cursor-not-allowed border-neutral-100 bg-neutral-50 opacity-50"
                            : "border-neutral-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
                        }`}
                      >
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                          exists ? "bg-neutral-100 text-neutral-300" : "bg-neutral-100 text-neutral-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                        }`}>
                          <preset.icon className="size-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium">{preset.name}</span>
                          {exists && <span className="ml-1.5 text-[10px] text-neutral-400">Added</span>}
                        </div>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => createPage("Blank Page", `page-${Date.now()}`, [])}
                    className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                      <File className="size-4" />
                    </div>
                    <span className="text-sm font-medium">Blank Page</span>
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3">
                  <label className="mb-1.5 block text-xs font-medium text-neutral-500">Custom page name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const name = customName.trim();
                          if (name) createPage(name, slugify(name), []);
                        }
                      }}
                      placeholder="e.g. FAQ, Gallery, Services..."
                      className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button
                      onClick={() => {
                        const name = customName.trim();
                        if (name) createPage(name, slugify(name), []);
                      }}
                      disabled={!customName.trim()}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
