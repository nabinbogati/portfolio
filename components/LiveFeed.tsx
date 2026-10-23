import React, { useEffect, useState } from "react";

const EVENTS: [channel: string, payload: string][] = [
  ["table:7", 'player:join {id: "p4821"}'],
  ["table:7", 'deal {cards: 13, trump: "♥"}'],
  ["pubsub", "fanout → 4 subscribers · 1.2ms"],
  ["cron", "nepse-sync · 312 symbols · exit 0"],
  ["redis", "HSET scores p4821 21 · OK"],
  ["prom", "move_latency_p99 = 13.6ms"],
  ["agent", "intent-architect → spec 3.1 kB"],
  ["table:7", 'move {card: "K♦"} · ack 11ms'],
  ["pg", "INSERT trades · 1 row · 0.8ms"],
  ["ws", "ping/pong · rtt 9ms"],
];
const EVERY_MS = 1800;

/** One line of sample events from the kind of systems I run, ticking over like `tail -f`. */
const LiveFeed: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % EVENTS.length), EVERY_MS);
    return () => window.clearInterval(timer);
  }, []);

  const [channel, payload] = EVENTS[index];
  return (
    <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-zinc-500" aria-hidden="true">
      <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-600">tail -f events.log</span>
      <span key={index} className="min-w-0 truncate animate-fade-in">
        <span className="text-accent-600 dark:text-accent-400">{channel}</span> {payload}
      </span>
    </p>
  );
};

export default LiveFeed;
