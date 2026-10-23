import React, { useEffect, useRef, useState } from "react";
import { TerminalLine, TerminalTone } from "../data/profile";

const toneClass: Record<TerminalTone, string> = {
  plain: "text-zinc-200",
  dim: "text-zinc-500",
  accent: "text-accent-300",
  ok: "text-emerald-400",
};

const CHAR_MS = 45;
const AFTER_CMD_MS = 400;
const LINE_MS = 90;

/** What a command handler returns: lines to print, or "clear" to wipe the screen. */
export type CommandResult = TerminalLine[] | "clear";

const Prompt: React.FC<{ prompt: string }> = ({ prompt }) => (
  <>
    <span className="text-accent-400">{prompt}</span>
    <span className="text-zinc-500">$ </span>
  </>
);

const Cursor: React.FC = () => (
  <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-accent-400 animate-blink" aria-hidden="true" />
);

const Output: React.FC<{ line: TerminalLine; prompt: string }> = ({ line, prompt }) =>
  "cmd" in line ? (
    <div>
      <Prompt prompt={prompt} />
      <span className="text-white">{line.cmd}</span>
    </div>
  ) : (
    <div>
      {line.out.map(([text, tone = "plain"], j) => (
        <span key={j} className={toneClass[tone]}>
          {text}
        </span>
      ))}
    </div>
  );

interface TerminalProps {
  /** Window title, e.g. "nabin@ktm: ~". */
  title: string;
  /** Prompt before each command, e.g. "nabin@ktm:~". */
  prompt: string;
  lines: TerminalLine[];
  /** Makes the terminal accept typed commands once the session has played. */
  onCommand?: (cmd: string) => CommandResult;
  /** Command names offered for Tab completion. */
  commands?: string[];
  className?: string;
}

/**
 * A terminal window that types out its session once it scrolls into view, then either offers a replay
 * or, with `onCommand`, takes commands. Scripted lines are rendered from the start and hidden until
 * reached, so the window never changes height while the session plays.
 */
const Terminal: React.FC<TerminalProps> = ({ title, prompt, lines, onCommand, commands = [], className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [started, setStarted] = useState(false);
  // How far the session has played: `line` is the current line, `chars` how much of its command is typed.
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  // Interactive mode: what the visitor has run, their input, and their command history for ↑/↓.
  const [cleared, setCleared] = useState(false);
  const [output, setOutput] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLine(lines.length);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [lines.length]);

  useEffect(() => {
    if (!started || line >= lines.length) return;
    const current = lines[line];
    let delay = LINE_MS;
    let step = () => setLine(line + 1);
    if ("cmd" in current) {
      if (chars < current.cmd.length) {
        delay = chars === 0 && line === 0 ? AFTER_CMD_MS : CHAR_MS;
        step = () => setChars(chars + 1);
      } else {
        delay = AFTER_CMD_MS;
        step = () => {
          setLine(line + 1);
          setChars(0);
        };
      }
    }
    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [started, line, chars, lines]);

  // Keep the newest output in view.
  useEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [output]);

  const done = line >= lines.length;
  const interactive = Boolean(onCommand) && done;

  const replay = () => {
    setLine(0);
    setChars(0);
    setStarted(true);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    const echo: TerminalLine = { cmd };
    if (!cmd || !onCommand) {
      setOutput((prev) => [...prev, echo]);
      return;
    }
    setHistory((prev) => [...prev, cmd]);
    const result = onCommand(cmd);
    if (result === "clear") {
      setCleared(true);
      setOutput([]);
    } else {
      setOutput((prev) => [...prev, echo, ...result]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      const from = historyIndex === -1 ? history.length : historyIndex;
      const next = e.key === "ArrowUp" ? Math.max(0, from - 1) : from + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === "Tab" && input) {
      const match = commands.filter((c) => c.startsWith(input));
      if (match.length === 1) {
        e.preventDefault();
        setInput(match[0] + " ");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setCleared(true);
      setOutput([]);
    }
  };

  const transcript = lines
    .map((l) => ("cmd" in l ? `${prompt}$ ${l.cmd}` : l.out.map(([text]) => text).join("")))
    .join("\n");

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-zinc-900/20 transition-shadow dark:shadow-black/40 ${
        interactive ? "focus-within:ring-1 focus-within:ring-accent-500/50" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-2 flex-1 truncate text-center font-mono text-xs text-zinc-500">{title}</span>
        <span className="w-16 whitespace-nowrap text-right">
          {!onCommand && done && (
            <button
              onClick={replay}
              className="rounded px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-accent-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-400"
            >
              ↻ replay
            </button>
          )}
        </span>
      </div>

      <pre className="sr-only">{transcript}</pre>
      {/* Clicking anywhere in the window focuses the prompt, like a real terminal. */}
      <div
        ref={screenRef}
        onClick={() => interactive && inputRef.current?.focus({ preventScroll: true })}
        className={`overflow-y-auto overflow-x-auto px-4 py-5 font-mono text-[12px] leading-relaxed whitespace-pre sm:px-5 sm:text-[13px] ${
          onCommand ? "h-[22.5rem] cursor-text" : ""
        }`}
      >
        {!cleared && (
          <div aria-hidden="true">
            {lines.map((l, i) => {
              const shown = i < line;
              if ("cmd" in l) {
                const typing = i === line && started;
                const visible = shown ? l.cmd.length : typing ? chars : 0;
                return (
                  <div key={i} className={shown || typing ? "" : "invisible"}>
                    <Prompt prompt={prompt} />
                    <span className="text-white">{l.cmd.slice(0, visible)}</span>
                    {typing && <Cursor />}
                    <span className="invisible">{l.cmd.slice(visible)}</span>
                  </div>
                );
              }
              return (
                <div key={i} className={shown ? "" : "invisible"}>
                  <Output line={l} prompt={prompt} />
                </div>
              );
            })}
          </div>
        )}

        <div aria-live="polite">
          {output.map((l, i) => (
            <Output key={i} line={l} prompt={prompt} />
          ))}
        </div>

        {interactive ? (
          <label className="flex">
            <Prompt prompt={prompt} />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              aria-label="Type a terminal command, or help to list them"
              className="min-w-0 flex-1 bg-transparent text-white caret-accent-400 outline-none"
            />
          </label>
        ) : (
          <div className={done ? "" : "invisible"} aria-hidden="true">
            <Prompt prompt={prompt} />
            <Cursor />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
