import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Link } from "@/components/ui/Link";
import { ContactForm } from "@/components/patterns/ContactForm";
import { CONTACT } from "@/lib/data/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: CONTACT.hero.subtitle
};

export default function ContactPage() {
  return (
    <main>
      <Section spacing="lg" as="section">
        <Container size="md">
          <p className="text-xs uppercase tracking-wide text-fg-muted font-medium mb-6">
            {CONTACT.hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {CONTACT.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fg-secondary max-w-2xl leading-normal">
            {CONTACT.hero.subtitle}
          </p>
        </Container>
      </Section>

      <Section spacing="md" as="section">
        <Container size="md">
          <ContactForm labels={{ ...CONTACT.form.fields, ...CONTACT.form }} />
          <p className="mt-8 text-sm text-fg-muted">
            {CONTACT.calendly.label}:{" "}
            <Link href={CONTACT.calendly.href} underline>
              {CONTACT.calendly.href.replace(/^https?:\/\//, "")}
            </Link>
          </p>
        </Container>
      </Section>
    </main>
  );
}
