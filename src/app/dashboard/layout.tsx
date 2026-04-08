import Link from "next/link";
import { Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/dashboard/user-menu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

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
          {session?.user && (
            <UserMenu
              name={session.user.name ?? "User"}
              email={session.user.email}
            />
          )}
        </div>
      </header>
      <main className="flex-1 bg-neutral-50/50">{children}</main>
    </div>
  );
}
