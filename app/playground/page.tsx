import type { Metadata } from "next";

import { DcPage } from "@/components/dc/DcPage";
import { DC_PAGES } from "@/lib/dc/routes";
import { renderDcPage } from "@/lib/dc/document";

export const metadata: Metadata = {
  title: "Playground",
  description: "Experiments, explorations and work in progress."
};

export default async function PlaygroundPage() {
  return <DcPage html={await renderDcPage(DC_PAGES["/playground"])} />;
}
