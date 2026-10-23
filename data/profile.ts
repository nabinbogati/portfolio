// All of the site's content lives here. Edit this file to update the portfolio.
import { YearMonth, yearsSince } from "../lib/time";

export const profile = {
  name: "Nabin Bogati",
  initials: "NB",
  title: "Backend & AI Agent Engineer",
  location: "Kathmandu, Nepal",
  // First full-time backend role; drives the "N+ years" figures across the site.
  careerStart: { year: 2019, month: 2 } as YearMonth,
  photo: "./assets/profile.png",
  cv: "./assets/NabinBogati.pdf",
  email: "nabin31bogati@gmail.com",
  github: "https://github.com/nabinbogati",
  linkedin: "https://np.linkedin.com/in/nabin-bogati-1b0a4a123",
  // The word joiner (U+2060) stops "4–5" from breaking across lines after the dash.
  teamSize: "4–\u20605",
  headline: "I build backend systems that hold up in production, and the AI agents that help build them.",
  currently: "Building in Python & Go · engineering with AI agents",
};

export const yearsOfExperience = yearsSince(profile.careerStart);

export const intro = `For ${yearsOfExperience}+ years I've designed, built and run backends end to end: async Python and Go services, real-time WebSocket systems, scheduled data pipelines, PostgreSQL and Redis, and the Linux servers underneath. Now I'm making AI agents a disciplined part of how that software gets built.`;

export interface StackLayer {
  layer: string;
  tools: string[];
}

/** The hero terminal: the layers of a backend I own, from the edge down to the servers. */
export const stackLayers: StackLayer[] = [
  { layer: "edge", tools: ["HAProxy"] },
  { layer: "services", tools: ["FastAPI", "aiohttp", "Go"] },
  { layer: "real-time", tools: ["Centrifugo", "Redis"] },
  { layer: "pipelines", tools: ["Go", "Python", "cron"] },
  { layer: "data", tools: ["PostgreSQL", "Redis", "MongoDB"] },
  { layer: "infra", tools: ["Linux", "Docker", "Prometheus"] },
];

export interface EngineeringArea {
  title: string;
  summary: string;
  tools: string[];
}

export const engineering: EngineeringArea[] = [
  {
    title: "APIs & backend services",
    summary:
      "Services designed for scale and security: async Python with FastAPI and aiohttp for high-concurrency APIs, Flask and Django REST Framework where they fit, and Go when I want one fast, boring binary.",
    tools: ["Python", "Go", "FastAPI", "aiohttp", "Flask", "Django REST Framework"],
  },
  {
    title: "Real-time & concurrent systems",
    summary:
      "Systems where many clients share one state and very little time to agree on it. WebSocket servers, pub/sub on Centrifugo and Redis, and Go designs where one goroutine owns the state so the hot path needs no locks.",
    tools: ["WebSockets", "Centrifugo", "Pub/sub", "Goroutines", "Redis"],
  },
  {
    title: "Data pipelines & storage",
    summary:
      "Scheduled ingestion that pulls from external APIs, cleans and adjusts the data, then computes on it: indicators, backtests, scores. Underneath, PostgreSQL schemas and queries built for integrity, plus Redis and MongoDB where they earn their place.",
    tools: ["PostgreSQL", "Redis", "MongoDB", "Go", "cron"],
  },
  {
    title: "AI agents & developer tooling",
    summary:
      "Agent skills and pipelines that make coding agents clarify before they build, keep changes surgical and judge their own output. I wire in long-term memory and code-graph MCP servers, and run local LLMs on llama.cpp, Strata and Colibri under several agent harnesses to see how they really behave.",
    tools: ["Claude Code", "Agent Skills", "MCP", "llama.cpp", "Local LLMs", "Hindsight"],
  },
  {
    title: "Running it in production",
    summary:
      "I run what I build: configuring, hardening, monitoring and troubleshooting Linux servers, HAProxy for load balancing and high availability, Docker for deployment, Prometheus for metrics, and Python and Bash on cron for the routine work.",
    tools: ["Linux", "DigitalOcean", "HAProxy", "Docker", "Prometheus", "Bash"],
  },
  {
    title: "Leading a team",
    summary: `I lead and mentor a backend team of ${profile.teamSize} developers across the whole lifecycle: design reviews, coding and testing standards, and deployments that don't need a hero.`,
    tools: ["Mentoring", "Code review", "System design"],
  },
];

export interface Drive {
  title: string;
  text: string;
}

