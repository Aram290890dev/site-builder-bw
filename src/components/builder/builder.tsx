"use client";

import { useState, useCallback, useEffect } from "react";
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
  SiteTheme,
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
import { ThemeEditor } from "./theme-editor";
import { ListingTemplateEditor } from "./template-editors/listing-editor";
import { DetailTemplateEditor } from "./template-editors/detail-editor";
import { CheckoutTemplateEditor } from "./template-editors/checkout-editor";
import { PageManager } from "./page-manager";
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
  Palette,
  Monitor,
  Tablet,
  Smartphone,
  X,
} from "lucide-react";
import Link from "next/link";
import type { BuilderPage } from "@/types/builder";

const SIDEBAR_PREFIX = "sidebar-";

type PreviewDevice = "desktop" | "tablet" | "mobile";

const DEVICE_CONFIG = {
  desktop: { maxWidth: "100%", icon: Monitor, label: "Desktop" },
  tablet: { maxWidth: "768px", icon: Tablet, label: "Tablet" },
  mobile: { maxWidth: "375px", icon: Smartphone, label: "Mobile" },
} as const;

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
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");

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

  const duplicateSection = useCallback(
    (sectionId: string) => {
      if (!currentPage) return;
      setConfig((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => {
          if (p.id !== currentPage.id) return p;
          const idx = p.sections.findIndex((s) => s.id === sectionId);
          if (idx === -1) return p;
          const original = p.sections[idx];
          const clone: Section = {
            ...JSON.parse(JSON.stringify(original)),
            id: `${original.type}-${Date.now()}`,
          };
          const updated = [...p.sections];
          updated.splice(idx + 1, 0, clone);
          return { ...p, sections: updated };
        }),
      }));
      setSaved(false);
    },
    [currentPage]
  );

  const toggleHideSection = useCallback(
    (sectionId: string) => {
      setConfig((prev) => ({
        ...prev,
        pages: prev.pages.map((p) => ({
          ...p,
          sections: p.sections.map((s) =>
            s.id === sectionId
              ? { ...s, style: { ...s.style, hidden: !s.style?.hidden } }
              : s
          ),
        })),
      }));
      setSaved(false);
    },
    []
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

  const updateTheme = useCallback(
    (updates: Partial<SiteTheme>) => {
      setConfig((prev) => ({
        ...prev,
        theme: { ...prev.theme, ...updates },
      }));
      setSaved(false);
    },
    []
  );

  const selectSection = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setShowThemeEditor(false);
  }, []);

  const addPage = useCallback((page: BuilderPage) => {
    setConfig((prev) => ({ ...prev, pages: [...prev.pages, page] }));
    setActiveTab({ type: "page", pageId: page.id });
    setSelectedId(null);
    setSaved(false);
  }, []);

  const renamePage = useCallback((pageId: string, newName: string) => {
    setConfig((prev) => ({
      ...prev,
      pages: prev.pages.map((p) =>
        p.id === pageId ? { ...p, name: newName } : p
      ),
    }));
    setSaved(false);
  }, []);

  const deletePage = useCallback(
    (pageId: string) => {
      setConfig((prev) => ({
        ...prev,
        pages: prev.pages.filter((p) => p.id !== pageId),
      }));
      if (activeTab.type === "page" && activeTab.pageId === pageId) {
        setActiveTab({ type: "page", pageId: config.pages[0]?.id ?? "home" });
      }
      setSelectedId(null);
      setSaved(false);
    },
    [activeTab, config.pages]
  );

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

  const themeAccent = config.theme.primaryColor ?? "#4f46e5";
  const themeBodyBg = config.theme.bodyBgColor ?? "#ffffff";
  const themeFont = config.theme.fontFamily ?? "Inter";
  const themeHeadingFont = config.theme.headingFont ?? themeFont;

  useEffect(() => {
    const families = new Set<string>();
    for (const f of [themeFont, themeHeadingFont]) {
      if (f && f !== "system-ui") families.add(f.replace(/ /g, "+"));
    }
    if (families.size === 0) return;
    const id = "builder-google-fonts";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    const href = `https://fonts.googleapis.com/css2?${[...families].map((f) => `family=${f}:wght@400;500;600;700`).join("&")}&display=swap`;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [themeFont, themeHeadingFont]);

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

        {/* Device preview toggle */}
        <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
          {(["desktop", "tablet", "mobile"] as const).map((device) => {
            const { icon: DeviceIcon, label } = DEVICE_CONFIG[device];
            return (
              <button
                key={device}
                onClick={() => setPreviewDevice(device)}
                title={label}
                className={`flex items-center justify-center rounded-md px-2 py-1 transition-all ${
                  previewDevice === device
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <DeviceIcon className="size-4" />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowThemeEditor((v) => !v); setSelectedId(null); }}
            className={showThemeEditor ? "border-indigo-300 bg-indigo-50 text-indigo-700" : ""}
          >
            <Palette className="mr-1.5 size-3.5" />
            Theme
          </Button>
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

      {/* Page navigation */}
      <div className="flex items-center border-b border-neutral-200 bg-white px-4 py-2">
        {/* Pages group */}
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-300">Pages</span>
          {config.pages.map((p) => (
            <PageTab
              key={p.id}
              page={p}
              isActive={activeTab.type === "page" && activeTab.pageId === p.id}
              isHome={p.slug === "/"}
              onSelect={() => { setActiveTab({ type: "page", pageId: p.id }); setSelectedId(null); }}
              onRename={(name) => renamePage(p.id, name)}
              onDelete={() => deletePage(p.id)}
            />
          ))}
          <PageManager existingPages={config.pages} onAddPage={addPage} />
        </div>

        {/* Divider */}
        <div className="mx-4 h-5 w-px bg-neutral-200" />

        {/* Templates group */}
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-300">Templates</span>
          {([
            { template: "listing" as const, label: "Listings", icon: LayoutGrid },
            { template: "detail" as const, label: "Property Detail", icon: FileText },
            { template: "checkout" as const, label: "Checkout", icon: ShoppingCart },
          ]).map(({ template, label, icon: Icon }) => (
            <button
              key={template}
              onClick={() => { setActiveTab({ type: "template", template }); setSelectedId(null); }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                activeTab.type === "template" && activeTab.template === template
                  ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
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
              className="flex-1 overflow-y-auto p-8 transition-colors"
              style={{
                backgroundColor: previewDevice !== "desktop" ? "#e5e5e5" : (themeBodyBg === "#ffffff" ? "#f5f5f5" : themeBodyBg),
                fontFamily: `'${themeFont}', system-ui, sans-serif`,
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedId(null);
              }}
            >
              <div
                className="mx-auto transition-all duration-300 ease-in-out"
                style={{
                  maxWidth: DEVICE_CONFIG[previewDevice].maxWidth,
                  backgroundColor: previewDevice !== "desktop" ? (themeBodyBg === "#ffffff" ? "#f5f5f5" : themeBodyBg) : undefined,
                  borderRadius: previewDevice !== "desktop" ? "12px" : undefined,
                  boxShadow: previewDevice !== "desktop" ? "0 4px 24px rgba(0,0,0,0.12)" : undefined,
                  minHeight: previewDevice !== "desktop" ? "70vh" : undefined,
                  padding: previewDevice !== "desktop" ? "0" : undefined,
                  overflow: previewDevice !== "desktop" ? "hidden" : undefined,
                }}
              >
                <CanvasDropZone
                  sections={currentPage.sections}
                  selectedId={selectedId}
                  themeAccent={themeAccent}
                  onSelect={selectSection}
                  onRemove={removeSection}
                  onDuplicate={duplicateSection}
                  onToggleHide={toggleHideSection}
                  onUpdate={updateSection}
                  isEmpty={currentPage.sections.length === 0}
                />
              </div>
            </div>

            {showThemeEditor ? (
              <ThemeEditor
                theme={config.theme}
                onUpdate={updateTheme}
                onClose={() => setShowThemeEditor(false)}
              />
            ) : selectedSection ? (
              <SectionEditor
                key={selectedSection.id}
                section={selectedSection}
                onUpdate={updateSection}
                onUpdateStyle={updateSectionStyle}
                onClose={() => setSelectedId(null)}
              />
            ) : null}
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
        <div
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: previewDevice !== "desktop" ? "#e5e5e5" : undefined,
          }}
        >
          <div
            className="mx-auto transition-all duration-300 ease-in-out"
            style={{
              maxWidth: DEVICE_CONFIG[previewDevice].maxWidth,
              backgroundColor: previewDevice !== "desktop" ? "#fff" : undefined,
              borderRadius: previewDevice !== "desktop" ? "12px" : undefined,
              boxShadow: previewDevice !== "desktop" ? "0 4px 24px rgba(0,0,0,0.12)" : undefined,
              minHeight: previewDevice !== "desktop" ? "70vh" : undefined,
              overflow: previewDevice !== "desktop" ? "hidden" : undefined,
              margin: previewDevice !== "desktop" ? "2rem auto" : undefined,
            }}
          >
            <TemplateView
              template={activeTab.template}
              config={config}
              onUpdateListing={updateListingSettings}
              onUpdateDetail={updateDetailSettings}
              onUpdateCheckout={updateCheckoutSettings}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ─── Canvas Drop Zone ─── */

function CanvasDropZone({
  sections,
  selectedId,
  themeAccent,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleHide,
  onUpdate,
  isEmpty,
}: {
  sections: Section[];
  selectedId: string | null;
  themeAccent?: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleHide: (id: string) => void;
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
                themeAccent={themeAccent}
                onSelect={onSelect}
                onRemove={onRemove}
                onDuplicate={onDuplicate}
                onToggleHide={onToggleHide}
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

/* ─── Page Tab (pill style, double-click to rename, hover X to delete) ─── */

function PageTab({
  page,
  isActive,
  isHome,
  onSelect,
  onRename,
  onDelete,
}: {
  page: BuilderPage;
  isActive: boolean;
  isHome: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [nameValue, setNameValue] = useState(page.name);

  function commitRename() {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== page.name) {
      onRename(trimmed);
    }
    setRenaming(false);
  }

  if (renaming) {
    return (
      <input
        autoFocus
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitRename();
          if (e.key === "Escape") { setNameValue(page.name); setRenaming(false); }
        }}
        className="w-24 rounded-lg border border-indigo-300 bg-white px-2.5 py-1.5 text-xs font-medium outline-none ring-2 ring-indigo-100"
      />
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        onDoubleClick={(e) => {
          if (isHome) return;
          e.preventDefault();
          setNameValue(page.name);
          setRenaming(true);
        }}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
          isActive
            ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
            : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
        } ${!isHome ? "pr-6" : ""}`}
      >
        {isHome && <Home className="size-3.5" />}
        {page.name}
      </button>

      {!isHome && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute right-1 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
          title="Remove page"
        >
          <X className="size-3 text-neutral-400 hover:text-red-600" />
        </button>
      )}
    </div>
  );
}
