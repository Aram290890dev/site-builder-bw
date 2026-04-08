"use client";

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
  bookNowHref: string;
  accent: string;
  borderRadius: string;
  navStyle: "light" | "dark" | "transparent";
}

export function MobileNav({ links, bookNowHref, accent, borderRadius, navStyle }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const linkColor = navStyle === "light" ? "text-neutral-700" : "text-neutral-200";
  const panelBg = navStyle === "dark" ? "bg-neutral-900" : "bg-white";
  const panelBorder = navStyle === "dark" ? "border-neutral-800" : "border-neutral-100";
  const barColor = navStyle === "light" ? "bg-neutral-700" : "bg-white";

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-9 flex-col items-center justify-center gap-[5px] rounded-lg transition-colors hover:bg-black/5"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span
          className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${barColor} ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${barColor} ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${barColor} ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile panel */}
      <div
        className={`absolute inset-x-0 top-14 z-50 border-b ${panelBorder} ${panelBg} shadow-lg transition-all duration-300 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 ${linkColor}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-neutral-100 pt-3">
            <Link
              href={bookNowHref}
              onClick={() => setOpen(false)}
              className="block w-full px-4 py-2.5 text-center text-sm font-medium text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: accent, borderRadius }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
