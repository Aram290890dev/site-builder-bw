"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Section } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import { SectionPreview } from "./section-preview";
import { GripVertical, Trash2, Pencil, Copy, Eye, EyeOff } from "lucide-react";

interface SortableSectionProps {
  section: Section;
  isSelected: boolean;
  themeAccent?: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleHide: (id: string) => void;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
}

export function SortableSection({
  section,
  isSelected,
  themeAccent,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleHide,
  onUpdate,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const def = SECTION_DEFINITIONS[section.type];
  const isHidden = section.style?.hidden === true;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/section relative transition-all ${
        isDragging
          ? "z-50 opacity-50"
          : isSelected
            ? "ring-2 ring-indigo-400 ring-offset-1"
            : ""
      } ${isHidden ? "opacity-40" : ""}`}
    >
      {/* Hover toolbar — floats above the section */}
      <div
        className={`absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-full border bg-white px-1.5 py-0.5 shadow-lg transition-all ${
          isSelected
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 group-hover/section:opacity-100 group-hover/section:scale-100"
        }`}
        style={{ borderColor: isSelected ? "#818cf8" : "#e5e5e5" }}
      >
        <button
          className="cursor-grab touch-none rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="size-3.5" />
        </button>

        <span className="px-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          {def.label}
        </span>

        <div className="mx-0.5 h-3.5 w-px bg-neutral-200" />

        <button
          onClick={(e) => { e.stopPropagation(); onSelect(section.id); }}
          className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          title="Edit in sidebar"
        >
          <Pencil className="size-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(section.id); }}
          className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          title="Duplicate"
        >
          <Copy className="size-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleHide(section.id); }}
          className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
          title={isHidden ? "Show" : "Hide"}
        >
          {isHidden ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(section.id); }}
          className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Delete"
        >
          <Trash2 className="size-3" />
        </button>
      </div>

      {/* Hover border indicator */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 rounded-lg border-2 transition-all ${
          isSelected
            ? "border-indigo-400"
            : "border-transparent group-hover/section:border-indigo-200"
        }`}
      />

      {/* The actual section content — full width, page-like */}
      <div onClick={() => onSelect(section.id)} className="relative cursor-default">
        <SectionPreview section={section} themeAccent={themeAccent} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
