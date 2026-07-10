import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  spacing?: "sm" | "md" | "lg";
  as?: "section" | "div" | "article";
};

const spacingClasses: Record<NonNullable<SectionProps["spacing"]>, string> = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32"
};

export function Section({
  spacing = "md",
  as: Tag = "section",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <Tag {...rest} className={clsx(spacingClasses[spacing], className)}>
      {children}
    </Tag>
  );
}
