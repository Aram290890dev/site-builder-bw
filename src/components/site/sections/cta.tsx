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

export function CTASection({ section, accent, textColor, wrapperStyle, siteSubdomain }: Props) {
  const title = section.data.title as string;
  const subtitle = section.data.subtitle as string;
  const buttonText = section.data.buttonText as string;
  const headingStyle = getHeadingStyle(section.style);
  const buttonStyle = getButtonStyle(section.style, accent);

  return (
    <section
      className="py-20"
      style={{
        backgroundColor: section.style?.backgroundColor ?? "#0f172a",
        ...wrapperStyle,
      }}
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          className="text-3xl font-bold sm:text-4xl"
          style={{ color: textColor ?? "#ffffff", ...headingStyle }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mx-auto mt-3 max-w-md text-lg"
            style={{ color: textColor ? `${textColor}99` : "#94a3b8" }}
          >
            {subtitle}
          </p>
        )}
        {buttonText && (
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
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
