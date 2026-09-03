import { isDcFragment } from "@/lib/dc/routes";
import { renderDcFragment } from "@/lib/dc/document";

/**
 * Serves the partial documents (`Nav`, `Footer`, `PreFooterCTA`) that the
 * design-canvas runtime fetches for `<dc-import>`. They go through the same
 * link and asset rewriting as a page, so their nav links point at routes
 * rather than `.html` files.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ component: string }> }
) {
  const { component } = await params;

  if (!isDcFragment(component)) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(await renderDcFragment(component), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}
