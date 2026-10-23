import React from "react";
import Section from "./Section";
import Tag from "./Tag";
import { Section as SectionId } from "../types";
import { engineering } from "../data/profile";

const Work: React.FC = () => {
  return (
    <Section
      id={SectionId.Work}
      title="What I build"
      description="The engineering I do, from the first API route to the servers it runs on, and the agents that help me build it."
    >
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {engineering.map((area, index) => (
          <li
            key={area.title}
            className="spotlight group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
          >
            <p className="font-mono text-xs text-zinc-400 transition-colors group-hover:text-accent-600 dark:text-zinc-600 dark:group-hover:text-accent-400">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">{area.title}</h3>
            <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">{area.summary}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {area.tools.map((tool) => (
                <Tag key={tool}>{tool}</Tag>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Work;
