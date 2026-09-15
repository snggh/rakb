export const site = {
  name: "Ruang Aksara Keyboard",
  description:
    "Ruang Aksara Keyboard is a collective movement built around bringing people together through mechanical keyboards",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ruangaksarakeyboard.com",
  instagram: "https://www.instagram.com/ruangaksarakb/",
  youtube: "https://www.youtube.com/@ruangaksarakb",
  instagramHandle: "@ruangaksarakb",
  youtubeHandle: "@ruangaksarakb",
} as const;

export const navItems = [
  { href: "/schedule", label: "Schedule" },
  { href: "/getting-there", label: "Getting There" },
  { href: "/rules", label: "Rules" },
  { href: "/gallery", label: "Gallery" },
  { href: "/community", label: "Community" },
  { href: "/tools", label: "Tools" },
  { href: "/faq", label: "FAQ" },
] as const;

export const routes: readonly string[] = [
  "/",
  ...navItems.map((item) => item.href),
  "/register",
];
