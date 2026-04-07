"use client";

import { useState } from "react";
import type { Section, SectionStyle } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Paintbrush,
} from "lucide-react";

interface SectionEditorProps {
  section: Section;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onUpdateStyle: (id: string, style: Partial<SectionStyle>) => void;
  onClose: () => void;
}

export function SectionEditor({
  section,
  onUpdate,
  onUpdateStyle,
  onClose,
}: SectionEditorProps) {
  const [tab, setTab] = useState<"content" | "style">("content");
  const def = SECTION_DEFINITIONS[section.type];

  function updateData(key: string, value: unknown) {
    onUpdate(section.id, { [key]: value });
  }

  function updateStyle(updates: Partial<SectionStyle>) {
    onUpdateStyle(section.id, updates);
  }

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">{def.label}</h3>
          <p className="text-xs text-neutral-400">Edit section</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100">
        <button
          onClick={() => setTab("content")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            tab === "content"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          <Type className="size-3.5" />
          Content
        </button>
        <button
          onClick={() => setTab("style")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            tab === "style"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          <Paintbrush className="size-3.5" />
          Style
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "content" ? (
          <ContentEditor section={section} update={updateData} />
        ) : (
          <StyleEditor style={section.style ?? {}} update={updateStyle} />
        )}
      </div>
    </div>
  );
}

/* ─── Style Editor ─── */

const PRESET_COLORS = [
  "#ffffff", "#f5f5f5", "#e5e5e5", "#171717",
  "#1e1b4b", "#312e81", "#4f46e5", "#818cf8",
  "#ecfdf5", "#059669", "#10b981", "#6ee7b7",
  "#fef3c7", "#d97706", "#f59e0b", "#fbbf24",
  "#fef2f2", "#dc2626", "#ef4444", "#fca5a5",
  "#eff6ff", "#2563eb", "#3b82f6", "#93c5fd",
  "#fdf4ff", "#9333ea", "#a855f7", "#d8b4fe",
];

const PADDING_OPTIONS = [
  { value: "sm", label: "S", px: "py-4" },
  { value: "md", label: "M", px: "py-8" },
  { value: "lg", label: "L", px: "py-12" },
  { value: "xl", label: "XL", px: "py-20" },
] as const;

const RADIUS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
] as const;

