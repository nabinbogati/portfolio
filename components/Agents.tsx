import React from "react";
import Section from "./Section";
import { Section as SectionId } from "../types";
import { agentPractices, agentSession } from "../data/profile";
import Terminal from "./Terminal";
import LocalLab from "./LocalLab";

const Agents: React.FC = () => {
  return (
    <Section
      id={SectionId.Agents}
      title="Engineering with AI agents"
      description="Coding agents are fast, but speed isn't the hard part. Making their work reliable is. This is the system I've built around them."
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <Terminal title="claude · ~/api · example run" prompt="nabin@ktm:~/api" lines={agentSession} />
        </div>
        <ul className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-6">
          {agentPractices.map((practice) => (
            <li
              key={practice.title}
              className="spotlight rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white">{practice.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{practice.text}</p>
            </li>
          ))}
        </ul>
      </div>
      <LocalLab />
    </Section>
  );
};

export default Agents;
