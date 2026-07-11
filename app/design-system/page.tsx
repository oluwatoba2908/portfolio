import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Link as LinkPrimitive } from "@/components/ui/Link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GlassPill } from "@/components/ui/GlassPill";
import { Avatar } from "@/components/ui/Avatar";
import { ScrollIndicator } from "@/components/patterns/ScrollIndicator";
import { TESTIMONIALS } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Live gallery of every token, primitive, and pattern in the portfolio design system."
};

/*
 * Live design-system route. Every token, primitive, and (eventually)
 * pattern is rendered below so we can eyeball the whole system in one
 * scroll. Kept as a server component — no interactivity needed to view.
 */
export default function DesignSystemPage() {
  return (
    <main className="bg-bg text-fg">
      <Container>
        <Section spacing="lg">
          <Eyebrow>Portfolio · Design System</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Tokens, primitives, patterns.
          </h1>
          <p className="mt-6 text-lg text-fg-secondary max-w-2xl">
            Every visual decision lives here as a single source of truth. Tokens
            come from{" "}
            <LinkPrimitive href="/styles/tokens.css" underline>
              app/globals.css
            </LinkPrimitive>{" "}
            (the `@theme` block Tailwind processes at build time). Primitives
            from{" "}
            <LinkPrimitive href="/components/ui" underline>
              components/ui/
            </LinkPrimitive>
            . Patterns from{" "}
            <LinkPrimitive href="/components/patterns" underline>
              components/patterns/
            </LinkPrimitive>
            .
          </p>
        </Section>

        {/* ---------- COLORS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 01" title="Colors" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Swatch name="bg" varName="--color-bg" />
            <Swatch name="bg-warm" varName="--color-bg-warm" />
            <Swatch name="bg-page" varName="--color-bg-page" />
            <Swatch name="bg-alt" varName="--color-bg-alt" />
            <Swatch name="bg-inverse" varName="--color-bg-inverse" />
            <Swatch name="bg-footer" varName="--color-bg-footer" />
            <Swatch name="fg" varName="--color-fg" />
            <Swatch name="fg-heading" varName="--color-fg-heading" />
            <Swatch name="fg-muted" varName="--color-fg-muted" />
            <Swatch name="accent-pulse" varName="--color-accent-pulse" />
          </div>
          <p className="mt-6 text-xs text-fg-muted font-mono">
            Testimonial cards use a darkening scale:
            testimonial-1 (#242222) → testimonial-5 (#141414).
          </p>
        </Section>

        {/* ---------- TYPOGRAPHY ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 02" title="Typography (Geist)" />
          <div className="mt-8 space-y-8">
            <TypeSample label="text-h1 · 90px · 800 (hero + footer)">
              <span className="font-extrabold tracking-tight text-fg-heading" style={{ fontSize: "90px", lineHeight: "1.1" }}>
                Intuitive product design
              </span>
            </TypeSample>
            <TypeSample label="text-h2 · 64px · 700 (section H2)">
              <span className="font-bold tracking-wide" style={{ fontSize: "64px", lineHeight: "1.05" }}>
                Selected Projects
              </span>
            </TypeSample>
            <TypeSample label="text-3xl · 24px · 700 (testimonial names)">
              <span className="text-3xl font-bold tracking-wide">Ali Ashfaq</span>
            </TypeSample>
            <TypeSample label="text-2xl · 22.4px · 700 (card titles)">
              <span className="text-2xl font-bold">Hi, I am Toba</span>
            </TypeSample>
            <TypeSample label="text-xl · 20px · 400 (subtitle)">
              <span className="text-xl text-fg-muted">
                Helping startups design products and build websites.
              </span>
            </TypeSample>
            <TypeSample label="text-base · 16px · 400 · body">
              <span className="text-base text-fg-secondary">
                Quick note, these case studies include visuals and content.
              </span>
            </TypeSample>
            <TypeSample label="text-xs · 12px · 500 · uppercase eyebrow">
              <Eyebrow>DOCUMENTATION 1 OF 6</Eyebrow>
            </TypeSample>
          </div>
        </Section>

        {/* ---------- RADII ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 03" title="Radii" />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(
              [
                { name: "sm", val: "--radius-sm" },
                { name: "md", val: "--radius-md" },
                { name: "lg", val: "--radius-lg" },
                { name: "xl", val: "--radius-xl" },
                { name: "2xl (cards)", val: "--radius-2xl" },
                { name: "glass (frosted pill)", val: "--radius-glass" },
                { name: "pill (CTA)", val: "--radius-pill" },
                { name: "avatar", val: "--radius-avatar" }
              ] as const
            ).map((r) => (
              <div key={r.name} className="flex flex-col items-start gap-2">
                <div
                  className="w-full h-24 bg-bg-inset border border-border"
                  style={{ borderRadius: `var(${r.val})` }}
                />
                <span className="text-sm text-fg-muted font-mono">
                  {r.name}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------- SHADOWS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 04" title="Shadows" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <ShadowCard name="button-heavy" varName="--shadow-button-heavy" />
            <ShadowCard name="portrait" varName="--shadow-portrait" />
            <ShadowCard
              name="testimonial-top"
              varName="--shadow-testimonial-top"
              dark
            />
          </div>
        </Section>

        {/* ---------- BUTTONS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Primitives · 01" title="Buttons" />
          <div className="mt-8 space-y-6">
            <Row label="Variants">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="pill" size="lg">
                Pill (Figma)
              </Button>
            </Row>
            <Row label="Sizes">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>
            <Row label="As anchor (href)">
              <Button href="/about" variant="pill">
                Read more
              </Button>
              <Button href="https://calendly.com/tofomiyonwon/30min" variant="pill">
                Book a call
              </Button>
            </Row>
          </div>
        </Section>

        {/* ---------- GLASS PILL + AVATAR ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Primitives · 02" title="Glass pill + Avatar" />
          <div className="mt-8 space-y-8">
            <Row label="GlassPill — frosted container, sits over imagery">
              <div className="w-full max-w-2xl bg-fg-heading rounded-xl p-6">
                <GlassPill className="px-6 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg font-bold text-fg">
                      Hi, I am Toba
                    </span>
                    <Button variant="pill" size="lg">
                      More about me
                    </Button>
                  </div>
                </GlassPill>
              </div>
            </Row>
            <Row label="Avatar sizes">
              {TESTIMONIALS.slice(0, 3).map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <Avatar src={t.avatarSrc} alt={t.avatarAlt} size="md" />
                  <span className="text-sm text-fg-muted">{t.name}</span>
                </div>
              ))}
            </Row>
          </div>
        </Section>

        {/* ---------- LINKS + CARDS + TAGS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle
            eyebrow="Primitives · 03"
            title="Links, cards, tags"
          />
          <div className="mt-8 space-y-6">
            <Row label="Links">
              <LinkPrimitive href="/about" underline>
                About me
              </LinkPrimitive>
              <LinkPrimitive
                href="https://www.behance.net/tofomiyonwon"
                underline
              >
                Behance ↗
              </LinkPrimitive>
            </Row>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default">
                <Eyebrow>Default</Eyebrow>
                <h3 className="text-xl font-semibold mt-2">Card default</h3>
              </Card>
              <Card variant="outlined">
                <Eyebrow>Outlined</Eyebrow>
                <h3 className="text-xl font-semibold mt-2">Card outlined</h3>
              </Card>
              <Card variant="muted">
                <Eyebrow>Muted</Eyebrow>
                <h3 className="text-xl font-semibold mt-2">Card muted</h3>
              </Card>
            </div>
            <Row label="Tags">
              <Tag>UX/UI Design</Tag>
              <Tag>Webflow</Tag>
              <Tag>Front-end dev</Tag>
            </Row>
          </div>
        </Section>

        {/* ---------- SCROLL INDICATOR ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle
            eyebrow="Patterns · 01"
            title="ScrollIndicator"
          />
          <div className="mt-8 p-8 bg-bg-inverse rounded-2xl flex justify-center">
            <ScrollIndicator label="SCROLL TO SEE PROJECTS" />
          </div>
          <p className="mt-4 text-sm text-fg-muted">
            Pulsing green dot + eyebrow. Used above section headings on dark
            backgrounds (Selected Projects). Pure CSS animation.
          </p>
        </Section>

        {/* ---------- PATTERNS SEEN IN CONTEXT ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle
            eyebrow="Patterns · 02"
            title="Patterns rendered in context"
          />
          <p className="mt-6 text-fg-secondary max-w-2xl">
            These patterns are best experienced on the actual pages — sticky
            scroll effects and portrait hover don&rsquo;t translate to
            isolated previews.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatternLink
              href="/"
              title="Hero + PortraitCard"
              description="Warm off-white hero, dark pill CTA, big portrait card with hover-to-reveal name and glass pill footer."
            />
            <PatternLink
              href="/#projects"
              title="DarkSection + ProjectCardOverlay"
              description="`#191919` rounded panel wrapping a 2×2 grid of overlay project cards with GlassPill titles."
            />
            <PatternLink
              href="/#reviews"
              title="StackingTestimonials"
              description="5 dark testimonial cards that stack via CSS `position: sticky`. Each darker than the last (#242222 → #141414)."
            />
            <PatternLink
              href="/"
              title="Footer (dark inset)"
              description="`#f5f5f5` wrapper containing a `#202020` panel with the 'Let's work together' 90px display."
            />
          </div>
        </Section>
      </Container>
    </main>
  );
}

/* ---------- local helpers (server-side rendering only) ---------- */

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-t border-border pt-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-semibold mt-3">{title}</h2>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-fg-muted font-mono mb-2">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <div className="h-24" style={{ background: `var(${varName})` }} />
      <div className="p-3 bg-bg">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-fg-muted font-mono">{varName}</p>
      </div>
    </div>
  );
}

function ShadowCard({
  name,
  varName,
  dark = false
}: {
  name: string;
  varName: string;
  dark?: boolean;
}) {
  return (
    <div
      className={
        "rounded-lg p-8 flex flex-col items-center justify-center h-40 " +
        (dark ? "bg-bg-inverse" : "bg-bg-alt")
      }
    >
      <div
        className={
          "w-32 h-12 rounded-full " +
          (dark ? "bg-bg-inverse" : "bg-fg")
        }
        style={{ boxShadow: `var(${varName})` }}
      />
      <p className={"mt-4 text-xs font-mono " + (dark ? "text-fg-on-dark-muted" : "text-fg-muted")}>
        {name}
      </p>
    </div>
  );
}

function TypeSample({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-4">
      <p className="text-xs text-fg-muted font-mono mb-2">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function PatternLink({
  href,
  title,
  description
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-6 rounded-lg border border-border hover:border-border-strong transition-colors"
    >
      <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
        {title} →
      </h3>
      <p className="mt-2 text-sm text-fg-secondary leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
