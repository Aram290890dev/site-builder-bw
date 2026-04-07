"use client";

import type { Section, SectionType } from "@/types/builder";
import { SECTION_DEFINITIONS } from "@/types/builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Trash2 } from "lucide-react";

interface SectionEditorProps {
  section: Section;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onClose: () => void;
}

export function SectionEditor({ section, onUpdate, onClose }: SectionEditorProps) {
  const def = SECTION_DEFINITIONS[section.type];

  function update(key: string, value: unknown) {
    onUpdate(section.id, { [key]: value });
  }

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">{def.label}</h3>
          <p className="text-xs text-neutral-400">Edit section content</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <EditorFields section={section} update={update} />
      </div>
    </div>
  );
}

function EditorFields({
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
      <Field
        label="Background Image URL"
        value={(data.backgroundImage as string) ?? ""}
        onChange={(v) => update("backgroundImage", v)}
        placeholder="https://..."
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

  function addImage() {
    update("images", [...images, ""]);
  }

  function updateImage(index: number, value: string) {
    const updated = [...images];
    updated[index] = value;
    update("images", updated);
  }

  function removeImage(index: number) {
    update("images", images.filter((_, i) => i !== index));
  }

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
              onChange={(e) => updateImage(i, (e.target as HTMLInputElement).value)}
              placeholder="Image URL"
              className="flex-1"
            />
            <button
              onClick={() => removeImage(i)}
              className="rounded p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addImage} className="w-full">
          <Plus className="mr-1.5 size-3.5" />
          Add Image
        </Button>
      </div>
    </div>
  );
}

function TestimonialsEditor({ data, update }: EditorProps) {
  const items = (data.items as Array<{ name: string; text: string; rating: number }>) ?? [];

  function addItem() {
    update("items", [...items, { name: "", text: "", rating: 5 }]);
  }

  function updateItem(index: number, field: string, value: unknown) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    update("items", updated);
  }

  function removeItem(index: number) {
    update("items", items.filter((_, i) => i !== index));
  }

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
        <div key={i} className="space-y-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium text-neutral-500">Review {i + 1}</span>
            <button
              onClick={() => removeItem(i)}
              className="rounded p-1 text-neutral-400 hover:text-red-500"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
          <Input
            value={item.name}
            onChange={(e) => updateItem(i, "name", (e.target as HTMLInputElement).value)}
            placeholder="Guest name"
          />
          <textarea
            value={item.text}
            onChange={(e) => updateItem(i, "text", e.target.value)}
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
                  onClick={() => updateItem(i, "rating", n)}
                  className={`text-lg ${n <= item.rating ? "text-amber-400" : "text-neutral-200"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
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

  function addItem() {
    update("items", [...items, ""]);
  }

  function updateItem(index: number, value: string) {
    const updated = [...items];
    updated[index] = value;
    update("items", updated);
  }

  function removeItem(index: number) {
    update("items", items.filter((_, i) => i !== index));
  }

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
            onChange={(e) => updateItem(i, (e.target as HTMLInputElement).value)}
            placeholder="e.g. Swimming Pool"
            className="flex-1"
          />
          <button
            onClick={() => removeItem(i)}
            className="rounded p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
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
