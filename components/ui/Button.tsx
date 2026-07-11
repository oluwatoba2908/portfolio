import { clsx } from "clsx";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "pill";
export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const base =
  "inline-flex items-center justify-center gap-2 font-medium " +
  "transition-colors transition-transform duration-[var(--duration-fast)] " +
  "ease-[var(--ease-standard)] disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "rounded-full bg-fg text-bg hover:opacity-90",
  secondary:
    "rounded-full bg-transparent text-fg border border-border-strong hover:bg-bg-inset",
  ghost: "rounded-full bg-transparent text-fg hover:text-accent",
  // Figma pill: heavy multi-layer drop shadow, oval pill, near-black
  pill:
    "rounded-[var(--radius-pill)] bg-fg text-bg font-normal hover:opacity-90 " +
    "shadow-[var(--shadow-button-heavy)]"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-5 py-2.5",
  lg: "text-base px-5 py-[17px]" // matches Figma's 20px/17px padding
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = clsx(base, variantClasses[variant], sizeClasses[size], className);

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    >
      {children}
    </button>
  );
}
