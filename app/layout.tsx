import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/data/site";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s · ${SITE.name}`
  },
  description: SITE.description
};

/*
 * Root layout — document shell only. Site chrome (nav, footer) belongs to the
 * page: the design-canvas pages render their own, and /design-system wraps
 * itself in the React components via its own layout.
 */
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * The design-canvas scripts write to the document shell before React
     * hydrates — vw.js sets a --vw custom property on <html> — so the shell
     * opts out of hydration attribute checks.
     */
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
