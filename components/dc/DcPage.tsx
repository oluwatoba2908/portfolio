/**
 * Renders a prepared design-canvas document inside a Next.js route.
 *
 * The markup is server-rendered, so the runtime's `<script>` tags execute on
 * load exactly as they did when the document was served as a standalone file.
 * `display: contents` keeps the wrapper out of the layout — the runtime's own
 * root element behaves as if it were a direct child of `<body>`.
 *
 * React never re-renders this subtree (the markup is static and the runtime
 * mounts its own tree inside it), so hydration warnings are suppressed.
 */
export function DcPage({ html }: { html: string }) {
  return (
    <div
      style={{ display: "contents" }}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
