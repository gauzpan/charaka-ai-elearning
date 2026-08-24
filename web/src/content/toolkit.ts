// AI Toolkit content (design.md §3.1 Toolkit): a curated, role-relevant list of
// AI products for healthcare work. Reference-grade and static — NO prompts,
// tutorials, or how-to here (that lives in Learn/Practice). Each tool renders as
// a ≤3-line card with a single external CTA ("Visit official website ↗").
//
// This is typed TS content (source of truth), not DB rows — mirrors src/content/modules.ts.

// Badge tones are the subset of the Tag component's semantic tones this list uses.
type BadgeTone = "info" | "warning" | "neutral";

/** Filterable categories. Order drives the filter-chip order (after "All"). */
export const TOOLKIT_CATEGORIES = [
  "Research",
  "Documentation",
  "General AI",
  "Study",
  "Clinical Learning",
  "Diagnostic AI",
] as const;

export type ToolCategory = (typeof TOOLKIT_CATEGORIES)[number];

export interface Tool {
  /** Stable slug — the key persisted for Saved tools. Never reuse across tools. */
  id: string;
  /** Display name. */
  name: string;
  /** 1–2 char monochrome lettermark (no external logos — CSP/offline). */
  mark: string;
  /** One-line purpose (card line 2). */
  purpose: string;
  category: ToolCategory;
  /** Safety/availability note (card line 3), rendered as a pastel semantic Tag. */
  badge: string;
  /** Semantic tone for the badge: warning = review/verify; info = access-gated. */
  badgeTone: BadgeTone;
  /** Official site — the single external link per card. Obvious official domain. */
  url: string;
}

export const TOOLS: Tool[] = [
  // Research
  {
    id: "openevidence",
    name: "OpenEvidence",
    mark: "OE",
    purpose: "AI-supported search and summaries for medical evidence.",
    category: "Research",
    badge: "Clinical review required",
    badgeTone: "warning",
    url: "https://www.openevidence.com",
  },
  {
    id: "consensus",
    name: "Consensus",
    mark: "Co",
    purpose: "Research search tool that surfaces findings from academic literature.",
    category: "Research",
    badge: "Verify sources",
    badgeTone: "warning",
    url: "https://consensus.app",
  },
  {
    id: "elicit",
    name: "Elicit",
    mark: "El",
    purpose: "AI research assistant for finding and organizing scientific papers.",
    category: "Research",
    badge: "Verify sources",
    badgeTone: "warning",
    url: "https://elicit.com",
  },

  // Documentation
  {
    id: "dragon-copilot",
    name: "Microsoft Dragon Copilot",
    mark: "DC",
    purpose: "Ambient AI documentation and clinical workflow support.",
    category: "Documentation",
    badge: "Institution-approved access",
    badgeTone: "info",
    url: "https://www.microsoft.com/en-us/health-solutions/clinical-workflow/dragon-copilot",
  },
  {
    id: "abridge",
    name: "Abridge",
    mark: "Ab",
    purpose: "AI-generated clinical conversation notes and summaries.",
    category: "Documentation",
    badge: "Institution-approved access",
    badgeTone: "info",
    url: "https://www.abridge.com",
  },
  {
    id: "suki",
    name: "Suki",
    mark: "Su",
    purpose: "AI assistant for clinical documentation and administrative tasks.",
    category: "Documentation",
    badge: "Institution-approved access",
    badgeTone: "info",
    url: "https://www.suki.ai",
  },

  // General AI
  {
    id: "chatgpt-enterprise",
    name: "ChatGPT Enterprise",
    mark: "CG",
    purpose: "Enterprise AI assistant for approved workplace productivity tasks.",
    category: "General AI",
    badge: "No patient data unless approved",
    badgeTone: "warning",
    url: "https://openai.com/chatgpt/enterprise/",
  },
  {
    id: "microsoft-copilot",
    name: "Microsoft Copilot",
    mark: "MC",
    purpose: "AI assistant for work tasks across Microsoft tools.",
    category: "General AI",
    badge: "Organisation-approved access",
    badgeTone: "info",
    url: "https://copilot.microsoft.com",
  },
  {
    id: "gemini-enterprise",
    name: "Gemini Enterprise",
    mark: "GE",
    purpose: "Enterprise AI assistant for workplace research and productivity.",
    category: "General AI",
    badge: "Organisation-approved access",
    badgeTone: "info",
    url: "https://cloud.google.com/gemini",
  },

  // Study
  {
    id: "notebooklm",
    name: "NotebookLM",
    mark: "NL",
    purpose: "AI workspace for exploring and synthesizing selected documents.",
    category: "Study",
    badge: "Use approved content only",
    badgeTone: "warning",
    url: "https://notebooklm.google.com",
  },
  {
    id: "researchrabbit",
    name: "ResearchRabbit",
    mark: "RR",
    purpose: "Visual tool for discovering related research papers and authors.",
    category: "Study",
    badge: "Research discovery",
    badgeTone: "neutral",
    url: "https://www.researchrabbit.ai",
  },

  // Clinical Learning
  {
    id: "amboss-ai",
    name: "AMBOSS AI",
    mark: "AM",
    purpose: "AI-enhanced medical learning and clinical reference platform.",
    category: "Clinical Learning",
    badge: "Education/reference",
    badgeTone: "neutral",
    url: "https://www.amboss.com",
  },
  {
    id: "glass-health",
    name: "Glass Health",
    mark: "GH",
    purpose: "Clinical decision-support and medical knowledge platform.",
    category: "Clinical Learning",
    badge: "Clinician review required",
    badgeTone: "warning",
    url: "https://www.glass.health",
  },

  // Diagnostic AI
  {
    id: "aidoc",
    name: "Aidoc",
    mark: "Ad",
    purpose: "AI platform supporting radiology and care-coordination workflows.",
    category: "Diagnostic AI",
    badge: "Specialty + institution access",
    badgeTone: "info",
    url: "https://www.aidoc.com",
  },
  {
    id: "viz-ai",
    name: "Viz.ai",
    mark: "Vz",
    purpose: "AI-powered care coordination platform, including stroke workflows.",
    category: "Diagnostic AI",
    badge: "Specialty + institution access",
    badgeTone: "info",
    url: "https://www.viz.ai",
  },
  {
    id: "rapidai",
    name: "RapidAI",
    mark: "Ra",
    purpose: "AI platform supporting neuroimaging and stroke-care workflows.",
    category: "Diagnostic AI",
    badge: "Specialty + institution access",
    badgeTone: "info",
    url: "https://www.rapidai.com",
  },
];
