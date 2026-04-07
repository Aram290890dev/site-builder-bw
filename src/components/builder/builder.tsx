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
import type {
  SiteConfig,
  Section,
  SectionType,
  SectionStyle,
  BuilderTab,
  ListingPageSettings,
  DetailPageSettings,
  CheckoutPageSettings,
} from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import { saveSiteConfig } from "@/app/dashboard/[siteId]/builder/actions";
import { SectionSidebar } from "./section-sidebar";
import { SortableSection } from "./sortable-section";
import { SectionPreview } from "./section-preview";
import { SectionEditor } from "./section-editor";
import { ListingTemplateEditor } from "./template-editors/listing-editor";
import { DetailTemplateEditor } from "./template-editors/detail-editor";
import { CheckoutTemplateEditor } from "./template-editors/checkout-editor";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Loader2,
  Home,
  LayoutGrid,
  FileText,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

const SIDEBAR_PREFIX = "sidebar-";

interface BuilderProps {
  siteId: string;
  siteName: string;
  siteSubdomain: string;
  initialConfig: SiteConfig;
}

export function Builder({ siteId, siteName, siteSubdomain, initialConfig }: BuilderProps) {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<BuilderTab>({
    type: "page",
    pageId: config.pages[0]?.id ?? "home",
  });
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

  const currentPage =
    activeTab.type === "page"
      ? config.pages.find((p) => p.id === activeTab.pageId)
      : null;

  const addSection = useCallback(
    (type: SectionType) => {
      if (!currentPage) return;
      const def = SECTION_DEFINITIONS[type];
      const id = `${type}-${Date.now()}`;
      const newSection: Section = { id, type, data: { ...def.defaultData } };
      setConfig((prev) => ({
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === currentPage.id
            ? { ...p, sections: [...p.sections, newSection] }
            : p
        ),
      }));
      setSelectedId(id);
      setSaved(false);
    },
    [currentPage]
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      if (!currentPage) return;
      setConfig((prev) => ({
        ...prev,
        pages: prev.pages.map((p) =>
          p.id === currentPage.id
            ? { ...p, sections: p.sections.filter((s) => s.id !== sectionId) }
            : p
        ),
      }));
      if (selectedId === sectionId) setSelectedId(null);
      setSaved(false);
    },
    [currentPage, selectedId]
  );

  const updateSection = useCallback(
    (sectionId: string, data: Record<string, unknown>) => {
      setConfig((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => ({
          ...p,
          sections: p.sections.map((s) =>
            s.id === sectionId ? { ...s, data: { ...s.data, ...data } } : s
          ),
        })),
      }));
      setSaved(false);
    },
    []
  );

  const updateSectionStyle = useCallback(
    (sectionId: string, styleUpdates: Partial<SectionStyle>) => {
      setConfig((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => ({
          ...p,
          sections: p.sections.map((s) =>
            s.id === sectionId
              ? { ...s, style: { ...s.style, ...styleUpdates } }
              : s
          ),
        })),
      }));
      setSaved(false);
    },
    []
  );

  const updateListingSettings = useCallback(
    (updates: Partial<ListingPageSettings>) => {
      setConfig((prev) => ({
        ...prev,
        templates: {
          ...prev.templates,
          listing: { ...prev.templates.listing, ...updates },
        },
      }));
      setSaved(false);
    },
    []
  );

  const updateDetailSettings = useCallback(
    (updates: Partial<DetailPageSettings>) => {
      setConfig((prev) => ({
        ...prev,
        templates: {
          ...prev.templates,
          detail: { ...prev.templates.detail, ...updates },
        },
      }));
      setSaved(false);
    },
    []
  );

  const updateCheckoutSettings = useCallback(
    (updates: Partial<CheckoutPageSettings>) => {
      setConfig((prev) => ({
        ...prev,
        templates: {
          ...prev.templates,
          checkout: { ...prev.templates.checkout, ...updates },
        },
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
    if (!currentPage) return;

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
        setConfig((prev) => ({
          ...prev,
          pages: prev.pages.map((p) => {
            if (p.id !== currentPage.id) return p;
            if (overIdStr === "canvas-droppable") {
              return { ...p, sections: [...p.sections, newSection] };
            }
            const idx = p.sections.findIndex((s) => s.id === overIdStr);
            if (idx >= 0) {
              const updated = [...p.sections];
              updated.splice(idx, 0, newSection);
              return { ...p, sections: updated };
            }
            return { ...p, sections: [...p.sections, newSection] };
          }),
        }));
        setSelectedId(newId);
        setSaved(false);
      }
      return;
    }

    if (!over || active.id === over.id) return;

    setConfig((prev) => ({
      ...prev,
      pages: prev.pages.map((p) => {
        if (p.id !== currentPage.id) return p;
        const oldIndex = p.sections.findIndex((s) => s.id === active.id);
        const newIndex = p.sections.findIndex((s) => s.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return p;
        return { ...p, sections: arrayMove(p.sections, oldIndex, newIndex) };
      }),
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await saveSiteConfig(siteId, config);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const activeSection = currentPage?.sections.find((s) => s.id === activeId);
  const selectedSection = currentPage?.sections.find((s) => s.id === selectedId);
  const isSidebarDrag = activeId?.startsWith(SIDEBAR_PREFIX);
  const activeSidebarType = isSidebarDrag
    ? (activeId!.replace(SIDEBAR_PREFIX, "") as SectionType)
    : null;

  const tabs: { tab: BuilderTab; label: string; icon: typeof Home }[] = [
    ...config.pages.map((p) => ({
      tab: { type: "page" as const, pageId: p.id },
      label: p.name,
      icon: Home,
    })),
    { tab: { type: "template" as const, template: "listing" as const }, label: "Listings", icon: LayoutGrid },
    { tab: { type: "template" as const, template: "detail" as const }, label: "Property Detail", icon: FileText },
    { tab: { type: "template" as const, template: "checkout" as const }, label: "Checkout", icon: ShoppingCart },
  ];

  function isActiveTab(t: BuilderTab) {
    if (t.type === "page" && activeTab.type === "page") return t.pageId === activeTab.pageId;
    if (t.type === "template" && activeTab.type === "template") return t.template === activeTab.template;
    return false;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Top bar */}
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
          <a
            href={`/site/${siteSubdomain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1.5 size-3.5" />
              View Site
            </Button>
          </a>
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

      {/* Page tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-4">
        {tabs.map(({ tab, label, icon: Icon }) => (
          <button
            key={tab.type === "page" ? tab.pageId : tab.template}
            onClick={() => {
              setActiveTab(tab);
              setSelectedId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
              isActiveTab(tab)
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Builder body */}
      {activeTab.type === "page" && currentPage ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 overflow-hidden">
            <SectionSidebar onAdd={addSection} sidebarPrefix={SIDEBAR_PREFIX} />

            <div
              className="flex-1 overflow-y-auto bg-neutral-100 p-8"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedId(null);
              }}
            >
              <div className="mx-auto max-w-3xl">
                <CanvasDropZone
                  sections={currentPage.sections}
                  selectedId={selectedId}
                  onSelect={selectSection}
                  onRemove={removeSection}
                  onUpdate={updateSection}
                  isEmpty={currentPage.sections.length === 0}
                />
              </div>
            </div>

            {selectedSection && (
              <SectionEditor
                key={selectedSection.id}
                section={selectedSection}
                onUpdate={updateSection}
                onUpdateStyle={updateSectionStyle}
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
      ) : activeTab.type === "template" ? (
        <TemplateView
          template={activeTab.template}
          config={config}
          onUpdateListing={updateListingSettings}
          onUpdateDetail={updateDetailSettings}
          onUpdateCheckout={updateCheckoutSettings}
        />
      ) : null}
    </div>
  );
}

/* ─── Canvas Drop Zone ─── */

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

/* ─── Template View ─── */

function TemplateView({
  template,
  config,
  onUpdateListing,
  onUpdateDetail,
  onUpdateCheckout,
}: {
  template: "listing" | "detail" | "checkout";
  config: SiteConfig;
  onUpdateListing: (u: Partial<ListingPageSettings>) => void;
  onUpdateDetail: (u: Partial<DetailPageSettings>) => void;
  onUpdateCheckout: (u: Partial<CheckoutPageSettings>) => void;
}) {
  switch (template) {
    case "listing":
      return (
        <ListingTemplateEditor
          settings={config.templates.listing}
          onUpdate={onUpdateListing}
        />
      );
    case "detail":
      return (
        <DetailTemplateEditor
          settings={config.templates.detail}
          onUpdate={onUpdateDetail}
        />
      );
    case "checkout":
      return (
        <CheckoutTemplateEditor
          settings={config.templates.checkout}
          onUpdate={onUpdateCheckout}
        />
      );
  }
}
