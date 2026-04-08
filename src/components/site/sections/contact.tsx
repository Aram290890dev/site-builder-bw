"use client";

import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
import { getHeadingStyle, getButtonStyle } from "./section-renderer";

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
  const address = section.data.address as string | undefined;

  return (
    <section className="py-16" style={wrapperStyle}>
      <div className="mx-auto max-w-xl px-6">
        <h2 className="mb-2 text-3xl font-bold" style={{ color: textColor, textAlign: "inherit", ...getHeadingStyle(section.style) }}>
          {title}
        </h2>
        {/* Contact info bar */}
        {(email || phone || address) && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: textColor ? `${textColor}99` : "#737373" }}>
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {address && <span>{address}</span>}
          </div>
        )}
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
            className="w-full py-3 text-sm font-semibold transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: accent, color: "#ffffff", borderRadius: "0.5rem", ...getButtonStyle(section.style, accent) }}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
