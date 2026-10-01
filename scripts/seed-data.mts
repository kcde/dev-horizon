// Placeholder content based on the Figma design. Day 1 times match the Figma
// Schedule screen; Days 2–3, descriptions and most bios are filler.
// Replace with the client's real content before launch.

type TrackKey = "frontend" | "performance" | "accessibility" | "tooling";

export type SeedSpeaker = {
  slug: string;
  name: string;
  jobTitle: string;
  company: string;
  bio: string;
};

export type SeedTalk = {
  speaker: string; // speaker slug
  title: string;
  description: string;
  day: 1 | 2 | 3;
  track: TrackKey;
  startTime: string;
  endTime: string;
  isKeynote?: boolean;
};

export const siteSettings = {
  eventName: "DEVHORIZON_26",
  tagline: "where code meets the machine_",
  eventDates: "Nov 15–17, 2026",
  venue: "Pier 70, San Francisco, CA",
};

export const days = [
  { number: 1, label: "Day 1", date: "2026-11-15" },
  { number: 2, label: "Day 2", date: "2026-11-16" },
  { number: 3, label: "Day 3", date: "2026-11-17" },
] as const;

export const ROOMS: Record<TrackKey, string> = {
  frontend: "Room A",
  performance: "Room B",
  accessibility: "Room C",
  tooling: "Room D",
};

export const speakers: SeedSpeaker[] = [
  {
    slug: "elena-vasquez",
    name: "Elena Vasquez",
    jobTitle: "Principal Frontend Engineer",
    company: "Bytecraft",
    bio: "Elena has spent the last decade pushing the boundaries of in-browser development environments. She led the browser-native IDE initiative at Bytecraft and is a frequent contributor to the TC39 process. Her work focuses on making the web platform a first-class development target.",
  },
  {
    slug: "aisha-patel",
    name: "Aisha Patel",
    jobTitle: "Web Performance Lead",
    company: "Edgevane",
    bio: "Aisha leads web performance at Edgevane, where she obsesses over Core Web Vitals across hundreds of storefronts.",
  },
  {
    slug: "naomi-tanaka",
    name: "Naomi Tanaka",
    jobTitle: "Accessibility Engineering Lead",
    company: "Axion",
    bio: "Naomi builds and audits component libraries with screen reader users in the loop from day one.",
  },
  {
    slug: "james-okonkwo",
    name: "James Okonkwo",
    jobTitle: "Engineering Director",
    company: "Cartwell",
    bio: "James runs developer experience at Cartwell and has migrated more repositories into monorepos than he cares to count.",
  },
  {
    slug: "sarah-lindstrom",
    name: "Sarah Lindström",
    jobTitle: "Design Systems Lead",
    company: "Tessera",
    bio: "Sarah leads the Tessera design system, shipping tokens to web, iOS and Android from a single source.",
  },
  {
    slug: "devon-park",
    name: "Devon Park",
    jobTitle: "Frontend Architect",
    company: "Luminary",
    bio: "Devon designs rendering architectures for content-heavy sites and has been streaming HTML since before it was cool.",
  },
  {
    slug: "bertram-gilfoyle",
    name: "Bertram Gilfoyle",
    jobTitle: "Systems Architect",
    company: "Pied Piper",
    bio: "Bertram architects the infrastructure at Pied Piper and maintains strong opinions about almost everything.",
  },
  {
    slug: "priya-sharma",
    name: "Priya Sharma",
    jobTitle: "Senior Developer Advocate",
    company: "Cobalt",
    bio: "Priya teaches teams to write accessible interfaces and keeps a running list of every ARIA misuse she finds.",
  },
  {
    slug: "lucas-moreau",
    name: "Lucas Moreau",
    jobTitle: "Senior Frontend Engineer",
    company: "Websmith",
    bio: "Lucas spends his days in browser devtools and his evenings writing about the features nobody knows exist.",
  },
  {
    slug: "marcus-chen",
    name: "Marcus Chen",
    jobTitle: "Staff UI Engineer",
    company: "Nimbus",
    bio: "Marcus moved Nimbus's dashboard to React Server Components and lived to tell the tale.",
  },
  {
    slug: "ryan-osullivan",
    name: "Ryan O'Sullivan",
    jobTitle: "Devtools Engineer",
    company: "Cobalt",
    bio: "Ryan builds profiling tools at Cobalt and can spot a wasted render from across the room.",
  },
  {
    slug: "fatima-al-rashid",
    name: "Fatima Al-Rashid",
    jobTitle: "Senior UI Engineer",
    company: "Spectra",
    bio: "Fatima works on Spectra's audio products, making sure every control is usable without sight or sound.",
  },
  {
    slug: "tom-kowalski",
    name: "Tom Kowalski",
    jobTitle: "Platform Engineer",
    company: "Nimbus",
    bio: "Tom runs the platform that spins up thousands of preview environments a day at Nimbus.",
  },
  {
    slug: "mei-lin-zhang",
    name: "Mei-Lin Zhang",
    jobTitle: "Staff Engineer",
    company: "Roamly",
    bio: "Mei-Lin rebuilt Roamly's layout system around container queries and deleted a lot of media queries in the process.",
  },
  {
    slug: "dinesh-chugtai",
    name: "Dinesh Chugtai",
    jobTitle: "Senior Frontend Engineer",
    company: "Pied Piper",
    bio: "Dinesh works on Pied Piper's video pipeline and the players that sit on top of it.",
  },
  {
    slug: "carlos-rivera",
    name: "Carlos Rivera",
    jobTitle: "Core Team Member",
    company: "Blaze",
    bio: "Carlos is on the core team of the Blaze bundler, where he works on incremental builds and caching.",
  },
  {
    slug: "hannah-bergstrom",
    name: "Hannah Bergström",
    jobTitle: "UX Engineer",
    company: "PayPath",
    bio: "Hannah designs and builds checkout flows at PayPath, testing every form with assistive technology.",
  },
  {
    slug: "kwame-asante",
    name: "Kwame Asante",
    jobTitle: "Engineering Manager",
    company: "Trackwise",
    bio: "Kwame manages the tooling team at Trackwise and has evaluated more AI coding assistants than anyone should.",
  },
  {
    slug: "julia-petrov",
    name: "Julia Petrov",
    jobTitle: "Runtime Engineer",
    company: "Dawn",
    bio: "Julia works on the Dawn JavaScript runtime with a focus on web-standard APIs.",
  },
  {
    slug: "oliver-chang",
    name: "Oliver Chang",
    jobTitle: "Principal Architect",
    company: "Crestline",
    bio: "Oliver keeps Crestline's apps fast for over a billion monthly users.",
  },
];

