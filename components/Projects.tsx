import React from "react";
import Section from "./Section";
import Tag from "./Tag";
import { Section as SectionId } from "../types";
import { featuredProject, projects, Project } from "../data/profile";
import { GitHubIcon } from "./icons/GitHubIcon";
import { ExternalLinkIcon } from "./icons/ExternalLinkIcon";

const linkClass =
  "inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 underline-offset-4 hover:text-accent-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded dark:text-zinc-300 dark:hover:text-accent-400";

const ProjectLinks: React.FC<{ project: Project }> = ({ project }) => {
  const { github, live } = project.links;
  if (!github && !live) return null;

  return (
    <div className="flex flex-wrap items-center gap-5">
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <ExternalLinkIcon className="h-4 w-4" />
          {live.includes("play.google.com") ? "View on Google Play" : "Live"}
        </a>
      )}
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <GitHubIcon className="h-4 w-4" />
          Source
        </a>
      )}
    </div>
  );
};

const Stack: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((item) => (
      <Tag key={item}>{item}</Tag>
    ))}
  </div>
);

const FeaturedProject: React.FC<{ project: Project }> = ({ project }) => (
  <article className="grid gap-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 dark:border-zinc-800 dark:bg-zinc-900/50">
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        {project.icon && (
          <img
            src={project.icon}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            // Hotlinked store icons can disappear; hide rather than show a broken image.
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="h-14 w-14 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800"
          />
        )}
        <div>
          <p className="font-mono text-xs text-accent-600 dark:text-accent-400">{project.kind}</p>
          <h3 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">{project.name}</h3>
        </div>
      </div>
      <p className="mt-5 leading-relaxed text-zinc-600 dark:text-zinc-400">{project.summary}</p>
      <div className="mt-6">
        <Stack items={project.stack} />
      </div>
      <div className="mt-auto pt-8">
        <ProjectLinks project={project} />
      </div>
    </div>
    {project.highlights && (
      <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-950/60">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">What I built</p>
        <ul className="mt-4 space-y-4">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 leading-relaxed text-zinc-700 dark:text-zinc-300">
              <span className="font-mono text-accent-600 dark:text-accent-400" aria-hidden="true">
                →
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </article>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="font-mono text-xs text-zinc-500">{project.kind}</p>
      {project.status && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-2 py-0.5 font-mono text-xs text-accent-700 dark:text-accent-300">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
          {project.status}
        </span>
      )}
    </div>
    <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">{project.name}</h3>
    <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">{project.summary}</p>
    <div className="mt-5">
      <Stack items={project.stack} />
    </div>
    <div className="mt-auto pt-6">
      <ProjectLinks project={project} />
    </div>
  </article>
);

const Projects: React.FC = () => {
  return (
    <Section
      id={SectionId.Projects}
      title="Selected work"
      description="Production systems from my day job, and things I've built on my own."
    >
      <FeaturedProject project={featuredProject} />
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default Projects;
