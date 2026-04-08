"use client";

import { useState, useEffect, useCallback } from "react";
import { getAvailability, getBookedDates, toggleDateAvailability, bulkToggleDates } from "./actions";
import { ChevronLeft, ChevronRight, Loader2, Lock, Unlock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Props {
  propertyId: string;
  siteId: string;
  basePrice: number;
  currency: string;
}

interface DayInfo {
  date: Date;
  dateStr: string;
  day: number;
  inMonth: boolean;
  isPast: boolean;
  blocked: boolean;
  customPrice: number | null;
  booked: { status: string; guestName: string } | null;
}

export function AvailabilityCalendar({ propertyId, siteId, basePrice, currency }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [days, setDays] = useState<DayInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const symbol = currency === "EUR" ? "\u20AC" : currency === "GBP" ? "\u00A3" : "$";

  const loadMonth = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());

    const [availability, bookings] = await Promise.all([
      getAvailability(propertyId, year, month),
      getBookedDates(propertyId, year, month),
    ]);

    const blockedMap = new Map(
      availability.map((a) => [a.date.toISOString().split("T")[0], { available: a.available, price: a.price }])
    );

    const bookedMap = new Map<string, { status: string; guestName: string }>();
    for (const b of bookings) {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        bookedMap.set(d.toISOString().split("T")[0], { status: b.status, guestName: b.guestName });
      }
    }

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const grid: DayInfo[] = [];

    for (let i = -startOffset; i < 42 - startOffset; i++) {
      const date = new Date(year, month, 1 + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const inMonth = date.getMonth() === month;
      const avail = blockedMap.get(dateStr);

      grid.push({
        date,
        dateStr,
        day: date.getDate(),
        inMonth,
        isPast: date < today,
        blocked: avail ? !avail.available : false,
        customPrice: avail?.price ?? null,
        booked: bookedMap.get(dateStr) ?? null,
      });

      if (i >= lastDay.getDate() + startOffset - 1 && grid.length % 7 === 0) break;
    }

    setDays(grid);
    setLoading(false);
  }, [propertyId, year, month]);

  useEffect(() => { loadMonth(); }, [loadMonth]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  async function toggleDay(day: DayInfo) {
    if (day.isPast || !day.inMonth || day.booked) return;
    setToggling(day.dateStr);
    await toggleDateAvailability(propertyId, siteId, day.dateStr, day.blocked, day.customPrice);
    await loadMonth();
    setToggling(null);
  }

  function toggleSelect(dateStr: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  }

  async function bulkAction(block: boolean) {
    if (selected.size === 0) return;
    setBulkLoading(true);
    await bulkToggleDates(propertyId, siteId, Array.from(selected), !block);
    await loadMonth();
    setBulkLoading(false);
  }

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
          <ChevronLeft className="size-5" />
        </button>
        <h2 className="text-lg font-semibold">{MONTHS[month]} {year}</h2>
        <button onClick={nextMonth} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-2.5">
          <span className="text-sm font-medium text-indigo-700">{selected.size} date{selected.size > 1 ? "s" : ""} selected</span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              className="h-7 rounded-md bg-red-500 text-xs text-white hover:bg-red-600"
              onClick={() => bulkAction(true)}
              disabled={bulkLoading}
            >
              {bulkLoading ? <Loader2 className="size-3 animate-spin" /> : <Lock className="mr-1 size-3" />}
              Block
            </Button>
            <Button
              size="sm"
              className="h-7 rounded-md bg-emerald-500 text-xs text-white hover:bg-emerald-600"
              onClick={() => bulkAction(false)}
              disabled={bulkLoading}
            >
              {bulkLoading ? <Loader2 className="size-3 animate-spin" /> : <Unlock className="mr-1 size-3" />}
              Unblock
            </Button>
            <Button size="sm" variant="outline" className="h-7 rounded-md text-xs" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Calendar grid */}
      {loading ? (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-neutral-300" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50">
            {DAYS.map((d) => (
              <div key={d} className="py-2.5 text-center text-xs font-semibold text-neutral-400">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const isSelected = selected.has(day.dateStr);
              const isToggling = toggling === day.dateStr;
              const isToday = day.dateStr === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

              return (
                <button
                  key={day.dateStr}
                  disabled={day.isPast || !day.inMonth}
                  onClick={(e) => {
                    if (e.shiftKey || e.metaKey) toggleSelect(day.dateStr);
                    else toggleDay(day);
                  }}
                  className={`
                    relative flex h-20 flex-col items-center justify-start border-b border-r border-neutral-100 p-1.5 text-left transition-all
                    ${!day.inMonth ? "bg-neutral-50/50 text-neutral-300" : ""}
                    ${day.isPast && day.inMonth ? "text-neutral-300" : ""}
                    ${day.inMonth && !day.isPast ? "cursor-pointer hover:bg-neutral-50" : "cursor-default"}
                    ${isSelected ? "ring-2 ring-inset ring-indigo-400 bg-indigo-50/50" : ""}
                    ${day.booked ? "cursor-not-allowed" : ""}
                  `}
                >
                  {/* Day number */}
                  <span className={`
                    flex size-7 items-center justify-center rounded-full text-xs font-medium
                    ${isToday ? "bg-indigo-600 text-white" : ""}
                    ${day.blocked && !isToday ? "text-red-500" : ""}
                  `}>
                    {day.day}
                  </span>

                  {/* Status indicators */}
                  {isToggling && (
                    <Loader2 className="mt-0.5 size-3 animate-spin text-neutral-300" />
                  )}

                  {day.blocked && !day.booked && !isToggling && day.inMonth && (
                    <span className="mt-0.5 rounded bg-red-50 px-1 text-[9px] font-semibold text-red-500">
                      Blocked
                    </span>
                  )}

                  {day.booked && day.inMonth && (
                    <span className={`mt-0.5 truncate w-full rounded px-1 text-[9px] font-semibold ${day.booked.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      {day.booked.guestName.split(" ")[0]}
                    </span>
                  )}

                  {day.customPrice !== null && day.inMonth && !day.blocked && (
                    <span className="mt-auto text-[9px] text-neutral-400">
                      {symbol}{day.customPrice}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-sm bg-indigo-600" />
          Today
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-sm bg-red-50 border border-red-200" />
          Blocked
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-sm bg-emerald-50 border border-emerald-200" />
          Confirmed
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-sm bg-amber-50 border border-amber-200" />
          Pending
        </div>
        <span className="ml-auto text-neutral-400">Click to toggle &middot; Shift+click to multi-select</span>
      </div>
    </div>
  );
}