export const drives: Drive[] = [
  {
    title: "Owning the whole system",
    text: "I don't stop at the API. I set up and harden the servers, configure the load balancer, watch how things perform and script away the repetitive work. Even my editor and shell setup lives in version control.",
  },
  {
    title: "Correct by construction",
    text: "Concurrency, consistency and latency are the problems I keep coming back to. I prefer designs where the wrong thing can't happen over code that hopes it won't.",
  },
  {
    title: "Agents as disciplined teammates",
    text: "I think the next decade of software gets written alongside AI agents. The interesting work is making them reliable: clear specs, small diffs, memory of the codebase and honest self-review.",
  },
  {
    title: "Widening the stack",
    text: "Backend is home, but I keep reaching outward: Go and Flutter, a C# certification, a puzzle game taken from idea to Google Play on my own, and now agents, MCP and local models.",
  },
];

export interface NowItem {
  label: string;
  text: string;
}

export const now = {
  updated: "October 2026",
  items: [
    {
      label: "Working",
      text: `Leading a backend team of ${profile.teamSize} developers, building real-time systems in async Python.`,
    },
    {
      label: "Building",
      text: "NEPSE Desk, a stock-market data platform in Go and Next.js, and a Callbreak game server in Go.",
    },
    {
      label: "Engineering with agents",
      text: "Refining a two-stage agent pipeline (clarify, then build) with persistent memory and a code-graph MCP server.",
    },
    {
      label: "Experimenting",
      text: "Running local LLMs on llama.cpp, Strata and Colibri on 8–12 GB GPUs, and driving them from Claude Code, dsh, Hermes Agent and Pi.",
    },
    {
      label: "Learning",
      text: "Go and Flutter by shipping real projects end to end, and design patterns for scalable systems.",
    },
    {
      label: "Reading",
      text: "The Power of Now by Eckhart Tolle.",
    },
  ] as NowItem[],
};

export interface Role {
  title: string;
  start: YearMonth;
  /** Leave out for a current role. */
  end?: YearMonth;
  highlights: string[];
}

export interface Job {
  company: string;
  location: string;
  roles: Role[];
  stack: string[];
}

export const experience: Job[] = [
  {
    company: "Teslatech Pvt. Ltd.",
    location: "Dhobighat, Lalitpur",
    roles: [
      {
        title: "Lead Backend Developer",
        start: { year: 2023, month: 4 },
        highlights: [
          "Architect and build scalable backends for large-scale online multiplayer games with Python, FastAPI and WebSockets, backed by PostgreSQL, Redis and MongoDB.",
          `Lead and mentor a team of ${profile.teamSize} developers across the full development lifecycle, promoting best practices in coding, testing and deployment.`,
          "Run the DigitalOcean VPS environments: server configuration, security hardening, performance monitoring and troubleshooting.",
        ],
      },
      {
        title: "Backend Developer",
        start: { year: 2019, month: 2 },
        end: { year: 2023, month: 4 },
        highlights: [
          "Designed, built and maintained RESTful APIs following industry best practices for scalability and security.",
          "Designed and managed relational (PostgreSQL) and NoSQL (Redis, MongoDB) databases, focusing on data integrity, optimized queries and horizontal scaling.",
          "Architected and deployed a resilient publish-subscribe messaging layer on Centrifugo for real-time gameplay communication.",
          "Configured HAProxy for load balancing and high availability, and automated routine operations with Python and Bash scripts on cron.",
        ],
      },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Flask",
      "aiohttp",
      "WebSockets",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "Centrifugo",
      "HAProxy",
      "DigitalOcean",
    ],
  },
  {
    company: "Dryice Pvt. Ltd.",
    location: "Kupondole, Lalitpur",
    roles: [
      {
        title: "Backend Intern",
        start: { year: 2018, month: 7 },
        end: { year: 2019, month: 1 },
        highlights: [
          "Built REST API-driven web applications with Django REST Framework.",
          "Wrote automated test cases for web applications.",
          "Developed a web crawler to scrape and compare stock prices from Yahoo Finance.",
        ],
      },
    ],
    stack: ["Python", "Django REST Framework"],
  },
  {
    company: "CloudFactory Nepal",
    location: "Bakhundole, Lalitpur",
    roles: [
      {
        title: "Cloud Analyst",
        start: { year: 2017, month: 1 },
        end: { year: 2018, month: 6 },
        highlights: ["Performed data analysis in Excel.", "Provided QA support."],
      },
    ],
    stack: [],
  },
];

