"use client";

import type { Section } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
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

interface SectionPreviewProps {
  section: Section;
}

export function SectionPreview({ section }: SectionPreviewProps) {
  const def = SECTION_DEFINITIONS[section.type];
  const Icon = ICON_MAP[def.icon] ?? LayoutGrid;
  const title = (section.data.title as string) ?? def.label;

  switch (section.type) {
    case "hero":
      return (
        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-800">
            {section.data.title as string}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            {section.data.subtitle as string}
          </p>
          <div className="mt-4 inline-block rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white">
            {section.data.ctaText as string}
          </div>
        </div>
      );

    case "propertyGrid":
      return (
        <div>
          <h3 className="mb-3 text-lg font-semibold">{title}</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
              >
                <div className="mb-2 h-20 rounded-md bg-neutral-200" />
                <div className="h-3 w-2/3 rounded bg-neutral-200" />
                <div className="mt-1 h-2 w-1/2 rounded bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>
      );

    case "gallery":
      return (
        <div>
          <h3 className="mb-3 text-lg font-semibold">{title}</h3>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex h-20 items-center justify-center rounded-lg bg-neutral-100"
              >
                <Images className="size-5 text-neutral-300" />
              </div>
            ))}
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div>
          <h3 className="mb-3 text-lg font-semibold">{title}</h3>
          <div className="rounded-lg bg-neutral-50 p-4">
            <Quote className="mb-2 size-5 text-indigo-300" />
            <p className="text-sm italic text-neutral-600">
              &ldquo;An unforgettable stay! The views were breathtaking.&rdquo;
            </p>
            <p className="mt-2 text-xs font-medium text-neutral-500">
              — Sarah M.
            </p>
          </div>
        </div>
      );

    case "contact":
      return (
        <div>
          <h3 className="mb-3 text-lg font-semibold">{title}</h3>
          <div className="space-y-2">
            <div className="h-9 rounded-lg border border-neutral-200 bg-neutral-50" />
            <div className="h-9 rounded-lg border border-neutral-200 bg-neutral-50" />
            <div className="h-20 rounded-lg border border-neutral-200 bg-neutral-50" />
          </div>
        </div>
      );

    case "map":
      return (
        <div>
          <h3 className="mb-3 text-lg font-semibold">{title}</h3>
          <div className="flex h-40 items-center justify-center rounded-lg bg-neutral-100">
            <MapPin className="size-8 text-neutral-300" />
          </div>
        </div>
      );

    case "features":
      return (
        <div>
          <h3 className="mb-3 text-lg font-semibold">{title}</h3>
          <div className="grid grid-cols-2 gap-2">
            {((section.data.items as string[]) ?? []).slice(0, 4).map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600"
              >
                <div className="size-2 rounded-full bg-indigo-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="rounded-lg bg-neutral-900 p-8 text-center text-white">
          <h3 className="text-xl font-bold">
            {section.data.title as string}
          </h3>
          <p className="mt-1 text-sm text-neutral-400">
            {section.data.subtitle as string}
          </p>
          <div className="mt-4 inline-block rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium">
            {section.data.buttonText as string}
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center gap-3 p-4">
          <Icon className="size-5 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-600">
            {def.label}
          </span>
        </div>
      );
  }
}
