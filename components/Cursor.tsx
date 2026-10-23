import React, { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, input, textarea, select, [data-tilt]";

/** A ring that trails the mouse pointer and widens over anything clickable. Mouse users only. */
const Cursor: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ref.current;
    if (
      !ring ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;

    const follow = () => {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // Stop the loop once the ring has caught up; the next move restarts it.
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.2 ? requestAnimationFrame(follow) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!ring.classList.contains("is-visible")) {
        x = targetX;
        y = targetY;
        ring.classList.add("is-visible");
      }
      ring.classList.toggle("is-active", !!(e.target as Element | null)?.closest?.(INTERACTIVE));
      if (!frame) frame = requestAnimationFrame(follow);
    };
    const onLeave = () => ring.classList.remove("is-visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-ring" aria-hidden="true" />;
};

export default Cursor;
