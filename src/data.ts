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

export type Pursuit = {
  n: string;
  name: string;
  detail: string;
  signal: string;
};

export const pursuits: Pursuit[] = [
  {
    n: '01',
    name: 'Skiing',
    detail: 'POWDER ≫ GROOMERS',
    signal: 'Chasing snow every winter. Type "ski" anywhere on this page.',
  },
  {
    n: '02',
    name: 'MMA',
    detail: 'STRIKING + GRAPPLING',
    signal:
      'Training and studying fight IQ — the best systems thinking happens in round three.',
  },
  {
    n: '03',
    name: 'Music',
    detail: 'ON ROTATION',
    signal: 'Hip-hop and everything adjacent. Current heavy rotation: classified.',
  },
  {
    n: '04',
    name: 'Travel',
    detail: 'NEXT: TBD',
    signal: 'Collecting cities. San Francisco is home base this year.',
  },
];

export const links = {
  email: 'tseng94@purdue.edu',
  github: 'https://github.com/jefft72',
  linkedin: 'https://linkedin.com/in/j-tseng/',
  resume: '/JeffreyTsengResume.pdf',
};
