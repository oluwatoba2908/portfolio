import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outlined" | "muted";
  padding?: "none" | "sm" | "md" | "lg";
};

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-bg-alt",
  outlined: "bg-bg border border-border",
  muted: "bg-bg-inset"
};

const paddingClasses: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

export function Card({
  variant = "outlined",
  padding = "md",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "rounded-lg",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
