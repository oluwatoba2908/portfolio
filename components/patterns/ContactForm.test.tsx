import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactForm } from "./ContactForm";

const labels = {
  name: { label: "Your name", placeholder: "Ada" },
  email: { label: "Email", placeholder: "you@x.com" },
  message: { label: "Message", placeholder: "Hello…" },
  submitLabel: "Send",
  successHeading: "Thanks!",
  successBody: "Reply coming."
};

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the three fields and submit button", () => {
    render(<ContactForm labels={labels} />);
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("shows a validation error when name is empty", () => {
    render(<ContactForm labels={labels} />);
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent(/name/i);
  });

  it("rejects an invalid email address", () => {
    render(<ContactForm labels={labels} />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-an-email" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hi there, thanks!" } });
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent(/email/i);
  });

  it("posts to the endpoint on valid submit and shows the success message", async () => {
    render(<ContactForm labels={labels} />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Ada Lovelace" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@x.com" } });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello there, I have a question about your work." }
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Thanks!");
    });

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe("/api/contact");
    expect(call[1]?.method).toBe("POST");
    const body = JSON.parse(call[1]?.body as string);
    expect(body).toEqual({
      name: "Ada Lovelace",
      email: "ada@x.com",
      message: "Hello there, I have a question about your work."
    });
  });
});
