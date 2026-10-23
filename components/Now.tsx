import React from "react";
import Section from "./Section";
import { Section as SectionId } from "../types";
import { now } from "../data/profile";

const Now: React.FC = () => {
  return (
    <Section
      id={SectionId.Now}
      title="What I'm doing now"
      description="Where my time and attention go at the moment."
      aside={
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
          updated <time>{now.updated}</time>
        </p>
      }
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {now.items.map((item) => (
          <li
            key={item.label}
            className="spotlight rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-accent-600 dark:text-accent-400">
              {item.label}
            </p>
            <p className="mt-3 leading-relaxed text-zinc-700 dark:text-zinc-300">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Now;
