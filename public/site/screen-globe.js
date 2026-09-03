/* <screen-globe> — real 3D globe of screen tiles (CSS 3D). Tiles are placed on
   a sphere via rotateY/rotateX + translateZ and the whole sphere spins
   continuously, with an ease-in-out sway/tilt layered on the wrapper.
   Attributes: data-frames (JSON array of image URLs), data-size (px). */
(function () {
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";

  class ScreenGlobe extends HTMLElement {
    connectedCallback() {
      if (this.__built) return;
      this.__built = true;
      let frames = [];
      try { frames = JSON.parse(this.getAttribute("data-frames") || "[]"); } catch (e) {}
      if (!frames.length) return;
      const size = parseInt(this.getAttribute("data-size") || "560", 10);
      const R = size * 0.36;                 // sphere radius
      const tileW = size * 0.42, tileH = tileW * 0.78;

      // two latitude rings + top/bottom caps, tiles distributed around each
      const placements = [];
      const rings = [
        { lat: 22, count: 5 },
        { lat: -22, count: 5 },
        { lat: 58, count: 3 },
        { lat: -58, count: 3 }
      ];
      rings.forEach((ring, ri) => {
        for (let i = 0; i < ring.count; i++) {
          placements.push({ lon: (360 / ring.count) * i + ri * 24, lat: ring.lat });
        }
      });

      const uid = "sg" + Math.random().toString(36).slice(2, 7);
      const style = document.createElement("style");
      style.textContent = `
        @keyframes ${uid}-spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes ${uid}-sway {
          0%   { transform: rotateX(-12deg) rotateZ(0deg) translateY(0); }
          25%  { transform: rotateX(-7deg) rotateZ(3deg) translateY(-8px); }
          50%  { transform: rotateX(-12deg) rotateZ(0deg) translateY(0); }
          75%  { transform: rotateX(-16deg) rotateZ(-3deg) translateY(-8px); }
          100% { transform: rotateX(-12deg) rotateZ(0deg) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-${uid}-spin], [data-${uid}-sway] { animation: none !important; }
        }`;
      this.appendChild(style);

      this.innerHTML += `
        <div style="display:flex;justify-content:center;padding:8px 0;">
          <div style="perspective:${size * 2.2}px;width:${size}px;max-width:100%;aspect-ratio:1;">
            <div data-${uid}-sway style="width:100%;height:100%;transform-style:preserve-3d;animation:${uid}-sway 16s ${EASE} infinite;">
              <div data-${uid}-spin style="position:relative;width:100%;height:100%;transform-style:preserve-3d;animation:${uid}-spin 34s linear infinite;">
                ${placements.map((p, i) => {
                  const src = frames[i % frames.length];
                  return `<div style="position:absolute;left:50%;top:50%;width:${tileW}px;height:${tileH}px;margin:${-tileH / 2}px 0 0 ${-tileW / 2}px;transform:rotateY(${p.lon}deg) rotateX(${p.lat}deg) translateZ(${R}px);backface-visibility:hidden;border-radius:10px;overflow:hidden;box-shadow:0 10px 26px rgba(15,23,42,0.18);">
                    <img src="${src}" alt="" decoding="async" style="display:block;width:100%;height:100%;object-fit:cover;">
                  </div>`;
                }).join("")}
              </div>
            </div>
          </div>
        </div>`;

      // pause the animations off-screen
      const spin = this.querySelector(`[data-${uid}-spin]`);
      const sway = this.querySelector(`[data-${uid}-sway]`);
      this._io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          const st = e.isIntersecting ? "running" : "paused";
          if (spin) spin.style.animationPlayState = st;
          if (sway) sway.style.animationPlayState = st;
        });
      }, { threshold: 0.15 });
      this._io.observe(this);
    }
    disconnectedCallback() { if (this._io) this._io.disconnect(); }
  }
  if (!customElements.get("screen-globe")) customElements.define("screen-globe", ScreenGlobe);
})();
