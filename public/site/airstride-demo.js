/* <airstride-demo> — looping simulated demo of the Airstride overview:
   empty state -> scroll down/up -> cursor to "Preview sample data" -> click ->
   "Syncing with CRM" loader -> filled state -> scroll down -> loop. */
(function () {
  const EMPTY = "assets/m-as-home-new-1.png";
  const FILLED = "assets/m-as-home-new-2.png";
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  class AirstrideDemo extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.style.cssText = "display:block;width:100%;";
      this.innerHTML = `
        <div data-frame style="position:relative;width:100%;border-radius:24px;overflow:hidden;background:#0d1117;box-shadow:0 24px 60px rgba(0,0,0,0.35);">
          <div style="display:flex;align-items:center;gap:8px;height:38px;padding:0 14px;background:#181d24;">
            <span style="width:10px;height:10px;border-radius:99px;background:#ff5f57;"></span>
            <span style="width:10px;height:10px;border-radius:99px;background:#febc2e;"></span>
            <span style="width:10px;height:10px;border-radius:99px;background:#28c840;"></span>
            <span style="flex:1;text-align:center;font:500 12px/1 'Geist',system-ui,sans-serif;color:#9aa4b2;">app.airstride.ai</span>
            <span style="width:46px;"></span>
          </div>
          <div data-viewport style="position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;background:#f6f7f9;">
            <img data-img-empty src="${EMPTY}" alt="Airstride overview, empty state" style="position:absolute;left:0;top:0;width:100%;height:auto;display:block;">
            <img data-img-filled src="${FILLED}" alt="Airstride overview, filled with partner data" style="position:absolute;left:0;top:0;width:100%;height:auto;display:block;opacity:0;">
            <div data-target style="position:absolute;left:79%;top:0;width:11%;height:3%;border-radius:8px;box-shadow:0 0 0 0 rgba(29,78,216,0);"></div>
            <div data-overlay style="position:absolute;inset:0;background:rgba(10,10,10,0.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;pointer-events:none;"></div>
            <div data-loader style="position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:12px;padding:16px 26px;background:#0a0a0a;opacity:0;pointer-events:none;">
              <span data-sq style="width:10px;height:10px;background:#3b82f6;"></span>
              <span data-sq style="width:10px;height:10px;background:#ec4899;"></span>
              <span data-sq style="width:10px;height:10px;background:#22c55e;"></span>
              <span style="font:600 14px/1 'Geist',system-ui,sans-serif;letter-spacing:0.08em;color:#ffffff;">SYNCING YOUR CRM</span>
            </div>
            <div data-cursor style="position:absolute;left:50%;top:80%;width:18px;height:18px;opacity:0;z-index:5;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 2l14 9-6.5 1.5L15 20l-3 1.5-2.5-7.5L5 18z" fill="#111" stroke="#fff" stroke-width="1.4"/></svg>
            </div>
            <div data-ripple style="position:absolute;width:34px;height:34px;border-radius:99px;border:2px solid #1d4ed8;opacity:0;z-index:4;"></div>
          </div>
        </div>`;
      const style = document.createElement("style");
      style.textContent = "@keyframes asd-blink{0%,100%{opacity:1}50%{opacity:0.25}}";
      this.appendChild(style);
      this.querySelectorAll("[data-sq]").forEach((sq, i) => { sq.style.animation = `asd-blink 1s ${i * 0.22}s ease-in-out infinite`; });
      this._run();
    }

    disconnectedCallback() { this._stopped = true; clearInterval(this._visTimer); }

    async _run() {
      const q = (s) => this.querySelector(s);
      const vp = q("[data-viewport]"), empty = q("[data-img-empty]"), filled = q("[data-img-filled]");
      const target = q("[data-target]"), loader = q("[data-loader]"), cursor = q("[data-cursor]"), ripple = q("[data-ripple]"), overlay = q("[data-overlay]");
      const loaded = (img) => img.complete ? Promise.resolve() : new Promise((r) => { img.onload = r; img.onerror = r; });
      await Promise.all([loaded(empty), loaded(filled)]);
      // start only when scrolled into view; pause while off-screen.
      // IO can be inert in embedded iframes, so poll visibility as the source of truth.
      this._visible = false;
      const checkVis = () => {
        const r = this.getBoundingClientRect();
        this._visible = r.bottom > 0 && r.top < window.innerHeight * 0.85;
      };
      checkVis();
      this._visTimer = setInterval(checkVis, 400);

      const scrollRange = (img) => Math.max(0, img.clientHeight - vp.clientHeight);
      const move = (el, ms, css) => { el.style.transition = `all ${ms}ms ${EASE}`; Object.assign(el.style, css); return wait(ms + 60); };

      while (!this._stopped) {
        while (!this._visible && !this._stopped) await wait(250);
        if (this._stopped) return;
        // reset
        [empty, filled, cursor].forEach((el) => { el.style.transition = "none"; });
        empty.style.transform = "translateY(0)"; empty.style.opacity = "1";
        filled.style.transform = "translateY(0)"; filled.style.opacity = "0";
        loader.style.opacity = "0"; overlay.style.opacity = "0"; cursor.style.opacity = "0";
        cursor.style.left = "55%"; cursor.style.top = "85%"; ripple.style.opacity = "0";
        // The "Preview with sample data" button lives at a fixed spot in the
        // screenshot. The image scales uniformly, so fractions of its RENDERED
        // size are resolution-independent. Fractions measured from the actual
        // image: button centre at 78.4% across, 17.5% of width down.
        const iw = empty.clientWidth;
        const BTN = { cx: 0.784, cy: 0.175, w: 0.141, h: 0.0245 };
        target.style.left = (iw * (BTN.cx - BTN.w / 2)) + "px";
        target.style.top = (iw * (BTN.cy - BTN.h / 2)) + "px";
        target.style.width = (iw * BTN.w) + "px";
        target.style.height = (iw * BTN.h) + "px";
        await wait(1400);

        // 1. scroll the empty state to the end of the page and back up
        const r1 = scrollRange(empty);
        if (r1 > 4) {
          await move(empty, 2600, { transform: `translateY(-${r1}px)` });
          await wait(700);
          await move(empty, 2200, { transform: "translateY(0)" });
        }
        await wait(500);

        // 2. cursor appears and travels to the existing Preview with sample data button
        cursor.style.transition = "opacity 400ms " + EASE;
        cursor.style.opacity = "1";
        await wait(420);
        const bx = target.offsetLeft + target.offsetWidth / 2, by = target.offsetTop + target.offsetHeight / 2;
        await move(cursor, 1300, { left: bx + "px", top: by + "px" });

        // 3. click: highlight ring hugging the real button + ripple
        target.style.transition = "box-shadow 200ms " + EASE;
        target.style.boxShadow = "0 0 0 2px #1d4ed8, 0 0 0 5px rgba(29,78,216,0.25)";
        ripple.style.left = (bx - 17) + "px"; ripple.style.top = (by - 17) + "px";
        ripple.style.transition = "none"; ripple.style.opacity = "0.8"; ripple.style.transform = "scale(0.4)";
        await wait(20);
        await move(ripple, 450, { opacity: "0", transform: "scale(1.6)" });
        target.style.boxShadow = "0 0 0 0 rgba(29,78,216,0)";
        cursor.style.opacity = "0";

        // 4. SYNCING YOUR CRM box over a dark blurred overlay
        overlay.style.transition = "opacity 350ms " + EASE;
        overlay.style.opacity = "1";
        loader.style.transition = "opacity 350ms " + EASE;
        loader.style.opacity = "1";
        await wait(2000);
        filled.style.transition = "opacity 500ms " + EASE;
        filled.style.opacity = "1";
        loader.style.opacity = "0";
        overlay.style.opacity = "0";
        await wait(900);

        // 5. scroll the filled page down to show it all, then rest and loop
        const r2 = scrollRange(filled);
        if (r2 > 4) {
          filled.style.transition = "none";
          await move(filled, 3000, { transform: `translateY(-${r2}px)` });
          await wait(1100);
        } else {
          await wait(1600);
        }
      }
    }
  }
  if (!customElements.get("airstride-demo")) customElements.define("airstride-demo", AirstrideDemo);
})();
