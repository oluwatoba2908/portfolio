import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Eyebrow } from "@/components/ui/Eyebrow";

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
            <Link href="/styles/tokens.css" underline>
              styles/tokens.css
            </Link>
            . Primitives from{" "}
            <Link href="/components/ui" underline>
              components/ui/
            </Link>
            . Patterns come next.
          </p>
        </Section>

        {/* ---------- COLORS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 01" title="Colors" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Swatch name="bg" varName="--color-bg" />
            <Swatch name="bg-alt" varName="--color-bg-alt" />
            <Swatch name="bg-inset" varName="--color-bg-inset" />
            <Swatch name="border" varName="--color-border" />
            <Swatch name="fg" varName="--color-fg" />
            <Swatch name="fg-secondary" varName="--color-fg-secondary" />
            <Swatch name="fg-muted" varName="--color-fg-muted" />
            <Swatch name="fg-quiet" varName="--color-fg-quiet" />
            <Swatch name="accent" varName="--color-accent" />
            <Swatch name="accent-soft" varName="--color-accent-soft" />
          </div>
        </Section>

        {/* ---------- TYPOGRAPHY ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 02" title="Typography" />
          <div className="mt-8 space-y-8">
            <TypeSample label="text-6xl / h1 · 90px · 700">
              <span className="text-6xl font-bold tracking-tight">
                Intuitive product design
              </span>
            </TypeSample>
            <TypeSample label="text-5xl · 60px · 700">
              <span className="text-5xl font-bold tracking-tight">
                Selected work
              </span>
            </TypeSample>
            <TypeSample label="text-3xl / h2 · 32px · 600">
              <span className="text-3xl font-semibold">Take their words for it.</span>
            </TypeSample>
            <TypeSample label="text-2xl · 24px · 500">
              <span className="text-2xl font-medium">Project title</span>
            </TypeSample>
            <TypeSample label="text-lg · 18px · 400">
              <span className="text-lg">
                Helping startups design products and build websites for over 3
                years.
              </span>
            </TypeSample>
            <TypeSample label="text-base · 16px · 400 · body">
              <span className="text-base text-fg-secondary">
                I can solve a Rubik&rsquo;s cube in 1:15, but that&rsquo;s just
                one way I keep my hands busy.
              </span>
            </TypeSample>
            <TypeSample label="text-sm · 14px · 400 · caption">
              <span className="text-sm text-fg-muted">
                Ryder reduced inequality by making transport access more
                affordable.
              </span>
            </TypeSample>
            <TypeSample label="text-xs · 12px · 500 · uppercase eyebrow">
              <Eyebrow>DOCUMENTATION 1 OF 6</Eyebrow>
            </TypeSample>
          </div>
        </Section>

        {/* ---------- SPACING ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 03" title="Spacing" />
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4, 6, 8, 12, 16, 24].map((n) => (
              <div key={n} className="flex items-center gap-4">
                <span className="w-24 text-sm text-fg-muted font-mono">
                  --spacing-{n}
                </span>
                <span
                  className="h-4 bg-fg"
                  style={{ width: `var(--spacing-${n})` }}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ---------- RADII ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Foundations · 04" title="Radii" />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            {(["sm", "md", "lg", "xl", "full"] as const).map((r) => (
              <div key={r} className="flex flex-col items-start gap-2">
                <div
                  className="w-full h-24 bg-bg-inset border border-border"
                  style={{ borderRadius: `var(--radius-${r})` }}
                />
                <span className="text-sm text-fg-muted font-mono">
                  --radius-{r}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------- BUTTONS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Primitives · 01" title="Buttons" />
          <div className="mt-8 space-y-6">
            <Row label="Variants (default size)">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </Row>
            <Row label="Sizes (primary)">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>
            <Row label="As anchor (href) — becomes an <a>">
              <Button href="/about" variant="secondary">
                Read more
              </Button>
              <Button href="https://calendly.com/tofomiyonwon/30min">
                Book a call
              </Button>
            </Row>
            <Row label="States">
              <Button disabled>Disabled</Button>
            </Row>
          </div>
        </Section>

        {/* ---------- LINKS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Primitives · 02" title="Links" />
          <div className="mt-8 space-y-4">
            <p>
              Internal link:{" "}
              <Link href="/about" underline>
                About me
              </Link>
            </p>
            <p>
              External link (auto-detected):{" "}
              <Link href="https://www.behance.net/tofomiyonwon" underline>
                Behance
              </Link>
            </p>
            <p>
              Mailto (auto-detected):{" "}
              <Link href="mailto:hi@tobadesigner.com" underline>
                hi@tobadesigner.com
              </Link>
            </p>
          </div>
        </Section>

        {/* ---------- CARDS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Primitives · 03" title="Cards" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <Eyebrow>Default</Eyebrow>
              <h3 className="text-xl font-semibold mt-2">Card default</h3>
              <p className="text-sm text-fg-secondary mt-2">
                Uses bg-alt background — the softest surface.
              </p>
            </Card>
            <Card variant="outlined">
              <Eyebrow>Outlined</Eyebrow>
              <h3 className="text-xl font-semibold mt-2">Card outlined</h3>
              <p className="text-sm text-fg-secondary mt-2">
                Bordered on the base bg — good for project grids.
              </p>
            </Card>
            <Card variant="muted">
              <Eyebrow>Muted</Eyebrow>
              <h3 className="text-xl font-semibold mt-2">Card muted</h3>
              <p className="text-sm text-fg-secondary mt-2">
                Slightly darker inset — for callouts.
              </p>
            </Card>
          </div>
        </Section>

        {/* ---------- TAGS ---------- */}
        <Section spacing="md" as="section">
          <SectionTitle eyebrow="Primitives · 04" title="Tags" />
          <div className="mt-8 flex flex-wrap gap-2">
            <Tag>UX/UI Design</Tag>
            <Tag>Webflow</Tag>
            <Tag>Front-end dev</Tag>
            <Tag>Design system</Tag>
            <Tag>Research</Tag>
          </div>
        </Section>

        <Section spacing="lg" as="section">
          <p className="text-sm text-fg-muted">
            Patterns (Nav, Footer, Hero, ProjectCard, TestimonialCard,
            SelectedProjects, ReviewsSection, CtaPanel) are next up.
          </p>
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
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Swatch({
  name,
  varName
}: {
  name: string;
  varName: string;
}) {
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
