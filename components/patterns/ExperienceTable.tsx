import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export type ExperienceRow = {
  role: string;
  company: string;
  dates: string;
};

export type ExperienceTableProps = {
  title: string;
  roles: readonly ExperienceRow[];
};

export function ExperienceTable({ title, roles }: ExperienceTableProps) {
  return (
    <Section spacing="md" as="section">
      <Container size="md">
        <div className="border-t border-border pt-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h2>
          <ul className="mt-10 divide-y divide-border">
            {roles.map((r) => (
              <li
                key={`${r.company}-${r.dates}`}
                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr] gap-2 md:gap-8 py-6"
              >
                <span className="text-base md:text-lg font-medium">
                  {r.role}
                </span>
                <span className="text-base text-fg-secondary">
                  {r.company}
                </span>
                <span className="text-sm text-fg-muted md:text-right">
                  {r.dates}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
