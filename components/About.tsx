import React from "react";
import Section from "./Section";
import { Section as SectionId } from "../types";
import { drives, hobbies, Hobby } from "../data/profile";
import { BikingIcon } from "./icons/BikingIcon";
import { HikingIcon } from "./icons/HikingIcon";
import { GamingIcon } from "./icons/GamingIcon";
import { TechIcon } from "./icons/TechIcon";

const hobbyIcons: Record<Hobby["icon"], React.FC<React.SVGProps<SVGSVGElement>>> = {
  biking: BikingIcon,
  hiking: HikingIcon,
  gaming: GamingIcon,
  tech: TechIcon,
};

const About: React.FC = () => {
  return (
    <Section id={SectionId.About} title="What drives me">
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        {drives.map((drive) => (
          <div key={drive.title} className="border-l-2 border-accent-500/40 pl-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{drive.title}</h3>
            <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">{drive.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="font-mono text-sm text-zinc-500">
          <span className="text-accent-600 dark:text-accent-400">#</span> outside work
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {hobbies.map((hobby) => {
            const Icon = hobbyIcons[hobby.icon];
            return (
              <li
                key={hobby.name}
                className="group spotlight flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-zinc-400 transition-colors group-hover:text-accent-600 dark:group-hover:text-accent-400" />
                {hobby.name}
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
};

export default About;
