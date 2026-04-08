"use client";

import { useState } from "react";
import { deleteProperty } from "./actions";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  propertyId: string;
  siteId: string;
  propertyName: string;
}

export function DeletePropertyButton({ propertyId, siteId, propertyName }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteProperty(propertyId, siteId);
    setDeleting(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-red-600">Delete?</span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 rounded-md border-red-200 text-xs text-red-600 hover:bg-red-50"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? <Loader2 className="size-3 animate-spin" /> : "Yes"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 rounded-md text-xs"
          onClick={() => setConfirming(false)}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
}
