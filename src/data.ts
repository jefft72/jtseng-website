export type Experience = {
  n: string;
  role: string;
  org: string;
  period: string;
  signal: string;
  details?: string[];
};

export type Project = {
  n: string;
  name: string;
  type: string;
  year: string;
  blurb?: string;
  summary: string;
  stack: string;
  metric: string;
  href?: string;
  tools: { name: string; role: string }[];
};

export const experience: Experience[] = [
  {
    n: '01',
    role: 'Backend Software Engineering Intern',
    org: 'Judi Health (formerly Capital Rx)',
    period: 'JUN 2026 - PRESENT',
    signal:
      'Leading an AWS-hosted Firecracker microVM platform that gives engineers and coding agents isolated sandboxes, alongside pharmacy claim infrastructure serving 5M+ contracted lives.',
    details: [
      'Designed a capacity-aware scheduler that places microVMs across EC2 hosts and manages their lifecycle.',
      'Built a Rust linter that enforces type-safe function calls across the claims pipeline and integrated it into CI.',
      'Backend engineering internship spanning summer and fall 2026.',
    ],
  },
  {
    n: '02',
    role: 'Co-Founder',
    org: 'Diffex - Luntraa Inc.',
    period: 'APR 2026 - PRESENT',
    signal:
      'Building a modular Rust agent harness and an evidence-driven self-evolution pipeline, reaching 20% on SWE-bench Lite after a single evolution cycle.',
    details: [
      'Awarded $50,000 in compute through the Daytona Grid Startup Initiative.',
      'Built provider-agnostic model interfaces, typed execution traces, tool orchestration, persistent sessions, and replayable evaluations.',
      'The self-evolution pipeline diagnoses recurring failures, attributes token and latency costs, and generates and validates targeted harness modifications.',
    ],
  },
  {
    n: '03',
    role: 'Machine Learning Researcher',
    org: 'Purdue Data Mine / RTX Corporation',
    period: 'AUG 2026 - PRESENT',
    signal:
      'Developing ML-based aircraft trajectories and a 3D simulation environment for real-time obstacle avoidance, route efficiency, and waypoint compliance.',
    details: [
      'Synthesizing flight data with path-planning algorithms to train models for dynamic airspace.',
      'Working through Purdue Data Mine with mentorship from Raytheon engineers.',
    ],
  },
  {
    n: '04',
    role: 'Co-Founder',
    org: 'UPlate',
    period: 'AUG 2025 - JUL 2026',
    signal:
      'Grew a campus dining and nutrition app to 150+ daily active users, led six engineers, and built its RAG pipeline and Flutter app.',
    details: [
      'Engineered semantic chunking over nutritional data to supply context to Google\'s Gemini API.',
      'Built the full app, including a stateful onboarding flow for dietary profiles, and managed partnerships.',
    ],
  },
  {
    n: '05',
    role: 'Technical Teaching Assistant',
    org: 'Google Developer Groups - Purdue University',
    period: 'AUG 2025 - MAY 2026',
    signal:
      'Taught RAG architecture to 300+ students and designed take-home projects on React, Google Cloud, Vertex AI, and TensorFlow.',
  },
  {
    n: '06',
    role: 'Team Lead',
    org: 'Hack the Future - Purdue University',
    period: 'OCT 2025 - MAY 2026',
    signal:
      'Led 10+ student engineers shipping full-stack apps for a local nonprofit, owning code reviews, Git workflows, and client requirements.',
  },
];

export const projects: Project[] = [
  {
    n: '01',
    name: 'Diffex',
    type: 'AGENT HARNESS',
    year: '2026',
    blurb: 'Agent infrastructure that learns from its own work.',
    summary:
      'A modular Rust agent harness with typed execution traces, tool orchestration, persistent sessions, and replayable evaluations. Its self-evolution pipeline reached 20% on SWE-bench Lite after a single evolution cycle.',
    stack: 'RUST / LLMS / EVALUATIONS',
    metric: '$50,000 in compute awarded through Daytona Grid',
    href: 'https://diffex.ai',
    tools: [
      { name: 'Rust', role: 'The agent harness, tool orchestration, and persistent sessions.' },
      { name: 'SWE-bench Lite', role: 'The benchmark used to evaluate software-engineering performance after harness improvements.' },
    ],
  },
  {
    n: '02',
    name: 'AnimaLabs',
    type: 'RESEARCH AGENTS',
    year: '',
    blurb: 'Research agents for biomedical simulation.',
    summary:
      'Research and analyst agents connect biomedical literature from Europe PMC with deterministic simulations and cited LaTeX reports. The reporting pipeline produced 7 simulation-based reports and 23 charts with checksum-verified artifacts. Team simulations reproduced published Parkinson\'s disease findings on data the model was not fitted to.',
    stack: 'AGENTS / APIFY / LATEX / SIMULATION',
    metric: 'Cal Hacks 13.0 winner, CREAO AI Track / Commit Fellowship Prize',
    tools: [
      { name: 'Europe PMC', role: 'Published biomedical research used to propose cited experiments.' },
      { name: 'Apify', role: 'Connects the research agent to Europe PMC search.' },
      { name: 'LaTeX', role: 'Turns simulation analysis and findings into research reports.' },
    ],
  },
  {
    n: '03',
    name: 'OpenCraft',
    type: 'MULTI-AGENT SYSTEM',
    year: '2026',
    blurb: 'Multiple agents, one shared Minecraft world.',
    summary:
      'Multi-agent coordination backend for Minecraft using Supabase as shared state for jobs, agents, and memory, with an integration harness for contention and handoffs.',
    stack: 'SUPABASE / POSTGRES / REALTIME / PGVECTOR',
    metric: 'HackPrinceton 2026 winner, Dedalus Track',
    tools: [
      { name: 'Supabase', role: 'Shared backend state for jobs, agents, and memory.' },
      { name: 'PostgreSQL', role: 'Stores the coordination backend’s shared data.' },
      { name: 'Realtime', role: 'Live updates to shared agent state.' },
      { name: 'pgvector', role: 'Vector storage in the shared-state backend.' },
      { name: 'Minecraft', role: 'The shared environment where agents coordinate their tasks.' },
    ],
  },
];

