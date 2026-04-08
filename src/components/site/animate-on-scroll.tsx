"use client";

import { useRef, useEffect, useState } from "react";

const SPEED_MAP = { fast: "0.4s", normal: "0.7s", slow: "1.2s" };

const INITIAL_STYLES: Record<string, React.CSSProperties> = {
  "fade-in": { opacity: 0 },
  "slide-up": { opacity: 0, transform: "translateY(40px)" },
  "slide-left": { opacity: 0, transform: "translateX(-40px)" },
  "slide-right": { opacity: 0, transform: "translateX(40px)" },
  "zoom-in": { opacity: 0, transform: "scale(0.92)" },
};

const VISIBLE_STYLES: React.CSSProperties = {
  opacity: 1,
  transform: "none",
};

interface Props {
  animation: string;
  speed: string;
  children: React.ReactNode;
}

export function AnimateOnScroll({ animation, speed, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const duration = SPEED_MAP[speed as keyof typeof SPEED_MAP] ?? SPEED_MAP.normal;
  const initial = INITIAL_STYLES[animation] ?? {};

  return (
    <div
      ref={ref}
      style={{
        ...(visible ? VISIBLE_STYLES : initial),
        transition: `opacity ${duration} ease-out, transform ${duration} ease-out`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
