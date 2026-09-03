/* <airstride-tour> — looping chaptered product tour: crossfades through a set
   of real product frames with a chapter label. Frames via data-frames (JSON
   array of URLs), labels via data-labels (JSON array, optional). */
(function () {
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  class AirstrideTour extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      let frames = [], labels = [], cursors = [], holds = [], aspects = [];
      try { frames = JSON.parse(this.getAttribute("data-frames") || "[]"); } catch (e) {}
      try { labels = JSON.parse(this.getAttribute("data-labels") || "[]"); } catch (e) {}
      try { cursors = JSON.parse(this.getAttribute("data-cursors") || "[]"); } catch (e) {}
      try { holds = JSON.parse(this.getAttribute("data-holds") || "[]"); } catch (e) {}
      try { aspects = JSON.parse(this.getAttribute("data-aspects") || "[]"); } catch (e) {}
      if (!frames.length) return;
      this.style.cssText = "display:block;width:100%;";
      const bar = this.getAttribute("data-bar") || "app.airstride.ai";
      const aspect = this.getAttribute("data-aspect") || "16/10";
      // viewport mode: fixed window that scrolls tall frames to reveal the click
      const viewport = this.getAttribute("data-viewport") || "";
      const useViewport = viewport && viewport.indexOf("/") > 0;
      const stageAspect = useViewport ? viewport : aspect;
      const imgCss = useViewport
        ? `position:absolute;left:0;top:0;width:100%;height:auto;transform:translateY(0);will-change:transform;`
        : `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;`;
      this.innerHTML = `
        <div style="position:relative;width:100%;border-radius:16px;overflow:hidden;background:#0d1117;">
          <div style="display:flex;align-items:center;gap:8px;height:34px;padding:0 14px;background:#181d24;">
            <span style="width:9px;height:9px;border-radius:99px;background:#ff5f57;"></span>
            <span style="width:9px;height:9px;border-radius:99px;background:#febc2e;"></span>
            <span style="width:9px;height:9px;border-radius:99px;background:#28c840;"></span>
            <span style="flex:1;text-align:center;font:500 12px/1 'Geist',system-ui,sans-serif;color:#9aa4b2;">${bar}</span>
            <span style="width:43px;"></span>
          </div>
          <div data-stage style="position:relative;width:100%;aspect-ratio:${stageAspect};overflow:hidden;background:#f6f7f9;">
            ${frames.map((f, i) => `<img data-src="${f}" alt="" decoding="async" style="${imgCss}opacity:${i === 0 ? 1 : 0};transition:opacity 700ms ${EASE}, transform 950ms ${EASE};">`).join("")}
            <div data-label style="position:absolute;left:14px;bottom:14px;padding:8px 14px;background:rgba(10,10,10,0.75);backdrop-filter:blur(4px);border-radius:8px;font:600 12px/1 'Geist',system-ui,sans-serif;letter-spacing:0.06em;color:#ffffff;opacity:${labels.length ? 1 : 0};"></div>
            <div data-cursor style="position:absolute;left:55%;top:80%;width:18px;height:18px;opacity:0;z-index:5;transition:left 900ms ${EASE}, top 900ms ${EASE}, opacity 400ms ${EASE};filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 2l14 9-6.5 1.5L15 20l-3 1.5-2.5-7.5L5 18z" fill="#111" stroke="#fff" stroke-width="1.4"/></svg>
            </div>
            <div data-ripple style="position:absolute;width:34px;height:34px;border-radius:99px;border:2px solid #1d4ed8;opacity:0;z-index:4;"></div>
            <div data-dots style="position:absolute;right:14px;bottom:16px;display:flex;gap:6px;"></div>
          </div>
        </div>`;
      const imgs = [...this.querySelectorAll("[data-stage] img")];
      const label = this.querySelector("[data-label]");
      const dotsWrap = this.querySelector("[data-dots]");
      const dots = frames.map((_, i) => {
        const d = document.createElement("span");
        d.style.cssText = `width:7px;height:7px;border-radius:99px;background:rgba(255,255,255,${i === 0 ? 0.95 : 0.35});box-shadow:0 1px 3px rgba(0,0,0,0.4);transition:background 400ms ${EASE};`;
        dotsWrap.appendChild(d);
        return d;
      });
      let idx = 0;
      const applyAspect = () => {
        const stage = this.querySelector("[data-stage]");
        if (useViewport) return; // fixed window; never resize per frame
        if (stage && aspects && aspects[idx]) stage.style.aspectRatio = String(aspects[idx]).replace('/', ' / ');
      };
      const hydrate = (n) => {
        for (let d = -1; d <= 1; d++) {
          const im = imgs[(n + d + imgs.length) % imgs.length];
          if (im && im.getAttribute("data-src")) {
            im.src = im.getAttribute("data-src");
            im.removeAttribute("data-src");
          }
        }
      };
      hydrate(0);
      const show = (n) => {
        hydrate(n % imgs.length);
        imgs[idx].style.opacity = "0";
        dots[idx].style.background = "rgba(255,255,255,0.35)";
        idx = n % imgs.length;
        // reset the incoming frame to the top with no scroll animation
        if (useViewport) { imgs[idx].style.transition = "none"; imgs[idx].style.transform = "translateY(0)"; void imgs[idx].offsetWidth; imgs[idx].style.transition = `opacity 700ms ${EASE}, transform 950ms ${EASE}`; }
        imgs[idx].style.opacity = "1";
        dots[idx].style.background = "rgba(255,255,255,0.95)";
        if (labels[idx]) label.textContent = labels[idx];
        applyAspect();
      };
      if (labels[0]) label.textContent = labels[0];
      applyAspect();
      const cursor = this.querySelector("[data-cursor]");
      const ripple = this.querySelector("[data-ripple]");
      const stage = this.querySelector("[data-stage]");
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      // start only when scrolled into view; pause while off-screen.
      // IO can be inert in embedded iframes, so poll visibility as the source of truth.
      this._visible = false;
      const checkVis = () => {
        const r = this.getBoundingClientRect();
        this._visible = r.bottom > 0 && r.top < window.innerHeight * 0.85;
      };
      checkVis();
      this._visTimer = setInterval(checkVis, 400);
      // await the current frame's decode so mapPoint has real dimensions
      const frameReady = async (img) => {
        if (img.complete && img.naturalWidth > 0) return true;
        await new Promise((r) => { img.onload = r; img.onerror = r; setTimeout(r, 4000); });
        return img.naturalWidth > 0;
      };
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
      // width-fill geometry for viewport mode
      const geom = () => {
        const img = imgs[idx];
        const iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
        const sw = stage.clientWidth, sh = stage.clientHeight;
        const dh = sw * ih / iw;
        return { sw, sh, dh, maxScroll: Math.max(0, dh - sh) };
      };
      // map a fraction-of-image point to stage pixels (object-fit: cover, top-anchored)
      const mapPoint = (c) => {
        const img = imgs[idx];
        const iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
        const sw = stage.clientWidth, sh = stage.clientHeight;
        const scale = Math.max(sw / iw, sh / ih);
        const dw = iw * scale, dh = ih * scale;
        return { x: (sw - dw) / 2 + c[0] * dw, y: c[1] * dh };
      };
      const run = async () => {
        while (!this._stopped) {
          while (!this._visible && !this._stopped) await wait(250);
          if (this._stopped) return;
          await wait(2000);
          const c = cursors[idx];
          if (useViewport && this._visible && await frameReady(imgs[idx])) {
            // viewport mode: scroll the tall frame to bring the target (or page) into view
            const g = geom();
            if (c && c.length === 2) {
              const tx = c[0] * g.sw, ty = c[1] * g.dh;
              const scrollY = clamp(ty - g.sh * 0.5, 0, g.maxScroll);
              imgs[idx].style.transform = `translateY(${-scrollY}px)`;
              if (scrollY > 2) await wait(1000);
              const x = tx, y = ty - scrollY;
              cursor.style.opacity = "1";
              await wait(60);
              cursor.style.left = x + "px"; cursor.style.top = y + "px";
              await wait(980);
              ripple.style.left = (x - 17) + "px"; ripple.style.top = (y - 17) + "px";
              ripple.style.transition = "none"; ripple.style.opacity = "0.8"; ripple.style.transform = "scale(0.4)";
              await wait(30);
              ripple.style.transition = `opacity 450ms ${EASE}, transform 450ms ${EASE}`;
              ripple.style.opacity = "0"; ripple.style.transform = "scale(1.6)";
              await wait(430);
              cursor.style.opacity = "0";
              await wait(220);
            } else if (g.maxScroll > 2) {
              // no click: slowly pan the tall page so the eye can read it
              await wait(400);
              imgs[idx].style.transform = `translateY(${-g.maxScroll}px)`;
              await wait(1400);
            }
          } else if (c && c.length === 2 && this._visible && await frameReady(imgs[idx])) {
            const p = mapPoint(c);
            const x = p.x, y = p.y;
            cursor.style.opacity = "1";
            await wait(60);
            cursor.style.left = x + "px"; cursor.style.top = y + "px";
            await wait(980);
            ripple.style.left = (x - 17) + "px"; ripple.style.top = (y - 17) + "px";
            ripple.style.transition = "none"; ripple.style.opacity = "0.8"; ripple.style.transform = "scale(0.4)";
            await wait(30);
            ripple.style.transition = `opacity 450ms ${EASE}, transform 450ms ${EASE}`;
            ripple.style.opacity = "0"; ripple.style.transform = "scale(1.6)";
            await wait(430);
            cursor.style.opacity = "0";
            await wait(220);
          }
          if (this._stopped) return;
          // extra dwell for loader frames so their progress reads
          if (holds[idx]) await wait(holds[idx]);
          if (this._stopped) return;
          show(idx + 1);
        }
      };
      run();
    }
    disconnectedCallback() { this._stopped = true; clearInterval(this._timer); clearInterval(this._visTimer); }
  }
  if (!customElements.get("airstride-tour")) customElements.define("airstride-tour", AirstrideTour);
})();
