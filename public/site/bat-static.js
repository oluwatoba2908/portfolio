/* Freezes decorative bats on their spread-wing frame.
   Frame 0 of the clip is a folded pose, so we let each player load,
   seek to the mid-point of the animation, then pause. */
(function () {
  function freeze(el) {
    if (el.__frozen) return;
    el.__frozen = true;
    var stop = function () {
      try {
        if (typeof el.seek === "function") el.seek("50%");
        if (typeof el.pause === "function") el.pause();
      } catch (e) {}
    };
    // dotlottie-player fires 'ready'; fall back to a timer if it already fired
    el.addEventListener("ready", function () { setTimeout(stop, 60); });
    setTimeout(stop, 700);
    setTimeout(stop, 1600);
  }

  function scan() {
    var nodes = document.querySelectorAll("[data-bat-static]");
    for (var i = 0; i < nodes.length; i++) freeze(nodes[i]);
  }

  function boot() {
    scan();
    if (window.MutationObserver) {
      new MutationObserver(scan).observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
