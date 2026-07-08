export type Experience = {
  n: string;
  role: string;
  org: string;
  period: string;
  signal: string;
};

export type Project = {
  n: string;
  name: string;
  type: string;
  year: string;
  summary: string;
  stack: string;
  metric: string;
  href?: string;
};

export const experience: Experience[] = [
  {
    n: '01',
    role: 'Backend Software Engineer',
    org: 'Judi Health / Capital Rx',
    period: 'JUN 2026 — AUG 2026',
    signal:
      'Backend systems for healthcare claims adjudication; built a Rust-based linter enforcing type-safe calls across the claims pipeline.',
  },
  {
    n: '02',
    role: 'Co-Founder',
    org: 'Diffex — Luntraa Inc',
    period: 'APR 2026 — PRESENT',
    signal:
      'Self-learning, model-agnostic AI agent harness that evolves through iterative cycles. $50K Daytona Grid award.',
  },
  {
    n: '03',
    role: 'CEO & Co-Founder',
    org: 'UPlate',
    period: 'AUG 2025 — PRESENT',
    signal:
      'AI meal planning with a custom RAG pipeline over nutritional datasets; leading a team of 5 engineers.',
  },
  {
    n: '04',
    role: 'Technical Teaching Assistant',
    org: 'Google Developer Groups, Purdue',
    period: 'AUG 2025 — MAY 2026',
    signal:
      'Taught RAG backends — semantic chunking, vector databases, cosine similarity — and shipped take-home projects for 300+ students.',
  },
  {
    n: '05',
    role: 'Team Lead',
    org: 'Hack the Future, Purdue',
    period: 'OCT 2025 — MAY 2026',
    signal:
      'Led 10+ engineers building full-stack apps for local nonprofits with React, Node.js/FastAPI, and MongoDB.',
  },
];

export const projects: Project[] = [
  {
    n: '01',
    name: 'Diffex',
    type: 'AGENT HARNESS',
    year: '2026',
    summary:
      'Self-evolving, model-agnostic agent harness that rewrites its own scaffolding through iterative improvement cycles.',
    stack: 'TYPESCRIPT / LLMS / EVALS',
    metric: '0% → 20% SWE-BENCH IN ONE CYCLE',
    href: 'https://diffex.ai',
  },
  {
    n: '02',
    name: 'OpenCraft',
    type: 'MULTI-AGENT SYSTEM',
    year: '2026',
    summary:
      'Multi-agent coordination backend for Minecraft task execution — Supabase as shared state, RAG over agent directives, end-to-end contention harness.',
    stack: 'SUPABASE / PGVECTOR / OPENAI',
    metric: 'HACKPRINCETON 2026 WINNER',
  },
  {
    n: '03',
    name: 'UPlate',
    type: 'MOBILE APP',
    year: '2025',
    summary:
      'Gemini-powered meal planning for campus dining, with semantic-chunking RAG and a stateful Flutter onboarding flow.',
    stack: 'FLUTTER / FIREBASE / GEMINI',
    metric: '150+ ACTIVE USERS',
    href: 'https://jefft72.github.io/UPlate/',
  },
];

export const stackLines = [
  'TypeScript · Python · Java · JavaScript · C · Rust',
  'React · React Native · Flutter · Node · Tailwind',
  'LangChain · LLMs · Hugging Face · RAG · Supabase',
  'NumPy · SciPy · Matlab · Gazebo · ROS',
];

export const reading = {
  title: 'Gödel, Escher, Bach',
  author: 'Douglas Hofstadter',
  // Drop a cover image in public/ (e.g. /book.jpg) and set it here;
  // leave empty for the typographic cover.
  cover: '',
  started: 'JUL 2026',
  thoughts:
    'Placeholder — swap in your running notes here in src/data.ts. A sentence or two on what the book is doing to your brain.',
};

export type Place = {
  name: string;
  note: string;
  lat: number;
  lng: number;
};

// One pin per place. The note shows in the hover tooltip — a short line
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
  resume: '/JeffreyTsengResume.pdf',
};
