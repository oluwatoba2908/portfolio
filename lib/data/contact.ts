/**
 * Contact page content. Extends the source (which had no form) with a real
 * contact form per the migration decision. Calendly stays as secondary CTA.
 */

export const CONTACT = {
  hero: {
    eyebrow: "Get in touch",
    title: "Let's build something together.",
    subtitle:
      "Have a product in mind, a role to fill, or just want to chat? Drop a message below — I usually reply within a couple of days."
  },
  calendly: {
    label: "Or book a 30-minute call",
    href: "https://calendly.com/tofomiyonwon/30min"
  },
  form: {
    submitLabel: "Send message",
    successHeading: "Thanks — message received.",
    successBody:
      "I'll reply from tofomiyonwon@gmail.com. If it's urgent, feel free to book time via the Calendly link.",
    fields: {
      name: {
        label: "Your name",
        placeholder: "Ada Lovelace"
      },
      email: {
        label: "Email address",
        placeholder: "you@company.com"
      },
      message: {
        label: "How can I help?",
        placeholder:
          "Tell me a little about what you're working on and what you'd like help with…"
      }
    }
  }
} as const;
