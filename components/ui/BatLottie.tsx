"use client";

/**
 * The bat accent, shared by the Nav and the About page's "Why the Bat?" section.
 *
 * The asset is a dotLottie (.lottie) file, so it needs @dotlottie/player-component
 * and its <dotlottie-player> element — the plain <lottie-player> from
 * @lottiefiles/lottie-player cannot read this format. Same player and version the
 * DC build used, loaded once and guarded so repeated mounts don't re-inject it.
 */

import { useEffect, useState } from "react";

const PLAYER_SRC =
  "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";

export function BatLottie({
  size = 40,
  className
}: {
  size?: number;
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (customElements.get("dotlottie-player")) {
      setReady(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PLAYER_SRC}"]`
    );
    if (existing) {
      customElements.whenDefined("dotlottie-player").then(() => setReady(true));
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = PLAYER_SRC;
    script.async = true;
    document.head.appendChild(script);
    customElements.whenDefined("dotlottie-player").then(() => setReady(true));
  }, []);

  // Reserve the space either way so the surrounding layout doesn't shift when
  // the player finishes loading.
  if (!ready) {
    return <div className={className} style={{ width: size, height: size }} />;
  }

  return (
    // @ts-expect-error -- custom element from @dotlottie/player-component, not typed
    <dotlottie-player
      src="/bat-halloween.lottie"
      autoplay
      loop
      class={className}
      style={{ width: size, height: size, pointerEvents: "none" }}
    />
  );
}