export interface Project {
  name: string;
  kind: string;
  summary: string;
  highlights?: string[];
  stack: string[];
  icon?: string;
  status?: string;
  links: {
    github?: string;
    live?: string;
  };
}

/** Shown large at the top of the projects section, in order. */
export const featuredProjects: Project[] = [
  {
    name: "NEPSE Desk",
    kind: "Personal · Data platform",
    summary:
      "A Nepal Stock Exchange data platform and portfolio manager. A Go engine syncs prices from NEPSE every trading day and analyses them. A mobile-first Next.js app turns that into a screener, a portfolio ledger and trade ideas with a public track record.",
    highlights: [
      "A daily Go pipeline syncs prices into PostgreSQL incrementally, then adjusts the history for bonus and right shares so charts and indicators stay honest.",
      "Computes indicators, relative-strength ratings and market breadth, grades eight published trading strategies against the history, and records every recommendation with its outcome.",
      "Per-user portfolio ledger with WACC and realized and unrealized profit and loss. Sign-in uses hashed one-time tokens, with roles and plans on top.",
      "Admin jobs and the cron crawler share one lock file so they never overlap. Kysely types are generated from the live schema, and Playwright covers the admin flows.",
    ],
    stack: ["Go", "PostgreSQL", "Next.js", "TypeScript", "Kysely", "Docker", "Playwright"],
    links: { github: "https://github.com/nabinbogati/stock-analyzer" },
  },
  // Load-test figures come from the "Load testing" section of the backend README in the repo.
  {
    name: "Callbreak game server",
    kind: "Personal · Open source",
    summary:
      "An authoritative multiplayer server for the card game Callbreak, written in Go for its Flutter client. Invite-only private tables, quick-play matchmaking, and bots that fill empty seats.",
    highlights: [
      "Load-tested at 800 concurrent players on one laptop core: 625 µs median and 13.6 ms p99 move latency, with zero dropped connections.",
      "One goroutine per table owns all of its state, so turn order is correct by construction and the hot path takes no locks.",
      "The rules engine is a pure state machine ported from the Dart client, with its tests ported case for case so client and server can't disagree.",
      "Hidden hands are redacted at the boundary, a panic costs one table rather than the process, and Redis lets it scale across nodes.",
    ],
    stack: ["Go", "WebSockets", "PostgreSQL", "Redis", "Prometheus", "Docker", "Flutter"],
    links: { github: "https://github.com/nabinbogati/callbreak-multiplayer" },
  },
];

export const projects: Project[] = [
  {
    name: "Karpathy agent pipeline",
    kind: "Personal · AI tooling",
    summary:
      "Three agent skills that change how coding agents work. intent-architect turns a vague request into a compact spec or a question. expert-karpathy builds it with small, surgical changes. karpathy-pipeline chains the two and ends with an honest production-ready check.",
    stack: ["Agent Skills", "Claude Code", "Prompt design"],
    links: { github: "https://github.com/nabinbogati/SKILLS" },
  },
  {
    name: "Commit message agent skill",
    kind: "Personal · AI tooling",
    summary:
      "An agent skill that teaches Claude my Conventional Commits standard, so any commit it writes or reviews follows the same types, scopes and subject rules I do.",
    stack: ["Agent Skills", "Claude", "Git"],
    links: { github: "https://github.com/nabinbogati/SKILLS" },
  },
  {
    name: "Connecting Dots",
    kind: "Personal · Mobile game",
    summary:
      "A one-line puzzle game: draw a single continuous path from the green dot to the red flag without crossing an obstacle. Built in Flutter and published on Google Play.",
    stack: ["Flutter", "Dart", "Android"],
    status: "Live on Google Play",
    links: { live: "https://play.google.com/store/apps/details?id=com.nabinbogati.connecting_dots" },
  },
  {
    name: "Dotfiles",
    kind: "Personal · Open source",
    summary:
      "Version-controlled configuration for Bash, Vim and Git, so I can reproduce my development environment on any new machine.",
    stack: ["Shell", "Vim", "Git", "Linux"],
    links: { github: "https://github.com/nabinbogati/dotfiles" },
  },
];

export type TerminalTone = "plain" | "dim" | "accent" | "ok";

/** A typed command, or an output line made of coloured parts. */
export type TerminalLine = { cmd: string } | { out: [text: string, tone?: TerminalTone][] };

