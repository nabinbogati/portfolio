import React from "react";
import { heroStats, intro, profile } from "../data/profile";
import StackDiagram from "./StackDiagram";
import CountUp from "./CountUp";
import LiveFeed from "./LiveFeed";
import { CvIcon } from "./icons/CvIcon";
import { EmailIcon } from "./icons/EmailIcon";
import { GitHubIcon } from "./icons/GitHubIcon";
import { LinkedInIcon } from "./icons/LinkedInIcon";
import { MapPinIcon } from "./icons/MapPinIcon";

const socials = [
  { href: profile.github, label: "GitHub", icon: GitHubIcon },
  { href: profile.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  { href: `mailto:${profile.email}`, label: "Email", icon: EmailIcon },
];

const Hero: React.FC = () => {
  return (
    <section id="top" className="relative -mt-16 overflow-hidden pt-16">
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:pb-16">
        <div className="animate-fade-in lg:col-span-7">
          <div className="flex items-center gap-5 sm:gap-6">
            <img
              src={profile.photo}
              alt={profile.name}
              width={112}
              height={112}
              className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover shadow-lg ring-4 ring-white transition-[rotate,scale] duration-500 ease-out hover:-rotate-3 hover:scale-105 sm:h-28 sm:w-28 dark:ring-zinc-800"
            />
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
                {profile.name}
              </p>
              <p className="mt-1.5 font-mono text-sm font-medium text-accent-700 sm:text-base dark:text-accent-400">
                {profile.title}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                {profile.location}
              </p>
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem] dark:text-white">
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
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <dl className="grid grid-cols-2 divide-zinc-200 sm:grid-cols-4 sm:divide-x dark:divide-zinc-800">
              {heroStats.map(({ value, decimals, unit, label }) => (
                <div key={label} className="px-4 py-3">
                  <dd className="whitespace-nowrap font-mono text-lg font-semibold text-accent-700 tabular-nums dark:text-accent-400">
                    <CountUp to={value} decimals={decimals} />
                    <span className="text-sm">{unit}</span>
                  </dd>
                  <dt className="mt-0.5 text-xs text-zinc-500">{label}</dt>
                </div>
              ))}
            </dl>
            <div className="border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
              <LiveFeed />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
