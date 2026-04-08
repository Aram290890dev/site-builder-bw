import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
import { getHeadingStyle, getButtonStyle } from "./section-renderer";
import Link from "next/link";

interface Props {
  section: Section;
  accent: string;
  textColor?: string;
  wrapperStyle: CSSProperties;
  siteSubdomain: string;
}

export function HeroSection({ section, accent, textColor, wrapperStyle, siteSubdomain }: Props) {
  const title = section.data.title as string;
  const subtitle = section.data.subtitle as string;
  const ctaText = section.data.ctaText as string;
  const bgImage = section.style?.backgroundImage;
  const overlay = section.style?.backgroundOverlay ?? 0.4;
  const headingStyle = getHeadingStyle(section.style);
  const buttonStyle = getButtonStyle(section.style, accent);

  return (
    <section
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden"
      style={{
        backgroundColor: section.style?.backgroundColor ?? "#0f172a",
        ...wrapperStyle,
      }}
    >
      {bgImage && (
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlay})` }} />
      )}
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
        <h1
          className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          style={{ color: textColor ?? "#ffffff", ...headingStyle }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mx-auto mt-4 max-w-xl text-lg sm:text-xl"
            style={{ color: textColor ? `${textColor}bb` : "#94a3b8" }}
          >
            {subtitle}
          </p>
        )}
        {ctaText && (
          <Link
            href={`/site/${siteSubdomain}/properties`}
            className="mt-8 inline-block font-semibold transition-transform hover:scale-105"
            style={{
              backgroundColor: accent,
              color: "#ffffff",
              borderRadius: "9999px",
              padding: "0.75rem 2rem",
              ...buttonStyle,
            }}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
