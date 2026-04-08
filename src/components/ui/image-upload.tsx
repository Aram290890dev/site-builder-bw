"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, GripVertical, ImageIcon, Loader2, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageItem {
  id: string;
  url: string;
  status: "uploading" | "done" | "error";
  progress: number;
  file?: File;
  name: string;
}

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

let idCounter = 0;
function uniqueId() {
  return `img_${Date.now()}_${++idCounter}`;
}

export function ImageUpload({ value, onChange, maxFiles = 20 }: ImageUploadProps) {
  const [items, setItems] = useState<ImageItem[]>(() =>
    value.map((url) => ({
      id: uniqueId(),
      url,
      status: "done" as const,
      progress: 100,
      name: url.split("/").pop() ?? "image",
    }))
  );
  const [draggingOver, setDraggingOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncParent = useCallback(
    (newItems: ImageItem[]) => {
      const urls = newItems.filter((i) => i.status === "done").map((i) => i.url);
      onChange(urls);
    },
    [onChange]
  );

  async function uploadFiles(files: File[]) {
    const remaining = maxFiles - items.filter((i) => i.status !== "error").length;
    const batch = files.slice(0, Math.max(0, remaining));
    if (!batch.length) return;

    const newItems: ImageItem[] = batch.map((file) => ({
      id: uniqueId(),
      url: URL.createObjectURL(file),
      status: "uploading" as const,
      progress: 0,
      file,
      name: file.name,
    }));

    setItems((prev) => {
      const updated = [...prev, ...newItems];
      return updated;
    });

    for (const item of newItems) {
      try {
        const formData = new FormData();
        formData.append("files", item.file!);

        const res = await fetch("/api/upload", { method: "POST", body: formData });

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();
        const uploadedUrl = data.images[0].url;

        setItems((prev) => {
          const updated = prev.map((i) =>
            i.id === item.id
              ? { ...i, url: uploadedUrl, status: "done" as const, progress: 100 }
              : i
          );
          syncParent(updated);
          return updated;
        });
      } catch {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "error" as const } : i
          )
        );
      }
    }
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      syncParent(updated);
      return updated;
    });
  }

  function retryItem(item: ImageItem) {
    if (!item.file) return;
    removeItem(item.id);
    uploadFiles([item.file]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingOver(false);

    if (dragIdx !== null) return;

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) uploadFiles(files);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) uploadFiles(files);
    e.target.value = "";
  }

  function handleReorderDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleReorderDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null) return;
    setDragOverIdx(idx);
  }

  function handleReorderDrop(idx: number) {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }

    setItems((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIdx, 1);
      updated.splice(idx, 0, moved);
      syncParent(updated);
      return updated;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  }

  const doneCount = items.filter((i) => i.status === "done").length;
  const uploadingCount = items.filter((i) => i.status === "uploading").length;

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (dragIdx === null) setDraggingOver(true);
        }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-all",
          draggingOver
            ? "border-indigo-400 bg-indigo-50"
            : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50"
        )}
      >
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-xl transition-colors",
            draggingOver ? "bg-indigo-100" : "bg-neutral-100 group-hover:bg-neutral-200/70"
          )}
        >
          <Upload
            className={cn(
              "size-5 transition-colors",
              draggingOver ? "text-indigo-600" : "text-neutral-400"
            )}
          />
        </div>
        <p className="mt-3 text-sm font-medium text-neutral-700">
          {draggingOver ? "Drop images here" : "Upload images"}
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Drag & drop or click to browse — JPG, PNG, WebP up to 10MB
        </p>
        {doneCount > 0 && (
          <p className="mt-2 text-xs text-neutral-400">
            {doneCount} of {maxFiles} images uploaded
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Uploading indicator */}
      {uploadingCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2">
          <Loader2 className="size-3.5 animate-spin text-indigo-600" />
          <span className="text-xs font-medium text-indigo-700">
            Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""}...
          </span>
        </div>
      )}

      {/* Image Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              draggable={item.status === "done"}
              onDragStart={() => handleReorderDragStart(idx)}
              onDragOver={(e) => handleReorderDragOver(e, idx)}
              onDrop={() => handleReorderDrop(idx)}
              onDragEnd={() => {
                setDragIdx(null);
                setDragOverIdx(null);
              }}
              className={cn(
                "group/card relative aspect-square overflow-hidden rounded-lg border transition-all",
                item.status === "error"
                  ? "border-red-200 bg-red-50"
                  : item.status === "uploading"
                    ? "border-indigo-200 bg-indigo-50"
                    : "border-neutral-200 bg-neutral-100",
                dragIdx === idx && "opacity-40",
                dragOverIdx === idx && dragIdx !== null && "ring-2 ring-indigo-400 ring-offset-1",
                item.status === "done" && "cursor-grab active:cursor-grabbing"
              )}
            >
              {/* Image preview */}
              <img
                src={item.url}
                alt={item.name}
                className={cn(
                  "h-full w-full object-cover transition-opacity",
                  item.status === "uploading" && "opacity-50",
                  item.status === "error" && "opacity-30"
                )}
              />

              {/* First image badge */}
              {idx === 0 && item.status === "done" && (
                <div className="absolute top-1.5 left-1.5 rounded-md bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  Cover
                </div>
              )}

              {/* Drag handle (visible on hover) */}
              {item.status === "done" && (
                <div className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-md bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/card:opacity-100">
                  <GripVertical className="size-3.5" />
                </div>
              )}

              {/* Uploading overlay */}
              {item.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-1.5">
                    <Loader2 className="size-5 animate-spin text-indigo-600" />
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {item.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                  <div className="flex flex-col items-center gap-1">
                    <AlertCircle className="size-5 text-red-500" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        retryItem(item);
                      }}
                      className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-red-600"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Done checkmark (brief flash on completion) */}
              {item.status === "done" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity">
                  <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="size-4" />
                  </div>
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="absolute bottom-1.5 right-1.5 flex size-6 items-center justify-center rounded-md bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-red-500 group-hover/card:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
