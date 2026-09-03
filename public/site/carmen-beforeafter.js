/* Animated onboarding before/after bars for the Carmen case study.
   Bars grow from the left when scrolled into view. Airstride blue accent. */
(function () {
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  const F = "'Geist', -apple-system, 'Helvetica Neue', Arial, sans-serif";
  const BLUE = "#2563eb";

  class CarmenBeforeAfter extends HTMLElement {
    connectedCallback() {
      if (this._done) return;
      this._done = true;
      this.style.display = "block";
      this.style.width = "100%";
      this.style.background = "#ffffff";
      this.style.borderRadius = "16px";
      this.style.padding = "clamp(24px, 3.5vw, 48px)";
      this.style.boxSizing = "border-box";

      this.innerHTML = `
        <h4 style="margin:0;font:700 clamp(20px,2.4vw,32px)/1.2 ${F};color:#1f1f1f;letter-spacing:0;">Onboarding, before and after</h4>
        <p style="margin:8px 0 0;font:400 clamp(13px,1.3vw,18px)/1.4 ${F};color:#6b6b6b;">Steps removed and the CRM connection simplified after the first launch</p>

        <div style="margin-top:clamp(24px,3vw,36px);">
          <span style="font:700 clamp(11px,1.1vw,13px)/1 ${F};letter-spacing:0.08em;color:#9aa0a6;">BEFORE</span>
          <div style="display:flex;align-items:center;gap:20px;margin-top:10px;">
            <div style="flex:1;height:clamp(46px,5vw,60px);background:#eceef1;border-radius:6px;overflow:hidden;">
              <div data-bar="before" style="height:100%;width:0;background:#111111;border-radius:6px;display:flex;align-items:center;transition:width 1200ms ${EASE};">
                <span style="padding-left:20px;font:700 clamp(16px,1.9vw,24px)/1 ${F};color:#ffffff;white-space:nowrap;">20 minutes</span>
              </div>
            </div>
            <span style="flex-shrink:0;width:clamp(80px,10vw,140px);font:400 clamp(13px,1.3vw,17px)/1.3 ${F};color:#6b6b6b;">6 steps</span>
          </div>
        </div>

        <div style="margin-top:clamp(18px,2.2vw,26px);">
          <span style="font:700 clamp(11px,1.1vw,13px)/1 ${F};letter-spacing:0.08em;color:#9aa0a6;">AFTER</span>
          <div style="display:flex;align-items:center;gap:20px;margin-top:10px;">
            <div style="flex:1;height:clamp(46px,5vw,60px);background:#eceef1;border-radius:6px;overflow:hidden;">
              <div data-bar="after" style="height:100%;width:0;background:${BLUE};border-radius:6px;display:flex;align-items:center;transition:width 1200ms ${EASE};transition-delay:350ms;">
                <span style="padding-left:20px;font:700 clamp(15px,1.8vw,22px)/1 ${F};color:#ffffff;white-space:nowrap;">Under 10 minutes</span>
              </div>
            </div>
            <span style="flex-shrink:0;width:clamp(80px,10vw,140px);font:400 clamp(13px,1.3vw,17px)/1.3 ${F};color:#6b6b6b;">Fewer steps, simpler CRM step</span>
          </div>
        </div>

        <p style="margin:clamp(20px,2.6vw,30px) 0 0;font:400 clamp(12px,1.2vw,16px)/1.4 ${F};color:#9aa0a6;">Measured from first sign-in to a live campaign</p>`;

      const play = () => {
        const b = this.querySelector('[data-bar="before"]');
        const a = this.querySelector('[data-bar="after"]');
        if (b) b.style.width = "100%";
        if (a) a.style.width = "47%";
      };
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { play(); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(this);
    }
  }
  if (!customElements.get("carmen-beforeafter")) customElements.define("carmen-beforeafter", CarmenBeforeAfter);
})();
