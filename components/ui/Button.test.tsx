import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders as a <button> when no href is passed", () => {
    render(<Button>Click me</Button>);
    const el = screen.getByRole("button", { name: "Click me" });
    expect(el.tagName).toBe("BUTTON");
  });

  it("renders as an <a> when href is passed", () => {
    render(<Button href="/about">Read more</Button>);
    const el = screen.getByRole("link", { name: "Read more" });
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/about");
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el.className).toMatch(/bg-fg/);
    expect(el.className).toMatch(/text-bg/);
  });

  it("applies ghost variant when specified", () => {
    render(<Button variant="ghost">Cancel</Button>);
    const el = screen.getByRole("button", { name: "Cancel" });
    expect(el.className).toMatch(/hover:text-accent/);
    expect(el.className).not.toMatch(/bg-fg\b/);
  });

  it("respects disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const el = screen.getByRole("button", { name: "Disabled" });
    expect(el).toBeDisabled();
  });
});
