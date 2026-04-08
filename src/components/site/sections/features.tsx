import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
import { getHeadingStyle } from "./section-renderer";
import { Check } from "lucide-react";

interface Props {
  section: Section;
  accent: string;
  textColor?: string;
  wrapperStyle: CSSProperties;
}

export function FeaturesSection({ section, accent, textColor, wrapperStyle }: Props) {
  const title = section.data.title as string;
  const items = (section.data.items as string[]) ?? [];

  return (
    <section className="py-16" style={wrapperStyle}>
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-8 text-3xl font-bold" style={{ color: textColor, textAlign: "inherit", ...getHeadingStyle(section.style) }}>
          {title}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3 shadow-sm"
            >
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${accent}15` }}
              >
                <Check className="size-4" style={{ color: accent }} />
              </div>
              <span className="text-sm font-medium" style={{ color: textColor ?? "#374151" }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
