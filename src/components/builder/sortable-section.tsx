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
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleHide: (id: string) => void;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
}

export function SortableSection({
  section,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleHide,
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
      onClick={() => onSelect(section.id)}
      className={`group relative cursor-pointer rounded-xl border bg-white shadow-sm transition-all ${
        isDragging
          ? "z-50 border-indigo-400 opacity-50 shadow-lg"
          : isSelected
            ? "border-indigo-500 ring-2 ring-indigo-200 shadow-md"
            : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
      } ${isHidden ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-2">
        <button
          className="cursor-grab touch-none rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="size-4" />
        </button>
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {def.label}
        </span>
        {isSelected && (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
            Editing
          </span>
        )}
        {isHidden && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-600">
            Hidden
          </span>
        )}
        <div className="flex-1" />
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(section.id); }}
          className="rounded p-1 text-neutral-400 opacity-0 transition-all hover:bg-blue-50 hover:text-blue-600 group-hover:opacity-100"
          title="Duplicate"
        >
          <Copy className="size-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleHide(section.id); }}
          className="rounded p-1 text-neutral-400 opacity-0 transition-all hover:bg-amber-50 hover:text-amber-600 group-hover:opacity-100"
          title={isHidden ? "Show" : "Hide"}
        >
          {isHidden ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(section.id); }}
          className="rounded p-1 text-neutral-400 opacity-0 transition-all hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(section.id); }}
          className="rounded p-1 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="p-4">
        <SectionPreview section={section} />
      </div>
    </div>
  );
}
