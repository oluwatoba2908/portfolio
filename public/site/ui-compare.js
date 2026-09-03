/* <ui-compare> — stacked "New UI" / "Old UI" carousels for feature sections.

   Display rules, in service of image quality:
   - each screen keeps its OWN aspect ratio (no fixed height, no cropping)
   - a tall screen (full-page dashboard) is shown at full intrinsic height
     inside a capped, internally scrollable slide, so nothing is squashed
   - a Zoom control opens the image at full resolution in a lightbox
   - slides are filled by drag-drop or click-to-browse; ids persist the drop

   Attributes:
     data-id     key prefix for the slots (required, unique per section)
     data-count  slides per row (default 4)
     data-new    placeholder text for the New UI row
     data-old    placeholder text for the Old UI row            */
(function () {
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  const F = "'Geist', system-ui, sans-serif";
  const CAP = "clamp(420px, 72vh, 780px)";

  // slim scrollbar so it never overshadows the screenshot
  if (!document.getElementById("ui-compare-sb")) {
    const st = document.createElement("style");
    st.id = "ui-compare-sb";
    st.textContent =
      // 5px webkit bar, pulled outside the content box so it never eats image width
      "ui-compare [data-scroll]::-webkit-scrollbar{width:5px;height:5px;background:transparent;}" +
      "ui-compare [data-scroll]::-webkit-scrollbar-track{background:transparent;}" +
      "ui-compare [data-scroll]::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.20);border-radius:999px;}" +
      "ui-compare [data-scroll]:hover::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.34);}" +
      // Firefox has no ::-webkit-scrollbar, so scope the standard props to it only
      "@supports not selector(::-webkit-scrollbar){" +
      "ui-compare [data-scroll]{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.22) transparent;}}";
    document.head.appendChild(st);
  }

  /* ---------- full-resolution lightbox with slider ---------- */
  let box = null;
  const TOUR_KEY = "uicompare.zoomTourSeen.v2";

  function lightbox(list, startIdx, alt) {
    if (!box) {
      box = document.createElement("div");
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-label", "Full size screen");
      box.style.cssText =
        "position:fixed;inset:0;z-index:9999;display:none;background:rgba(8,8,8,0.92);" +
        "overflow:auto;padding:32px 20px 64px;box-sizing:border-box;cursor:zoom-out;" +
        "align-items:center;justify-content:center;" +
        "opacity:0;transition:opacity 220ms " + EASE + ";";

      const inner = document.createElement("img");
      inner.dataset.lb = "";
      // fit the viewport width; clicking advances to the next screen.
      // margin:auto centres a short image inside the flex box; a tall one
      // overflows and the box scrolls as normal.
      inner.style.cssText =
        "position:relative;z-index:1;display:block;margin:auto;width:100%;max-width:1400px;" +
        "height:auto;border-radius:8px;cursor:pointer;";
      inner.addEventListener("click", function (e) {
        e.stopPropagation();
        const l = box.__list || [];
        if (l.length < 2) return;
        box.__idx = (box.__idx + 1) % l.length;
        paint();
        dismissTour();
      });

      const close = document.createElement("button");
      close.textContent = "\u2715";
      close.setAttribute("aria-label", "Close");
      close.style.cssText =
        "position:fixed;top:16px;right:18px;z-index:10;width:40px;height:40px;border:none;border-radius:999px;" +
        "background:rgba(20,20,20,0.85);color:#fff;font-size:16px;cursor:pointer;" +
        "box-shadow:0 8px 20px rgba(0,0,0,0.5);";

      const counter = document.createElement("div");
      counter.dataset.lbCount = "";
      counter.style.cssText =
        "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:10;padding:7px 14px;" +
        "border-radius:999px;background:rgba(20,20,20,0.85);color:#fff;font:600 12px/1 " + F + ";" +
        "letter-spacing:0.06em;pointer-events:none;";

      // one-time guided hint for the slider
      const tour = document.createElement("div");
      tour.dataset.lbTour = "";
      tour.style.cssText =
        "position:fixed;left:50%;bottom:58px;transform:translateX(-50%);z-index:11;display:none;" +
        "max-width:min(88vw,420px);padding:14px 18px;border-radius:14px;background:#ffffff;color:#191919;" +
        "font:500 13px/1.5 " + F + ";text-align:center;box-shadow:0 18px 40px rgba(0,0,0,0.5);";
      tour.innerHTML =
        '<strong style="display:block;margin-bottom:4px;font-weight:700;">Click the screen to see the next one</strong>' +
        'Use \u2190 \u2192 to move between screens, and Esc to close.' +
        '<button data-lb-tour-ok style="display:block;margin:10px auto 0;padding:7px 16px;border:none;border-radius:999px;' +
        'background:#191919;color:#fff;font:600 12px/1 ' + F + ';cursor:pointer;">Got it</button>';

      box.appendChild(inner);
      box.appendChild(close);
      box.appendChild(counter);
      box.appendChild(tour);
      document.body.appendChild(box);

      const hide = () => {
        box.style.opacity = "0";
        setTimeout(() => {
          box.style.display = "none";
          // release the page and restore its scroll position
          const de = document.documentElement;
          de.style.overflow = box.__prevHtmlOverflow || "";
          document.body.style.overflow = box.__prevBodyOverflow || "";
          if (typeof box.__prevScroll === "number") window.scrollTo(0, box.__prevScroll);
        }, 220);
      };
      box.addEventListener("click", hide);
      close.addEventListener("click", (e) => { e.stopPropagation(); hide(); });
      tour.addEventListener("click", (e) => e.stopPropagation());
      tour.querySelector("[data-lb-tour-ok]").addEventListener("click", (e) => {
        e.stopPropagation();
        dismissTour();
      });
      document.addEventListener("keydown", (e) => {
        if (box.style.display !== "block") return;
        const l = box.__list || [];
        if (e.key === "Escape") hide();
        else if (e.key === "ArrowRight" && l.length > 1) { box.__idx = (box.__idx + 1) % l.length; paint(); dismissTour(); }
        else if (e.key === "ArrowLeft" && l.length > 1) { box.__idx = (box.__idx - 1 + l.length) % l.length; paint(); dismissTour(); }
      });
    }

    box.__list = list;
    box.__idx = startIdx || 0;
    box.__alt = alt || "";
    paint();
    const de = document.documentElement;
    box.__prevScroll = window.scrollY || de.scrollTop || 0;
    box.__prevHtmlOverflow = de.style.overflow;
    box.__prevBodyOverflow = document.body.style.overflow;
    de.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    box.style.display = "flex";
    box.scrollTop = 0;
    requestAnimationFrame(() => { box.style.opacity = "1"; });

    // first visit only, and only when there is more than one screen to browse
    let seen = false;
    try { seen = window.sessionStorage.getItem(TOUR_KEY) === "1"; } catch (e) {}
    const tourEl = box.querySelector("[data-lb-tour]");
    if (!seen && list.length > 1) {
      tourEl.style.display = "block";
      clearTimeout(box.__tourTimer);
      box.__tourTimer = setTimeout(dismissTour, 9000);
    } else {
      tourEl.style.display = "none";
    }
  }

  function dismissTour() {
    if (!box) return;
    const tourEl = box.querySelector("[data-lb-tour]");
    if (tourEl) tourEl.style.display = "none";
    clearTimeout(box.__tourTimer);
    try { window.sessionStorage.setItem(TOUR_KEY, "1"); } catch (e) {}
  }

  function paint() {
    if (!box) return;
    const l = box.__list || [];
    const img = box.querySelector("[data-lb]");
    const counter = box.querySelector("[data-lb-count]");
    img.src = l[box.__idx] || "";
    img.alt = box.__alt;
    img.style.cursor = l.length > 1 ? "pointer" : "zoom-out";
    counter.textContent = l.length > 1 ? (box.__idx + 1) + " / " + l.length : "";
    counter.style.display = l.length > 1 ? "block" : "none";
    box.scrollTop = 0;
  }

  /* ---------- per-slot sizing from the real image ---------- */
  function trackSlot(slot, slide, zoom) {
    const box = slide.querySelector("[data-scroll]") || slide;
    let last = "";
    const apply = () => {
      const inner = slot.shadowRoot && slot.shadowRoot.querySelector(".frame img");
      const iw = inner && inner.naturalWidth;
      const ih = inner && inner.naturalHeight;
      if (!iw || !ih) {
        // empty slot: a calm placeholder box, not a 1440px void
        slot.style.height = "clamp(240px, 30vw, 380px)";
        zoom.style.display = "none";
        return;
      }
      const w = box.clientWidth || slot.clientWidth || 1;
      // intrinsic height at the current column width — never cropped, never squashed
      const h = Math.round(w * (ih / iw));
      const key = w + "x" + h;
      if (key !== last) {
        last = key;
        slot.style.height = h + "px";
        // let the viewport hug a short image instead of leaving dead space under
        // it; tall pages still cap at CAP and scroll internally
        box.style.height = "auto";
        const capPx = box.getBoundingClientRect
          ? parseFloat(getComputedStyle(box).maxHeight) || 0
          : 0;
        box.style.height = capPx && h < capPx ? h + "px" : "";
      }
      zoom.style.display = "inline-flex";
      zoom.__src = inner.currentSrc || inner.src;
    };
    // the image can land long after mount (sidecar hydration, user drop), so poll
    // only until it is known, then rely on the observers below.
    let iv = setInterval(() => {
      const inner = slot.shadowRoot && slot.shadowRoot.querySelector(".frame img");
      if (inner && inner.naturalWidth) { clearInterval(iv); iv = null; }
      apply();
    }, 500);
    slot.__stopTrack = () => { if (iv) { clearInterval(iv); iv = null; } };
    apply();
    if (window.ResizeObserver) new ResizeObserver(apply).observe(slide);
    // a later replacement drop swaps the shadow img's src: re-measure on load,
    // and resume polling if the slot is emptied again
    if (slot.shadowRoot) {
      new MutationObserver(() => {
        apply();
        const inner = slot.shadowRoot.querySelector(".frame img");
        if (inner) inner.addEventListener("load", apply, { once: true });
        if ((!inner || !inner.naturalWidth) && !iv) {
          iv = setInterval(() => {
            const n = slot.shadowRoot && slot.shadowRoot.querySelector(".frame img");
            if (n && n.naturalWidth) { clearInterval(iv); iv = null; }
            apply();
          }, 500);
        }
      }).observe(slot.shadowRoot, { attributes: true, subtree: true, attributeFilter: ["src"] });
    }
  }

  class UICompare extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;

      const key = this.getAttribute("data-id") || "cmp";
      const count = Math.max(1, parseInt(this.getAttribute("data-count") || "4", 10));
      let seed = {};
      try { seed = JSON.parse(this.getAttribute("data-seed") || "{}"); } catch (e) {}
      const rows = [
        { name: "New UI", slug: "new", hint: this.getAttribute("data-new") || "Drop the redesigned screen" },
        { name: "Old UI", slug: "old", hint: this.getAttribute("data-old") || "Drop the previous screen" }
      ];

      this.style.display = "block";
      this.innerHTML = rows.map((L) => {
        // indices with a real seed; if none seeded, keep all slots (drop-to-fill)
        const seededIdx = Array.from({ length: count }, (_, i) => i).filter((i) => seed[L.slug + "-" + i]);
        const idxs = seededIdx.length ? seededIdx : Array.from({ length: count }, (_, i) => i);
        const n = idxs.length;
        return `
        <div data-row="${L.slug}" style="margin-bottom:clamp(48px,7vw,88px);">
          <h3 style="margin:0 0 22px;text-align:center;font:500 clamp(20px,2.2vw,28px)/1.3 ${F};color:#8f8f8f;letter-spacing:0;">${L.name}</h3>
          <div style="position:relative;">
            <div data-glass style="position:relative;border-radius:24px;padding:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);box-shadow:0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);">
            <div data-viewport style="overflow:clip;border-radius:16px;">
              <div data-track style="display:flex;align-items:flex-start;transition:transform 420ms ${EASE};">
              ${idxs.map((i, pos) => `
                <div data-slide style="position:relative;flex:0 0 100%;min-width:0;padding:0 2px;box-sizing:border-box;">
                  <div data-scroll style="overflow-y:auto;overflow-x:hidden;max-height:${CAP};margin-right:-5px;padding-right:5px;-webkit-overflow-scrolling:touch;">
                  ${seed[L.slug + "-" + i]
                    ? (function (v) {
                        const src = typeof v === "string" ? v : v.src;
                        const ratio = (typeof v === "object" && v.ratio) || 0.7038;
                        return /\.pdf($|[?#])/i.test(src)
                          ? `<iframe data-seeded-pdf src="${src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH" title="${L.name} screen ${pos + 1}" loading="eager" style="display:block;width:100%;aspect-ratio:${ratio};border:none;border-radius:16px;background:#fff;"></iframe>`
                          : `<img data-seeded data-src="${src}" alt="${L.name} screen ${pos + 1}" decoding="async" style="display:block;width:100%;height:auto;border-radius:16px;">`;
                      })(seed[L.slug + "-" + i])
                    : `<image-slot id="${key}-${L.slug}-${i}" theme="dark" fit="contain" shape="rounded" radius="16"
                    placeholder="${L.hint} ${pos + 1}"
                    style="width:100%;max-width:100%;min-width:0;aspect-ratio:auto;border-radius:16px;"></image-slot>`}
                  </div>
                  <button data-zoom aria-label="View at full size" style="display:none;position:absolute;right:14px;bottom:14px;z-index:2;align-items:center;gap:6px;padding:8px 12px;border:none;border-radius:999px;cursor:pointer;background:rgba(10,10,10,0.72);color:#fff;font:600 11px/1 ${F};letter-spacing:0.04em;text-transform:uppercase;backdrop-filter:blur(4px);transition:background 200ms ${EASE};">Zoom</button>
                </div>`).join("")}
              </div>
            </div>
            </div>
            ${n > 1 ? `
            <button data-prev aria-label="Previous ${L.name} screen" style="position:absolute;left:-22px;top:50%;transform:translateY(-50%);z-index:3;width:44px;height:44px;border:none;border-radius:999px;cursor:pointer;background:#ffffff;color:#191919;font-size:18px;line-height:1;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,0.45);transition:transform 200ms ${EASE}, background 200ms ${EASE};">&#8249;</button>
            <button data-next aria-label="Next ${L.name} screen" style="position:absolute;right:-22px;top:50%;transform:translateY(-50%);z-index:3;width:44px;height:44px;border:none;border-radius:999px;cursor:pointer;background:#ffffff;color:#191919;font-size:18px;line-height:1;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,0.45);transition:transform 200ms ${EASE}, background 200ms ${EASE};">&#8250;</button>
            <div data-dots style="display:flex;gap:6px;justify-content:center;margin-top:18px;">
              ${idxs.map((i, pos) => `<span data-dot style="width:9px;height:9px;border-radius:999px;background:${pos === 0 ? "#12c971" : "rgba(255,255,255,0.30)"};transition:background 200ms ${EASE};"></span>`).join("")}
            </div>` : ""}
          </div>
        </div>`;
      }).join("");

      this.querySelectorAll("[data-row]").forEach((row) => {
        const track = row.querySelector("[data-track]");
        const dots = [...row.querySelectorAll("[data-dot]")];
        const slides = [...row.querySelectorAll("[data-slide]")];
        const count = slides.length; // per-row, after empty slides were dropped
        const vp = row.querySelector("[data-viewport]");
        let idx = 0;
        // decode only the active slide and its immediate neighbours
        const hydrate = (n) => {
          for (let d = -1; d <= 1; d++) {
            const s = slides[(n + d + count) % count];
            if (!s) continue;
            s.querySelectorAll("img[data-seeded][data-src]").forEach((im) => {
              im.src = im.getAttribute("data-src");
              im.removeAttribute("data-src");
            });
          }
        };
        hydrate(0);
        const syncHeight = () => {
          const active = slides[idx];
          const h = active && active.getBoundingClientRect().height;
          if (h > 0) vp.style.height = h + "px";
        };
        row.__syncHeight = syncHeight;
        const go = (n) => {
          idx = (n + count) % count;
          hydrate(idx);
          if (vp && vp.scrollLeft) vp.scrollLeft = 0;
          track.style.transform = `translateX(${-idx * 100}%)`;
          dots.forEach((d, i) => {
            d.style.background = i === idx ? "#12c971" : "rgba(255,255,255,0.30)";
          });
          syncHeight();
        };
        // re-hug whenever ANY slide's own height settles (image load, slot fill,
        // scroll-cap engaging) — cheap no-op unless it is the currently active one
        if (window.ResizeObserver) {
          const ro = new ResizeObserver(syncHeight);
          slides.forEach((sl) => ro.observe(sl));
        }
        setTimeout(syncHeight, 50);
        setTimeout(syncHeight, 400);

        slides.forEach((slide) => {
          const slot = slide.querySelector("image-slot");
          const seeded = slide.querySelector("[data-seeded]");
          const seededPdf = slide.querySelector("[data-seeded-pdf]");
          const zoom = slide.querySelector("[data-zoom]");
          zoom.addEventListener("click", (e) => {
            e.stopPropagation(); // do not trigger the slot's browse-files
            if (zoom.__pdf) { window.open(zoom.__pdf, "_blank", "noopener"); return; }
            if (!zoom.__src) return;
            const list = [];
            let at = 0;
            slides.forEach((sl) => {
              const z = sl.querySelector("[data-zoom]");
              if (z && z.__src) { if (z === zoom) at = list.length; list.push(z.__src); }
            });
            lightbox(list, at, (slot && slot.getAttribute("placeholder")) || (seeded && seeded.alt));
          });
          zoom.addEventListener("mouseenter", () => { zoom.style.background = "rgba(10,10,10,0.88)"; });
          zoom.addEventListener("mouseleave", () => { zoom.style.background = "rgba(10,10,10,0.72)"; });
          if (seededPdf) {
            zoom.style.display = "inline-flex";
            zoom.__pdf = (seededPdf.getAttribute("src") || "").split("#")[0];
            return;
          }
          if (seeded) {
            // plain image: intrinsic ratio already, just enable zoom
            const arm = () => {
              zoom.style.display = "inline-flex";
              zoom.__src = seeded.currentSrc || seeded.getAttribute("src") || seeded.getAttribute("data-src");
              if (row.__syncHeight) row.__syncHeight();
            };
            arm();
            if (!seeded.complete || !seeded.naturalWidth) seeded.addEventListener("load", arm, { once: true });
            return;
          }
          // shadowRoot may not exist until the element upgrades
          const start = () => {
            if (slot.shadowRoot) trackSlot(slot, slide, zoom);
            else setTimeout(start, 100);
          };
          start();
        });

        const prev = row.querySelector("[data-prev]");
        const next = row.querySelector("[data-next]");
        if (prev) prev.addEventListener("click", () => go(idx - 1));
        if (next) next.addEventListener("click", () => go(idx + 1));
        [prev, next].forEach((b) => {
          if (!b) return;
          b.addEventListener("mouseenter", () => { b.style.transform = "translateY(-50%) scale(1.08)"; });
          b.addEventListener("mouseleave", () => { b.style.transform = "translateY(-50%) scale(1)"; });
        });
        dots.forEach((d, i) => {
          d.style.cursor = "pointer";
          d.addEventListener("click", () => go(i));
        });
      });
    }
  }

  UICompare.prototype.disconnectedCallback = function () {
    this.querySelectorAll("image-slot").forEach((s) => { if (s.__stopTrack) s.__stopTrack(); });
  };

  if (!customElements.get("ui-compare")) customElements.define("ui-compare", UICompare);
})();
