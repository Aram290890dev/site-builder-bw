"use client";

import { useState, useTransition } from "react";
import { togglePublish } from "./actions";

interface Props {
  siteId: string;
  initialPublished: boolean;
}

export function PublishToggle({ siteId, initialPublished }: Props) {
  const [published, setPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await togglePublish(siteId);
      if ("published" in result && result.published !== undefined) {
        setPublished(result.published);
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="group/toggle flex items-center gap-2"
      title={published ? "Unpublish site" : "Publish site"}
    >
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          isPending ? "opacity-60" : ""
        } ${published ? "bg-emerald-500" : "bg-neutral-300"}`}
      >
        <div
          className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
            published ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span
        className={`text-xs font-medium ${
          published ? "text-emerald-600" : "text-neutral-400"
        }`}
      >
        {isPending ? "..." : published ? "Live" : "Draft"}
      </span>
    </button>
  );
}
