/* Publishes the viewport width EXCLUDING the scrollbar as --vw.
   Full-bleed elements must use var(--vw) instead of 100vw: 100vw counts the
   scrollbar, so a "full width" line overflows and creates a horizontal scroll. */
(function () {
  var set = function () {
    document.documentElement.style.setProperty(
      "--vw",
      document.documentElement.clientWidth + "px"
    );
  };
  set();
  window.addEventListener("resize", set);
  window.addEventListener("orientationchange", set);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(set);
  window.addEventListener("load", set);
})();
