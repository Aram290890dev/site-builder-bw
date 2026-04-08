"use client";

import { useRef, useState, useCallback, useEffect, type CSSProperties, type KeyboardEvent } from "react";

interface InlineEditableProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  multiline?: boolean;
}

export function InlineEditable({
  value,
  onChange,
  placeholder = "Click to edit...",
  className = "",
  style,
  tag: Tag = "div",
  multiline = false,
}: InlineEditableProps) {
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);
  const lastValue = useRef(value);

  useEffect(() => {
    if (!editing && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value || "";
    }
    lastValue.current = value;
  }, [value, editing]);

  const handleFocus = useCallback(() => {
    setEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const text = ref.current?.textContent ?? "";
    if (text !== lastValue.current) {
      onChange(text);
    }
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        ref.current?.blur();
      }
      if (e.key === "Escape") {
        if (ref.current) ref.current.textContent = lastValue.current;
        ref.current?.blur();
      }
      e.stopPropagation();
    },
    [multiline]
  );

  const isEmpty = !value;

  return (
    <Tag
      ref={ref as React.Ref<never>}
      contentEditable
      suppressContentEditableWarning
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        ref.current?.focus();
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none transition-all ${
        editing
          ? "ring-2 ring-indigo-400/50 rounded-sm"
          : "hover:ring-2 hover:ring-indigo-300/30 hover:rounded-sm cursor-text"
      } ${isEmpty && !editing ? "text-neutral-300" : ""} ${className}`}
      style={style}
      data-placeholder={placeholder}
    >
      {isEmpty && !editing ? placeholder : value}
    </Tag>
  );
}
