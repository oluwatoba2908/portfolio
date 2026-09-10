/* Drives the bat's wings from the scroll position.

   The bat pins inside its section while the copy scrolls past it, and the
   wingbeat is tied to how far the section has travelled through the viewport:
   scroll down and the wings beat forward, scroll back and they unbeat. Two full
   cycles across the section, so the movement reads as flight rather than a
   twitch. A GIF could not do this — Lottie exposes a frame to seek to. */
(function () {
  var FLAPS = 2;
  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(player, fn) {
    var done = false;
    var go = function () {
      if (done) return;
      done = true;
      fn();
    };
    player.addEventListener("ready", function () { setTimeout(go, 40); });
    // the player may already be ready by the time this runs
    setTimeout(go, 700);
  }

  function bind(player) {
    if (player.__batBound) return;
    player.__batBound = true;

    var section = player.closest("[data-bat-section]") || player.parentElement;

    ready(player, function () {
      try { player.pause(); } catch (e) {}

      if (reduced) {
        // wings held open, no scroll coupling
        try { player.seek("50%"); } catch (e) {}
        return;
      }

      var queued = false;

      var draw = function () {
        queued = false;
        var r = section.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        if (r.bottom < 0 || r.top > vh) return; // off screen: nothing to drive

        // 0 as the section enters from the bottom, 1 as it leaves past the top
        var travelled = vh - r.top;
        var total = r.height + vh;
        var p = Math.min(1, Math.max(0, travelled / total));
        var cycle = (p * FLAPS) % 1;

        // Drive the frame directly: the player's seek() only parses whole
        // percentages, so a fractional one is silently ignored.
        var anim = player.getLottie && player.getLottie();
        if (anim && anim.totalFrames) {
          try { anim.goToAndStop(cycle * (anim.totalFrames - 1), true); } catch (e) {}
        } else {
          try { player.seek(Math.round(cycle * 100) + "%"); } catch (e) {}
        }
      };

      var onScroll = function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(draw);
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      draw();
    });
  }

  function scan() {
    var nodes = document.querySelectorAll("[data-bat-scrub]");
    for (var i = 0; i < nodes.length; i++) bind(nodes[i]);
  }

  function boot() {
    scan();
    // the design-canvas template streams in, so watch for the player arriving
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
