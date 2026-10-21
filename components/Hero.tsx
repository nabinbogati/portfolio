import React from "react";
import { profile, yearsOfExperience } from "../data/profile";
import TerminalCard from "./TerminalCard";
import { CvIcon } from "./icons/CvIcon";
import { EmailIcon } from "./icons/EmailIcon";
import { GitHubIcon } from "./icons/GitHubIcon";
import { LinkedInIcon } from "./icons/LinkedInIcon";
import { MapPinIcon } from "./icons/MapPinIcon";

const stats = [
  { value: `${yearsOfExperience}+`, label: "years in backend engineering" },
  { value: profile.teamSize, label: "developers led & mentored" },
  { value: "2019", label: "at Teslatech, from developer to lead" },
];

const socials = [
  { href: profile.github, label: "GitHub", icon: GitHubIcon },
  { href: profile.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  { href: `mailto:${profile.email}`, label: "Email", icon: EmailIcon },
];

const Hero: React.FC = () => {
  return (
    <section id="top" className="relative -mt-16 overflow-hidden pt-16">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8 lg:pb-28">
        <div className="animate-fade-in lg:col-span-7">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src={profile.photo}
              alt={profile.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-md dark:ring-zinc-800"
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              {profile.currentRole} @ {profile.currentCompany}
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            {profile.name}
          </h1>
          <p className="mt-3 font-mono text-lg text-accent-600 sm:text-xl dark:text-accent-400">
            {profile.title}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            I design, build and run the backends behind real-time multiplayer games: the APIs, the
            databases, the messaging layer and the Linux servers underneath. {yearsOfExperience}+
            years in, most of them at Teslatech, where I now lead a team of {profile.teamSize}{" "}
            developers.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500">
            <MapPinIcon className="h-4 w-4" />
            {profile.location}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={profile.cv}
              download="NabinBogati.pdf"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
            >
              <CvIcon className="h-4 w-4" />
              Download CV
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              Get in touch
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

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-xs leading-snug text-zinc-500 sm:text-sm dark:text-zinc-400">
                  {stat.label}
                </dt>
                <dd className="font-mono text-2xl font-semibold text-zinc-900 sm:text-3xl dark:text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-in [animation-delay:150ms] lg:col-span-5">
          <TerminalCard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