/** An illustrative run of my agent pipeline, typed out in the Agents section's terminal. */
export const agentSession: TerminalLine[] = [
  { cmd: 'claude "add rate limiting"' },
  { out: [["◇ recall  ", "accent"], ["hindsight · codebase-memory"]] },
  { out: [["  → past decisions + call graph loaded", "dim"]] },
  { out: [["◇ clarify ", "accent"], ["intent-architect"]] },
  { out: [["  TARGET_FILES ", "dim"], ["api/limits.py, routes.py"]] },
  { out: [["  DO           ", "dim"], ["token bucket per key, Redis"]] },
  { out: [["  DO_NOT       ", "dim"], ["touch auth, add deps"]] },
  { out: [["◇ build   ", "accent"], ["expert-karpathy"]] },
  { out: [["  → 2 files changed, +48 −3", "dim"]] },
  { out: [["◇ judge   ", "accent"], ["self-review"]] },
  { out: [["  ✓ Production-ready? Yes", "ok"]] },
];

/** The local AI lab panel in the Agents section, and the hero terminal's `lab` command. */
export const localLab = {
  vram: "8–12 GB",
  runtimes: ["llama.cpp", "Strata", "Colibri"],
  harnesses: [
    { id: "claude-code", name: "Claude Code" },
    { id: "dsh", name: "dsh", note: "DeepSeek harness" },
    { id: "hermes-agent", name: "Hermes Agent" },
    { id: "pi", name: "Pi" },
  ],
  questions: [
    "How far can a small local model go as a coding agent on a consumer GPU?",
    "Same task, different harness: where does each one shine, and where does it break?",
    "Which new runtimes, models and agent tools from the community hold up under real work?",
  ],
};

export interface AgentPractice {
  title: string;
  text: string;
}

export const agentPractices: AgentPractice[] = [
  {
    title: "Skills as code",
    text: "Agent behaviour lives in versioned skill files with clear triggers, reviewed and improved like any other code.",
  },
  {
    title: "Memory & context",
    text: "Long-term memory with Hindsight, plus codebase-memory MCP for structure, so agents start each task knowing the project.",
  },
  {
    title: "Open models, small GPUs",
    text: "I run open-weight models locally on 8–12 GB consumer GPUs: a realistic budget that shows what local agents can really do today.",
  },
  {
    title: "Guardrails over vibes",
    text: "Ask instead of guessing, keep scope tight, keep diffs small, and judge the result honestly. That's what makes an agent's work shippable.",
  },
];

export const education = {
  school: "Nagarjuna College of Information Technology",
  location: "Sankhamul, Lalitpur",
  degree: "Bachelor in Computer Science and Information Technology",
  start: { year: 2014, month: 11 } as YearMonth,
  end: { year: 2018, month: 12 } as YearMonth,
};

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  imageUrl: string;
  description: string;
}

export const certifications: Certification[] = [
  {
    name: "Crash Course on Python",
    issuer: "Google",
    date: "Issued Mar 27, 2020",
    imageUrl: "./assets/certificates/python_crash_course.png",
    description:
      "An introductory course designed by Google to build foundational Python programming skills. Topics include syntax, control flow, data types, functions, loops, and basic error handling. The course emphasizes hands-on coding and prepares learners to write simple programs and automate routine tasks using Python.",
  },
  {
    name: "Using Python to Interact with the Operating System",
    issuer: "Google",
    date: "Issued Apr 21, 2020",
    imageUrl: "./assets/certificates/python_for_systems.png",
    description:
      "This course focuses on using Python for system-level tasks, including file and directory management, automation with scripts, environment variables, subprocesses, and error handling. Developed by Google, the curriculum emphasizes practical skills for automating administrative tasks and interacting with the underlying operating system through Python.",
  },
  {
    name: "Foundational C# with Microsoft",
    issuer: "freeCodeCamp",
    date: "Issued Jan 19, 2025",
    imageUrl: "./assets/certificates/csharp_fundamentals.png",
    description:
      "A certification from freeCodeCamp and Microsoft that validates a foundational level of C# knowledge. It combines Microsoft Learn's C# training path, covering types, control flow, methods, debugging and exception handling, with a final certification exam.",
  },
];

export interface Hobby {
  name: string;
  icon: "biking" | "hiking" | "gaming" | "tech";
}

export const hobbies: Hobby[] = [
  { name: "Biking adventures", icon: "biking" },
  { name: "Hiking & trekking", icon: "hiking" },
  { name: "Online gaming", icon: "gaming" },
  { name: "Exploring new tech", icon: "tech" },
];
