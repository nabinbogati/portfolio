import React, { useEffect, useState } from "react";

const RTT_EVERY_MS = 15000;

const ktmTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kathmandu",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Times a real, uncached round trip to this site, so the number shown is the visitor's own. */
const measureRtt = async () => {
  const start = performance.now();
  await fetch(`/favicon.svg?rtt=${Date.now()}`, { method: "HEAD", cache: "no-store" });
  return Math.round(performance.now() - start);
};

/** Header readout: a status light, the time in Kathmandu, and the visitor's live round trip to the site. */
const HudStatus: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [time, setTime] = useState(() => ktmTime.format(new Date()));
  const [rtt, setRtt] = useState<number | null>(null);

  useEffect(() => {
    const clock = window.setInterval(() => setTime(ktmTime.format(new Date())), 1000);
    const ping = () => {
      if (!document.hidden) measureRtt().then(setRtt, () => setRtt(null));
    };
    ping();
    const pinger = window.setInterval(ping, RTT_EVERY_MS);
    return () => {
      window.clearInterval(clock);
      window.clearInterval(pinger);
    };
  }, []);

  return (
    <div className={`items-center gap-2 font-mono text-xs text-zinc-500 tabular-nums ${className}`}>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
      </span>
      <span title="Time in Kathmandu">KTM {time}</span>
      <span className="text-zinc-300 dark:text-zinc-700">·</span>
      <span title="Your round trip to this site, measured live">rtt {rtt === null ? "--" : rtt}ms</span>
    </div>
  );
};

export default HudStatus;
