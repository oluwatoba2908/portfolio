import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export type TagProps = HTMLAttributes<HTMLSpanElement>;

export function Tag({ className, children, ...rest }: TagProps) {
  return (
    <span
      {...rest}
      className={clsx(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
