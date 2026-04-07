import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600">
              <Sparkles className="size-3.5 text-white" />
            </div>
            BookWise
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">Demo Owner</span>
            <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
              DO
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-neutral-50/50">{children}</main>
    </div>
  );
}
