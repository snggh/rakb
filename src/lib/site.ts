export const site = {
  name: "Ruang Aksara Keyboard",
  description:
    "A mechanical keyboard community in Jakarta. Meetups, group buys, and learning together.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ruangaksarakeyboard.com",
  instagram: "https://www.instagram.com/ruangaksarakeyboard/",
  youtube: "https://www.youtube.com/@ruangaksarakeyboard",
  instagramHandle: "@ruangaksarakeyboard",
  youtubeHandle: "@ruangaksarakeyboard",
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/getting-there", label: "Getting There" },
  { href: "/rules", label: "Rules" },
  { href: "/gallery", label: "Gallery" },
  { href: "/community", label: "Community" },
  { href: "/tools", label: "Tools" },
  { href: "/faq", label: "FAQ" },
] as const;

export const routes: readonly string[] = [
  ...navItems.map((item) => item.href),
  "/register",
];
