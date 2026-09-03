/* <screen-marquee> — angled infinite card marquee: two rows of screen cards
   drifting in opposite directions on a subtle 3D tilt. Pauses on hover and
   off-screen; respects reduced motion.
   Attributes: data-frames (JSON array of image URLs), data-speed (s per loop). */
(function () {
  class ScreenMarquee extends HTMLElement {
    connectedCallback() {
      if (this.__built) return;
      this.__built = true;
      let frames = [];
      try { frames = JSON.parse(this.getAttribute("data-frames") || "[]"); } catch (e) {}
      if (!frames.length) return;
      const speed = parseInt(this.getAttribute("data-speed") || "38", 10);
      const half = Math.ceil(frames.length / 2);
      const rowA = frames.slice(0, half), rowB = frames.slice(half);
      const uid = "sm" + Math.random().toString(36).slice(2, 7);

      const style = document.createElement("style");
      style.textContent = `
        @keyframes ${uid}-left  { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ${uid}-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .${uid}-track { display: flex; gap: 20px; width: max-content; will-change: transform; }
        .${uid}-card { flex: 0 0 auto; width: clamp(220px, 26vw, 360px); border-radius: 12px; overflow: hidden; box-shadow: 0 12px 28px rgba(15,23,42,0.16); background: #ffffff; }
        .${uid}-card img { display: block; width: 100%; height: auto; }
        @media (prefers-reduced-motion: reduce) { .${uid}-track { animation: none !important; } }`;
      this.appendChild(style);

      const row = (imgs, anim, dur) => `
        <div style="overflow: clip;">
          <div class="${uid}-track" style="animation: ${anim} ${dur}s linear infinite;">
            ${[...imgs, ...imgs].map((s) => `<div class="${uid}-card"><img src="${s}" alt="" decoding="async"></div>`).join("")}
          </div>
        </div>`;

      this.innerHTML += `
        <div class="${uid}-stage" style="perspective: 1400px; overflow: clip; border-radius: 16px; padding: clamp(20px, 3vw, 40px) 0;">
          <div style="transform: rotateX(14deg) rotateZ(-3deg) scale(1.06); transform-style: preserve-3d; display: flex; flex-direction: column; gap: 20px;">
            ${row(rowA, uid + "-left", speed)}
            ${row(rowB.length ? rowB : rowA, uid + "-right", speed * 1.18)}
          </div>
        </div>`;

      const tracks = [...this.querySelectorAll("." + uid + "-track")];
      this._io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          tracks.forEach((t) => { t.style.animationPlayState = e.isIntersecting ? "running" : "paused"; });
        });
      }, { threshold: 0.15 });
      this._io.observe(this);
    }
    disconnectedCallback() { if (this._io) this._io.disconnect(); }
  }
  if (!customElements.get("screen-marquee")) customElements.define("screen-marquee", ScreenMarquee);
})();
