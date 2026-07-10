import { Fragment, type ReactNode } from "react";
import NextLink from "next/link";

/**
 * Parse a plain string with light inline markdown into React nodes.
 * Supported:
 *   [label](url)  — link (auto-detects external via /^https?:/ )
 *   **text**      — <strong>
 *   _text_        — <em>
 *
 * Anything else renders as plain text. Nesting is not supported (KISS).
 */
export function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|_([^_\n]+)_/g;
  let cursor = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      const label = match[1];
      const href = match[2];
      const isExternal = /^https?:/i.test(href);
      const linkClass =
        "underline underline-offset-4 hover:text-accent transition-colors";
      parts.push(
        isExternal ? (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={linkClass}
          >
            {label}
          </a>
        ) : (
          <NextLink key={key++} href={href} className={linkClass}>
            {label}
          </NextLink>
        )
      );
    } else if (match[3] !== undefined) {
      parts.push(<strong key={key++}>{match[3]}</strong>);
    } else if (match[4] !== undefined) {
      parts.push(<em key={key++}>{match[4]}</em>);
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}
