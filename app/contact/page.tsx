/**
 * Ported from contact.dc.html. Drop at app/contact/page.tsx.
 * Replace CALENDLY_URL with your real Calendly link.
 */

import { Nav } from "@/components/patterns/Nav";
import { Footer } from "@/components/patterns/Footer";
import { SITE } from "@/lib/data/site";

const CALENDLY_URL = SITE.calendlyUrl;

export default function ContactPage() {
  return (
    <div style={{ position: "relative", background: "#efefef" }}>
      <Nav />

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(64px, 10vw, 140px) 20px", textAlign: "center" }}>
        <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9a9a9a", margin: "0 0 16px" }}>
          About me
        </p>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, letterSpacing: 0, margin: 0 }}>Let&apos;s talk.</h1>
        <p style={{ marginTop: 16, fontSize: 18, color: "#6b6b6b", maxWidth: "50ch", margin: "16px auto 0" }}>
          Open to new roles and collaborations — book a slot or send a note.
        </p>

        <div style={{ marginTop: 40, borderRadius: 24, background: "#ffffff", border: "1px solid rgba(25,25,25,0.08)", padding: "clamp(32px, 5vw, 56px)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 16px" }}>Book a call</h2>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              display: "inline-flex",
              width: "fit-content",
              margin: "0 auto",
              padding: "12px 24px",
              borderRadius: 999,
              background: "#191919",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            Contact Calendly
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
