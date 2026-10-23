import React from "react";
import Section from "./Section";
import Tag from "./Tag";
import { Section as SectionId } from "../types";
import { experience, yearsOfExperience, Job, Role } from "../data/profile";
import { YearMonth, formatDuration, formatYearMonth, monthsBetween } from "../lib/time";

const formatRange = (start: YearMonth, end?: YearMonth) =>
  `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;

const RoleEntry: React.FC<{ role: Role }> = ({ role }) => (
  <li className="relative pl-7">
    <span
      className={`absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-white dark:ring-zinc-900 ${
        role.end ? "bg-zinc-300 dark:bg-zinc-600" : "bg-accent-500"
      }`}
      aria-hidden="true"
    />
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">{role.title}</h4>
      {!role.end && (
        <span className="rounded-full bg-accent-500/10 px-2 py-0.5 font-mono text-xs text-accent-700 dark:text-accent-300">
          current
        </span>
      )}
    </div>
    <p className="mt-1 font-mono text-xs text-zinc-500">
      {formatRange(role.start, role.end)} · {formatDuration(monthsBetween(role.start, role.end))}
    </p>
    <ul className="mt-4 space-y-2.5">
      {role.highlights.map((highlight) => (
        <li key={highlight} className="flex gap-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
          <span className="mt-2.5 h-1 w-3 flex-shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700" aria-hidden="true" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  </li>
);

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  // Roles are listed newest first.
  const start = job.roles[job.roles.length - 1].start;
  const end = job.roles[0].end;

  return (
    <li className="grid gap-8 spotlight rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 md:grid-cols-12 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="md:col-span-4">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{job.company}</h3>
        <p className="mt-1 text-sm text-zinc-500">{job.location}</p>
        <p className="mt-3 font-mono text-xs text-zinc-500">
          {formatRange(start, end)}
          <br />
          {formatDuration(monthsBetween(start, end))}
        </p>
        {job.stack.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {job.stack.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        )}
      </div>
      <ol className="relative space-y-8 border-l border-zinc-200 md:col-span-8 dark:border-zinc-800">
        {job.roles.map((role) => (
          <RoleEntry key={role.title} role={role} />
        ))}
      </ol>
    </li>
  );
};

const Experience: React.FC = () => {
  return (
    <Section
      id={SectionId.Experience}
      title="Where I've worked"
      description={`${yearsOfExperience}+ years building backend systems, growing from intern to leading a backend team.`}
    >
      <ol className="space-y-6">
        {experience.map((job) => (
          <JobCard key={job.company} job={job} />
        ))}
      </ol>
    </Section>
  );
};

export default Experience;
