/* Airstride feature vignettes — looping recreations of the code-driven
   interactions on airstride.ai's platform pages (no image/video assets exist
   for these). Shared frame styling with <airstride-tour>. Elements:
   as-map, as-training, as-analytics, as-library, as-engage. */
(function () {
  const EASE = "cubic-bezier(0.645, 0.045, 0.355, 1)";
  const F = "'Geist',system-ui,sans-serif";
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function frame(el, bar, inner) {
    el.style.cssText = "display:block;width:100%;";
    el.innerHTML = `
      <div style="position:relative;width:100%;border-radius:16px;overflow:hidden;background:#0d1117;">
        <div style="display:flex;align-items:center;gap:8px;height:34px;padding:0 14px;background:#181d24;">
          <span style="width:9px;height:9px;border-radius:99px;background:#ff5f57;"></span>
          <span style="width:9px;height:9px;border-radius:99px;background:#febc2e;"></span>
          <span style="width:9px;height:9px;border-radius:99px;background:#28c840;"></span>
          <span style="flex:1;text-align:center;font:500 12px/1 ${F};color:#9aa4b2;">${bar}</span>
          <span style="width:43px;"></span>
        </div>
        <div data-stage style="position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;background:#f6f7f9;padding:4.5%;box-sizing:border-box;font-family:${F};">${inner}</div>
      </div>`;
    return el.querySelector("[data-stage]");
  }
  const card = (extra) => `background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 1px 3px rgba(16,24,40,0.06);${extra || ""}`;
  const fadeSlide = "opacity:0;transform:translateY(10px);transition:opacity 600ms " + EASE + ", transform 600ms " + EASE + ";";
  const showEl = (el) => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; };
  const hideEl = (el) => { el.style.opacity = "0"; el.style.transform = "translateY(10px)"; };
  const countUp = (el, target, ms, fmt) => {
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / ms, 1);
      const e = p * (2 - p);
      el.textContent = fmt ? fmt(Math.round(target * e)) : Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  function defineLoop(name, bar, inner, tick) {
    if (customElements.get(name)) return;
    customElements.define(name, class extends HTMLElement {
      connectedCallback() {
        if (this._built) return; this._built = true;
        const stage = frame(this, bar, inner);
        const run = async () => { while (!this._stopped) { await tick(stage, this); } };
        run();
      }
      disconnectedCallback() { this._stopped = true; }
    });
  }

  /* ---- Account mapping: categories count up, rows land, new-match toast ---- */
  defineLoop("as-map", "app.airstride.ai/account-mapping", `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font:600 15px/1 ${F};color:#111827;">Matches &middot; N-able</span>
      <span style="font:600 10px/1 ${F};letter-spacing:0.06em;color:#059669;background:#ecfdf5;padding:6px 10px;border-radius:99px;">SYNCED 12 MIN AGO &middot; SALESFORCE</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px;">
      ${["Exact|34|#1d4ed8", "Probable|18|#b45309", "Possible|41|#6b7280", "New ICP|27|#059669"].map((s) => { const [l, v, c] = s.split("|"); return `<div style="${card("padding:12px 14px;")}"><div style="font:500 11px/1 ${F};color:#6b7280;">${l}</div><div data-num data-v="${v}" style="font:700 22px/1.4 ${F};color:${c};">0</div></div>`; }).join("")}
    </div>
    <div style="${card("margin-top:12px;overflow:hidden;")}">
      ${["Acme Industries|EXACT|100%|Register deal|#1d4ed8", "Intl Business Machines &rarr; IBM|PROBABLE|87%|Review|#b45309", "Northwind Labs|NEW ICP|&ndash;|Request intro|#059669"].map((s) => { const [n, c, sc, a, col] = s.split("|"); return `<div data-row style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f4f6;${fadeSlide}"><span style="flex:1;font:500 13px/1 ${F};color:#111827;">${n}</span><span style="font:700 10px/1 ${F};letter-spacing:0.05em;color:${col};">${c}</span><span style="font:500 12px/1 ${F};color:#6b7280;width:36px;text-align:right;">${sc}</span><span style="font:600 11px/1 ${F};color:#1d4ed8;background:#eff6ff;padding:6px 10px;border-radius:8px;">${a}</span></div>`; }).join("")}
    </div>
    <div data-toast style="position:absolute;left:4.5%;right:4.5%;bottom:5%;display:flex;align-items:center;gap:10px;padding:12px 16px;background:#0a0a0a;border-radius:10px;opacity:0;transform:translateY(14px);transition:all 500ms ${EASE};">
      <span style="width:8px;height:8px;border-radius:99px;background:#22c55e;"></span>
      <span style="font:600 11px/1 ${F};letter-spacing:0.05em;color:#ffffff;">NEW MATCH &middot; EXACT &middot; SYNCED FROM SALESFORCE</span>
    </div>`,
    async (s) => {
      const rows = s.querySelectorAll("[data-row]"), toast = s.querySelector("[data-toast]");
      rows.forEach(hideEl); toast.style.opacity = "0"; toast.style.transform = "translateY(14px)";
      s.querySelectorAll("[data-num]").forEach((n) => { n.textContent = "0"; });
      await wait(600);
      s.querySelectorAll("[data-num]").forEach((n) => countUp(n, +n.dataset.v, 1200));
      await wait(900);
      for (const r of rows) { showEl(r); await wait(350); }
      await wait(1200);
      showEl(toast); toast.style.transform = "translateY(0)";
      await wait(2400);
      hideEl(toast);
      await wait(900);
    });

  /* ---- Partner training: upload -> AI drafts -> assign -> learner journey ---- */
  defineLoop("as-training", "app.airstride.ai/training", `
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      ${["Bring it in", "AI drafts it", "Assign", "Watch it climb"].map((l, i) => `<span data-step style="font:600 11px/1 ${F};padding:7px 12px;border-radius:99px;background:#eef2f7;color:#6b7280;transition:all 400ms ${EASE};">0${i + 1} ${l}</span>`).join("")}
    </div>
    <div data-p style="${card("padding:16px;position:absolute;left:4.5%;right:4.5%;top:24%;bottom:6%;overflow:hidden;")}">
      <div data-ph="0" style="position:absolute;inset:16px;${fadeSlide}">
        <div style="border:2px dashed #cbd5e1;border-radius:10px;padding:18px;text-align:center;font:500 13px/1 ${F};color:#6b7280;">Drop files here, or browse</div>
        ${["PDF|Partner onboarding deck.pdf|42 SLIDES", "MP4|Security walkthrough.mp4|12 MIN", "URL|help.nextron.com/specs|LINK"].map((f) => { const [t, n, m] = f.split("|"); return `<div data-file style="display:flex;gap:10px;align-items:center;margin-top:10px;padding:10px 12px;background:#f8fafc;border-radius:8px;${fadeSlide}"><span style="font:700 9px/1 ${F};color:#1d4ed8;background:#eff6ff;padding:5px 7px;border-radius:6px;">${t}</span><span style="flex:1;font:500 12px/1 ${F};color:#111827;">${n}</span><span style="font:500 10px/1 ${F};color:#9ca3af;">${m}</span></div>`; }).join("")}
      </div>
      <div data-ph="1" style="position:absolute;inset:16px;${fadeSlide}">
        <div style="font:600 14px/1 ${F};color:#111827;">Partner Onboarding Essentials <span style="font:700 9px/1 ${F};color:#b45309;background:#fffbeb;padding:4px 7px;border-radius:6px;">DRAFTING&hellip;</span></div>
        <div style="margin-top:12px;height:6px;border-radius:99px;background:#e5e7eb;overflow:hidden;"><div data-bar style="height:100%;width:0;background:#1d4ed8;transition:width 1600ms ${EASE};"></div></div>
        ${["01 Platform architecture in 10 minutes|VIDEO &middot; 10M", "02 Performance benchmarks &amp; SLAs|PDF &middot; 9P", "03 Security &amp; compliance documentation|PDF &middot; 14P", "Knowledge check|5 QUESTIONS &middot; PASS AT 70%"].map((l) => { const [n, m] = l.split("|"); return `<div data-lesson style="display:flex;justify-content:space-between;margin-top:10px;padding:10px 12px;background:#f8fafc;border-radius:8px;font:500 12px/1 ${F};color:#111827;${fadeSlide}"><span>${n}</span><span style="color:#9ca3af;font-size:10px;">${m}</span></div>`; }).join("")}
      </div>
      <div data-ph="2" style="position:absolute;inset:16px;${fadeSlide}">
        <div style="font:600 14px/1 ${F};color:#111827;">Assign &middot; Partner Onboarding Essentials</div>
        ${["MC|Meridian Capital|6 SEATS", "NW|Northwind Bank|4 SEATS", "AT|Atlas Securities +2 more|8 SEATS"].map((o) => { const [a, n, m] = o.split("|"); return `<div data-org style="display:flex;gap:10px;align-items:center;margin-top:10px;padding:10px 12px;background:#f8fafc;border-radius:8px;${fadeSlide}"><span data-check style="font:700 11px/1 ${F};color:#d1d5db;transition:color 300ms;">&#10003;</span><span style="font:700 10px/1 ${F};color:#1d4ed8;background:#eff6ff;padding:6px;border-radius:6px;">${a}</span><span style="flex:1;font:500 12px/1 ${F};color:#111827;">${n}</span><span style="font:500 10px/1 ${F};color:#9ca3af;">${m}</span></div>`; }).join("")}
        <div data-assignbtn style="margin-top:12px;text-align:center;padding:11px;border-radius:8px;background:#1d4ed8;color:#fff;font:600 12px/1 ${F};${fadeSlide}">Assign to 5 organisations</div>
      </div>
      <div data-ph="3" style="position:absolute;inset:16px;${fadeSlide}">
        <div style="display:flex;justify-content:space-between;align-items:center;"><span style="font:600 14px/1 ${F};color:#111827;">Learner journey &middot; 18 learners</span><span style="font:600 11px/1 ${F};color:#1d4ed8;background:#eff6ff;padding:7px 12px;border-radius:8px;">Nudge stalled</span></div>
        <div style="display:flex;align-items:flex-end;gap:10px;height:42%;margin-top:16px;">
          ${[18, 17, 11, 9, 8].map((v, i) => `<div style="flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;"><div data-fbar data-h="${(v / 18) * 100}" style="width:100%;height:0;border-radius:6px 6px 0 0;background:${i === 2 ? "#ef4444" : "#1d4ed8"};transition:height 900ms ${EASE};"></div><span style="font:500 10px/1 ${F};color:#6b7280;">L${i + 1} &middot; ${v}</span></div>`).join("")}
        </div>
        <div data-drop style="margin-top:12px;padding:10px 12px;border-radius:8px;background:#fef2f2;font:500 11px/1.5 ${F};color:#991b1b;${fadeSlide}">6 learners stall on lesson 3 &middot; 2.4&times; median time &middot; flagged as the <b>BIGGEST DROP</b></div>
        <div data-cert style="margin-top:8px;font:600 10px/1 ${F};letter-spacing:0.05em;color:#059669;${fadeSlide}">CERTIFIED &middot; 11 PARTNERS &middot; +3 THIS WEEK</div>
      </div>
    </div>`,
    async (s) => {
      const steps = s.querySelectorAll("[data-step]"), phases = s.querySelectorAll("[data-ph]");
      const setStep = (n) => steps.forEach((st, i) => { st.style.background = i === n ? "#0a0a0a" : "#eef2f7"; st.style.color = i === n ? "#ffffff" : "#6b7280"; });
      const setPhase = (n) => phases.forEach((p) => { (+p.dataset.ph === n) ? showEl(p) : hideEl(p); });
      // phase 0: files land
      setStep(0); setPhase(0);
      const files = phases[0].querySelectorAll("[data-file]"); files.forEach(hideEl);
      await wait(500); for (const f of files) { showEl(f); await wait(320); }
      await wait(1100);
      // phase 1: drafting
      setStep(1); setPhase(1);
      const bar = phases[1].querySelector("[data-bar]"); bar.style.width = "0";
      const lessons = phases[1].querySelectorAll("[data-lesson]"); lessons.forEach(hideEl);
      await wait(120); bar.style.width = "100%";
      await wait(900); for (const l of lessons) { showEl(l); await wait(280); }
      await wait(1100);
      // phase 2: assign
      setStep(2); setPhase(2);
      const orgs = phases[2].querySelectorAll("[data-org]"), btn = phases[2].querySelector("[data-assignbtn]");
      orgs.forEach(hideEl); hideEl(btn);
      await wait(300);
      for (const o of orgs) { showEl(o); await wait(300); o.querySelector("[data-check]").style.color = "#059669"; }
      showEl(btn);
      await wait(1400);
      // phase 3: learner journey
      setStep(3); setPhase(3);
      const bars = phases[3].querySelectorAll("[data-fbar]"), drop = phases[3].querySelector("[data-drop]"), cert = phases[3].querySelector("[data-cert]");
      bars.forEach((b) => { b.style.height = "0"; }); hideEl(drop); hideEl(cert);
      await wait(300); bars.forEach((b) => { b.style.height = b.dataset.h + "%"; });
      await wait(1100); showEl(drop);
      await wait(800); showEl(cert);
      await wait(2200);
    });

  /* ---- Analytics: KPIs count up, bars grow, dashboard customises itself ---- */
  defineLoop("as-analytics", "app.airstride.ai/analytics", `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font:600 15px/1 ${F};color:#111827;">Partner programme &middot; This quarter</span>
      <span data-custom style="font:600 11px/1 ${F};color:#1d4ed8;background:#eff6ff;padding:7px 12px;border-radius:8px;transition:all 300ms ${EASE};">Customise</span>
    </div>
    <div data-kpis style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;">
      ${["Partner-sourced revenue|494|k&pound;|#111827", "Deal registrations|128||#111827", "Partner deal win rate|38|%|#059669"].map((k) => { const [l, v, u, c] = k.split("|"); return `<div data-kpi style="${card("padding:14px;transition:all 500ms " + EASE + ";")}"><div style="font:500 11px/1.4 ${F};color:#6b7280;">${l}</div><div style="font:700 22px/1.5 ${F};color:${c};">${u.indexOf("&pound;") >= 0 ? "&pound;" : ""}<span data-num data-v="${v}">0</span>${u.replace("&pound;", "")}</div></div>`; }).join("")}
    </div>
    <div style="${card("margin-top:12px;padding:16px;")}">
      <div style="font:500 12px/1 ${F};color:#6b7280;">Partner-sourced pipeline by partner</div>
      <div style="display:flex;align-items:flex-end;gap:12px;height:90px;margin-top:12px;">
        ${[85, 62, 48, 34, 22].map((v, i) => `<div style="flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;"><div data-abar data-h="${v}" style="width:100%;height:0;border-radius:6px 6px 0 0;background:${i === 0 ? "#1d4ed8" : "#bfdbfe"};transition:height 900ms ${EASE};transition-delay:${i * 90}ms;"></div></div>`).join("")}
      </div>
      <div style="display:flex;gap:12px;margin-top:8px;font:500 10px/1 ${F};color:#9ca3af;"><span style="flex:1;text-align:center;">First AML</span><span style="flex:1;text-align:center;">N-able</span><span style="flex:1;text-align:center;">Rightcharge</span><span style="flex:1;text-align:center;">Triple S.</span><span style="flex:1;text-align:center;">Quo</span></div>
    </div>
    <div data-note style="margin-top:10px;font:500 11px/1.5 ${F};color:#6b7280;${fadeSlide}">Dashboards are customisable per role &mdash; drag, hide, and reorder the cards that matter to you.</div>`,
    async (s) => {
      const nums = s.querySelectorAll("[data-num]"), bars = s.querySelectorAll("[data-abar]");
      const kpis = s.querySelectorAll("[data-kpi]"), custom = s.querySelector("[data-custom]"), note = s.querySelector("[data-note]");
      nums.forEach((n) => { n.textContent = "0"; }); bars.forEach((b) => { b.style.height = "0"; }); hideEl(note);
      kpis.forEach((k) => { k.style.transform = "none"; k.style.boxShadow = ""; });
      await wait(600);
      nums.forEach((n) => countUp(n, +n.dataset.v, 1300));
      bars.forEach((b) => { b.style.height = b.dataset.h + "%"; });
      await wait(1800);
      // customise moment: first two KPI cards swap, note appears
      custom.style.background = "#0a0a0a"; custom.style.color = "#ffffff";
      await wait(400);
      kpis[0].style.transform = "translateX(calc(100% + 10px))";
      kpis[1].style.transform = "translateX(calc(-100% - 10px))";
      showEl(note);
      await wait(2200);
      custom.style.background = "#eff6ff"; custom.style.color = "#1d4ed8";
      await wait(1200);
    });

  /* ---- Content library: search filters co-branded assets, download logged ---- */
  defineLoop("as-library", "app.airstride.ai/content", `
    <div style="display:flex;gap:10px;align-items:center;">
      <div style="flex:1;${card("padding:10px 14px;display:flex;align-items:center;gap:8px;")}"><span style="color:#9ca3af;">&#128269;</span><span data-query style="font:500 13px/1 ${F};color:#111827;"></span><span data-caret style="width:1px;height:14px;background:#111827;"></span></div>
      <span style="font:600 11px/1 ${F};color:#6b7280;background:#eef2f7;padding:8px 12px;border-radius:8px;">Co-branded</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;">
      ${["One-pager|Payments overview|#1d4ed8|1", "Deck|Partner pitch Q3|#b45309|0", "One-pager|Security brief|#1d4ed8|1", "Case study|First AML rollout|#059669|0", "One-pager|ROI calculator|#1d4ed8|1", "Video|Product tour|#6b7280|0"].map((a) => { const [t, n, c, m] = a.split("|"); return `<div data-asset data-match="${m}" style="${card("padding:12px;transition:all 500ms " + EASE + ";")}"><div style="font:700 9px/1 ${F};letter-spacing:0.05em;color:${c};">${t.toUpperCase()}</div><div style="font:600 12px/1.4 ${F};color:#111827;margin-top:6px;">${n}</div><div style="height:5px;border-radius:99px;background:#eef2f7;margin-top:10px;"></div><div style="height:5px;border-radius:99px;background:#eef2f7;margin-top:5px;width:70%;"></div></div>`; }).join("")}
    </div>
    <div data-toast style="position:absolute;left:4.5%;right:4.5%;bottom:5%;display:flex;align-items:center;gap:10px;padding:12px 16px;background:#0a0a0a;border-radius:10px;opacity:0;transform:translateY(14px);transition:all 500ms ${EASE};">
      <span style="width:8px;height:8px;border-radius:99px;background:#22c55e;"></span>
      <span style="font:600 11px/1 ${F};letter-spacing:0.05em;color:#ffffff;">N-ABLE DOWNLOADED &ldquo;PAYMENTS OVERVIEW&rdquo; &middot; TAILORED FOR THEIR AUDIENCE</span>
    </div>`,
    async (s) => {
      const q = s.querySelector("[data-query]"), caret = s.querySelector("[data-caret]");
      const assets = s.querySelectorAll("[data-asset]"), toast = s.querySelector("[data-toast]");
      q.textContent = ""; toast.style.opacity = "0"; toast.style.transform = "translateY(14px)";
      assets.forEach((a) => { a.style.opacity = "1"; a.style.transform = "none"; });
      caret.style.animation = "as-blink 0.9s step-end infinite";
      if (!document.getElementById("as-blink-kf")) { const st = document.createElement("style"); st.id = "as-blink-kf"; st.textContent = "@keyframes as-blink{50%{opacity:0}}"; document.head.appendChild(st); }
      await wait(900);
      const text = "one-pager";
      for (const ch of text) { q.textContent += ch; await wait(110); }
      await wait(400);
      assets.forEach((a) => { if (a.dataset.match === "0") { a.style.opacity = "0.22"; a.style.transform = "scale(0.97)"; } });
      await wait(1300);
      showEl(toast); toast.style.transform = "translateY(0)";
      await wait(2300);
      toast.style.opacity = "0"; toast.style.transform = "translateY(14px)";
      assets.forEach((a) => { a.style.opacity = "1"; a.style.transform = "none"; });
      await wait(700);
    });

  /* ---- Engagement: signals land, at-risk flag, next-action suggestion ---- */
  defineLoop("as-engage", "app.airstride.ai/engagement", `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font:600 15px/1 ${F};color:#111827;">Engagement &middot; Rightcharge</span>
      <span data-risk style="font:700 10px/1 ${F};letter-spacing:0.05em;color:#991b1b;background:#fef2f2;padding:7px 11px;border-radius:99px;opacity:0;transition:opacity 500ms ${EASE};">AT RISK</span>
    </div>
    <div style="${card("margin-top:12px;overflow:hidden;")}">
      ${["&#9993;|Email forwarded &middot; logged to Dana Reyes|JUST NOW", "&#128221;|Note added &middot; QBR prep call summary|2 MIN AGO", "&#128196;|Opened &ldquo;Payments overview&rdquo; one-pager|1 HR AGO", "&#9888;|Deal-reg cadence down 50% from baseline|FLAGGED"].map((r, i) => { const [ic, t, m] = r.split("|"); return `<div data-sig style="display:flex;gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid #f3f4f6;${fadeSlide}"><span style="font-size:14px;">${ic}</span><span style="flex:1;font:500 12px/1.4 ${F};color:${i === 3 ? "#991b1b" : "#111827"};">${t}</span><span style="font:600 9px/1 ${F};letter-spacing:0.05em;color:#9ca3af;">${m}</span></div>`; }).join("")}
    </div>
    <div data-carmen style="margin-top:12px;display:flex;gap:12px;align-items:center;padding:14px 16px;border-radius:12px;background:#0a0a0a;${fadeSlide}">
      <span style="width:28px;height:28px;border-radius:99px;background:linear-gradient(135deg,#3b82f6,#ec4899);flex-shrink:0;"></span>
      <span style="font:500 12px/1.5 ${F};color:#ffffff;">Carmen: Rightcharge has gone quiet &mdash; book a call with their champion this week, before the stage review.</span>
    </div>`,
    async (s) => {
      const sigs = s.querySelectorAll("[data-sig]"), risk = s.querySelector("[data-risk]"), carmen = s.querySelector("[data-carmen]");
      sigs.forEach(hideEl); risk.style.opacity = "0"; hideEl(carmen);
      await wait(600);
      for (let i = 0; i < sigs.length; i++) { showEl(sigs[i]); await wait(500); if (i === 3) risk.style.opacity = "1"; }
      await wait(700);
      showEl(carmen);
      await wait(2800);
    });
})();
