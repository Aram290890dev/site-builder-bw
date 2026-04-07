"use client";

import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";

interface Props {
  section: Section;
  accent: string;
  textColor?: string;
  wrapperStyle: CSSProperties;
}

export function ContactSection({ section, accent, textColor, wrapperStyle }: Props) {
  const title = section.data.title as string;
  const email = section.data.email as string;
  const phone = section.data.phone as string;

  return (
    <section className="py-16" style={wrapperStyle}>
      <div className="mx-auto max-w-xl px-6">
        <h2 className="mb-8 text-center text-3xl font-bold" style={{ color: textColor }}>
          {title}
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name"
              className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400"
            />
            <input
              type="email"
              placeholder={email || "Email address"}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400"
            />
          </div>
          {phone && (
            <input
              type="tel"
              placeholder={phone}
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400"
            />
          )}
          <textarea
            placeholder="Your message..."
            rows={5}
            className="w-full resize-none rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-400"
          />
          <button
            type="submit"
            className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: accent }}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
