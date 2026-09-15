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
    id: "26dc3323",
    name: "Stephanie",
    role: "Operational Business Manager",
    category: "Operations & Admin",
    rate: "$5,000",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/eb10fbc2d7d6467ab66e371035a243b4",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/a1c7ffc3-02b3-1115-b0ff-cb6df0fbc350.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/26dc3323",
    workableEmail: "",
  },
  {
    id: "27f1893a",
    name: "Kate",
    role: "Executive Assistant",
    category: "Operations & Admin",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1K96oNdFc00e_6aclUGeqSJNeuS86bdWp/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/293e4b6f-df18-bec1-a910-2b9b4cd5f326.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/27f1893a",
    workableEmail: "",
  },
  {
    id: "28044580",
    name: "John",
    role: "Sales Development Representative",
    category: "Operations & Admin",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/9de30c49e1ee4aacac7d81c82ce4cdc9",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/15fb97b0-9e7a-4923-2629-68c6157bac7c.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/28044580",
    workableEmail: "",
  },
  // ---------------- Marketing & Creatives ----------------
  {
    id: "27c0eb32",
    name: "Gila",
    role: "Multimedia Designer",
    category: "Marketing & Creatives",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/19Wdk5Se7AxLk3uBeZ2UleNRu_3j20oc4/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/02d4e38a-6a58-eb34-7a79-947122794ec6.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/27c0eb32",
    workableEmail: "",
  },
  {
    id: "279c9cb1",
    name: "Faith",
    role: "Digital Marketing Specialist",
    category: "Marketing & Creatives",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1rFE_DCUUjIW_b_WUrN4GeM92rvVIJRW0/view",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/79c705f2-fc0b-bbce-8f6e-5148e21f5315.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/279c9cb1",
    workableEmail: "",
  },
  {
    id: "26e9730c",
    name: "Thanh Ha",
    role: "SEO & Marketing Specialist",
    category: "Marketing & Creatives",
    rate: "$900",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/be8190b10dc648a28ed78d9f9694c23d",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/482a5398-22f9-48bb-90ff-604adf6a96d6.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/26e9730c",
    workableEmail: "",
  },
  // ---------------- Tech & Automation ----------------
  {
    id: "277b7483",
    name: "Patrick",
    role: "Full Stack Developer",
    category: "Tech & Automation",
    rate: "$3,500",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/68a365baa11842c8add7742d1f823f75",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/e6ed3f66-e945-a7e4-aee6-b4e48920c918.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/277b7483",
    workableEmail: "",
  },
  {
    id: "27ee2e87",
    name: "Daisy",
    role: "Full Stack Developer",
    category: "Tech & Automation",
    rate: "$3,500",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/f2c740b9793047fa9c33540e8815da33",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/67f79a7f-7171-cf35-86f7-f77c5f38cba2.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/27ee2e87",
    workableEmail: "",
  },
  {
    id: "2781069a",
    name: "Monsour",
    role: "IT Specialist",
    category: "Tech & Automation",
    rate: "$1,800",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/666137b4206d43229c375d7cc12836b3",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/1ea99e9e-09d8-c9f9-d627-d840141cf840.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2781069a",
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
