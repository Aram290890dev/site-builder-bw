"use client";

import { SECTION_DEFINITIONS, type SectionType } from "@/types/builder";
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

interface SectionSidebarProps {
  onAdd: (type: SectionType) => void;
}

export function SectionSidebar({ onAdd }: SectionSidebarProps) {
  const sections = Object.entries(SECTION_DEFINITIONS) as [
    SectionType,
    (typeof SECTION_DEFINITIONS)[SectionType],
  ][];

  return (
    <div className="w-64 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white p-4">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        Sections
      </h3>
      <p className="mb-4 text-xs text-neutral-400">
        Click to add to your page
      </p>
      <div className="space-y-2">
        {sections.map(([type, def]) => {
          const Icon = ICON_MAP[def.icon] ?? LayoutGrid;
          return (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <Icon className="size-4 text-neutral-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-800">
                  {def.label}
                </p>
                <p className="truncate text-xs text-neutral-400">
                  {def.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
