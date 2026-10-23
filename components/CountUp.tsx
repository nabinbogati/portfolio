import React, { useEffect, useRef, useState } from "react";
import { booted } from "../lib/boot";

const DURATION_MS = 1400;

interface CountUpProps {
  to: number;
  decimals?: number;
}

/** A number that counts up from zero the first time it scrolls into view, after the boot screen. */
const CountUp: React.FC<CountUpProps> = ({ to, decimals = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const [value, setValue] = useState(reducedMotion ? to : 0);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / DURATION_MS);
        setValue(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    booted.then(() => {
      if (cancelled) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer?.disconnect();
            run();
          }
        },
        { threshold: 0.6 },
      );
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, reducedMotion]);

  return <span ref={ref}>{value.toFixed(decimals)}</span>;
};

export default CountUp;