export const stackLines = [
  'Python · Rust · TypeScript / JavaScript · C · Java · Dart',
  'React · React Native · Flutter · Node.js · FastAPI · LangChain',
  'AWS (EC2, VPC) · Firecracker · PostgreSQL · Supabase',
  'Git · Google Cloud · Vertex AI',
];

export const reading = {
  title: 'Dark Age',
  author: 'Pierce Brown',
  // Drop a cover image in public/ (e.g. /book.jpg) and set it here;
  // leave empty for the typographic cover.
  cover: 'darkagecover.jpg',
  started: 'JUL 2026',
  thoughts:
    'Red Rising is such a cult classic cut-and-dry dystopian sci-fi series for a reason. I\'ve lost count of how many people I\'ve recommended it to. My only gripe is that Pierce Brown keeps killing everyone off...',
};

export type Place = {
  name: string;
  note: string;
  lat: number;
  lng: number;
};

// One pin per place. The note shows in the hover tooltip - a short line
// on what you did there. Coordinates map 1:1 onto the globe.
export const places: Place[] = [
  { name: 'Merzouga Sand Dunes', note: 'camped in the sahara and rode camels', lat: 31.0966, lng: -3.9846 },
  { name: 'San Francisco', note: 'Home', lat: 37.7749, lng: -122.4194 },
  { name: 'Dolomites', note: 'Skied in the dolomites', lat: 46.4333, lng: 11.8500 },
  { name: 'Tokyo', note: 'Visited friends and ate good food', lat: 35.6762, lng: 139.6503 },
  { name: 'Osaka', note: 'Visited friends and ate good food', lat: 34.6937, lng: 135.5023 },
  { name: 'Kyoto', note: 'Visited friends and ate good food', lat: 35.0116, lng: 135.7681 },
  { name: 'Taipei', note: 'Visited family', lat: 25.0330, lng: 121.5654 },
  { name: 'Green Island', note: 'Scuba diving', lat: 22.6616, lng: 121.4884 },
  { name: 'Vienna', note: 'Sibling trip!', lat: 48.2082, lng: 16.3738 },
  { name: 'Frankfurt', note: 'Sibling trip!', lat: 50.1109, lng: 8.6821 },
  { name: 'Munich', note: 'Sibling trip!', lat: 48.1351, lng: 11.5820 },
  { name: 'Passau', note: 'Sibling trip!', lat: 48.5667, lng: 13.4319 },
  { name: 'Dresden', note: 'Sibling trip!', lat: 51.0504, lng: 13.7373 },
  { name: 'Hamburg', note: 'Sibling trip!', lat: 53.5511, lng: 9.9937 },
  { name: 'Prague', note: 'Sibling trip!', lat: 50.0755, lng: 14.4378 },
  { name: 'Mexico City', note: 'Family trip!', lat: 19.4326, lng: -99.1332 },
  { name: 'Glacier National Park', note: 'Sightseeing and hiking', lat: 48.7596, lng: -113.7870 },
  { name: 'West Lafayette', note: 'Purdue', lat: 40.4259, lng: -86.9081 },
  { name: 'Denali', note: 'Sightseeing and hiking', lat: 63.1148, lng: -151.1926 },
  { name: 'Anchorage', note: 'Sightseeing and hiking', lat: 61.2181, lng: -149.9003 },
  { name: 'Kauai', note: 'Snorkeling', lat: 22.0964, lng: -159.5261 },
  { name: 'Honolulu', note: 'Waikiki', lat: 21.3069, lng: -157.8583 },
  { name: 'Maui', note: 'First time surfing!', lat: 20.7984, lng: -156.3319 },
  { name: 'Dallas', note: 'Mind-blowing bbq', lat: 32.7767, lng: -96.7970 },
  { name: 'NYC', note: 'Good eats', lat: 40.7128, lng: -74.0060 }
];

export const links = {
  email: 'tseng94@purdue.edu',
  github: 'https://github.com/jefft72',
  linkedin: 'https://linkedin.com/in/j-tseng/',
};
