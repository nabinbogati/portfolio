import * as THREE from "three";
import { LABEL_FONT } from "./constants";

export type Tone = "accent" | "info" | "warn" | "error" | "muted";

/** CSS colours for each tone, plus the pill background behind the text. */
export type LabelColors = Record<Tone | "bg", string>;

const PAD_X = 14;
const HEIGHT = 46;
const WORLD_PER_PX = 0.0075; // a 46px label is about a third of a world unit tall

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const ms = (a: number, b: number, digits = 0) => rand(a, b).toFixed(digits);

/** A floating text pill: a sprite whose canvas texture is repainted when its text or the theme changes. */
export interface Label {
  sprite: THREE.Sprite;
  set: (text: string, tone: Tone, colors: LabelColors) => void;
  /** Repaints the current text, e.g. after a theme change. */
  paint: (colors: LabelColors) => void;
  dispose: () => void;
}

export const createLabel = (): Label => {
  const material = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, opacity: 0 });
  const sprite = new THREE.Sprite(material);
  let text = "";
  let tone: Tone = "muted";

  const paint = (colors: LabelColors) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = LABEL_FONT;
    canvas.width = Math.ceil(ctx.measureText(text).width) + PAD_X * 2;
    canvas.height = HEIGHT;
    // Resizing a canvas resets its context state.
    ctx.font = LABEL_FONT;
    ctx.textBaseline = "middle";
    ctx.fillStyle = colors.bg;
    ctx.strokeStyle = colors[tone];
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.roundRect(1, 1, canvas.width - 2, HEIGHT - 2, 8);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors[tone];
    ctx.fillText(text, PAD_X, HEIGHT / 2 + 1);

    // A new texture per paint: an uploaded texture can't change size.
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    material.map?.dispose();
    material.map = texture;
    material.needsUpdate = true;
    sprite.scale.set(canvas.width * WORLD_PER_PX, HEIGHT * WORLD_PER_PX, 1);
  };

  return {
    sprite,
    set: (nextText, nextTone, colors) => {
      text = nextText;
      tone = nextTone;
      paint(colors);
    },
    paint,
    dispose: () => {
      material.map?.dispose();
      material.dispose();
    },
  };
};

const ROUTES = [
  "/api/v1/tables",
  "/api/v1/players/me",
  "/ws/connect",
  "/auth/token",
  "/v1/quotes/NABIL",
  "/v1/screener",
  "/mcp/tools/call",
  "/v1/chat/completions",
  "/metrics",
  "/health",
];
const METHODS = ["GET", "GET", "GET", "POST", "POST", "PUT", "DELETE"];

const STATUS: [string, Tone, number][] = [
  ["200 OK", "accent", 10],
  ["201 Created", "accent", 3],
  ["204 No Content", "accent", 2],
  ["301 Moved Permanently", "info", 1],
  ["304 Not Modified", "info", 2],
  ["400 Bad Request", "warn", 1],
  ["401 Unauthorized", "warn", 1],
  ["404 Not Found", "warn", 2],
  ["409 Conflict", "warn", 1],
  ["429 Too Many Requests", "warn", 1],
  ["500 Internal Server Error", "error", 1],
  ["502 Bad Gateway", "error", 1],
  ["503 Service Unavailable", "error", 1],
  ["504 Gateway Timeout", "error", 1],
];
const STATUS_WEIGHT = STATUS.reduce((sum, [, , w]) => sum + w, 0);

const status = (): [string, Tone] => {
  let roll = Math.random() * STATUS_WEIGHT;
  for (const [text, tone, weight] of STATUS) {
    roll -= weight;
    if (roll < 0) return [text, tone];
  }
  return ["200 OK", "accent"];
};

const TECH = [
  "Python", "Go", "FastAPI", "aiohttp", "PostgreSQL", "Redis", "MongoDB", "Centrifugo", "HAProxy",
  "Docker", "Linux", "Prometheus", "WebSockets", "pub/sub", "cron", "asyncio", "goroutines",
];
const AI = [
  "Claude Code", "MCP", "llama.cpp", "Agent Skills", "RAG", "embeddings · 1536d", "q4_K_M · 8 GB",
  "tool_call → search_graph", "agent: plan → build → verify", "ctx 32k tokens", "memory recall · 4 hits",
];
const DATA = [
  "SELECT sector, avg(ret)", "EXPLAIN ANALYZE", "VACUUM ANALYZE", "GROUP BY symbol", "RSI(14)", "SMA(50) ↑",
  "OHLCV · 1d", "corr r=0.82", "backtest · 8 strategies", "rows 1,284,330", "p-value 0.03", "σ 1.94",
];

/** Random backdrop chatter: requests and status codes, latencies, pings, and the tech behind them. */
export const randomLabel = (): [string, Tone] => {
  const roll = Math.random();
  if (roll < 0.22) return status();
  if (roll < 0.36) {
    const [code, tone] = status();
    return [`${pick(METHODS)} ${pick(ROUTES)} ${code.split(" ")[0]} · ${ms(2, 48)}ms`, tone];
  }
  if (roll < 0.48) {
    const latency = pick([
      () => `p50 ${ms(1, 4)}ms`,
      () => `p99 ${ms(9, 16, 1)}ms`,
      () => `median ${ms(590, 660)}µs`,
      () => `latency ${ms(3, 40)}ms`,
      () => `throughput ${ms(1.2, 9.8, 1)}k rps`,
    ]);
    return [latency(), "info"];
  }
  if (roll < 0.58) {
    const ping = pick([
      () => `ping 10.0.${ms(0, 9)}.${ms(2, 40)} · ${ms(0.2, 2, 2)}ms`,
      () => `icmp_seq=${ms(1, 999)} ttl=64 time=${ms(8, 40, 1)} ms`,
      () => `rtt ${ms(9, 60)}ms`,
      () => "PING → PONG",
    ]);
    return [ping(), "muted"];
  }
  if (roll < 0.66) {
    const gauge = pick([
      () => `cpu ${ms(12, 71)}%`,
      () => `mem ${ms(1.1, 6.4, 1)}G / 8G`,
      () => `conn ${ms(120, 900)} open`,
      () => `uptime 99.9${ms(5, 9)}%`,
      () => `goroutines ${ms(300, 1800)}`,
    ]);
    return [gauge(), "muted"];
  }
  if (roll < 0.78) return [pick(TECH), "muted"];
  if (roll < 0.9) return [pick(AI), "accent"];
  return [pick(DATA), "info"];
};

const CRASHES = [
  "500 Internal Server Error", "502 Bad Gateway", "503 Service Unavailable", "504 Gateway Timeout",
  "OOMKilled", "panic: runtime error", "SIGSEGV", "ECONNRESET", "connection refused", "deadlock detected",
];
const RECOVERIES = ["restarted ✓", "healthy ✓", "failover → node-2", "200 OK", "back in rotation ✓"];

export const crashLabel = () => pick(CRASHES);
export const recoveryLabel = () => pick(RECOVERIES);
