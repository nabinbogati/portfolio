import React from "react";
import { intro, profile } from "../data/profile";
import StackDiagram from "./StackDiagram";
import { CvIcon } from "./icons/CvIcon";
import { EmailIcon } from "./icons/EmailIcon";
import { GitHubIcon } from "./icons/GitHubIcon";
import { LinkedInIcon } from "./icons/LinkedInIcon";

const socials = [
  { href: profile.github, label: "GitHub", icon: GitHubIcon },
  { href: profile.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  { href: `mailto:${profile.email}`, label: "Email", icon: EmailIcon },
];

const Hero: React.FC = () => {
  return (
    <section id="top" className="relative -mt-16 overflow-hidden pt-16">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:pb-28">
        <div className="animate-fade-in lg:col-span-7">
          <div className="flex items-center gap-4">
            <img
              src={profile.photo}
              alt={profile.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md dark:ring-zinc-800"
            />
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">{profile.name}</p>
              <p className="text-sm text-zinc-500">
                {profile.title} · {profile.location}
              </p>
            </div>
          </div>

          <h1 className="mt-10 text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem] dark:text-white">
            {profile.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            {intro}
          </p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
            </span>
            {profile.currently}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex items-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
            >
              See what I build
            </a>
            <a
              href={profile.cv}
              download="NabinBogati.pdf"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              <CvIcon className="h-4 w-4" />
              Download CV
            </a>
            <div className="ml-1 flex items-center gap-1">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-lg p-2.5 text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:150ms] lg:col-span-5">
          <StackDiagram />
        </div>
      </div>
    </section>
  );
};

export default Hero;
