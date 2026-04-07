import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          BookWise
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Create beautiful booking websites for your properties in minutes.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
