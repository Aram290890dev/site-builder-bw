import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
import { Quote } from "lucide-react";

interface Props {
  section: Section;
  accent: string;
  textColor?: string;
  wrapperStyle: CSSProperties;
}

export function TestimonialsSection({ section, accent, textColor, wrapperStyle }: Props) {
  const title = section.data.title as string;
  const items = (section.data.items as Array<{ name: string; text: string; rating: number }>) ?? [];

  return (
    <section className="py-16" style={wrapperStyle}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold" style={{ color: textColor }}>
          {title}
        </h2>
        {items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm">
                <Quote className="mb-3 size-6" style={{ color: `${accent}66` }} />
                <p className="text-base leading-relaxed" style={{ color: textColor ? `${textColor}cc` : "#525252" }}>
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: textColor ?? "#171717" }}>
                    {item.name}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={`text-sm ${n <= item.rating ? "text-amber-400" : "text-neutral-200"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400">No reviews yet.</p>
        )}
      </div>
    </section>
  );
}
