import NextLink from "next/link";
import { clsx } from "clsx";
import type { AnchorHTMLAttributes } from "react";

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  external?: boolean;
  underline?: boolean;
};

const isExternal = (href: string) =>
  /^(https?:|mailto:|tel:)/i.test(href);

export function Link({
  href,
  external,
  underline = false,
  className,
  children,
  ...rest
}: LinkProps) {
  const treatAsExternal = external ?? isExternal(href);

  const classes = clsx(
    "hover:text-accent transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    underline && "underline underline-offset-4",
    className
  );

  if (treatAsExternal) {
    return (
      <a
        {...rest}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink {...rest} href={href} className={classes}>
      {children}
    </NextLink>
  );
}
