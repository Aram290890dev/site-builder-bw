import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  Palette,
  MousePointerClick,
  CalendarCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Preview />
      <CTA />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
            <Sparkles className="size-4 text-white" />
          </div>
          BookWise
        </Link>
        <div className="hidden items-center gap-8 sm:flex">
          <Link
            href="#features"
            className="text-sm text-neutral-500 transition-colors hover:text-black"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm text-neutral-500 transition-colors hover:text-black"
          >
            How It Works
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Get Started
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-600" />
              Built for property owners
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl">
              Your properties
              <br />
              deserve a{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                beautiful
              </span>{" "}
              website.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-neutral-500">
              Create stunning booking websites for your properties in minutes.
              No code needed. Just pick a template, customize, and publish.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-indigo-600 px-8 text-base font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Start Building — It&apos;s Free
                <ArrowRight className="size-4" />
              </Link>
              <span className="text-sm text-neutral-400">
                No credit card required
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-100 to-violet-100 opacity-60 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-indigo-200/30">
              <Image
                src="/images/hero-mockup.png"
                alt="BookWise - Property booking website builder"
                width={1024}
                height={560}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Palette,
      color: "bg-amber-50 text-amber-600 border-amber-200",
      title: "Beautiful Templates",
      description:
        "Start with professionally designed templates crafted specifically for vacation rentals, hotels, and B&Bs.",
      image: "/images/feature-templates.png",
    },
    {
      icon: MousePointerClick,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
      title: "Drag & Drop Builder",
      description:
        "Customize every detail with an intuitive visual editor. Move sections, change colors, swap images — all without code.",
      image: "/images/feature-builder.png",
    },
    {
      icon: CalendarCheck,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      title: "Smart Booking System",
      description:
        "Built-in availability calendars, reservation management, and guest communication — everything you need to accept bookings.",
      image: "/images/feature-booking.png",
    },
  ];

  return (
    <section id="features" className="border-t border-neutral-100 bg-neutral-50/50">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-600">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Everything you need to
            <br />
            go live with bookings.
          </h2>
        </div>
        <div className="space-y-24">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={cn("space-y-5", i % 2 === 1 && "lg:order-2")}>
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl border",
                    feature.color
                  )}
                >
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-black">
                  {feature.title}
                </h3>
                <p className="max-w-md text-base leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </div>
              <div className={cn(i % 2 === 1 && "lg:order-1")}>
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-neutral-100/80">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={800}
                    height={450}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      color: "text-indigo-200",
      accent: "bg-indigo-600",
      title: "Pick a template",
      description:
        "Choose from our collection of booking-focused templates designed for properties.",
    },
    {
      number: "02",
      color: "text-amber-200",
      accent: "bg-amber-500",
      title: "Customize everything",
      description:
        "Add your properties, photos, pricing, and availability. Make it uniquely yours.",
    },
    {
      number: "03",
      color: "text-emerald-200",
      accent: "bg-emerald-500",
      title: "Publish & accept bookings",
      description:
        "Go live with one click. Start accepting reservations from guests immediately.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-600">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Live in three steps.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-8 transition-colors hover:border-neutral-200"
            >
              <span className={cn("text-5xl font-bold", step.color)}>
                {step.number}
              </span>
              <div className={cn("h-1 w-10 rounded-full", step.accent)} />
              <h3 className="text-xl font-semibold tracking-tight text-black">
                {step.title}
              </h3>
              <p className="text-base leading-relaxed text-neutral-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Preview() {
  const highlights = [
    "Unlimited properties per site",
    "Custom domain support",
    "Mobile-responsive design",
    "SEO optimized pages",
  ];

  return (
    <section className="border-t border-neutral-100 bg-gradient-to-br from-neutral-950 via-neutral-900 to-indigo-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built to scale with
              <br />
              your portfolio.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-neutral-400">
              Whether you manage one cozy cabin or a fleet of luxury villas,
              BookWise grows with you. One account, unlimited sites.
            </p>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-neutral-300"
                >
                  <ChevronRight className="size-4 text-indigo-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-32 rounded-2xl bg-gradient-to-br from-indigo-800/40 to-indigo-900/40 ring-1 ring-white/10" />
                <div className="h-48 rounded-2xl bg-gradient-to-br from-violet-800/30 to-violet-900/30 ring-1 ring-white/10" />
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-48 rounded-2xl bg-gradient-to-br from-amber-800/20 to-amber-900/20 ring-1 ring-white/10" />
                <div className="h-32 rounded-2xl bg-gradient-to-br from-emerald-800/20 to-emerald-900/20 ring-1 ring-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-neutral-100 bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/80 via-transparent to-violet-50/80" />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Ready to build your
          <br />
          booking website?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-neutral-500">
          Join property owners who trust BookWise to power their online
          presence. Get started in minutes.
        </p>
        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-indigo-600 px-8 text-base font-medium text-white shadow-lg shadow-indigo-200 transition-colors hover:bg-indigo-700"
          >
            Get Started for Free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-indigo-600">
            <Sparkles className="size-3 text-white" />
          </div>
          <span className="text-sm font-semibold">BookWise</span>
          <span className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex gap-6">
          <Link
            href="#"
            className="text-sm text-neutral-400 transition-colors hover:text-black"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm text-neutral-400 transition-colors hover:text-black"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="text-sm text-neutral-400 transition-colors hover:text-black"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
