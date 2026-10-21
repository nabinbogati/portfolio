import React from "react";
import { profile, yearsOfExperience } from "../data/profile";

type JsonValue = string | string[];

// Keys and values are kept short so lines fit the card without wrapping.
const body: Record<string, JsonValue> = {
  name: profile.name,
  title: profile.title,
  experience: `${yearsOfExperience}+ years`,
  role: profile.currentRole,
  company: profile.currentCompany,
  location: profile.location,
  stack: profile.coreStack,
};

const Str: React.FC<{ value: string }> = ({ value }) => (
  <span className="text-accent-300">"{value}"</span>
);

const renderValue = (value: JsonValue) =>
  Array.isArray(value) ? (
    <>
      {"[\n"}
      {value.map((item, i) => (
        <React.Fragment key={item}>
          {"    "}
          <Str value={item} />
          {i < value.length - 1 && ","}
          {"\n"}
        </React.Fragment>
      ))}
      {"  ]"}
    </>
  ) : (
    <Str value={value} />
  );

/** A decorative API response that introduces me, styled like a terminal. */
const TerminalCard: React.FC = () => {
  const entries = Object.entries(body);

  return (
    <div
      className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-zinc-900/20 dark:shadow-black/40"
      aria-label={`${profile.name}, ${profile.title}`}
      role="img"
    >
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-zinc-700" />
        <span className="h-3 w-3 rounded-full bg-zinc-700" />
        <span className="h-3 w-3 rounded-full bg-zinc-700" />
        <span className="ml-3 font-mono text-xs text-zinc-500">api — GET /me</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-zinc-400 sm:text-[13px]">
        <code>
          <span className="text-zinc-500">$</span> <span className="text-zinc-100">http GET /me</span>
          {"\n\n"}
          <span className="text-accent-400">HTTP/1.1 200 OK</span>
          {"\n"}
          <span className="text-zinc-500">content-type: application/json</span>
          {"\n\n"}
          {"{\n"}
          {entries.map(([key, value], i) => (
            <React.Fragment key={key}>
              {"  "}
              <span className="text-sky-300">"{key}"</span>: {renderValue(value)}
              {i < entries.length - 1 && ","}
              {"\n"}
            </React.Fragment>
          ))}
          {"}\n"}
          <span className="inline-block h-4 w-2 translate-y-1 bg-accent-400 animate-blink" />
        </code>
      </pre>
    </div>
  );
};

export default TerminalCard;
