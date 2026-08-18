// SERVER-ONLY talent data. `workableEmail` is used exclusively for
// hired-VA sanitization and MUST NEVER be sent to the client.
// The public payload is produced by toPublicTalent() below.
//
// TODO(daniel): fill in workableEmail for each talent.
// Run `npm run fetch-emails` with WORKABLE_API_KEY set to resolve them
// automatically from the Workable candidate IDs.

export type TalentStatus = "available" | "hired";

export type Talent = {
  /** Workable candidate ID (same ID used by workable-profile.lovable.app) */
  id: string;
  /** First name + last initial only (privacy rule from the brief) */
  name: string;
  role: string;
  category: "Operations & Admin" | "Marketing & Creatives" | "Tech & Automation";
  /** Asking rate, e.g. "$1,800" (rendered as "from $1,800/mo") */
  rate?: string;
  /** e.g. "6+ years" */
  experience?: string;
  tools?: string[];
  summary?: string;
  /** "Full time" | "Part time" + start window */
  availability?: string;
  loomUrl?: string;
  photoUrl?: string;
  profileUrl?: string;
  /**
   * "available" (default) or "hired". Hired talents render as fully
   * blurred cards with a "Hired <date>" badge, mixed through the grid.
   * Set manually here OR flipped automatically by lib/sanitize.ts when
   * the Hub shows an active (non-trial) placement for the VA.
   */
  status?: TalentStatus;
  /** ISO date the VA was hired (shown on the hired badge) */
  hiredDate?: string;
  /** SERVER-ONLY. Never expose. Used for the Hub cross-check. */
  workableEmail?: string;
};

export const TALENTS: Talent[] = [
  // ---------------- Operations & Admin ----------------
  {
    id: "272ede3f",
    name: "Fernanda",
    role: "Project Manager",
    category: "Operations & Admin",
    rate: "$900",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/3ec60bc314b24f92a6274af7999267e7",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/85e7c94b-129d-732f-71e7-5c4af9a4be79.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/272ede3f",
    workableEmail: "",
  },
  {
    id: "2727cfab",
    name: "Patricia",
    role: "Executive Assistant",
    category: "Operations & Admin",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1wO-Y1_qbirGpBQJoSsxIXaAagaLgyQ_T/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/cb5929b1-9c10-96ca-2468-e362583980cf.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2727cfab",
    workableEmail: "",
  },
  {
    id: "2727c90e",
    name: "Joseph",
    role: "Operations Manager",
    category: "Operations & Admin",
    rate: "$2,750",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/8f532ccd2c19484b94999780901f5010",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/da32d352-5e55-bbad-5c3a-73d28b751632.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2727c90e",
    workableEmail: "",
  },
  // ---------------- Marketing & Creatives ----------------
  {
    id: "2586561b",
    name: "Neil",
    role: "Social Media Manager",
    category: "Marketing & Creatives",
    rate: "$900",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/febec9b066de47029aee15ef8d5b9a71",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/5aa35321-12d3-3aa0-30cd-ba16312e6d86.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2586561b",
    workableEmail: "",
  },
  {
    id: "2769725c",
    name: "Francis",
    role: "Senior UI/UX Designer",
    category: "Marketing & Creatives",
    rate: "$1,450",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1X3NnA2hZsdRdKSH1Pn6tnTSUxKUmRzjH/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/118d54e7-2190-fb14-b07e-79578fd27358.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2769725c",
    workableEmail: "",
  },
  {
    id: "26ef67a7",
    name: "Reymark",
    role: "Website Designer",
    category: "Marketing & Creatives",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/f2ee6f53f6c9406eb5949ff77be6d875",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/9fe329e4-5ca5-3c46-5189-00c5a92c9ad1.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/26ef67a7",
    workableEmail: "",
  },
  // ---------------- Tech & Automation ----------------
  {
    id: "27511687",
    name: "Princess",
    role: "AI Automation",
    category: "Tech & Automation",
    rate: "$2,500",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/ba85088f3a4844fcaffedf0fc0910136",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/9bb09707-58be-ec05-829b-23a7b539812b.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/27511687",
    workableEmail: "",
  },
  {
    id: "269d87b0",
    name: "Rafael",
    role: "Automation Engineer",
    category: "Tech & Automation",
    rate: "$7,500",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1Qf2j0naOKFR8UAgIRhbYLC8kXULxt8hy/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/db753047-f9fc-408f-bf19-0f27952bd86f.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/269d87b0",
    workableEmail: "",
  },
  {
    id: "2727d8b9",
    name: "Oliver",
    role: "Software Engineer",
    category: "Tech & Automation",
    rate: "$10,000",
    availability: "Full time · can start now",
    loomUrl: "https://youtu.be/unSlTwvZZeA",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/672d914f-f898-17cb-acd1-9704f18d5271.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2727d8b9",
    workableEmail: "",
  },
  // ---------------- Recently hired (urgency cards) ----------------
  // Real placements from the Hub (active, non-trial, PT20/FT40).
  // Fully blurred on the page with a "Hired <date>" badge.
  {
    id: "hired-alessandra",
    name: "Alessandra O.",
    role: "Quality Assurance Specialist",
    category: "Operations & Admin",
    status: "hired",
    hiredDate: "2026-08-10",
  },
  {
    id: "hired-mariah",
    name: "Mariah A.",
    role: "Executive Assistant",
    category: "Operations & Admin",
    status: "hired",
    hiredDate: "2026-08-04",
  },
  {
    id: "hired-richel",
    name: "Richel J.",
    role: "AP/AR Specialist",
    category: "Tech & Automation",
    status: "hired",
    hiredDate: "2026-08-03",
  },
];

export type PublicTalent = Omit<Talent, "workableEmail">;

export function toPublicTalent(t: Talent): PublicTalent {
  const { workableEmail, ...pub } = t;
  return pub;
}
