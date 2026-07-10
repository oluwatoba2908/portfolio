import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement>;

export function Eyebrow({ className, children, ...rest }: EyebrowProps) {
  return (
    <p
      {...rest}
      className={clsx(
        "text-xs uppercase tracking-wide text-fg-muted font-medium",
        className
      )}
    >
      {children}
    </p>
  );
}
