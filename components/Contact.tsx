import React, { useState } from "react";
import Section from "./Section";
import { Section as SectionId } from "../types";
import { profile } from "../data/profile";
import { EmailIcon } from "./icons/EmailIcon";
import { GitHubIcon } from "./icons/GitHubIcon";
import { LinkedInIcon } from "./icons/LinkedInIcon";
import { CvIcon } from "./icons/CvIcon";

const links = [
  { href: profile.github, label: "GitHub", icon: GitHubIcon, external: true },
  { href: profile.linkedin, label: "LinkedIn", icon: LinkedInIcon, external: true },
  { href: profile.cv, label: "CV (PDF)", icon: CvIcon, external: false },
];

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <>
      <Section
        id={SectionId.Contact}
        title="Get in touch"
        description="Questions about my work, a backend problem worth talking through, or just a hello. My inbox is open."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 block break-all font-mono text-xl text-zinc-900 underline-offset-4 hover:text-accent-600 hover:underline sm:text-2xl dark:text-white dark:hover:text-accent-400"
            >
              {profile.email}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <EmailIcon className="h-4 w-4" />
                Send an email
              </a>
              <button
                onClick={copyEmail}
                className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 font-mono text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <span aria-live="polite">{copied ? "copied ✓" : "copy address"}</span>
              </button>
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            {links.map(({ href, label, icon: Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  download={external ? undefined : "NabinBogati.pdf"}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                >
                  <span className="flex items-center gap-3 font-medium">
                    <Icon className="h-5 w-5" />
                    {label}
                  </span>
                  <span className="font-mono text-zinc-400" aria-hidden="true">
                    {external ? "↗" : "↓"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </p>
          <p className="font-mono text-xs">built with React, TypeScript &amp; Tailwind CSS</p>
        </div>
      </footer>
    </>
  );
};

export default Contact;
