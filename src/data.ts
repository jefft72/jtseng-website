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
    role: 'Backend Software Engineering Intern',
    org: 'Judi Health (formerly Capital Rx)',
    period: 'JUN 2026 - PRESENT',
    signal:
      'Building an AWS-hosted Firecracker microVM execution platform and backend services for pharmacy claim adjudication serving 5M+ contracted lives.',
  },
  {
    n: '02',
    role: 'Co-Founder',
    org: 'Diffex - Luntraa Inc.',
    period: 'APR 2026 - PRESENT',
    signal:
      'Architected a modular Rust-based agent harness and evidence-driven self-evaluation pipeline, improving SWE-bench Lite performance to 20% after one evolution cycle.',
  },
  {
    n: '03',
    role: 'Co-Founder',
    org: 'UPlate',
    period: 'AUG 2025 - JUL 2026',
    signal:
      'Grew a campus dining and nutrition app to 150+ daily active users; engineered its RAG pipeline and full stateful Flutter onboarding flow.',
  },
  {
    n: '04',
    role: 'Technical Teaching Assistant',
    org: 'Google Developer Groups - Purdue University',
    period: 'AUG 2025 - MAY 2026',
    signal:
      'Taught RAG architecture to 300+ students and designed take-home projects on React, Google Cloud, Vertex AI, and TensorFlow.',
  },
  {
    n: '05',
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
    summary:
      'Modular, provider-agnostic agent harness with typed execution traces, tool orchestration, persistent session state, and replayable evaluations.',
    stack: 'RUST / LLMS / EVALUATIONS',
    metric: '20% SWE-BENCH LITE AFTER ONE EVOLUTION CYCLE',
    href: 'https://diffex.ai',
  },
  {
    n: '02',
    name: 'OpenCraft',
    type: 'MULTI-AGENT SYSTEM',
    year: '2026',
    summary:
      'Multi-agent coordination backend for Minecraft using Supabase as shared state for jobs, agents, and memory, with an integration harness for contention and handoffs.',
    stack: 'SUPABASE / POSTGRES / REALTIME / PGVECTOR',
    metric: 'HACKPRINCETON 2026 WINNER (DEDALUS TRACK)',
  },
  {
    n: '03',
    name: 'UPlate',
    type: 'MOBILE APP',
    year: '2025',
    summary:
      'Campus dining and nutrition app with semantic-chunking RAG over nutritional data and a stateful multi-page Flutter onboarding flow.',
    stack: 'FLUTTER / FIREBASE / GEMINI',
    metric: '150+ DAILY ACTIVE USERS',
    href: 'https://jefft72.github.io/UPlate/',
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
