import type { Metadata } from "next";

import { DcPage } from "@/components/dc/DcPage";
import { SITE } from "@/lib/data/site";
import { DC_PAGES } from "@/lib/dc/routes";
import { renderDcPage } from "@/lib/dc/document";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE.name}.`
};

export default async function ContactPage() {
  return <DcPage html={await renderDcPage(DC_PAGES["/contact"])} />;
}
