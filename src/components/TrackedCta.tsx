"use client";

import { trackEvent } from "@/lib/track";

/**
 * Trackované CTA tlačítko — posílá GA4 event při kliknutí.
 * Používá se na /ai-worker pro měření konverzí (demo klik, kalkulačka).
 */
export default function TrackedCta({
  href,
  children,
  eventName,
  params = {},
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  eventName: string;
  params?: Record<string, string | number | boolean>;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const cls = variant === "primary" ? "btn-apple btn-apple-primary" : "btn-apple btn-apple-secondary";
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => trackEvent(eventName, params)}
      className={cls}
    >
      {children}
    </a>
  );
}
