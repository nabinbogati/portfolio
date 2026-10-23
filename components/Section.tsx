import React from "react";
import { Section as SectionId } from "../types";

interface SectionProps {
  id: SectionId;
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, description, aside, children }) => {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="reveal mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-accent-600 dark:text-accent-400">
            <span className="text-zinc-400 dark:text-zinc-600">//</span> {id}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
        {aside}
      </div>
      <div className="reveal [transition-delay:120ms]">{children}</div>
    </section>
  );
};

export default Section;
