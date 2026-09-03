/* Internal link fixer.
   The host serves pages with required query params (auth token, etc). A plain
   relative href like "project.dc.html?slug=givn" replaces the whole query
   string and drops those params, so the target page fails to load.
   This preserves the current page's params and layers the link's own on top. */
(function () {
  var isInternal = function (a) {
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return false;
    if (/^(https?:|mailto:|tel:)/i.test(href)) return false;
    return /\.dc\.html(\?|$)/.test(href) || /\.html(\?|$)/.test(href);
  };

  document.addEventListener(
    "click",
    function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.target === "_blank" || !isInternal(a)) return;

      var raw = a.getAttribute("href");
      var parts = raw.split("?");
      var path = parts[0];
      var own = new URLSearchParams(parts[1] || "");
      var merged = new URLSearchParams(window.location.search);
      own.forEach(function (v, k) { merged.set(k, v); });

      e.preventDefault();
      var qs = merged.toString();
      window.location.href = path + (qs ? "?" + qs : "");
    },
    true
  );
})();
