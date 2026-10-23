import React, { useEffect, useRef } from "react";

interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** How lit the neuron is, 0–1; decays every frame. */
  charge: number;
}

/** A signal travelling along a link; on arrival it lights the target and may fire onward with less energy. */
interface Signal {
  from: number;
  to: number;
  progress: number;
  energy: number;
}

const LINK = 150; // px: neurons closer than this are linked
const REACH = 170; // px: neurons closer than this to the pointer reach for it
const DENSITY = 17000; // px² of screen per neuron
const MAX_NEURONS = 95;
const SPONTANEOUS_MS = 1400;

const palettes = {
  light: { node: "113 113 122", link: "113 113 122", fire: "5 150 105", nodeA: 0.45, linkA: 0.16 },
  dark: { node: "161 161 170", link: "161 161 170", fire: "52 211 153", nodeA: 0.35, linkA: 0.12 },
};

/**
 * A neural network drawn behind the page: neurons drift and link to their neighbours, signals fire along
 * the links, the pointer pulls nearby neurons toward it, and a click fires the closest one.
 */
const NeuralNet: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let neurons: Neuron[] = [];
    let signals: Signal[] = [];
    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;
    let lastFire = 0;

    const spawn = (): Neuron => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      charge: 0,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const widthChanged = window.innerWidth !== width;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile browsers resize the height as the URL bar shows and hides; only reseed on a real width change.
      if (widthChanged) {
        const count = Math.min(MAX_NEURONS, Math.round((width * height) / DENSITY));
        neurons = Array.from({ length: count }, spawn);
        signals = [];
      }
    };

    const neighbours = (i: number) => {
      const a = neurons[i];
      const near: number[] = [];
      neurons.forEach((b, j) => {
        if (j !== i && Math.hypot(a.x - b.x, a.y - b.y) < LINK) near.push(j);
      });
      return near;
    };

    const fire = (i: number, energy: number, fanOut: number) => {
      neurons[i].charge = 1;
      const near = neighbours(i).sort(() => Math.random() - 0.5).slice(0, fanOut);
      near.forEach((to) => signals.push({ from: i, to, progress: 0, energy }));
    };

    const step = (now: number) => {
      if (now - lastFire > SPONTANEOUS_MS && neurons.length) {
        lastFire = now;
        fire(Math.floor(Math.random() * neurons.length), 0.7, 2);
      }

      neurons.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH && d > 1) {
            n.x += (dx / d) * 0.15;
            n.y += (dy / d) * 0.15;
            n.charge = Math.max(n.charge, 0.5 * (1 - d / REACH));
          }
        }
        n.charge *= 0.965;
      });

      const arrived: Signal[] = [];
      signals = signals.filter((s) => {
        const a = neurons[s.from];
        const b = neurons[s.to];
        const length = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        s.progress += 2.2 / length;
        if (s.progress >= 1) {
          arrived.push(s);
          return false;
        }
        return true;
      });
      arrived.forEach((s) => {
        neurons[s.to].charge = Math.max(neurons[s.to].charge, s.energy);
        if (s.energy > 0.3 && signals.length < 60) fire(s.to, s.energy * 0.7, Math.random() < 0.5 ? 1 : 2);
      });
    };

    const draw = () => {
      const p = palettes[document.documentElement.classList.contains("dark") ? "dark" : "light"];
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (let i = 0; i < neurons.length; i++) {
        const a = neurons[i];
        for (let j = i + 1; j < neurons.length; j++) {
          const b = neurons[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= LINK) continue;
          const charge = Math.max(a.charge, b.charge);
          const fade = 1 - d / LINK;
          ctx.strokeStyle = charge > 0.05 ? `rgb(${p.fire} / ${fade * charge * 0.45})` : `rgb(${p.link} / ${fade * p.linkA})`;
          if (charge > 0.05) {
            // Lit links draw over the plain one so they glow without hiding the network.
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.strokeStyle = `rgb(${p.link} / ${fade * p.linkA})`;
          }
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (pointer.active) {
          const d = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (d < REACH) {
            ctx.strokeStyle = `rgb(${p.fire} / ${(1 - d / REACH) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      signals.forEach((s) => {
        const a = neurons[s.from];
        const b = neurons[s.to];
        const x = a.x + (b.x - a.x) * s.progress;
        const y = a.y + (b.y - a.y) * s.progress;
        ctx.fillStyle = `rgb(${p.fire} / ${0.25 + s.energy * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      neurons.forEach((n) => {
        ctx.fillStyle = `rgb(${p.node} / ${p.nodeA})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (n.charge > 0.05) {
          ctx.fillStyle = `rgb(${p.fire} / ${n.charge * 0.85})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.6 + n.charge * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${p.fire} / ${n.charge * 0.12})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6 + n.charge * 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const loop = (now: number) => {
      step(now);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = e.pointerType === "mouse";
    };
    const onPointerLeave = () => (pointer.active = false);
    const onClick = (e: MouseEvent) => {
      let closest = -1;
      let best = REACH;
      neurons.forEach((n, i) => {
        const d = Math.hypot(n.x - e.clientX, n.y - e.clientY);
        if (d < best) {
          best = d;
          closest = i;
        }
      });
      if (closest >= 0) fire(closest, 1, 4);
    };
    const onResize = () => {
      resize();
      if (reducedMotion) draw();
    };

    resize();
    window.addEventListener("resize", onResize);
    if (reducedMotion) {
      // A still frame, redrawn when the theme changes.
      draw();
      const themeObserver = new MutationObserver(draw);
      themeObserver.observe(document.documentElement, { attributeFilter: ["class"] });
      return () => {
        window.removeEventListener("resize", onResize);
        themeObserver.disconnect();
      };
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />;
};

export default NeuralNet;
