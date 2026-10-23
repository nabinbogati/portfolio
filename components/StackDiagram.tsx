import React from "react";
import { featuredProjects, localLab, profile, projects, stackLayers, TerminalLine } from "../data/profile";
import { Section } from "../types";
import Terminal, { CommandResult } from "./Terminal";

const PAD = Math.max(...stackLayers.map((l) => l.layer.length)) + 1;

/** The layers of a backend I build and run, printed as a systemd-style status tree. */
const lines: TerminalLine[] = [
  { cmd: "whoami" },
  { out: [["nabin", "accent"], [` · ${profile.title.toLowerCase()}`]] },
  { cmd: "systemctl status stack" },
  { out: [["● ", "ok"], ["stack.target"], [" - what I build & run", "dim"]] },
  { out: [["  Active: ", "dim"], ["active (running)", "ok"], [` since ${profile.careerStart.year}`, "dim"]] },
  ...stackLayers.map<TerminalLine>((l, i) => ({
    out: [
      [i === stackLayers.length - 1 ? "  └─ " : "  ├─ ", "dim"],
      [l.layer.padEnd(PAD), "accent"],
      [l.tools.join(" · ")],
    ],
  })),
  { out: [["# this terminal works. type ", "dim"], ["help", "accent"]] },
];

const sections = Object.values(Section);

const text = (...parts: string[]): TerminalLine[] => parts.map((p) => ({ out: [[p]] }));
const dim = (p: string): TerminalLine => ({ out: [[p, "dim"]] });

const help: [string, string][] = [
  ["ls", "list the sections of this page"],
  ["cd <section>", "jump to a section"],
  ["projects", "things I've built"],
  ["stack", "what I build & run"],
  ["lab", "my local AI setup"],
  ["cat contact", "how to reach me"],
  ["open cv", "download my CV"],
  ["whoami", "who's this"],
  ["clear", "clear the screen"],
];

/** The commands visitors can run in the hero terminal. */
const handle = (input: string): CommandResult => {
  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(" ").replace(/\/$/, "");

  switch (cmd) {
    case "help":
      return [
        ...help.map<TerminalLine>(([name, what]) => ({ out: [[name.padEnd(14), "accent"], [what, "dim"]] })),
        dim("tab completes · ↑/↓ for history"),
      ];
    case "ls":
      return [{ out: sections.map<[string, "accent"]>((s) => [`${s}/  `, "accent"]) }];
    case "cd": {
      if (!arg || arg === "~") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return [];
      }
      if (!sections.includes(arg as Section)) return text(`cd: no such section: ${arg}`);
      document.getElementById(arg)?.scrollIntoView({ behavior: "smooth" });
      return [dim(`→ #${arg}`)];
    }
    case "projects":
      return [...featuredProjects, ...projects].map<TerminalLine>((p) => ({
        out: [["▸ ", "accent"], [p.name.padEnd(28)], [p.kind.split("·").pop()!.trim().toLowerCase(), "dim"]],
      }));
    case "stack":
    case "systemctl":
      return lines.slice(3, 5 + stackLayers.length);
    case "lab":
    case "nvidia-smi":
      return [
        { out: [["gpu        ", "dim"], [`${localLab.vram} VRAM`]] },
        { out: [["runtimes   ", "dim"], [localLab.runtimes.join(" · ")]] },
        { out: [["harnesses  ", "dim"], [localLab.harnesses.map((h) => h.name.toLowerCase()).join(" · ")]] },
        { out: [["status     ", "dim"], ["experimenting", "ok"]] },
      ];
    case "cat":
      if (arg !== "contact") return text(arg ? `cat: ${arg}: No such file` : "usage: cat contact");
      return [
        { out: [["email     ", "dim"], [profile.email]] },
        { out: [["github    ", "dim"], [profile.github.replace("https://", "")]] },
        { out: [["linkedin  ", "dim"], ["linkedin.com/in/nabin-bogati"]] },
      ];
    case "open":
      if (arg !== "cv") return text("usage: open cv");
      window.open(profile.cv, "_blank", "noopener");
      return [dim("opening NabinBogati.pdf …")];
    case "whoami":
      return [lines[1]];
    case "clear":
      return "clear";
    case "sudo":
      if (arg === "hire-me" || arg === "hire me")
        return [
          { out: [["[sudo] ", "dim"], ["permission granted ✓", "ok"]] },
          { out: [["→ ", "dim"], [profile.email, "accent"]] },
        ];
      return text(`nabin is not in the sudoers file. This incident will be reported.`);
    case "rm":
      return text("nice try.");
    case "exit":
      return text("there's no escape. try 'cd contact' instead.");
    default:
      return text(`command not found: ${cmd}. try 'help'`);
  }
};

const commandNames = [...help.map(([name]) => name.split(" ")[0]), "sudo", ...sections.map((s) => `cd ${s}`)];

const StackDiagram: React.FC = () => (
  <Terminal title="nabin@ktm: ~" prompt="nabin@ktm:~" lines={lines} onCommand={handle} commands={commandNames} />
);

export default StackDiagram;
