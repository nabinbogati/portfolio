// All of the site's content lives here. Edit this file to update the portfolio.
import { YearMonth, yearsSince } from "../lib/time";

export const profile = {
  name: "Nabin Bogati",
  initials: "NB",
  title: "Senior Backend Engineer",
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
  headline: "I build real-time backends for multiplayer games, and keep them running in production.",
  currently: "Building multiplayer game backends at Teslatech",
};

export const yearsOfExperience = yearsSince(profile.careerStart);

export const intro = `For ${yearsOfExperience}+ years I've designed, built and operated the server side of online games: async Python APIs, WebSockets and pub/sub messaging, PostgreSQL and Redis, and the load balancers and Linux servers underneath.`;

export interface StackLayer {
  layer: string;
  does: string;
  tools: string[];
}

/** The hero diagram: the parts of a game backend I own, from the edge down to the servers. */
export const stackLayers: StackLayer[] = [
  { layer: "edge", does: "load balancing · high availability", tools: ["HAProxy"] },
  { layer: "services", does: "REST APIs · WebSocket game servers", tools: ["FastAPI", "aiohttp", "Flask"] },
  { layer: "real-time", does: "pub/sub messaging", tools: ["Centrifugo"] },
  { layer: "data", does: "persistence · caching · sessions", tools: ["PostgreSQL", "Redis", "MongoDB"] },
  { layer: "infra", does: "servers · hardening · automation", tools: ["DigitalOcean", "Linux", "Bash", "cron"] },
];

export interface EngineeringArea {
  title: string;
  summary: string;
  tools: string[];
}

export const engineering: EngineeringArea[] = [
  {
    title: "Real-time multiplayer systems",
    summary:
      "Game servers where every player sees the same state at the same moment. I build WebSocket services in async Python and a pub/sub messaging layer on Centrifugo, tuned for low latency and consistent game state across concurrent sessions.",
    tools: ["WebSockets", "Centrifugo", "Pub/sub", "FastAPI", "aiohttp"],
  },
  {
    title: "APIs & backend services",
    summary:
      "RESTful APIs designed for scalability and security. Async Python with FastAPI and aiohttp for high-concurrency services; Flask and Django REST Framework where they fit.",
    tools: ["Python", "FastAPI", "aiohttp", "Flask", "Django REST Framework"],
  },
  {
    title: "Data design & scaling",
    summary:
      "Relational and NoSQL stores built for integrity and speed: PostgreSQL schemas and query optimization, Redis for caching and session state, MongoDB, and strategies for scaling horizontally.",
    tools: ["PostgreSQL", "Redis", "MongoDB"],
  },
  {
    title: "Running it in production",
    summary:
      "I run what I build. That means configuring, hardening, monitoring and troubleshooting VPS environments on DigitalOcean, running HAProxy for load balancing and high availability, and automating routine operations with Python and Bash on cron.",
    tools: ["Linux", "DigitalOcean", "HAProxy", "Docker", "Bash", "Cron", "Git"],
  },
];

export interface Drive {
  title: string;
  text: string;
}

export const drives: Drive[] = [
  {
    title: "Games, from both sides",
    text: "Games run through everything I do. I've spent most of my career building the backends for online multiplayer games, I play them in my spare time, and I've started shipping apps of my own, beginning with Connecting Dots on Google Play.",
  },
  {
    title: "Owning the whole system",
    text: "I don't stop at the API. I set up and harden the servers, configure the load balancer, watch how things perform and script away the repetitive work. Even my editor and shell setup lives in version control.",
  },
  {
    title: "Hard real-time problems",
    text: "Many players, one game state, and very little time to agree on it. Concurrency, consistency and latency are the problems I keep coming back to.",
  },
  {
    title: "Widening the stack",
    text: "Backend is home, but I keep reaching outward: a C# certification in 2025, TypeScript and React now, and taking an app all the way from idea to store listing on my own.",
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
      text: `Architecting real-time backends for online multiplayer games at Teslatech, and mentoring a team of ${profile.teamSize} developers.`,
    },
    {
      label: "Shipped",
      text: "Connecting Dots, my own Android app, is live on Google Play.",
    },
    {
      label: "Learning",
      text: "TypeScript and React, to work across the full stack, and design patterns for scalable system design.",
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

export const featuredProject: Project = {
  name: "Callbreak: multiplayer game backend",
  kind: "Professional · Teslatech",
  summary:
    "Designed and built the backend for a real-time online multiplayer card game, built for high availability and low latency with thousands of concurrent players.",
  highlights: [
    "Real-time gameplay over WebSockets, served by async Python services (FastAPI, aiohttp).",
    "PostgreSQL for persistent game data; Redis for caching and session state.",
    "Kept game state consistent across concurrent sessions while keeping network latency low.",
    "Scalable infrastructure on DigitalOcean to keep pace with a growing player base.",
  ],
  stack: ["Python", "FastAPI", "aiohttp", "WebSockets", "PostgreSQL", "Redis", "DigitalOcean"],
  icon: "https://play-lh.googleusercontent.com/98wVaNrNvDGkmz5MwtrHkpNVgtUnKaMSqntl5ZVAMzYR0z4IXADMPN8Rq-3MtvfQ-m6s=w240-h480-rw",
  links: {
    live: "https://play.google.com/store/apps/details?id=io.teslatech.callbreak&hl=en",
  },
};

export const projects: Project[] = [
  {
    name: "Connecting Dots",
    kind: "Personal · Android",
    summary:
      "My own Android app, published on Google Play. Private by design: it collects no personal or usage data and uses no cookies or tracking.",
    stack: ["Android", "Google Play"],
    status: "Live on Google Play",
    // Add the Play Store URL as `live` to show a link on the card.
    links: {},
  },
  {
    name: "Dotfiles",
    kind: "Personal · Open source",
    summary:
      "Version-controlled configuration for Bash, Vim and Git, so I can reproduce my development environment on any new machine.",
    stack: ["Shell", "Vim", "Git", "Linux"],
    links: { github: "https://github.com/nabinbogati/dotfiles" },
  },
  {
    name: "Tic-Tac-Toe",
    kind: "Personal · Open source",
    summary:
      "The classic game for the command line in Python: game-state management, input handling and win/draw detection.",
    stack: ["Python", "CLI"],
    links: { github: "https://github.com/nabinbogati/tic-tac-toe" },
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
