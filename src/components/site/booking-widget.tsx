"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  domain: string;
  propertyId: string;
  price: number;
  currency: string;
  maxGuests: number;
  accentColor: string;
  textColor: string;
  radius: string;
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
}: Props) {
  const router = useRouter();
  const symbol = currency === "EUR" ? "\u20AC" : currency === "GBP" ? "\u00A3" : "$";
  const today = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${textColor}50` }}>Check-in</div>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && e.target.value >= checkOut) setCheckOut("");
            }}
            className="w-full rounded-lg border border-neutral-200 px-2.5 py-2 text-sm outline-none focus:border-neutral-400"
            style={{ borderRadius: radius }}
          />
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${textColor}50` }}>Check-out</div>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-2.5 py-2 text-sm outline-none focus:border-neutral-400"
            style={{ borderRadius: radius }}
          />
        </div>
      </div>

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
