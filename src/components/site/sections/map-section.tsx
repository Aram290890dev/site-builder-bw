import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
import { MapPin } from "lucide-react";

interface Props {
  section: Section;
  accent: string;
  textColor?: string;
  wrapperStyle: CSSProperties;
}

export function MapSection({ section, accent, textColor, wrapperStyle }: Props) {
  const title = section.data.title as string;

  return (
    <section className="py-16" style={wrapperStyle}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-3xl font-bold" style={{ color: textColor, textAlign: "inherit" }}>
          {title}
        </h2>
        <div className="flex h-72 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
          <div className="text-center text-neutral-400">
            <MapPin className="mx-auto size-10" />
            <p className="mt-2 text-sm">Interactive map coming soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
