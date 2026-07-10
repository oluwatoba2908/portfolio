import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/patterns/Nav";
import { Footer } from "@/components/patterns/Footer";
import { NAV_LINKS, FOOTER_LINK_GROUPS } from "@/lib/data/nav";
import { SITE } from "@/lib/data/site";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s · ${SITE.name}`
  },
  description: SITE.description
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={interTight.variable}>
      <body>
        <Nav logoMark={SITE.logoMark} links={NAV_LINKS} />
        {children}
        <Footer
          logoMark={SITE.logoMark}
          groups={FOOTER_LINK_GROUPS}
          copyright={SITE.copyright}
        />
      </body>
    </html>
  );
}
