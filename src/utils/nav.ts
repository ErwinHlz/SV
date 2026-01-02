export type NavItem = {
  label: string;
  to?: string;
  children?: NavItem[];
};

export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Teams",
    to: "/teams/one/kader",
    children: [
      {
        label: "1. Mannschaft",
        to: "/teams/one/kader",
        children: [
          { label: "Kader", to: "/teams/one/kader" },
          { label: "Spielplan", to: "/teams/one/spielplan" },
          { label: "Tabelle", to: "/teams/one/tabelle" },
        ],
      },
      {
        label: "2. Mannschaft",
        to: "/teams/two/kader",
        children: [
          { label: "Kader", to: "/teams/two/kader" },
          { label: "Spielplan", to: "/teams/two/spielplan" },
          { label: "Tabelle", to: "/teams/two/tabelle" },
        ],
      },
      {
        label: "Jugendmannschaften",
        to: "/teams/jugend",
      },
    ],
  },
  {
    label: "Aktuelles",
    to: "/news",
    children: [
      { label: "News", to: "/news" },
      { label: "Termine", to: "/termine" },
    ],
  },
  { label: "Sponsoren", to: "/sponsor" },
];
