import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-[var(--container-max)]"
};

export function Container({
  size = "lg",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "mx-auto w-full px-6 md:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
