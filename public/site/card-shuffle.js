/* <card-shuffle> — infinite stacked card shuffle. The front card slides away,
   the cards behind step forward, and the front card rejoins at the back.
   Attributes: data-frames (JSON array of image URLs), data-bg, data-interval. */
(function () {
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";

  class CardShuffle extends HTMLElement {
    connectedCallback() {
      if (this.__built) return;
      this.__built = true;
      let frames = [];
      try { frames = JSON.parse(this.getAttribute("data-frames") || "[]"); } catch (e) {}
      if (!frames.length) return;
      const bg = this.getAttribute("data-bg") || "#E3EEFD";
      const interval = parseInt(this.getAttribute("data-interval") || "3200", 10);
      const n = frames.length;

      this.innerHTML = `
        <div data-stage style="position:relative;background:${bg};border-radius:24px;padding:clamp(24px,4vw,56px);overflow:hidden;">
          <div data-deck style="position:relative;max-width:820px;margin:0 auto;">
            ${frames.map((f, i) => `
              <div data-card style="position:${i === 0 ? "relative" : "absolute"};inset:${i === 0 ? "auto" : "0"};will-change:transform,opacity;transition:transform 900ms ${EASE}, opacity 700ms ${EASE};">
                <img src="${f}" alt="Partner profile card ${i + 1}" decoding="async" style="display:block;width:100%;height:auto;border-radius:16px;box-shadow:0 18px 40px rgba(31,41,63,0.14);">
              </div>`).join("")}
          </div>
        </div>`;

      const cards = [...this.querySelectorAll("[data-card]")];
      let order = cards.map((_, i) => i); // order[0] = front
      const layout = () => {
        order.forEach((ci, pos) => {
          const el = cards[ci];
          const depth = Math.min(pos, 2);
          el.style.zIndex = String(n - pos);
          el.style.opacity = pos > 2 ? "0" : String(1 - depth * 0.12);
          el.style.transform = `translateY(${-depth * 26}px) scale(${1 - depth * 0.05})`;
        });
      };
      layout();

      let visible = false;
      this._io = new IntersectionObserver((es) => { es.forEach((e) => { visible = e.isIntersecting; }); }, { threshold: 0.3 });
      this._io.observe(this);

      const shuffle = () => {
        if (!visible || document.hidden) return;
        const front = cards[order[0]];
        // front card slides down-and-out, then rejoins at the back
        front.style.opacity = "0";
        front.style.transform = "translateY(56px) scale(0.98)";
        setTimeout(() => {
          order = order.slice(1).concat(order[0]);
          layout();
        }, 650);
      };
      this._timer = setInterval(shuffle, interval);
    }
    disconnectedCallback() {
      clearInterval(this._timer);
      if (this._io) this._io.disconnect();
    }
  }
  if (!customElements.get("card-shuffle")) customElements.define("card-shuffle", CardShuffle);
})();
