"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
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
import { SectionEditor } from "./section-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

const SIDEBAR_PREFIX = "sidebar-";

interface BuilderProps {
  siteId: string;
  siteName: string;
  initialConfig: SiteConfig;
}

export function Builder({ siteId, siteName, initialConfig }: BuilderProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSection = useCallback((type: SectionType) => {
    const def = SECTION_DEFINITIONS[type];
    const id = `${type}-${Date.now()}`;
    const newSection: Section = {
      id,
      type,
      data: { ...def.defaultData },
    };
    setConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSelectedId(id);
    setSaved(false);
  }, []);

  const removeSection = useCallback(
    (sectionId: string) => {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
      }));
      if (selectedId === sectionId) setSelectedId(null);
      setSaved(false);
    },
    [selectedId]
  );

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

  const selectSection = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    const activeIdStr = active.id as string;
    const isSidebarItem = activeIdStr.startsWith(SIDEBAR_PREFIX);

    if (isSidebarItem) {
      const sectionType = activeIdStr.replace(SIDEBAR_PREFIX, "") as SectionType;
      const def = SECTION_DEFINITIONS[sectionType];
      const newId = `${sectionType}-${Date.now()}`;
      const newSection: Section = {
        id: newId,
        type: sectionType,
        data: { ...def.defaultData },
      };

      if (over) {
        const overIdStr = over.id as string;
        if (overIdStr === "canvas-droppable") {
          setConfig((prev) => ({
            ...prev,
            sections: [...prev.sections, newSection],
          }));
        } else {
          const overIndex = config.sections.findIndex((s) => s.id === overIdStr);
          if (overIndex >= 0) {
            setConfig((prev) => {
              const updated = [...prev.sections];
              updated.splice(overIndex, 0, newSection);
              return { ...prev, sections: updated };
            });
          } else {
            setConfig((prev) => ({
              ...prev,
              sections: [...prev.sections, newSection],
            }));
          }
        }
        setSelectedId(newId);
      } else {
        return;
      }
      setSaved(false);
      return;
    }

    if (!over || active.id === over.id) return;

    setConfig((prev) => {
      const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
      const newIndex = prev.sections.findIndex((s) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
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
  const selectedSection = config.sections.find((s) => s.id === selectedId);
  const isSidebarDrag = activeId?.startsWith(SIDEBAR_PREFIX);
  const activeSidebarType = isSidebarDrag
    ? (activeId!.replace(SIDEBAR_PREFIX, "") as SectionType)
    : null;

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar — section palette */}
          <SectionSidebar onAdd={addSection} sidebarPrefix={SIDEBAR_PREFIX} />

          {/* Canvas */}
          <div
            className="flex-1 overflow-y-auto bg-neutral-100 p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
          >
            <div className="mx-auto max-w-3xl">
              <CanvasDropZone
                sections={config.sections}
                selectedId={selectedId}
                onSelect={selectSection}
                onRemove={removeSection}
                onUpdate={updateSection}
                isEmpty={config.sections.length === 0}
              />
            </div>
          </div>

          {/* Right sidebar — section editor */}
          {selectedSection && (
            <SectionEditor
              key={selectedSection.id}
              section={selectedSection}
              onUpdate={updateSection}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeSection ? (
            <div className="w-[700px] rounded-xl border-2 border-indigo-400 bg-white p-4 opacity-90 shadow-xl">
              <SectionPreview section={activeSection} />
            </div>
          ) : activeSidebarType ? (
            <div className="w-56 rounded-xl border-2 border-indigo-400 bg-indigo-50 px-3 py-2.5 text-sm font-medium text-indigo-700 shadow-xl">
              {SECTION_DEFINITIONS[activeSidebarType].label}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function CanvasDropZone({
  sections,
  selectedId,
  onSelect,
  onRemove,
  onUpdate,
  isEmpty,
}: {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  isEmpty: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-droppable" });

  return (
    <div ref={setNodeRef} className="min-h-[200px]">
      {isEmpty ? (
        <div
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 text-center transition-colors ${
            isOver
              ? "border-indigo-400 bg-indigo-50"
              : "border-neutral-300 bg-white"
          }`}
        >
          <p className="text-lg font-medium text-neutral-400">
            {isOver ? "Drop here to add" : "Your canvas is empty"}
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Drag sections from the sidebar or click to add
          </p>
        </div>
      ) : (
        <SortableContext
          items={sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                isSelected={section.id === selectedId}
                onSelect={onSelect}
                onRemove={onRemove}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
