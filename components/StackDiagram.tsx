import React from "react";
import { stackLayers } from "../data/profile";

/** The layers of a game backend I build and run, drawn as a request flowing from players down to servers. */
const StackDiagram: React.FC = () => {
  return (
    <figure className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-zinc-900/20 dark:shadow-black/40">
      <figcaption className="flex items-center justify-between gap-3 border-b border-zinc-800 px-5 py-3">
        <span className="font-mono text-xs text-zinc-400">what I build &amp; run</span>
        <span className="font-mono text-[11px] text-zinc-600">players → servers</span>
      </figcaption>

      <div className="relative px-5 py-6">
        {/* Rail with a packet travelling down it. */}
        <div className="absolute bottom-10 left-[29px] top-9 w-px bg-zinc-700" aria-hidden="true">
          <span className="absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-accent-400 shadow-[0_0_10px_2px] shadow-accent-400/60 animate-flow" />
        </div>

        <ol className="relative space-y-5" aria-label="The layers of a game backend I build and run">
          <li className="flex items-center gap-4">
            <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-accent-400/60 bg-zinc-900">
              <span className="h-2 w-2 rounded-full bg-accent-400" />
            </span>
            <span className="font-mono text-sm text-zinc-100">players</span>
            <span className="font-mono text-xs text-zinc-500">HTTP · WebSockets</span>
          </li>

          {stackLayers.map((layer) => (
            <li key={layer.layer} className="flex gap-4">
              <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-mono text-sm text-accent-300">{layer.layer}</span>
                  <span className="text-xs text-zinc-500">{layer.does}</span>
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {layer.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-md bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-200"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
};

export default StackDiagram;
