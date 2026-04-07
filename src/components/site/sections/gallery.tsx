import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
import { Images } from "lucide-react";

interface Props {
  section: Section;
  textColor?: string;
  wrapperStyle: CSSProperties;
}

export function GallerySection({ section, textColor, wrapperStyle }: Props) {
  const title = section.data.title as string;
  const images = (section.data.images as string[]) ?? [];

  return (
    <section className="py-16" style={wrapperStyle}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: textColor }}>
          {title}
        </h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl">
                <img src={src} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200">
            <div className="text-center text-neutral-400">
              <Images className="mx-auto size-8" />
              <p className="mt-2 text-sm">Gallery images will appear here</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
