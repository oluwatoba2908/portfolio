/* Plays .load-in entrances when the element scrolls into view (once each).
   Elements start hidden (opacity:0) and get .in-view to fire the animation. */
(function () {
  var THRESHOLD = 0.2;
  var io = null;

  function reveal(el) {
    el.classList.add("in-view");
  }

  function observe(root) {
    var nodes = (root || document).querySelectorAll(".load-in:not(.in-view)");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i++) reveal(nodes[i]);
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      }, { threshold: THRESHOLD, rootMargin: "0px 0px -8% 0px" });
    }
    for (var j = 0; j < nodes.length; j++) {
      var el = nodes[j];
      // already on screen at load: reveal immediately, keeping the stagger
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
      else io.observe(el);
    }
  }

  function boot() {
    observe(document);
    // DC templates stream in, so pick up nodes added after first paint
    if (window.MutationObserver) {
      new MutationObserver(function () { observe(document); })
        .observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
