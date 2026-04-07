import type { CSSProperties } from "react";
import type { Section } from "@/types/builder";
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
          style={{ color: textColor ?? "#ffffff" }}
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
            className="mt-8 inline-block rounded-full px-8 py-3 text-base font-semibold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: accent }}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
