"use client";

import { useState } from "react";
import { updateBookingStatus } from "./actions";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  bookingId: string;
  siteId: string;
  currentStatus: string;
}

export function StatusButtons({ bookingId, siteId, currentStatus }: Props) {
  const [loading, setLoading] = useState<"CONFIRMED" | "CANCELLED" | null>(null);

  async function handleUpdate(status: "CONFIRMED" | "CANCELLED") {
    setLoading(status);
    await updateBookingStatus(bookingId, siteId, status);
    setLoading(null);
  }

  if (currentStatus === "CANCELLED") {
    return <span className="text-xs text-neutral-400">Cancelled</span>;
  }

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus === "PENDING" && (
        <Button
          size="sm"
          className="h-7 rounded-md bg-emerald-600 text-xs text-white hover:bg-emerald-700"
          onClick={() => handleUpdate("CONFIRMED")}
          disabled={loading !== null}
        >
          {loading === "CONFIRMED" ? <Loader2 className="size-3 animate-spin" /> : <Check className="mr-1 size-3" />}
          Confirm
        </Button>
      )}
      {currentStatus !== "CANCELLED" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 rounded-md border-red-200 text-xs text-red-600 hover:bg-red-50"
          onClick={() => handleUpdate("CANCELLED")}
          disabled={loading !== null}
        >
          {loading === "CANCELLED" ? <Loader2 className="size-3 animate-spin" /> : <X className="mr-1 size-3" />}
          Cancel
        </Button>
      )}
    </div>
  );
}
