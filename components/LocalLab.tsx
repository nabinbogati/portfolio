import React from "react";
import { localLab } from "../data/profile";

type Token = [text: string, kind?: "comment" | "section" | "key" | "string" | "punct"];

const tokenClass: Record<NonNullable<Token[1]>, string> = {
  comment: "italic text-zinc-500",
  section: "text-accent-300",
  key: "text-sky-300",
  string: "text-amber-200/90",
  punct: "text-zinc-500",
};

const KEY = 10;
const str = (s: string): Token => [`"${s}"`, "string"];
const key = (k: string): Token[] => [[k.padEnd(KEY), "key"], ["= ", "punct"]];
const list = (items: string[]): Token[] =>
  items.flatMap<Token>((item, i) => [...(i ? [[", ", "punct"] as Token] : []), str(item)]);

/** My local AI setup, written out as the config file it would be. */
const file: Token[][] = [
  [["# ~/lab/lab.toml · what runs on my desk", "comment"]],
  [],
  [["[hardware]", "section"]],
  [...key("gpu_vram"), str(localLab.vram), ["   # consumer cards", "comment"]],
  [],
  [["[runtimes]", "section"]],
  [...key("engines"), ["[", "punct"], ...list(localLab.runtimes), ["]", "punct"]],
  [],
  [["[harnesses]", "section"]],
  [...key("agents"), ["[", "punct"]],
  ...localLab.harnesses.map<Token[]>((h) => [
    ["  "],
    str(h.id),
    [",", "punct"],
    ...(h.note ? [[`${" ".repeat(14 - h.id.length)}# ${h.note}`, "comment"] as Token] : []),
  ]),
  [["]", "punct"]],
  [],
  [["[status]", "section"]],
  [...key("mode"), str("experimenting")],
  [...key("tracking"), str("what's new in the community")],
];

const LocalLab: React.FC = () => (
  <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
    <div className="lg:col-span-5">
      <p className="font-mono text-sm text-accent-600 dark:text-accent-400">
        <span className="text-zinc-400 dark:text-zinc-600">~/</span>lab
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Local AI lab</h3>
      <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
        Alongside hosted models, I run open-weight LLMs on my own hardware with {localLab.runtimes.join(", ").replace(/, ([^,]*)$/, " and $1")},
        on {localLab.vram} GPUs. I put them to work behind different agent harnesses and keep up with what the community
        ships. These are the questions I'm testing:
      </p>
      <ul className="mt-5 space-y-3">
        {localLab.questions.map((q) => (
          <li key={q} className="flex gap-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
            <span className="font-mono text-accent-600 dark:text-accent-400" aria-hidden="true">
              ?
            </span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>

    <figure className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-zinc-900/20 lg:col-span-7 dark:shadow-black/40">
      <figcaption className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-2 flex-1 truncate font-mono text-xs text-zinc-400">lab.toml</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
          </span>
          experimenting
        </span>
      </figcaption>
      <pre className="overflow-x-auto py-4 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        {file.map((line, i) => (
          <div key={i} className="flex px-4 transition-colors hover:bg-white/[0.04]">
            <span className="w-8 flex-shrink-0 select-none pr-4 text-right text-zinc-700" aria-hidden="true">
              {i + 1}
            </span>
            <span className="text-zinc-300">
              {line.map(([text, kind], j) => (
                <span key={j} className={kind ? tokenClass[kind] : undefined}>
                  {text}
                </span>
              ))}
              {line.length === 0 && " "}
            </span>
          </div>
        ))}
      </pre>
    </figure>
  </div>
);

export default LocalLab;
