/**
 * Contact form endpoint.
 *
 * For now this validates + logs the submission server-side and always
 * returns { ok: true } to the client. Wire up a real transport
 * (Resend / SendGrid / Postmark) when you're ready to actually receive
 * messages — swap the `deliver()` implementation.
 */

type Payload = { name?: unknown; email?: unknown; message?: unknown };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LEN = 5000;

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

async function deliver(msg: {
  name: string;
  email: string;
  message: string;
}) {
  // TODO: replace with a real transport (e.g. Resend).
  // For now, log so submissions are visible in the dev server output.
  console.log("[contact] new message:", msg);
}

export async function POST(req: Request) {
  let raw: Payload;
  try {
    raw = (await req.json()) as Payload;
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (!name) return badRequest("Name is required.");
  if (!EMAIL_RE.test(email)) return badRequest("A valid email is required.");
  if (message.length < 10)
    return badRequest("Message must be at least 10 characters.");
  if (message.length > MAX_MESSAGE_LEN)
    return badRequest("Message is too long.");

  await deliver({ name, email, message });
  return Response.json({ ok: true });
}
