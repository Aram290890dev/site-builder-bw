"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Props {
  blockedDates: string[];
  bookedDates: string[];
  accentColor: string;
  blockedColor: string;
  textColor: string;
  radius: string;
}

export function AvailabilityCalendar({ blockedDates, bookedDates, accentColor, blockedColor, textColor, radius }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const blockedSet = new Set(blockedDates);
  const bookedSet = new Set(bookedDates);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cells: Array<{ date: Date; dateStr: string; day: number; inMonth: boolean; isPast: boolean }> = [];
  for (let i = -startOffset; i < 42 - startOffset; i++) {
    const date = new Date(year, month, 1 + i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    cells.push({
      date,
      dateStr,
      day: date.getDate(),
      inMonth: date.getMonth() === month,
      isPast: date < today,
    });
    if (i >= lastDay.getDate() + startOffset - 1 && cells.length % 7 === 0) break;
  }

  const canGoPrev = !(year === now.getFullYear() && month === now.getMonth());

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden" style={{ borderRadius: radius }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="size-4" style={{ color: textColor }} />
        </button>
        <span className="text-sm font-semibold" style={{ color: textColor }}>
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
        >
          <ChevronRight className="size-4" style={{ color: textColor }} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-neutral-50 px-3 py-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium" style={{ color: `${textColor}50` }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px bg-neutral-50 px-3 py-2">
        {cells.map((cell) => {
          const isBlocked = blockedSet.has(cell.dateStr);
          const isBooked = bookedSet.has(cell.dateStr);
          const isUnavailable = isBlocked || isBooked;
          const isToday = cell.dateStr === todayStr;

          let bg = "transparent";
          let color = textColor;
          let opacity = 1;

          if (!cell.inMonth) {
            opacity = 0.2;
          } else if (cell.isPast) {
            opacity = 0.3;
          } else if (isToday) {
            bg = accentColor;
            color = "#ffffff";
          } else if (isBlocked) {
            bg = blockedColor;
            color = "#dc2626";
            opacity = 0.8;
          } else if (isBooked) {
            bg = `${accentColor}15`;
            color = accentColor;
          }

          return (
            <div
              key={cell.dateStr}
              className="flex h-9 items-center justify-center rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: bg, color, opacity }}
              title={isBlocked ? "Blocked" : isBooked ? "Booked" : "Available"}
            >
              {cell.day}
              {isUnavailable && !isToday && cell.inMonth && !cell.isPast && (
                <span className="absolute mt-5 h-0.5 w-3 rounded-full" style={{ backgroundColor: isBlocked ? "#dc2626" : accentColor, opacity: 0.5 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 border-t border-neutral-100 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-[10px]" style={{ color: `${textColor}60` }}>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full" style={{ backgroundColor: blockedColor, opacity: 0.8 }} />
          <span className="text-[10px]" style={{ color: `${textColor}60` }}>Unavailable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full" style={{ backgroundColor: `${accentColor}30` }} />
          <span className="text-[10px]" style={{ color: `${textColor}60` }}>Booked</span>
        </div>
      </div>
    </div>
  );
}
