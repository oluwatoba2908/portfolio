import type { Metadata } from "next";

import { DcPage } from "@/components/dc/DcPage";
import { SITE } from "@/lib/data/site";
import { DC_PAGES } from "@/lib/dc/routes";
import { renderDcPage } from "@/lib/dc/document";

export const metadata: Metadata = {
  title: "About me",
  description: `About ${SITE.name} — ${SITE.role}. ${SITE.description}`
};

export default async function AboutPage() {
  return <DcPage html={await renderDcPage(DC_PAGES["/about-toba"])} />;
}
