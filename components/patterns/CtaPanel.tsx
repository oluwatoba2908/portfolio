import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export type CtaPanelAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type CtaPanelProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  actions?: readonly CtaPanelAction[];
  id?: string;
};

/**
 * CtaPanel — server pattern. Bottom-of-page contact prompt. Content is
 * fully driven by props so it can render "Let's work together" on the
 * homepage AND "If you scrolled this far, let's talk" on About/Contact.
 */
export function CtaPanel({
  eyebrow,
  title,
  body,
  actions = [],
  id
}: CtaPanelProps) {
  return (
    <Section spacing="lg" as="section" id={id}>
      <Container>
        <div className="rounded-xl bg-bg-alt border border-border p-8 md:p-16 text-center">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-wide text-fg-muted font-medium mb-4">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            {title}
          </h2>
          {body ? (
            <p className="mt-6 text-lg text-fg-secondary max-w-xl mx-auto">
              {body}
            </p>
          ) : null}
          {actions.length > 0 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {actions.map((action, i) => (
                <Button
                  key={action.href}
                  href={action.href}
                  variant={action.variant ?? (i === 0 ? "primary" : "secondary")}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
