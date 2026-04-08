"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface Props {
  domain: string;
  propertyId: string;
  price: number;
  currency: string;
  maxGuests: number;
  accentColor: string;
  textColor: string;
  radius: string;
  blockedDates?: string[];
  bookedDates?: string[];
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function BookingWidget({
  domain,
  propertyId,
  price,
  currency,
  maxGuests,
  accentColor,
  textColor,
  radius,
  blockedDates = [],
  bookedDates = [],
}: Props) {
  const router = useRouter();
  const symbol = currency === "EUR" ? "\u20AC" : currency === "GBP" ? "\u00A3" : "$";

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [calOpen, setCalOpen] = useState(false);
  const [picking, setPicking] = useState<"checkIn" | "checkOut">("checkIn");
  const [hovered, setHovered] = useState("");
  const calRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const blockedSet = new Set(blockedDates);
  const bookedSet = new Set(bookedDates);
  const unavailableSet = new Set([...blockedDates, ...bookedDates]);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openCal(target: "checkIn" | "checkOut") {
    setPicking(target);
    setCalOpen(true);
    if (target === "checkIn" && checkIn) {
      const d = new Date(checkIn + "T12:00:00");
      setYear(d.getFullYear());
      setMonth(d.getMonth());
    } else if (target === "checkOut" && checkOut) {
      const d = new Date(checkOut + "T12:00:00");
      setYear(d.getFullYear());
      setMonth(d.getMonth());
    } else {
      setYear(now.getFullYear());
      setMonth(now.getMonth());
    }
  }

  function selectDate(dateStr: string) {
    if (picking === "checkIn") {
      setCheckIn(dateStr);
      if (checkOut && dateStr >= checkOut) setCheckOut("");
      setPicking("checkOut");
    } else {
      if (checkIn && dateStr <= checkIn) {
        setCheckIn(dateStr);
        setCheckOut("");
        setPicking("checkOut");
      } else {
        setCheckOut(dateStr);
        setCalOpen(false);
      }
    }
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toDateStr(today);
  const canGoPrev = !(year === now.getFullYear() && month === now.getMonth());

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: Array<{ dateStr: string; day: number; inMonth: boolean; isPast: boolean }> = [];
  for (let i = -startOffset; i < 42 - startOffset; i++) {
    const date = new Date(year, month, 1 + i);
    cells.push({
      dateStr: toDateStr(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
      isPast: date < today,
    });
    if (i >= lastDay.getDate() + startOffset - 1 && cells.length % 7 === 0) break;
  }

  function isInRange(dateStr: string) {
    const start = checkIn;
    const end = picking === "checkOut" && hovered && checkIn ? hovered : checkOut;
    if (!start || !end) return false;
    return dateStr > start && dateStr < end;
  }

  function handleBook() {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    router.push(`/site/${domain}/checkout/${propertyId}?${params.toString()}`);
  }

  return (
    <div className="sticky top-20 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-5" style={{ borderRadius: radius }}>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold" style={{ color: textColor }}>{symbol}{price}</span>
        <span className="text-base" style={{ color: `${textColor}80` }}>/night</span>
      </div>

      {/* Date picker triggers */}
      <div className="relative" ref={calRef}>
        <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-neutral-200" style={{ borderRadius: radius }}>
          <button
            type="button"
            onClick={() => openCal("checkIn")}
            className={`flex flex-col px-3 py-3 text-left transition-colors hover:bg-neutral-50 ${calOpen && picking === "checkIn" ? "bg-neutral-50" : ""}`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${textColor}50` }}>Check-in</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-sm" style={{ color: checkIn ? textColor : `${textColor}40` }}>
              <CalendarDays className="size-3.5" style={{ color: accentColor }} />
              {checkIn ? formatDisplay(checkIn) : "Add date"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => openCal("checkOut")}
            className={`flex flex-col border-l border-neutral-200 px-3 py-3 text-left transition-colors hover:bg-neutral-50 ${calOpen && picking === "checkOut" ? "bg-neutral-50" : ""}`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${textColor}50` }}>Check-out</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-sm" style={{ color: checkOut ? textColor : `${textColor}40` }}>
              <CalendarDays className="size-3.5" style={{ color: accentColor }} />
              {checkOut ? formatDisplay(checkOut) : "Add date"}
            </span>
          </button>
        </div>

        {/* Calendar dropdown */}
        {calOpen && (
          <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl" style={{ borderRadius: radius }}>
            {/* Picking indicator */}
            <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2">
              <span className="text-xs font-medium" style={{ color: accentColor }}>
                {picking === "checkIn" ? "Select check-in date" : "Select check-out date"}
              </span>
            </div>

            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={prevMonth}
                disabled={!canGoPrev}
                className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-neutral-100 disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm font-semibold" style={{ color: textColor }}>
                {MONTHS_FULL[month]} {year}
              </span>
              <button onClick={nextMonth} className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-neutral-100">
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 px-3">
              {DAYS.map((d) => (
                <div key={d} className="pb-1.5 text-center text-[10px] font-semibold" style={{ color: `${textColor}40` }}>{d}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
              {cells.map((cell) => {
                const disabled = !cell.inMonth || cell.isPast || unavailableSet.has(cell.dateStr);
                const isCheckIn = cell.dateStr === checkIn;
                const isCheckOut = cell.dateStr === checkOut;
                const isSelected = isCheckIn || isCheckOut;
                const inRange = isInRange(cell.dateStr);
                const isToday = cell.dateStr === todayStr;

                let bg = "transparent";
                let fg = textColor;
                let fontWeight = "400";

                if (!cell.inMonth) {
                  fg = `${textColor}20`;
                } else if (disabled) {
                  fg = `${textColor}30`;
                } else if (isSelected) {
                  bg = accentColor;
                  fg = "#ffffff";
                  fontWeight = "600";
                } else if (inRange) {
                  bg = `${accentColor}15`;
                  fg = accentColor;
                } else if (isToday) {
                  fontWeight = "700";
                }

                return (
                  <button
                    key={cell.dateStr}
                    disabled={disabled}
                    onClick={() => selectDate(cell.dateStr)}
                    onMouseEnter={() => !disabled && setHovered(cell.dateStr)}
                    onMouseLeave={() => setHovered("")}
                    className="flex h-9 items-center justify-center rounded-lg text-xs transition-all disabled:cursor-default"
                    style={{
                      backgroundColor: bg,
                      color: fg,
                      fontWeight,
                    }}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            {/* Quick clear */}
            {(checkIn || checkOut) && (
              <div className="border-t border-neutral-100 px-4 py-2 text-right">
                <button
                  onClick={() => { setCheckIn(""); setCheckOut(""); setPicking("checkIn"); }}
                  className="text-xs font-medium transition-colors hover:opacity-70"
                  style={{ color: accentColor }}
                >
                  Clear dates
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${textColor}50` }}>Guests</div>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-lg border border-neutral-200 px-2.5 py-2 text-sm outline-none focus:border-neutral-400"
          style={{ borderRadius: radius }}
        >
          {Array.from({ length: maxGuests }).map((_, i) => (
            <option key={i} value={i + 1}>{i + 1} guest{i > 0 ? "s" : ""}</option>
          ))}
        </select>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="space-y-1.5 border-t border-neutral-100 pt-4 text-sm">
          <div className="flex justify-between" style={{ color: `${textColor}99` }}>
            <span>{symbol}{price} x {nights} night{nights > 1 ? "s" : ""}</span>
            <span>{symbol}{(price * nights).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-bold" style={{ color: textColor }}>
            <span>Total</span>
            <span>{symbol}{(price * nights).toLocaleString()}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleBook}
        className="block w-full rounded-lg py-3 text-center text-base font-semibold text-white transition-transform hover:scale-[1.01]"
        style={{ backgroundColor: accentColor, borderRadius: radius }}
      >
        Book Now
      </button>

      <p className="text-center text-xs" style={{ color: `${textColor}50` }}>
        You won&apos;t be charged yet
      </p>
    </div>
  );
}
