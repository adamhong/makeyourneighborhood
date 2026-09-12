/** Supporters needed before a proposal shows the "Community momentum" banner. */
export const MOMENTUM_THRESHOLD = 50;

/** Demo only: newly submitted proposals start with a few "I want this" votes. */
export const STARTER_SUPPORT = { min: 3, max: 12 };

export const INVESTMENT_DISCLAIMER =
  "Interest is non-binding and does not constitute an investment offer.";

/** Community needs, shown as mock "AI" suggestions on the submit form. */
export const NEEDS = [
  {
    id: "childcare",
    label: "Childcare",
    tag: "Childcare",
    emoji: "🧸",
    why: "Affordable care close to home lets parents keep working and keeps young families rooted here.",
  },
  {
    id: "bookstore",
    label: "Bookstore",
    tag: "Books",
    emoji: "📚",
    why: "An independent bookstore is a third place for readers, students, and local authors.",
  },
  {
    id: "green",
    label: "Public green space",
    tag: "Park",
    emoji: "🌳",
    why: "Trees and open space cool the block, support health, and give neighbors somewhere to gather.",
  },
  {
    id: "kitchen",
    label: "Community kitchen",
    tag: "Food",
    emoji: "🍲",
    why: "A shared kitchen launches food businesses, powers meal programs, and hosts celebrations.",
  },
  {
    id: "workspace",
    label: "Affordable workspace",
    tag: "Workspace",
    emoji: "🛠️",
    why: "Below-market studios and desks keep artists and small businesses from being priced out.",
  },
  {
    id: "music",
    label: "Live music venue",
    tag: "Music",
    emoji: "🎶",
    why: "Small stages give local musicians a home and bring evening life to quiet blocks.",
  },
] as const;

export type Need = (typeof NEEDS)[number];
export type NeedId = Need["id"];

export function isNeedId(value: unknown): value is NeedId {
  return typeof value === "string" && NEEDS.some((need) => need.id === value);
}

export function getNeed(id: NeedId): Need {
  return NEEDS.find((need) => need.id === id)!;
}

export const CATEGORIES = [
  { id: "childcare", label: "Childcare & Family", emoji: "🧸", className: "bg-butter" },
  { id: "music", label: "Music & Performance", emoji: "🎶", className: "bg-lilac" },
  { id: "books", label: "Books & Learning", emoji: "📚", className: "bg-ice" },
  { id: "green", label: "Parks & Green Space", emoji: "🌳", className: "bg-mint" },
  { id: "arts", label: "Arts & Makers", emoji: "🎨", className: "bg-blush" },
  { id: "food", label: "Food & Gathering", emoji: "🍲", className: "bg-butter" },
  { id: "workspace", label: "Workspace", emoji: "💼", className: "bg-ice" },
  { id: "other", label: "Something else", emoji: "✨", className: "bg-lilac" },
] as const;

export type Category = (typeof CATEGORIES)[number];

export function getCategory(id: string): Category {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export type Neighborhood = {
  name: string;
  /** Pin position on the illustrated map, in percent of its width/height. */
  x: number;
  y: number;
  /** Mock "AI" context shown on the submit form. */
  alreadyHas: string[];
  topNeeds: NeedId[];
};

export const NEIGHBORHOODS: Neighborhood[] = [
  { name: "SoMa", x: 68, y: 33, alreadyHas: ["Tech offices", "Coffee shops", "Yerba Buena Gardens"], topNeeds: ["childcare", "green", "workspace"] },
  { name: "Dogpatch", x: 80, y: 50, alreadyHas: ["Breweries", "Maker studios", "Waterfront walks"], topNeeds: ["music", "green", "kitchen"] },
  { name: "Mission", x: 62, y: 51, alreadyHas: ["Taquerias", "Murals", "Dolores Park"], topNeeds: ["bookstore", "kitchen", "childcare"] },
  { name: "Tenderloin", x: 61, y: 25, alreadyHas: ["Historic theaters", "Family-run restaurants", "Social services"], topNeeds: ["green", "kitchen", "childcare"] },
  { name: "Bayview", x: 76, y: 77, alreadyHas: ["Third Street shops", "Community gardens", "Warehouse space"], topNeeds: ["workspace", "bookstore", "childcare"] },
  { name: "Hayes Valley", x: 54, y: 34, alreadyHas: ["Boutiques", "Patricia's Green", "Restaurants"], topNeeds: ["childcare", "music", "workspace"] },
  { name: "Chinatown", x: 67, y: 16, alreadyHas: ["Family associations", "Bakeries", "Portsmouth Square"], topNeeds: ["green", "childcare", "kitchen"] },
  { name: "Excelsior", x: 54, y: 82, alreadyHas: ["Mission St businesses", "McLaren Park", "Churches"], topNeeds: ["bookstore", "music", "workspace"] },
  { name: "Outer Sunset", x: 14, y: 56, alreadyHas: ["Ocean Beach", "Surf shops", "Golden Gate Park"], topNeeds: ["kitchen", "childcare", "music"] },
  { name: "Western Addition", x: 47, y: 28, alreadyHas: ["Jazz history", "Fillmore venues", "Alamo Square"], topNeeds: ["workspace", "bookstore", "green"] },
];

export function getNeighborhood(name: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((neighborhood) => neighborhood.name === name);
}
