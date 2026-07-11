import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export type GlassPillProps = HTMLAttributes<HTMLDivElement>;

/**
 * Frosted glass pill container. From the Figma design's portrait card and
 * project card overlays. Semi-transparent white bg + subtle white border +
 * pill radius. Sits over imagery for legibility while feeling airy.
 */
export function GlassPill({ className, children, ...rest }: GlassPillProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "bg-white/40 backdrop-blur-sm border border-white",
        "rounded-[var(--radius-glass)]",
        className
      )}
    >
      {children}
    </div>
  );
}
