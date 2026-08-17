// SERVER-ONLY talent data. `workableEmail` is used exclusively for
// hired-VA sanitization and MUST NEVER be sent to the client.
// The public payload is produced by toPublicTalent() below.
//
// TODO(daniel): fill in workableEmail for each talent.
// Run `npm run fetch-emails` with WORKABLE_API_KEY set to resolve them
// automatically from the Workable candidate IDs.

export type Talent = {
  /** Workable candidate ID (same ID used by workable-profile.lovable.app) */
  id: string;
  /** First name + last initial only (privacy rule from the brief) */
  name: string;
  role: string;
  category: "Executive & Operations" | "Marketing & Tech" | "Specialists";
  /** e.g. "6+ years" — TODO: fill from resumes */
  experience?: string;
  /** Tools & systems they know — TODO: fill from resumes */
  tools?: string[];
  /** 2–3 sentence summary of what they've actually done — TODO */
  summary?: string;
  /** "Full time" | "Part time" + start window */
  availability?: string;
  loomUrl?: string;
  photoUrl?: string;
  profileUrl: string;
  /** SERVER-ONLY. Never expose. Used to drop hired VAs (Hub cross-check). */
  workableEmail?: string;
};

export const TALENTS: Talent[] = [
  {
    id: "2550a857",
    name: "Paul",
    role: "Executive Assistant",
    category: "Executive & Operations",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/de12074580324bb9a5424cce09a3d322",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/6cc90828-2217-67f4-ab7f-bdb17557f599.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2550a857",
    workableEmail: "",
  },
  {
    id: "25b7cf68",
    name: "MJ",
    role: "Sales Development Specialist",
    category: "Executive & Operations",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/8dfee457e8824e648a38a05bc60fb9fa",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/2a998eb9-ecf6-d28b-4bb8-e186f922ae7d.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/25b7cf68",
    workableEmail: "",
  },
  {
    id: "258bfb9f",
    name: "Chin",
    role: "Executive Sales Manager",
    category: "Executive & Operations",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/1c4cc2fc54ba438cbe9fcb60d5e2b11a",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/5d37742f-4580-bba4-8b3a-c9153fdc73da.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/258bfb9f",
    workableEmail: "",
  },
  {
    id: "25a08972",
    name: "Glo",
    role: "Project Manager",
    category: "Executive & Operations",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/2af2b017d92e4cffa6326edd115d867f",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/b069ecb8-ea0b-ebcd-6beb-87e8a33bafe4.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/25a08972",
    workableEmail: "",
  },
  {
    id: "25bb2af7",
    name: "Chrisanne",
    role: "Software Engineer",
    category: "Marketing & Tech",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/3c351073ab7040f9ae5b6e739d17c07c",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/8353b5db-749a-204b-7bd1-2265eb4d2a9f.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/25bb2af7",
    workableEmail: "",
  },
  {
    id: "252891c0",
    name: "Jaspher",
    role: "Automations Specialist",
    category: "Marketing & Tech",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/873a500e61414674966094f1772b2f95",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/cd729112-442e-161b-f467-8d2551ef8f74.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/252891c0",
    workableEmail: "",
  },
  {
    id: "259f4b3d",
    name: "Angela",
    role: "Social Media Manager",
    category: "Marketing & Tech",
    availability: "Full time · can start now",
    loomUrl: "https://drive.google.com/file/d/1a_bBCBnpnJ-UblcssGKuNJSHLcXR4GnG/view?usp=sharing",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/649e6a0d-2b86-6f62-16a4-8f068b7a9d21.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/259f4b3d",
    // NOTE: likely already hired (Hub has an active VA named Angela).
    // Once workableEmail is filled, she should drop from the page
    // automatically — use this as the sanitization test case.
    workableEmail: "",
  },
  {
    id: "254e01e1",
    name: "Kaycee",
    role: "Marketing / SEO Specialist",
    category: "Marketing & Tech",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/007fcbb026f54578a71dd4e62f73a4e8",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/38f10756-5cbe-94c0-b18b-7501edb5c1a5.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/254e01e1",
    workableEmail: "",
  },
  {
    id: "2578106a",
    name: "Harsh",
    role: "AI Automations Specialist",
    category: "Specialists",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/4f43a36685024bd584ed915a442b2114",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/2657efc5-7dca-eaaa-8e5a-5436c4516ce9.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2578106a",
    workableEmail: "",
  },
  {
    id: "2184dee4",
    name: "Annmarie",
    role: "Social Media / Marketing",
    category: "Specialists",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/97f8b4f8d5be4614ba590a471fca8814",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/779d52ab-14a2-9892-892a-1a1783977898.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/2184dee4",
    workableEmail: "",
  },
  {
    id: "24a333ce",
    name: "Abdus",
    role: "Data Analyst",
    category: "Specialists",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/301e245cacbd40e483af2e50a9bca947",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/7a998baa-cccf-cb3a-4262-9429d1029fc9.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/24a333ce",
    workableEmail: "",
  },
  {
    id: "24b7eab4",
    name: "Yago",
    role: "Software Developer",
    category: "Specialists",
    availability: "Full time · can start now",
    loomUrl: "https://www.loom.com/share/e35182e88a154fb192bdd010ed39b977",
    photoUrl: "https://mcusercontent.com/f446058f113961954b0efff8f/images/4007e2df-4dc1-22dc-5135-7ae22377673e.png",
    profileUrl: "https://workable-profile.lovable.app/candidate/24b7eab4",
    workableEmail: "",
  },
];

/** Public shape sent to the browser. Strips workableEmail and anything sensitive. */
export type PublicTalent = Omit<Talent, "workableEmail">;

export function toPublicTalent(t: Talent): PublicTalent {
  const { workableEmail, ...pub } = t;
  return pub;
}
