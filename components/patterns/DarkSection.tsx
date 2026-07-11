import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export type DarkSectionProps = HTMLAttributes<HTMLElement>;

/**
 * Dark rounded panel. Wraps sections that should appear on a `#191919`
 * card floating within the page. Used for Selected Projects and (in a
 * variant) for the footer.
 */
export function DarkSection({ className, children, ...rest }: DarkSectionProps) {
  return (
    <section
      {...rest}
      className={clsx(
        "bg-bg-inverse text-fg-on-dark",
        "rounded-[var(--radius-2xl)]",
        "px-8 md:px-16 lg:px-24 py-16 md:py-24",
        className
      )}
    >
      {children}
    </section>
  );
}