function StyleEditor({
  style,
  update,
}: {
  style: SectionStyle;
  update: (s: Partial<SectionStyle>) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Background Color */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Background Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={style.backgroundColor ?? "#ffffff"}
            onChange={(e) => update({ backgroundColor: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded-lg border border-neutral-200"
          />
          <Input
            value={style.backgroundColor ?? "#ffffff"}
            onChange={(e) =>
              update({ backgroundColor: (e.target as HTMLInputElement).value })
            }
            className="flex-1 font-mono text-xs"
          />
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => update({ backgroundColor: color })}
              className={`size-7 rounded-md border transition-transform hover:scale-110 ${
                style.backgroundColor === color
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-neutral-200"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Text Color */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Text Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={style.textColor ?? "#171717"}
            onChange={(e) => update({ textColor: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded-lg border border-neutral-200"
          />
          <Input
            value={style.textColor ?? "#171717"}
            onChange={(e) =>
              update({ textColor: (e.target as HTMLInputElement).value })
            }
            className="flex-1 font-mono text-xs"
          />
        </div>
        <div className="flex gap-1.5">
          {["#171717", "#374151", "#6b7280", "#ffffff", "#e5e7eb"].map((c) => (
            <button
              key={c}
              onClick={() => update({ textColor: c })}
              className={`size-7 rounded-md border transition-transform hover:scale-110 ${
                style.textColor === c
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-neutral-200"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Accent / Button Color */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Accent / Button Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={style.accentColor ?? "#4f46e5"}
            onChange={(e) => update({ accentColor: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded-lg border border-neutral-200"
          />
          <Input
            value={style.accentColor ?? "#4f46e5"}
            onChange={(e) =>
              update({ accentColor: (e.target as HTMLInputElement).value })
            }
            className="flex-1 font-mono text-xs"
          />
        </div>
        <div className="flex gap-1.5">
          {["#4f46e5", "#2563eb", "#059669", "#d97706", "#dc2626", "#9333ea"].map(
            (c) => (
              <button
                key={c}
                onClick={() => update({ accentColor: c })}
                className={`size-7 rounded-md border transition-transform hover:scale-110 ${
                  style.accentColor === c
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-neutral-200"
                }`}
                style={{ backgroundColor: c }}
              />
            )
          )}
        </div>
      </div>

      <Separator />

      {/* Text Alignment */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Text Alignment</Label>
        <div className="flex gap-2">
          {([
            { value: "left", icon: AlignLeft },
            { value: "center", icon: AlignCenter },
            { value: "right", icon: AlignRight },
          ] as const).map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => update({ textAlign: value })}
              className={`flex h-9 flex-1 items-center justify-center rounded-lg border text-sm transition-colors ${
                (style.textAlign ?? "center") === value
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
              }`}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Padding */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Padding</Label>
        <div className="flex gap-2">
          {PADDING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ padding: opt.value })}
              className={`flex h-9 flex-1 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                (style.padding ?? "md") === opt.value
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Border Radius */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Corner Radius</Label>
        <div className="flex gap-2">
          {RADIUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ borderRadius: opt.value })}
              className={`flex h-9 flex-1 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                (style.borderRadius ?? "none") === opt.value
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Background Image */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Background Image URL</Label>
        <Input
          value={style.backgroundImage ?? ""}
          onChange={(e) =>
            update({ backgroundImage: (e.target as HTMLInputElement).value })
          }
          placeholder="https://..."
          className="text-xs"
        />
        {style.backgroundImage && (
          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">
              Overlay Opacity ({Math.round((style.backgroundOverlay ?? 0.4) * 100)}%)
            </Label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={style.backgroundOverlay ?? 0.4}
              onChange={(e) =>
                update({ backgroundOverlay: parseFloat(e.target.value) })
              }
              className="w-full accent-indigo-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Content Editor ─── */

function ContentEditor({
  section,
  update,
}: {
  section: Section;
  update: (key: string, value: unknown) => void;
}) {
  switch (section.type) {
    case "hero":
      return <HeroEditor data={section.data} update={update} />;
    case "propertyGrid":
      return <PropertyGridEditor data={section.data} update={update} />;
    case "gallery":
      return <GalleryEditor data={section.data} update={update} />;
    case "testimonials":
      return <TestimonialsEditor data={section.data} update={update} />;
    case "contact":
      return <ContactEditor data={section.data} update={update} />;
    case "map":
      return <MapEditor data={section.data} update={update} />;
    case "features":
      return <FeaturesEditor data={section.data} update={update} />;
    case "cta":
      return <CtaEditor data={section.data} update={update} />;
    default:
      return <p className="text-sm text-neutral-400">No editor available.</p>;
  }
}

type EditorProps = {
  data: Record<string, unknown>;
  update: (key: string, value: unknown) => void;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-neutral-500">{label}</Label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange((e.target as HTMLInputElement).value)}
          placeholder={placeholder}
          type={type}
        />
      )}
    </div>
  );
}

function HeroEditor({ data, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="Welcome to Our Properties"
      />
      <Field
        label="Subtitle"
        value={(data.subtitle as string) ?? ""}
        onChange={(v) => update("subtitle", v)}
        placeholder="Find your perfect stay"
      />
      <Field
        label="Button Text"
        value={(data.ctaText as string) ?? ""}
        onChange={(v) => update("ctaText", v)}
        placeholder="Browse Properties"
      />
    </div>
  );
}

function PropertyGridEditor({ data, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Section Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="Our Properties"
      />
      <div className="space-y-1.5">
        <Label className="text-xs text-neutral-500">Columns</Label>
        <div className="flex gap-2">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => update("columns", n)}
              className={`flex h-9 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                (data.columns as number) === n
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryEditor({ data, update }: EditorProps) {
  const images = (data.images as string[]) ?? [];

  return (
    <div className="space-y-4">
      <Field
        label="Section Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="Gallery"
      />
      <Separator />
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Images</Label>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={img}
              onChange={(e) => {
                const updated = [...images];
                updated[i] = (e.target as HTMLInputElement).value;
                update("images", updated);
              }}
              placeholder="Image URL"
              className="flex-1"
            />
            <button
              onClick={() => update("images", images.filter((_, j) => j !== i))}
              className="rounded p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => update("images", [...images, ""])}
          className="w-full"
        >
          <Plus className="mr-1.5 size-3.5" />
          Add Image
        </Button>
      </div>
    </div>
  );
}

function TestimonialsEditor({ data, update }: EditorProps) {
  const items =
    (data.items as Array<{ name: string; text: string; rating: number }>) ?? [];

  return (
    <div className="space-y-4">
      <Field
        label="Section Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="What Our Guests Say"
      />
      <Separator />
      <Label className="text-xs text-neutral-500">Reviews</Label>
      {items.map((item, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3"
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium text-neutral-500">
              Review {i + 1}
            </span>
            <button
              onClick={() =>
                update("items", items.filter((_, j) => j !== i))
              }
              className="rounded p-1 text-neutral-400 hover:text-red-500"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
          <Input
            value={item.name}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = { ...item, name: (e.target as HTMLInputElement).value };
              update("items", updated);
            }}
            placeholder="Guest name"
          />
          <textarea
            value={item.text}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = { ...item, text: e.target.value };
              update("items", updated);
            }}
            placeholder="Their review..."
            rows={2}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
          <div className="space-y-1">
            <Label className="text-xs text-neutral-500">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    const updated = [...items];
                    updated[i] = { ...item, rating: n };
                    update("items", updated);
                  }}
                  className={`text-lg ${
                    n <= item.rating ? "text-amber-400" : "text-neutral-200"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          update("items", [...items, { name: "", text: "", rating: 5 }])
        }
        className="w-full"
      >
        <Plus className="mr-1.5 size-3.5" />
        Add Review
      </Button>
    </div>
  );
}

function ContactEditor({ data, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Section Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="Get in Touch"
      />
      <Field
        label="Email"
        value={(data.email as string) ?? ""}
        onChange={(v) => update("email", v)}
        placeholder="hello@example.com"
        type="email"
      />
      <Field
        label="Phone"
        value={(data.phone as string) ?? ""}
        onChange={(v) => update("phone", v)}
        placeholder="+1 (555) 123-4567"
      />
      <Field
        label="Address"
        value={(data.address as string) ?? ""}
        onChange={(v) => update("address", v)}
        placeholder="123 Main St, City"
      />
    </div>
  );
}

function MapEditor({ data, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Section Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="Our Locations"
      />
      <Field
        label="Latitude"
        value={String((data.latitude as number) ?? "")}
        onChange={(v) => update("latitude", v ? parseFloat(v) : null)}
        placeholder="37.4467"
      />
      <Field
        label="Longitude"
        value={String((data.longitude as number) ?? "")}
        onChange={(v) => update("longitude", v ? parseFloat(v) : null)}
        placeholder="25.3289"
      />
    </div>
  );
}

function FeaturesEditor({ data, update }: EditorProps) {
  const items = (data.items as string[]) ?? [];

  return (
    <div className="space-y-4">
      <Field
        label="Section Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="What We Offer"
      />
      <Separator />
      <Label className="text-xs text-neutral-500">Amenities / Features</Label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = (e.target as HTMLInputElement).value;
              update("items", updated);
            }}
            placeholder="e.g. Swimming Pool"
            className="flex-1"
          />
          <button
            onClick={() => update("items", items.filter((_, j) => j !== i))}
            className="rounded p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => update("items", [...items, ""])}
        className="w-full"
      >
        <Plus className="mr-1.5 size-3.5" />
        Add Feature
      </Button>
    </div>
  );
}

function CtaEditor({ data, update }: EditorProps) {
  return (
    <div className="space-y-4">
      <Field
        label="Title"
        value={(data.title as string) ?? ""}
        onChange={(v) => update("title", v)}
        placeholder="Ready to Book?"
      />
      <Field
        label="Subtitle"
        value={(data.subtitle as string) ?? ""}
        onChange={(v) => update("subtitle", v)}
        placeholder="Reserve your stay today"
      />
      <Field
        label="Button Text"
        value={(data.buttonText as string) ?? ""}
        onChange={(v) => update("buttonText", v)}
        placeholder="Book Now"
      />
    </div>
  );
}
