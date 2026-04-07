"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSite } from "./actions";
import { Plus } from "lucide-react";

export function CreateSiteDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    setSubdomain(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("subdomain", subdomain);

    const result = await createSite(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setOpen(false);
    setName("");
    setSubdomain("");
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700" />
        }
      >
        <Plus className="mr-1.5 size-4" />
        New Site
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new site</DialogTitle>
            <DialogDescription>
              Give your booking website a name. You can change this later.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                placeholder="Astra Villas"
                value={name}
                onChange={(e) =>
                  handleNameChange((e.target as HTMLInputElement).value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex items-center">
                <Input
                  id="subdomain"
                  placeholder="astra-villas"
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain((e.target as HTMLInputElement).value)
                  }
                  className="rounded-r-none"
                  required
                />
                <span className="flex h-8 items-center rounded-r-lg border border-l-0 border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500">
                  .bookwise.dev
                </span>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name || !subdomain}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? "Creating..." : "Create Site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
