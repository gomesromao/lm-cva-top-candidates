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
    id: "27867164",
    name: "Ashley",
    role: "Operations Manager",
    category: "Operations & Admin",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/73183354b7e84bcaad384536e397995a",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/675d3925-1478-83f3-f976-b9fc9ceba539.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/27867164",
    workableEmail: "",
  },
  {
    id: "28f5824f",
    name: "James",
    role: "Project Manager",
    category: "Operations & Admin",
    rate: "$1,450",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/85efd37ca89747c9969b4d6ce021ad47",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/0c26f8a5-7b01-34f9-bcdf-324fd6e92fbd.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/28f5824f",
    workableEmail: "",
  },
  {
    id: "29027a5a",
    name: "Rick",
    role: "Account Executive",
    category: "Operations & Admin",
    rate: "$1,450",
    availability: "Full time · can start now",
    loomUrl: "https://www.youtube.com/watch?v=sMcpdrgZ0DQ",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/6f480a23-9aeb-e33f-6cc2-4154e2ba7921.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/29027a5a",
    workableEmail: "",
  },
  // ---------------- Marketing & Creatives ----------------
  {
    id: "28124d24",
    name: "Sandra",
    role: "Social Media Manager",
    category: "Marketing & Creatives",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1PalZOZsW6GU_rb9rg_zxpeMtoVgBsU2d/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/9e84241a-684c-0956-b706-81cb9699f091.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/28124d24",
    workableEmail: "",
  },
  {
    id: "277aaa66",
    name: "Gorg",
    role: "Content & Design Specialist",
    category: "Marketing & Creatives",
    rate: "$1,450",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1jHFf79MfsY-i4R4za5blJvRFFyXDrm17/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/6b9181bb-d246-f9c9-e131-18ae3e28b338.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/277aaa66",
    workableEmail: "",
  },
  {
    id: "27ed01b3",
    name: "Jose",
    role: "Social Media Manager",
    category: "Marketing & Creatives",
    rate: "$900",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1dBzM80KmgPrGkcz-PqoU1y-wiKP6R7Qh/view?usp=sharing",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/e59c0e24-9181-9b9f-2738-129ec76f69cc.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/27ed01b3",
    workableEmail: "",
  },
  // ---------------- Tech & Automation ----------------
  {
    id: "27e40a03",
    name: "Samson",
    role: "Monday Solutions Consultant",
    category: "Tech & Automation",
    rate: "$5,000",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/503230d203e441a883a1253971542028",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/c78eabba-aeea-580c-4350-cab6596a8c58.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/27e40a03",
    workableEmail: "",
  },
  {
    id: "285ee671",
    name: "Abdalsalam",
    role: "AI Integration Engineer",
    category: "Tech & Automation",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/edff2408ea37405db77fdaab6ab71f84",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/aa43de5f-ca16-ba7c-562f-ae461167e255.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/285ee671",
    workableEmail: "",
  },
  {
    id: "276964d5",
    name: "Joel",
    role: "Quality Assurance Engineer",
    category: "Tech & Automation",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/c7802b60ca9e4d379f42e22ec03fc817",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/4bf73d88-72e0-d39f-925e-853f70de4110.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/276964d5",
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
