"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { SiteConfig, Section, SectionType } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import { saveSiteConfig } from "@/app/dashboard/[siteId]/builder/actions";
import { SectionSidebar } from "./section-sidebar";
import { SortableSection } from "./sortable-section";
import { SectionPreview } from "./section-preview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface BuilderProps {
  siteId: string;
  siteName: string;
  initialConfig: SiteConfig;
}

export function Builder({ siteId, siteName, initialConfig }: BuilderProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSection = useCallback(
    (type: SectionType) => {
      const def = SECTION_DEFINITIONS[type];
      const newSection: Section = {
        id: `${type}-${Date.now()}`,
        type,
        data: { ...def.defaultData },
      };
      setConfig((prev) => ({
        ...prev,
        sections: [...prev.sections, newSection],
      }));
      setSaved(false);
    },
    []
  );

  const removeSection = useCallback((sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
    setSaved(false);
  }, []);

  const updateSection = useCallback(
    (sectionId: string, data: Record<string, unknown>) => {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, data: { ...s.data, ...data } } : s
        ),
      }));
      setSaved(false);
    },
    []
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setConfig((prev) => {
      const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
      const newIndex = prev.sections.findIndex((s) => s.id === over.id);
      return {
        ...prev,
        sections: arrayMove(prev.sections, oldIndex, newIndex),
      };
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await saveSiteConfig(siteId, config);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const activeSection = config.sections.find((s) => s.id === activeId);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Builder toolbar */}
      <div className="flex h-12 items-center justify-between border-b border-neutral-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-black"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <div className="h-5 w-px bg-neutral-200" />
          <span className="text-sm font-medium">{siteName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Eye className="mr-1.5 size-3.5" />
            Preview
          </Button>
          <Button
            size="sm"
            className="bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 size-3.5" />
            )}
            {saved ? "Saved!" : saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Builder body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SectionSidebar onAdd={addSection} />

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-neutral-100 p-8">
          <div className="mx-auto max-w-3xl">
            {config.sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-white py-24 text-center">
                <p className="text-lg font-medium text-neutral-400">
                  Your canvas is empty
                </p>
                <p className="mt-1 text-sm text-neutral-400">
                  Drag sections from the sidebar or click to add
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={config.sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {config.sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        onRemove={removeSection}
                        onUpdate={updateSection}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeSection ? (
                    <div className="rounded-xl border-2 border-indigo-400 bg-white p-4 opacity-90 shadow-xl">
                      <SectionPreview section={activeSection} />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
