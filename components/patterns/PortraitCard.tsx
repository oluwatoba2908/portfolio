"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GlassPill } from "@/components/ui/GlassPill";
import { Button } from "@/components/ui/Button";

export type PortraitCardProps = {
  portraitSrc: string;
  portraitAlt: string;
  firstName: string;
  fullName: string;
  chipDefaultText: string; // e.g. "Hover to know my name"
  cta: { label: string; href: string };
};

/**
 * The big rounded portrait card from the Figma design. Client component
 * because the top chip swaps text on hover — this is the only client
 * boundary. Data enters via props.
 */
export function PortraitCard({
  portraitSrc,
  portraitAlt,
  firstName,
  fullName,
  chipDefaultText,
  cta
}: PortraitCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-[969px] mx-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={
          "relative rounded-[var(--radius-2xl)] bg-bg-alt border-8 border-white p-2 " +
          "shadow-[var(--shadow-portrait)] overflow-hidden"
        }
      >
        {/* Portrait */}
        <div className="relative aspect-[969/861] rounded-[20px] overflow-hidden bg-bg-inset">
          <Image
            src={portraitSrc}
            alt={portraitAlt}
            fill
            sizes="(min-width: 1024px) 969px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Top chip — reveals name on hover */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-3 py-5">
          <span className="text-lg md:text-xl font-medium text-fg transition-opacity">
            {hovered ? fullName : chipDefaultText}
          </span>
        </div>

        {/* Bottom glass pill: name + CTA */}
        <div className="absolute bottom-5 left-5 right-5">
          <GlassPill className="pl-6 pr-2 py-2">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-fg">
                Hi, I am {firstName}
              </h3>
              <Link href={cta.href} className="shrink-0">
                <Button variant="pill" size="lg">
                  {cta.label}
                </Button>
              </Link>
            </div>
          </GlassPill>
        </div>
      </div>
    </div>
  );
}
