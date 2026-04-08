"use client";

import { useState } from "react";
import { createProperty, updateProperty } from "./actions";
import type { PropertyFormData } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Pencil, Loader2, X } from "lucide-react";

interface Props {
  siteId: string;
  mode: "create" | "edit";
  property?: PropertyFormData & { id: string };
}

export function PropertyFormDialog({ siteId, mode, property }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(property?.name ?? "");
  const [description, setDescription] = useState(property?.description ?? "");
  const [address, setAddress] = useState(property?.address ?? "");
  const [price, setPrice] = useState(property?.price ?? 100);
  const [currency, setCurrency] = useState(property?.currency ?? "USD");
  const [maxGuests, setMaxGuests] = useState(property?.maxGuests ?? 2);
  const [amenities, setAmenities] = useState<string[]>(property?.amenities ?? []);
  const [amenityInput, setAmenityInput] = useState("");
  const [images, setImages] = useState<string[]>(property?.images ?? []);

  function reset() {
    setName(property?.name ?? "");
    setDescription(property?.description ?? "");
    setAddress(property?.address ?? "");
    setPrice(property?.price ?? 100);
    setCurrency(property?.currency ?? "USD");
    setMaxGuests(property?.maxGuests ?? 2);
    setAmenities(property?.amenities ?? []);
    setAmenityInput("");
    setImages(property?.images ?? []);
  }

  function addAmenity() {
    const val = amenityInput.trim();
    if (val && !amenities.includes(val)) {
      setAmenities([...amenities, val]);
    }
    setAmenityInput("");
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    setSaving(true);

    const data: PropertyFormData = {
      name: name.trim(),
      description: description.trim(),
      address: address.trim(),
      price,
      currency,
      maxGuests,
      amenities,
      images,
    };

    if (mode === "edit" && property?.id) {
      await updateProperty(property.id, siteId, data);
    } else {
      await createProperty(siteId, data);
    }

    setSaving(false);
    setOpen(false);
    if (mode === "create") reset();
  }

  return (
    <>
      <Button
        size="sm"
        variant={mode === "create" ? "default" : "outline"}
        className={mode === "create" ? "rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" : "rounded-lg"}
        onClick={() => { reset(); setOpen(true); }}
      >
        {mode === "create" ? (
          <>
            <Plus className="mr-1.5 size-3.5" />
            Add Property
          </>
        ) : (
          <Pencil className="size-3.5" />
        )}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] pb-[5vh]">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold">
                {mode === "create" ? "Add Property" : "Edit Property"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-neutral-400 hover:text-neutral-600">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-500">Property Name *</Label>
                  <Input value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} placeholder="e.g. Seaside Villa" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-500">Description</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the property..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-500">Address</Label>
                  <Input value={address} onChange={(e) => setAddress((e.target as HTMLInputElement).value)} placeholder="e.g. Mykonos, Greece" />
                </div>
              </div>

              <Separator />

              {/* Pricing & Capacity */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-500">Price / night *</Label>
                  <Input type="number" min={0} value={price} onChange={(e) => setPrice(Number((e.target as HTMLInputElement).value))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-500">Currency</Label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-9 w-full rounded-lg border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (\u20AC)</option>
                    <option value="GBP">GBP (\u00A3)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-neutral-500">Max Guests</Label>
                  <Input type="number" min={1} value={maxGuests} onChange={(e) => setMaxGuests(Number((e.target as HTMLInputElement).value))} />
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-500">Amenities</Label>
                <div className="flex gap-1.5">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput((e.target as HTMLInputElement).value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                    placeholder="e.g. Pool, WiFi, Kitchen..."
                    className="flex-1"
                  />
                  <Button size="sm" variant="outline" onClick={addAmenity} className="shrink-0 rounded-lg">
                    Add
                  </Button>
                </div>
                {amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {amenities.map((a) => (
                      <span key={a} className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                        {a}
                        <button onClick={() => setAmenities(amenities.filter((x) => x !== a))} className="ml-0.5 rounded-full p-0.5 hover:bg-indigo-100">
                          <X className="size-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Images */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-neutral-500">Images</Label>
                <ImageUpload value={images} onChange={setImages} maxFiles={20} />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-neutral-100 bg-white px-6 py-4 rounded-b-2xl">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button
                size="sm"
                className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={handleSubmit}
                disabled={saving || !name.trim()}
              >
                {saving && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
                {mode === "create" ? "Create Property" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