export const talks: SeedTalk[] = [
  // Day 1 — matches the Figma Schedule screen.
  {
    speaker: "elena-vasquez",
    title: "The next frontier of web development",
    description:
      "The opening keynote. Elena takes the audience on a tour of the web platform's most transformative recent additions — from WebGPU to View Transitions to baseline support for container queries. She live-demos a full-stack application running entirely in the browser and makes the case that the gap between native and web has never been smaller.",
    day: 1,
    track: "frontend",
    startTime: "09:00",
    endTime: "10:00",
    isKeynote: true,
  },
  {
    speaker: "ryan-osullivan",
    title: "Profiling React renders at 120fps",
    description:
      "A hands-on walkthrough of finding and fixing wasted renders with the React Profiler, performance tracks and a few custom tools.",
    day: 1,
    track: "performance",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    speaker: "dinesh-chugtai",
    title: "Video compression for the web: the middle-out approach",
    description:
      "How modern codecs, adaptive streaming and a little cleverness get high-quality video onto slow connections.",
    day: 1,
    track: "performance",
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    speaker: "james-okonkwo",
    title: "Monorepos at scale: lessons from 500 packages",
    description:
      "What worked, what broke and what we'd do differently after moving 500 packages into one repository.",
    day: 1,
    track: "tooling",
    startTime: "12:00",
    endTime: "13:00",
  },
  {
    speaker: "mei-lin-zhang",
    title: "CSS container queries in production",
    description:
      "Real-world patterns, pitfalls and performance notes from shipping container queries across a large product.",
    day: 1,
    track: "frontend",
    startTime: "13:00",
    endTime: "14:00",
  },
  {
    speaker: "priya-sharma",
    title: "ARIA patterns you're probably using wrong",
    description:
      "A tour of the most common ARIA mistakes in production code and the native HTML that usually does the job better.",
    day: 1,
    track: "accessibility",
    startTime: "15:00",
    endTime: "16:00",
  },
  {
    speaker: "kwame-asante",
    title: "AI-powered developer tools: hype vs. reality",
    description:
      "An honest look at where AI tools speed teams up, where they slow them down, and how to measure the difference.",
    day: 1,
    track: "tooling",
    startTime: "16:00",
    endTime: "17:00",
  },

  // Day 2
  {
    speaker: "sarah-lindstrom",
    title: "Type-safe design tokens across platforms",
    description:
      "Generating typed tokens for web, iOS and Android from one source, and keeping them in sync with design.",
    day: 2,
    track: "frontend",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    speaker: "aisha-patel",
    title: "Eliminating layout shift once and for all",
    description:
      "Practical techniques for fonts, images, ads and late-loading content that bring CLS to zero.",
    day: 2,
    track: "performance",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    speaker: "fatima-al-rashid",
    title: "Designing accessible audio experiences",
    description:
      "Building media controls, captions and audio descriptions that work for everyone.",
    day: 2,
    track: "accessibility",
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    speaker: "devon-park",
    title: "Streaming server components for instant pages",
    description:
      "How streaming HTML and server components combine to show useful content before the data is done loading.",
    day: 2,
    track: "tooling",
    startTime: "12:00",
    endTime: "13:00",
  },
  {
    speaker: "carlos-rivera",
    title: "Inside a modern bundler: an architectural deep dive",
    description:
      "A look under the hood of a modern bundler: module graphs, incremental builds and persistent caching.",
    day: 2,
    track: "performance",
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    speaker: "marcus-chen",
    title: "React Server Components: a practical deep dive",
    description:
      "Data fetching, caching and client boundaries in a real React Server Components migration.",
    day: 2,
    track: "frontend",
    startTime: "15:00",
    endTime: "16:00",
  },
  {
    speaker: "naomi-tanaka",
    title: "Screen readers deserve better components",
    description:
      "What screen reader users run into with popular component libraries, and how to build ones that work.",
    day: 2,
    track: "accessibility",
    startTime: "16:00",
    endTime: "17:00",
  },

  // Day 3
  {
    speaker: "oliver-chang",
    title: "Web performance at billion-user scale",
    description:
      "Performance budgets, real-user monitoring and the organisational habits that keep a huge app fast.",
    day: 3,
    track: "frontend",
    startTime: "09:00",
    endTime: "10:00",
  },
  {
    speaker: "lucas-moreau",
    title: "Browser devtools: hidden gems for CSS debugging",
    description:
      "Lesser-known devtools features that make layout, cascade and animation bugs easy to track down.",
    day: 3,
    track: "tooling",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    speaker: "hannah-bergstrom",
    title: "Accessible payment forms that convert",
    description:
      "Form patterns that are both accessible and better for conversion, backed by checkout experiments.",
    day: 3,
    track: "accessibility",
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    speaker: "tom-kowalski",
    title: "Deploy preview environments that scale",
    description:
      "Running thousands of preview environments a day without blowing the budget or the database.",
    day: 3,
    track: "tooling",
    startTime: "12:00",
    endTime: "13:00",
  },
  {
    speaker: "julia-petrov",
    title: "Server-side rendering without the framework",
    description:
      "Building a fast server-rendered site with only web-standard APIs and a small runtime.",
    day: 3,
    track: "frontend",
    startTime: "14:00",
    endTime: "15:00",
  },
  {
    speaker: "bertram-gilfoyle",
    title: "Teaching machines to write code: building Son of Anton",
    description:
      "The architecture behind an autonomous coding agent, and the guardrails it turned out to need.",
    day: 3,
    track: "tooling",
    startTime: "15:00",
    endTime: "16:00",
  },
];
