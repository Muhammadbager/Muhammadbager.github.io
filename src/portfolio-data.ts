const baseUrl = import.meta.env.BASE_URL;

export const profile = {
  name: "Muhammadbager Al-Ali",
  role: "Software Engineer",
  location: "Greater Seattle Area",
  email: "muhammadbaqer_a@yahoo.com",
  linkedin: "https://www.linkedin.com/in/muhammadbager-al-ali/",
  github: "https://github.com/Muhammadbager",
  resume: `${baseUrl}resume/Muhammadbager_Al-Ali_Resume.pdf`,
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
      "A React and Flask hands-free navigation app with voice commands, routing, and Raspberry Pi integration.",
    highlights: [
      "Contributed to the navigation interface, voice-command flows, and full-stack debugging before the app was integrated into a Raspberry Pi.",
      "Used Claude as an implementation and debugging aid during the hackathon.",
    ],
    tools: ["React", "Python", "Flask", "Raspberry Pi", "Gemma", "OSRM"],
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
      "Evaluated physics-informed neural operators across 1D wave super-resolution and Black–Scholes option-pricing experiments.",
    highlights: [
      "Generated 1,000 synthetic option-pricing samples and trained with only 32 real Yahoo Finance observations; the sparse real-data results were similar to results from clean synthetic data.",
      "Used Codex to debug incorrect Black–Scholes solver outputs and Cursor to support experiment implementation.",
      "Separately improved Quadro RTX 6000 utilization from about 13% to 88% while troubleshooting the training pipeline with nvidia-smi.",
    ],
    tools: ["PyTorch", "Jupyter", "PINO", "Black–Scholes", "Yahoo Finance"],
    links: [
      { label: "Code", href: "https://github.com/hishambhatti/PINO-apps" },
      { label: "Paper", href: `${baseUrl}research/PINO_Robustness_Paper.pdf` },
    ],
  },
  {
    index: "03",
    title: "Next-Character Prediction",
    type: "Natural language processing",
    description:
      "A team-built language model that returned the three most likely next characters for a given text input.",
    highlights: [
      "Experimented with n-grams, LSTMs, and Transformers using Kneser–Ney smoothing, AdamW, learning-rate scheduling, and early stopping.",
      "Improved top-three prediction accuracy by about 3.6× on more than 20 million Wikipedia characters while reducing runtime.",
      "Contributed across implementation, optimizer tuning, parameter testing, and debugging with Cursor; validated the final model in the course Docker environment.",
    ],
    tools: ["Python", "PyTorch", "Kneser–Ney", "AdamW", "Docker", "NLP"],
    links: [
      { label: "Code", href: "https://github.com/pemap654/cse447-project" },
    ],
  },
  {
    index: "04",
    title: "Topical",
    type: "AI research discovery",
    description:
      "A team-built mobile research discovery app that turns academic papers into approachable summaries.",
    highlights: [
      "Built the Llama summarization pipeline, repaired the research-paper web scraper, and improved backend request handling.",
      "Supported the FastAPI backend used by the React Native client, personalized feeds, search, and source links.",
    ],
    tools: ["FastAPI", "Supabase", "React Native", "Llama", "arXiv"],
    links: [
      { label: "Code", href: "https://github.com/hcp-uw/topical" },
    ],
    availability: "Archived codebase — Railway deployment offline",
  },
  {
    index: "05",
    title: "SkillSnap",
    type: "Full-stack portfolio platform",
    description:
      "A Blazor portfolio and project tracker with authenticated CRUD workflows, role-aware API security, client session state, and cached EF Core queries.",
    highlights: [
      "Implemented project and skill management, ASP.NET Identity with JWT authentication, protected routes, SQLite persistence, and API caching.",
      "Used GitHub Copilot as a course requirement to scaffold and refine features and debug integration between the Blazor client and ASP.NET Core API.",
    ],
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
  "GitHub Copilot",
  "Cursor",
  "Codex",
  "Claude",
];

