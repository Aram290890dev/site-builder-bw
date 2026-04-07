"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Section } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import { SectionPreview } from "./section-preview";
import { GripVertical, Trash2 } from "lucide-react";

interface SortableSectionProps {
  section: Section;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
}

export function SortableSection({
  section,
  onRemove,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border bg-white shadow-sm transition-all ${
        isDragging
          ? "z-50 border-indigo-400 opacity-50 shadow-lg"
          : "border-neutral-200 hover:border-indigo-300 hover:shadow-md"
      }`}
    >
      {/* Section header with drag handle */}
      <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-2">
        <button
          className="cursor-grab touch-none rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {def.label}
        </span>
        <div className="flex-1" />
        <button
          onClick={() => onRemove(section.id)}
          className="rounded p-1 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {/* Section preview */}
      <div className="p-4">
        <SectionPreview section={section} />
      </div>
    </div>
  );
}
