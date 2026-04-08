"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "../actions";
import type { BookingFormData } from "../actions";
import { Loader2, AlertCircle } from "lucide-react";

interface Props {
  propertyId: string;
  siteId: string;
  domain: string;
  maxGuests: number;
  pricePerNight: number;
  currency: string;
  propertyName: string;
  propertyAddress: string | null;
  propertyImage: string | null;
  accentColor: string;
  cardRadius: string;
  showOrderSummary: boolean;
  showPropertyImage: boolean;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export function CheckoutForm({
  propertyId,
  siteId,
  domain,
  maxGuests,
  pricePerNight,
  currency,
  propertyName,
  propertyAddress,
  propertyImage,
  accentColor,
  cardRadius,
  showOrderSummary,
  showPropertyImage,
  initialCheckIn = "",
  initialCheckOut = "",
  initialGuests = 1,
}: Props) {
  const router = useRouter();
  const symbol = currency === "EUR" ? "\u20AC" : currency === "GBP" ? "\u00A3" : "$";

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;
  const total = nights * pricePerNight;

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data: BookingFormData = {
      propertyId,
      siteId,
      checkIn,
      checkOut,
      guests,
      guestName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      notes: notes.trim(),
    };

    const result = await createBooking(data);

    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    router.push(`/site/${domain}/checkout/${propertyId}/success?booking=${result.bookingId}`);
  }

  const inputStyle: React.CSSProperties = { borderRadius: cardRadius };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form fields */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Dates */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4" style={{ borderRadius: cardRadius }}>
            <h2 className="text-lg font-semibold">Your Dates</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Check-in</label>
                <input
                  type="date"
                  required
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={inputStyle}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Check-out</label>
                <input
                  type="date"
                  required
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                style={inputStyle}
              >
                {Array.from({ length: maxGuests }).map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} guest{i > 0 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Info */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4" style={{ borderRadius: cardRadius }}>
            <h2 className="text-lg font-semibold">Guest Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={inputStyle}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={inputStyle}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-500">Special Requests</label>
              <textarea
                placeholder="Any special requests or notes..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-lg py-3.5 text-base font-semibold text-white transition-all hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
            style={{ backgroundColor: accentColor, borderRadius: cardRadius }}
          >
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
          <p className="text-center text-xs text-neutral-400">
            No payment required. You&apos;ll receive a confirmation email.
          </p>
        </div>

        {/* Order Summary */}
        {showOrderSummary && (
          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-xl border border-neutral-200 bg-white p-6 space-y-4" style={{ borderRadius: cardRadius }}>
              <h3 className="text-base font-semibold">Booking Summary</h3>

              {showPropertyImage && propertyImage && (
                <div className="overflow-hidden rounded-lg" style={{ borderRadius: cardRadius }}>
                  <img src={propertyImage} alt={propertyName} className="aspect-[16/10] w-full object-cover" />
                </div>
              )}

              <div>
                <div className="font-semibold">{propertyName}</div>
                {propertyAddress && (
                  <div className="text-sm text-neutral-500">{propertyAddress}</div>
                )}
              </div>

              <div className="space-y-2 border-t border-neutral-100 pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Check-in</span>
                  <span>{checkIn ? new Date(checkIn + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Check-out</span>
                  <span>{checkOut ? new Date(checkOut + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Guests</span>
                  <span>{guests}</span>
                </div>
                {nights > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Nights</span>
                    <span>{nights}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">{symbol}{pricePerNight} x {nights || 1} night{nights !== 1 ? "s" : ""}</span>
                  <span>{symbol}{nights > 0 ? total : pricePerNight}</span>
                </div>
                <div className="mt-2 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{symbol}{nights > 0 ? total : pricePerNight}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
