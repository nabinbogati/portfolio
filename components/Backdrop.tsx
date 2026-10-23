import React, { useEffect, useRef } from "react";
import { markSceneReady } from "../lib/boot";
import { LABEL_FONT } from "../lib/scene/constants";

/**
 * The fixed layers behind and over the page: the 3D server-room scene (loaded as its own chunk after
 * first paint), a scrim that keeps text readable over it, and a faint scanline and vignette on top.
 */
const Backdrop: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    Promise.all([
      import("../lib/scene/world"),
      // Labels are drawn to canvases, so the font has to be ready before the first one is painted.
      document.fonts?.load(LABEL_FONT).catch(() => undefined),
    ])
      .then(([{ createWorld }]) => {
        if (!cancelled && ref.current) dispose = createWorld(ref.current, { reducedMotion });
      })
      .catch(() => {
        // No WebGL, or the chunk failed to load: the backdrop is decoration, so the page carries on without it.
      })
      .finally(markSceneReady);

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-80 dark:opacity-70"
        aria-hidden="true"
      />
      <div className="scene-scrim pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
      <div className="fx-scanlines pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
      <div className="fx-vignette pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
    </>
  );
};

export default Backdrop;
