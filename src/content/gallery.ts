export type GalleryItem = {
  id: string;
  cap: string;
  src?: string;
};

export const gallery: GalleryItem[] = [
  { id: "g1", cap: "Display tables" },
  { id: "g2", cap: "Sound test" },
  { id: "g3", cap: "Lube session" },
  { id: "g4", cap: "Artisan corner" },
  { id: "g5", cap: "Attendees" },
  { id: "g6", cap: "Group photo" },
  { id: "g7", cap: "Build detail" },
  { id: "g8", cap: "Keycap trade" },
  { id: "g9", cap: "Closing" },
];
