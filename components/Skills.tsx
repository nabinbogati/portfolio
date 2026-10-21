import React from "react";
import Section from "./Section";
import { Section as SectionId } from "../types";
import { skills } from "../data/profile";

const Skills: React.FC = () => {
  return (
    <Section
      id={SectionId.Skills}
      title="Tools I build with"
      description="The stack I use day to day to design, ship and operate backend services."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div
            key={group.label}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <h3 className="font-mono text-sm text-zinc-500">
              <span className="text-accent-600 dark:text-accent-400">#</span> {group.label}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 dark:bg-zinc-800/70 dark:text-zinc-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
