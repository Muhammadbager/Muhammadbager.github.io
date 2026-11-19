export const profile = {
  name: "Muhammadbager Al-Ali",
  role: "Software Engineer",
  location: "Greater Seattle Area",
  email: "muhammadbaqer_a@yahoo.com",
  linkedin: "https://www.linkedin.com/in/muhammadbager-al-ali/",
  github: "https://github.com/Muhammadbager",
  resume: "/resume/Muhammadbager_Al-Ali_Resume.pdf",
};

export const experience = [
  {
    period: "Oct 2025 — Jun 2026",
    role: "Backend Engineer",
    organization: "Husky Coding Project",
    summary:
      "Built FastAPI and Supabase services for an AI-assisted research app that processes and summarizes academic papers.",
    details: [
      "Architected nine REST endpoints and bulk metadata operations for up to 25 research papers per request.",
      "Connected a React Native client with arXiv ingestion, PDF image extraction, and multiple LLM providers.",
    ],
  },
  {
    period: "Mar 2026 — Jun 2026",
    role: "Undergraduate Researcher",
    organization: "University of Washington Capstone",
    summary:
      "Evaluated physics-informed neural operators across wave-equation and Black–Scholes experiments.",
    details: [
      "Tested zero-shot super-resolution across training resolutions and PDE evaluation grids.",
      "Built a Crank–Nicolson data generator, Yahoo Finance options pipeline, and masked sparse-data loss for Black–Scholes experiments.",
    ],
  },
];

export const projects = [
  {
    index: "01",
    title: "Voice Navigation Copilot",
    type: "Embedded AI / Hackathon",
    description:
      "A hands-free navigation copilot for Raspberry Pi with on-device language understanding, speech, routing, and resilient GPS fallbacks.",
    tools: ["Python", "Flask", "Raspberry Pi", "Gemma", "OSRM"],
    links: [
      { label: "Code", href: "https://github.com/aryank09/Dubhacks_25_T-Mobile" },
      { label: "Presentation", href: "https://www.canva.com/design/DAG2NXKM7MI/sZyGksvAPrxJ8DEA5sqSPw/view?utlId=h192cf142bd" },
      { label: "Demo", href: "https://www.youtube.com/watch?v=DKR2-e1kkLI" },
    ],
  },
  {
    index: "02",
    title: "PINO Robustness",
    type: "Machine learning research",
    description:
      "Stress-tested physics-informed neural operators across 1D wave super-resolution and Black–Scholes experiments with sparse real-world options data.",
    tools: ["PyTorch", "Jupyter", "PINO", "Black–Scholes", "Yahoo Finance"],
    links: [
      { label: "Code", href: "https://github.com/hishambhatti/PINO-apps" },
      { label: "Paper", href: "/research/PINO_Robustness_Paper.pdf" },
    ],
  },
  {
    index: "03",
    title: "Next-Character Prediction",
    type: "Natural language processing",
    description:
      "A multilingual character n-gram model with Kneser–Ney smoothing trained on more than 20 million characters.",
    tools: ["Python", "Kneser–Ney", "Docker", "NLP"],
    links: [
      { label: "Code", href: "https://github.com/pemap654/cse447-project" },
    ],
  },
  {
    index: "04",
    title: "Topical",
    type: "AI research discovery",
    description:
      "A mobile research discovery app that turns academic papers into approachable summaries with personalized feeds, search, and source links.",
    tools: ["FastAPI", "Supabase", "React Native", "LLM APIs", "arXiv"],
    links: [
      { label: "Code", href: "https://github.com/hcp-uw/topical" },
    ],
    availability: "Archived codebase — Railway deployment offline",
  },
  {
    index: "05",
    title: "CampusMaps Friends",
    type: "Software design",
    description:
      "Friend-management APIs, spatial search utilities, and React components for viewing nearby friends and routes.",
    tools: ["React", "TypeScript", "Node.js", "Spatial search"],
    links: [],
    availability: "Course project — source available on request",
  },
  {
    index: "06",
    title: "SkillSnap",
    type: "Full-stack portfolio platform",
    description:
      "A Blazor portfolio and project tracker with authenticated CRUD workflows, role-aware API security, client session state, and cached EF Core queries.",
    tools: ["Blazor WebAssembly", "ASP.NET Core", "EF Core", "SQLite", "JWT"],
    links: [
      { label: "Code", href: "https://github.com/Muhammadbager/skillsnap" },
    ],
    availability: "Local demo — public deployment planned",
  },
];

export const skills = [
  "Python",
  "Java",
  "TypeScript",
  "C#",
  "C/C++",
  "React",
  "FastAPI",
  "PostgreSQL",
  "Supabase",
  "ASP.NET Core",
  "PyTorch",
  "Docker",
];

