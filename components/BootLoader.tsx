import React, { useEffect, useLayoutEffect, useState } from "react";
import { finishBoot, sceneReady } from "../lib/boot";

const LINES: [cmd: string, result: string][] = [
  ["ssh nabin@ktm-prod-01", "connected"],
  ["systemctl start postgresql redis centrifugo", "active"],
  ["docker compose up -d api worker", "3/3 healthy"],
  ["agent-skills load intent-architect expert-karpathy", "ok"],
  ["webgl init --scene server-room", "ok"],
  ["curl -s localhost:8000/health", "200 OK"],
];
// The "webgl init" line really does wait for the 3D scene, up to a limit.
const SCENE_LINE = 4;
const SCENE_WAIT_MS = 2500;
const CHAR_MS = 6;
const LINE_MS = 110;
const EXIT_MS = 700;
const SEEN_KEY = "booted";

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const shouldSkip = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * A terminal boot sequence shown over the page on the first visit of a session. Any key, click or tap
 * skips it. While it runs the page can't scroll and intro animations wait for it.
 */
const BootLoader: React.FC = () => {
  const [active] = useState(() => !shouldSkip());
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(!active);

  useLayoutEffect(() => {
    if (!active) {
      finishBoot();
      return;
    }
    document.documentElement.classList.add("booting");
    return () => document.documentElement.classList.remove("booting");
  }, [active]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const leave = () => {
      if (cancelled) return;
      cancelled = true;
      window.removeEventListener("keydown", leave);
      window.removeEventListener("pointerdown", leave);
      document.documentElement.classList.remove("booting");
      finishBoot();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private mode: the boot screen just plays again next time.
      }
      setLeaving(true);
      window.setTimeout(() => setGone(true), EXIT_MS);
    };

    const run = async () => {
      for (let i = 0; i < LINES.length; i++) {
        const cmd = LINES[i][0];
        for (let c = 1; c <= cmd.length; c++) {
          if (cancelled) return;
          setLine(i);
          setChars(c);
          await sleep(CHAR_MS);
        }
        if (i === SCENE_LINE) await Promise.race([sceneReady, sleep(SCENE_WAIT_MS)]);
        if (cancelled) return;
        setLine(i + 1);
        setChars(0);
        await sleep(LINE_MS);
      }
      await sleep(250);
      leave();
    };
    run();

    window.addEventListener("keydown", leave);
    window.addEventListener("pointerdown", leave);
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", leave);
      window.removeEventListener("pointerdown", leave);
    };
  }, [active]);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-center bg-zinc-50 px-6 font-mono text-sm transition-[translate,opacity] duration-700 ease-[cubic-bezier(.7,0,.3,1)] sm:px-[8vw] dark:bg-zinc-950 ${
        leaving ? "pointer-events-none -translate-y-full opacity-0" : ""
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="space-y-1.5">
        {LINES.slice(0, line + 1).map(([cmd, result], i) => (
          <p key={cmd} className="break-all text-zinc-500 dark:text-zinc-400">
            <span className="text-accent-600 dark:text-accent-400">$ </span>
            {i < line ? cmd : cmd.slice(0, chars)}
            {i < line ? (
              <span className="text-accent-600 dark:text-accent-400"> {result}</span>
            ) : (
              <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent-500 animate-blink" />
            )}
          </p>
        ))}
      </div>
      <div className="mt-6 h-0.5 w-56 bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-accent-500 shadow-[0_0_12px] shadow-accent-500 transition-[width] duration-200"
          style={{ width: `${(Math.min(line, LINES.length) / LINES.length) * 100}%` }}
        />
      </div>
      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">press any key to skip</p>
    </div>
  );
};

export default BootLoader;
