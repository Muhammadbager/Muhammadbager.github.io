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
      "Built analytical data-generation and PyTorch training workflows for controlled experiments.",
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
    href: "https://github.com/aryank09/Dubhacks_25_T-Mobile",
  },
  {
    index: "02",
    title: "SkillSnap",
    type: "Full-stack product",
    description:
      "A portfolio platform with relational project and skill models, secure identity flows, and a polished Blazor interface.",
    tools: ["ASP.NET Core", "Blazor", "EF Core", "SQLite", "JWT"],
    href: null,
    availability: "Repository available on request",
  },
  {
    index: "03",
    title: "Next-Character Prediction",
    type: "Natural language processing",
    description:
      "A multilingual character n-gram model with Kneser–Ney smoothing trained on more than 20 million characters.",
    tools: ["Python", "Kneser–Ney", "Docker", "NLP"],
    href: null,
    availability: "Project details available on request",
  },
  {
    index: "04",
    title: "CampusMaps Friends",
    type: "Software design",
    description:
      "Friend-management APIs, spatial search utilities, and React components for viewing nearby friends and routes.",
    tools: ["React", "TypeScript", "Node.js", "Spatial search"],
    href: null,
    availability: "Course project — source available on request",
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

