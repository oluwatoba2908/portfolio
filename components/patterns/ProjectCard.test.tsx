import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/data/projects";

// next/image tries to serve optimised images in tests — swap for a plain <img>.
// Strip next-specific props (fill, sizes, priority) so they don't warn on
// the DOM element. We rebuild `rest` by omitting those keys.
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const rest = { ...props };
    delete rest.fill;
    delete rest.sizes;
    delete rest.priority;
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...rest} />;
  }
}));

const baseProject: Project = {
  slug: "givn",
  title: "Givn",
  imageSrc: "/img/givn.png",
  imageAlt: "Givn project card",
  ctaLabel: "View project",
  ctaHref: "/projects/givn"
};

describe("ProjectCard", () => {
  it("renders the project title", () => {
    render(<ProjectCard project={baseProject} />);
    expect(
      screen.getByRole("heading", { name: "Givn" })
    ).toBeInTheDocument();
  });

  it("renders every tag when provided", () => {
    const withTags: Project = {
      ...baseProject,
      tags: ["UX/UI Design", "Webflow", "Front-end dev"]
    };
    render(<ProjectCard project={withTags} />);
    expect(screen.getByText("UX/UI Design")).toBeInTheDocument();
    expect(screen.getByText("Webflow")).toBeInTheDocument();
    expect(screen.getByText("Front-end dev")).toBeInTheDocument();
  });

  it("uses an internal <a> for internal CTAs", () => {
    render(<ProjectCard project={baseProject} />);
    const link = screen.getByRole("link", { name: /view project/i });
    expect(link).toHaveAttribute("href", "/projects/givn");
    expect(link).not.toHaveAttribute("target");
  });

  it("marks external CTAs with target=_blank and rel=noreferrer", () => {
    const external: Project = {
      ...baseProject,
      slug: "infragen",
      title: "Infragen",
      ctaLabel: "View site",
      ctaHref: "https://console.infragen.ai/",
      external: true
    };
    render(<ProjectCard project={external} />);
    const link = screen.getByRole("link", { name: /view site/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("skips the description when none is provided", () => {
    const { container } = render(<ProjectCard project={baseProject} />);
    expect(container.querySelector("p")).toBeNull();
  });
});
