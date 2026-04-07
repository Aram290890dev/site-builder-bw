"use client";

import type { CheckoutPageSettings } from "@/types/builder";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Props {
  settings: CheckoutPageSettings;
  onUpdate: (updates: Partial<CheckoutPageSettings>) => void;
}

const RADIUS_MAP: Record<string, string> = { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem" };

export function CheckoutTemplateEditor({ settings, onUpdate }: Props) {
  const radius = RADIUS_MAP[settings.cardRadius];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Settings */}
      <div className="w-80 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white p-4 space-y-5">
        <div>
          <h3 className="text-sm font-semibold">Checkout Page</h3>
          <p className="text-xs text-neutral-400">Customize the booking checkout flow</p>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Flow Style</Label>
          <div className="flex gap-2">
            {(["single-page", "multi-step"] as const).map((v) => (
              <button key={v} onClick={() => onUpdate({ style: v })} className={`flex-1 rounded-lg border py-2 text-xs font-medium capitalize transition-colors ${settings.style === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                {v.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Card Corners</Label>
          <div className="flex gap-2">
            {(["none", "sm", "md", "lg"] as const).map((v) => (
              <button key={v} onClick={() => onUpdate({ cardRadius: v })} className={`flex-1 rounded-lg border py-1.5 text-[10px] font-medium uppercase transition-colors ${settings.cardRadius === v ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-neutral-200 text-neutral-500"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Show / Hide</Label>
          {([
            { key: "showOrderSummary", label: "Order Summary" },
            { key: "showPropertyImage", label: "Property Image" },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-xs text-neutral-600">{label}</span>
              <input type="checkbox" checked={settings[key]} onChange={(e) => onUpdate({ [key]: e.target.checked })} className="h-4 w-4 rounded border-neutral-300 accent-indigo-600" />
            </label>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs text-neutral-500 font-semibold">Colors</Label>
          {([
            { key: "bgColor", label: "Background" },
            { key: "accentColor", label: "Accent / Button" },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <input type="color" value={settings[key]} onChange={(e) => onUpdate({ [key]: e.target.value })} className="h-7 w-7 cursor-pointer rounded border border-neutral-200" />
              <span className="flex-1 text-xs text-neutral-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: settings.bgColor }}>
        <div className="mx-auto max-w-3xl">
          {settings.style === "multi-step" && (
            <div className="mb-8 flex items-center justify-center gap-4">
              {["Dates", "Guest Info", "Confirm"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? settings.accentColor : "#d4d4d4" }}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium" style={{ color: i === 0 ? settings.accentColor : "#a3a3a3" }}>{step}</span>
                  {i < 2 && <div className="h-px w-8 bg-neutral-200" />}
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4" style={{ borderRadius: radius }}>
                <h2 className="text-lg font-semibold">Guest Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  {["First Name", "Last Name", "Email", "Phone"].map((f) => (
                    <div key={f} className="space-y-1">
                      <label className="text-xs text-neutral-500">{f}</label>
                      <div className="h-9 rounded-lg border border-neutral-200 bg-neutral-50" style={{ borderRadius: RADIUS_MAP[settings.cardRadius] }} />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-500">Special Requests</label>
                  <div className="h-20 rounded-lg border border-neutral-200 bg-neutral-50" style={{ borderRadius: RADIUS_MAP[settings.cardRadius] }} />
                </div>
              </div>

              <button className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ backgroundColor: settings.accentColor, borderRadius: radius }}>
                Confirm Booking
              </button>
            </div>

            {/* Summary */}
            {settings.showOrderSummary && (
              <div className="lg:col-span-2">
                <div className="sticky top-4 rounded-xl border border-neutral-200 bg-white p-5 space-y-4" style={{ borderRadius: radius }}>
                  <h3 className="text-sm font-semibold">Booking Summary</h3>
                  {settings.showPropertyImage && (
                    <div className="h-32 rounded-lg bg-neutral-200 flex items-center justify-center text-xs text-neutral-400" style={{ borderRadius: RADIUS_MAP[settings.cardRadius] }}>
                      Property Photo
                    </div>
                  )}
                  <div className="text-sm font-medium">The Clifftop Villa</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-neutral-500">Check-in</span><span>Jun 15, 2026</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Check-out</span><span>Jun 18, 2026</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">Guests</span><span>4</span></div>
                    <Separator />
                    <div className="flex justify-between"><span className="text-neutral-500">€450 x 3 nights</span><span>€1,350</span></div>
                    <div className="flex justify-between font-semibold text-sm"><span>Total</span><span>€1,350</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
