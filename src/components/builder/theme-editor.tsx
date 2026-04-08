"use client";

import type { SiteTheme } from "@/types/builder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter", style: "'Inter', sans-serif" },
  { value: "DM Sans", label: "DM Sans", style: "'DM Sans', sans-serif" },
  { value: "Poppins", label: "Poppins", style: "'Poppins', sans-serif" },
  { value: "Space Grotesk", label: "Space Grotesk", style: "'Space Grotesk', sans-serif" },
  { value: "Outfit", label: "Outfit", style: "'Outfit', sans-serif" },
  { value: "Playfair Display", label: "Playfair Display", style: "'Playfair Display', serif" },
  { value: "Lora", label: "Lora", style: "'Lora', serif" },
  { value: "Merriweather", label: "Merriweather", style: "'Merriweather', serif" },
  { value: "JetBrains Mono", label: "JetBrains Mono", style: "'JetBrains Mono', monospace" },
  { value: "system-ui", label: "System Default", style: "system-ui, sans-serif" },
];

const ACCENT_PRESETS = [
  "#4f46e5", "#2563eb", "#0891b2", "#059669",
  "#d97706", "#dc2626", "#9333ea", "#e11d48",
  "#171717", "#6366f1",
];

interface Props {
  theme: SiteTheme;
  onUpdate: (updates: Partial<SiteTheme>) => void;
  onClose: () => void;
}

export function ThemeEditor({ theme, onUpdate, onClose }: Props) {
  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Site Theme</h3>
          <p className="text-xs text-neutral-400">Global visual settings</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Colors */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Colors</div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Primary / Accent Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor ?? "#4f46e5"}
                onChange={(e) => onUpdate({ primaryColor: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded-lg border border-neutral-200"
              />
              <Input
                value={theme.primaryColor ?? "#4f46e5"}
                onChange={(e) => onUpdate({ primaryColor: (e.target as HTMLInputElement).value })}
                className="flex-1 font-mono text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ACCENT_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdate({ primaryColor: c })}
                  className={`size-7 rounded-md border transition-transform hover:scale-110 ${
                    theme.primaryColor === c ? "border-indigo-500 ring-2 ring-indigo-200" : "border-neutral-200"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Body Background</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.bodyBgColor ?? "#ffffff"}
                onChange={(e) => onUpdate({ bodyBgColor: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded-lg border border-neutral-200"
              />
              <Input
                value={theme.bodyBgColor ?? "#ffffff"}
                onChange={(e) => onUpdate({ bodyBgColor: (e.target as HTMLInputElement).value })}
                className="flex-1 font-mono text-xs"
              />
            </div>
            <div className="flex gap-1.5">
              {["#ffffff", "#fafafa", "#f5f5f4", "#fef3c7", "#ecfdf5", "#eff6ff", "#fdf4ff", "#171717"].map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdate({ bodyBgColor: c })}
                  className={`size-7 rounded-md border transition-transform hover:scale-110 ${
                    (theme.bodyBgColor ?? "#ffffff") === c ? "border-indigo-500 ring-2 ring-indigo-200" : "border-neutral-200"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Typography */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Typography</div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Body Font</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onUpdate({ fontFamily: f.value })}
                  className={`rounded-lg border px-2.5 py-2 text-left text-[11px] transition-colors ${
                    (theme.fontFamily ?? "Inter") === f.value
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                  style={{ fontFamily: f.style }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Heading Font</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onUpdate({ headingFont: f.value })}
                  className={`rounded-lg border px-2.5 py-2 text-left text-[11px] font-semibold transition-colors ${
                    (theme.headingFont ?? theme.fontFamily ?? "Inter") === f.value
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                  style={{ fontFamily: f.style }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Navbar */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Navbar</div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Style</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["light", "dark", "transparent"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onUpdate({ navStyle: v })}
                  className={`flex h-14 flex-col items-center justify-center gap-1 rounded-lg border text-[10px] font-medium transition-colors ${
                    (theme.navStyle ?? "light") === v
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <div
                    className="h-4 w-10 rounded-sm border"
                    style={{
                      backgroundColor: v === "light" ? "#fff" : v === "dark" ? "#171717" : "transparent",
                      borderColor: v === "transparent" ? "#d4d4d4" : v === "dark" ? "#333" : "#e5e5e5",
                      borderStyle: v === "transparent" ? "dashed" : "solid",
                    }}
                  />
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Logo Size</Label>
            <div className="flex gap-1.5">
              {(["sm", "md", "lg"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onUpdate({ navLogoSize: v })}
                  className={`flex h-8 flex-1 items-center justify-center rounded-md border text-[10px] font-medium transition-colors ${
                    (theme.navLogoSize ?? "md") === v
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Footer</div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Style</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["minimal", "centered", "columns"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onUpdate({ footerStyle: v })}
                  className={`flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg border text-[10px] font-medium transition-colors ${
                    (theme.footerStyle ?? "minimal") === v
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  {v === "minimal" && <div className="flex w-8 items-center justify-between"><div className="h-1 w-3 rounded-full bg-current opacity-40" /><div className="h-1 w-2 rounded-full bg-current opacity-40" /></div>}
                  {v === "centered" && <div className="flex flex-col items-center gap-0.5"><div className="h-1 w-4 rounded-full bg-current opacity-40" /><div className="h-1 w-6 rounded-full bg-current opacity-40" /></div>}
                  {v === "columns" && <div className="flex gap-1"><div className="h-3 w-2 rounded-sm bg-current opacity-20" /><div className="h-3 w-2 rounded-sm bg-current opacity-20" /><div className="h-3 w-2 rounded-sm bg-current opacity-20" /></div>}
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Background Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.footerBgColor ?? "#ffffff"}
                onChange={(e) => onUpdate({ footerBgColor: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded border border-neutral-200"
              />
              <Input
                value={theme.footerBgColor ?? "#ffffff"}
                onChange={(e) => onUpdate({ footerBgColor: (e.target as HTMLInputElement).value })}
                className="flex-1 font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Text Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.footerTextColor ?? "#a3a3a3"}
                onChange={(e) => onUpdate({ footerTextColor: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded border border-neutral-200"
              />
              <Input
                value={theme.footerTextColor ?? "#a3a3a3"}
                onChange={(e) => onUpdate({ footerTextColor: (e.target as HTMLInputElement).value })}
                className="flex-1 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Global Rounding */}
        <div className="space-y-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Global Rounding</div>
          <div className="space-y-2">
            <Label className="text-xs text-neutral-500">Corner Radius</Label>
            <div className="flex gap-1.5">
              {(["none", "sm", "md", "lg"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onUpdate({ borderRadius: v })}
                  className={`flex h-8 flex-1 items-center justify-center rounded-md border text-[10px] font-medium transition-colors ${
                    (theme.borderRadius ?? "md") === v
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <div
                    className="size-4 border-2 border-current"
                    style={{ borderRadius: { none: 0, sm: 2, md: 4, lg: 8 }[v] }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
