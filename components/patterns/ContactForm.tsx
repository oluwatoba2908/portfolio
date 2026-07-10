"use client";

import { useState, useTransition, type FormEvent } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";

export type ContactFormLabels = {
  name: { label: string; placeholder: string };
  email: { label: string; placeholder: string };
  message: { label: string; placeholder: string };
  submitLabel: string;
  successHeading: string;
  successBody: string;
};

export type ContactFormProps = {
  labels: ContactFormLabels;
  /** Endpoint the form POSTs to. Defaults to /api/contact. */
  action?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success" };

/**
 * ContactForm — client component. Owns local form state and submission.
 * Data (labels/action) enters via props from a server parent, so this
 * boundary stays tight and the component is unit-testable in isolation.
 */
export function ContactForm({
  labels,
  action = "/api/contact"
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();

  function validate(): string | null {
    if (!name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address.";
    if (message.trim().length < 10)
      return "Please write at least a short message (10 characters).";
    return null;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ kind: "error", message: err });
      return;
    }
    setStatus({ kind: "idle" });
    startTransition(async () => {
      try {
        const res = await fetch(action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          setStatus({
            kind: "error",
            message: body.error ?? "Something went wrong. Please try again."
          });
          return;
        }
        setStatus({ kind: "success" });
        setName("");
        setEmail("");
        setMessage("");
      } catch {
        setStatus({
          kind: "error",
          message: "Network error. Please try again."
        });
      }
    });
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-border bg-bg-alt p-8 md:p-10 text-center"
      >
        <h3 className="text-2xl font-semibold tracking-tight">
          {labels.successHeading}
        </h3>
        <p className="mt-4 text-base text-fg-secondary max-w-md mx-auto">
          {labels.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Field
        id="contact-name"
        label={labels.name.label}
        placeholder={labels.name.placeholder}
        value={name}
        onChange={setName}
        autoComplete="name"
        required
      />
      <Field
        id="contact-email"
        label={labels.email.label}
        placeholder={labels.email.placeholder}
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        required
      />
      <FieldTextarea
        id="contact-message"
        label={labels.message.label}
        placeholder={labels.message.placeholder}
        value={message}
        onChange={setMessage}
      />
      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-red-600">
          {status.message}
        </p>
      ) : null}
      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending…" : labels.submitLabel}
        </Button>
      </div>
    </form>
  );
}

/* ---------- input primitives (local, not part of ui/) ---------- */

const baseInputClasses =
  "block w-full rounded-lg border border-border bg-bg px-4 py-3 text-base " +
  "placeholder:text-fg-quiet focus:outline-none focus:ring-2 focus:ring-fg " +
  "focus:border-transparent transition-colors";

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-fg mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(baseInputClasses)}
      />
    </div>
  );
}

function FieldTextarea({
  id,
  label,
  value,
  onChange,
  placeholder
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-fg mb-2"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        rows={5}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(baseInputClasses, "resize-y")}
      />
    </div>
  );
}
