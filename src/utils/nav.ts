export type NavItem = {
  label: string;
  to?: string;
  children?: NavItem[];
};

export const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Teams",
    children: [
      { label: "1. Mannschaft", to: "/teams/one" },
      { label: "2. Mannschaft", to: "/teams/two" },
    ],
  },
  {
    label: "Aktuelles",
    children: [
      { label: "News", to: "/news" },
      { label: "Termine", to: "/termine" },
    ],
  },
];
