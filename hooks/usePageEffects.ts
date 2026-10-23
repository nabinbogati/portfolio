import { useEffect } from "react";

/**
 * Page-wide, CSS-driven effects, wired up once:
 * - `.spotlight` elements get --x/--y set to the pointer position, for a glow that follows the cursor.
 * - `.reveal` elements get `.is-visible` the first time they scroll into view.
 * - `[data-tilt]` cards lean toward the pointer in 3D.
 */
const TILT_DEG = 4;

export const usePageEffects = () => {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest<HTMLElement>(".spotlight");
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }
      const tilted = target?.closest<HTMLElement>("[data-tilt]");
      if (tilted && e.pointerType === "mouse" && !reducedMotion) {
        const rect = tilted.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        tilted.style.transform = `perspective(1000px) rotateX(${-py * TILT_DEG}deg) rotateY(${px * TILT_DEG}deg)`;
      }
    };
    const onPointerOut = (e: PointerEvent) => {
      const tilted = (e.target as Element | null)?.closest<HTMLElement>("[data-tilt]");
      if (tilted && !tilted.contains(e.relatedTarget as Node | null)) tilted.style.transform = "";
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      observer.disconnect();
    };
  }, []);
};
