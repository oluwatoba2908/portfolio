/* Animated onboarding drop-off funnel for the Carmen case study.
   Bars grow from the baseline when the chart scrolls into view. */
(function () {
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  const F = "'Geist', -apple-system, 'Helvetica Neue', Arial, sans-serif";
  const STEPS = [
    ["Sign up", 100], ["Company profile", 92], ["Ideal customer profile", 84],
    ["Voice training", 78], ["Connect CRM", 43], ["First campaign", 40]
  ];

  class CarmenFunnel extends HTMLElement {
    connectedCallback() {
      if (this._done) return;
      this._done = true;
      this.style.display = "block";
      this.style.width = "100%";
      this.style.background = "#ffffff";
      this.style.borderRadius = "16px";
      this.style.padding = "clamp(20px, 3vw, 44px)";
      this.style.boxSizing = "border-box";
      this.style.maxWidth = "100%";
      this.style.overflow = "hidden";

      const bars = STEPS.map(([label, pct], i) => `
        <div style="min-width:0;display:flex;flex-direction:column;">
          <div style="position:relative;height:clamp(180px,26vw,300px);background:#e6e8ec;border-radius:4px;overflow:hidden;">
            <div data-bar data-pct="${pct}" style="position:absolute;left:0;right:0;bottom:0;height:0;background:${i === 4 ? "#d93a3a" : "#191919"};transition:height 1100ms ${EASE};transition-delay:${i * 110}ms;">
              <span data-val style="position:absolute;left:10px;top:8px;font:700 clamp(13px,1.5vw,20px)/1 ${F};color:#ffffff;opacity:0;transition:opacity 500ms ${EASE};transition-delay:${i * 110 + 500}ms;">${pct}%</span>
            </div>
          </div>
          <span style="margin-top:12px;min-height:2.5em;font:600 clamp(11px,1.3vw,15px)/1.25 ${F};color:#1f1f1f;overflow-wrap:break-word;hyphens:auto;">${label}</span>
        </div>`).join("");

      this.innerHTML = `
        <h4 style="margin:0;font:700 clamp(20px,2.4vw,34px)/1.2 ${F};color:#1f1f1f;letter-spacing:0;">Where new users stopped</h4>
        <p style="margin:8px 0 0;font:400 clamp(13px,1.3vw,19px)/1.4 ${F};color:#6b6b6b;">Hotjar funnels and session recordings across the six-step onboarding</p>
        <div data-note style="display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 0;margin:22px 0 6px;opacity:0;transform:translateY(6px);transition:opacity 600ms ${EASE},transform 600ms ${EASE};transition-delay:1100ms;">
          <span style="font:700 clamp(14px,1.5vw,22px)/1.2 ${F};color:#d93a3a;">45% dropped off</span>
          <span style="font:400 clamp(12px,1.2vw,17px)/1.2 ${F};color:#6b6b6b;margin-left:10px;">at the third-party CRM step</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:clamp(16px,1.4vw,26px) clamp(6px,1.4vw,26px);align-items:start;">${bars}</div>`;

      const play = () => {
        this.querySelectorAll("[data-bar]").forEach((b) => {
          b.style.height = b.getAttribute("data-pct") + "%";
          const v = b.querySelector("[data-val]");
          if (v) v.style.opacity = "1";
        });
        const note = this.querySelector("[data-note]");
        if (note) { note.style.opacity = "1"; note.style.transform = "translateY(0)"; }
      };
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { play(); io.disconnect(); } });
      }, { threshold: 0.3 });
      io.observe(this);
    }
  }
  if (!customElements.get("carmen-funnel")) customElements.define("carmen-funnel", CarmenFunnel);
})();
