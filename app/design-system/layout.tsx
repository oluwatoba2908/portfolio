import { Nav } from "@/components/patterns/Nav";
import { Footer } from "@/components/patterns/Footer";
import { NAV_LINKS, FOOTER_LINK_GROUPS } from "@/lib/data/nav";
import { SITE } from "@/lib/data/site";

/*
 * The design-system gallery is the one route rendered from React components,
 * so it carries the React nav and footer. The design-canvas pages bring their
 * own chrome and must not be wrapped in these.
 */
export default function DesignSystemLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav logoMark={SITE.logoMark} links={NAV_LINKS} />
      {children}
      <Footer
        logoMark={SITE.logoMark}
        groups={FOOTER_LINK_GROUPS}
        copyright={SITE.copyright}
      />
    </>
  );
}
