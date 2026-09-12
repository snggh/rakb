export type GalleryItem = {
  id: string;
  cap: string;
  src: string;
  /** Intrinsic pixel size of the optimized asset — drives lightbox orientation. */
  w: number;
  h: number;
};

export type GalleryVolume = {
  id: string;
  volume: string;
  title: string;
  description: string;
  items: GalleryItem[];
};

const VOL1 = "/gallery/vol1";

function vol1(
  id: string,
  file: string,
  cap: string,
  w: number,
  h: number,
): GalleryItem {
  return { id, cap, src: `${VOL1}/${file}.webp`, w, h };
}

/** Curated shots for the home “From Vol. 1” strip. */
export const galleryPreview: GalleryItem[] = [
  vol1("preview-1", "dscf8322", "Display tables", 1440, 960),
  vol1("preview-2", "dsc00461", "Sound test", 1600, 900),
  vol1("preview-3", "dscf0085", "Panel talk", 1440, 960),
  vol1("preview-4", "group-overhead", "Group photo", 1600, 1121),
];

/** @deprecated Prefer galleryPreview or galleryVolumes — kept for callers that flat-map photos. */
export const gallery = galleryPreview;

export const galleryVolumes: GalleryVolume[] = [
  {
    id: "vol-1",
    volume: "Vol. 1",
    title: "Meetup Vol. 1",
    description:
      "Documentation from the first Ruang Aksara Keyboard Meetup. Send photos to the organisers to be included here.",
    items: [
      vol1("v1-group-overhead", "group-overhead", "Group photo", 1600, 1121),
      vol1("v1-dsc00750", "dsc00750", "Keyboards up", 1600, 900),
      vol1("v1-dscf8339", "dscf8339", "Build detail", 1440, 960),
      vol1("v1-dscf8322", "dscf8322", "Display tables", 1440, 960),
      vol1("v1-dsc00461", "dsc00461", "Sound test", 1600, 900),
      vol1("v1-dscf0085", "dscf0085", "Panel talk", 1440, 960),
      vol1("v1-dsc00107", "dsc00107", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dsc00127", "dsc00127", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dsc00143", "dsc00143", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dsc00183", "dsc00183", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dsc00208", "dsc00208", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dsc00258", "dsc00258", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dsc00290", "dsc00290", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dsc00388", "dsc00388", "Switch trading", 1600, 900),
      vol1("v1-dsc00391", "dsc00391", "Around the tables", 1600, 900),
      vol1("v1-dsc00649", "dsc00649", "Meetup Vol. 1", 1600, 900),
      vol1("v1-dscf0054", "dscf0054", "Meetup Vol. 1", 1440, 960),
      vol1("v1-dscf0070", "dscf0070", "Meetup Vol. 1", 1440, 2160),
      vol1("v1-dscf0071", "dscf0071", "Meetup Vol. 1", 1440, 960),
      vol1("v1-dscf7108", "dscf7108", "Meetup Vol. 1", 1600, 1067),
      vol1("v1-dscf7111", "dscf7111", "Meetup Vol. 1", 1600, 1067),
      vol1("v1-dscf7114", "dscf7114", "Meetup Vol. 1", 1600, 1067),
      vol1("v1-dscf7145", "dscf7145", "Meetup Vol. 1", 1600, 1067),
      vol1("v1-dscf8382", "dscf8382", "Meetup Vol. 1", 1440, 960),
      vol1("v1-ocn02162", "ocn02162", "Build session", 1600, 2395),
      vol1("v1-ocn02024", "ocn02024", "Meetup Vol. 1", 1600, 2395),
      vol1("v1-ocn02034", "ocn02034", "Meetup Vol. 1", 1600, 2395),
      vol1("v1-ocn02149", "ocn02149", "Board in hand", 1600, 2395),
      vol1("v1-ocn02050", "ocn02050", "Meetup Vol. 1", 1600, 1069),
      vol1("v1-ocn02129", "ocn02129", "Meetup Vol. 1", 1600, 2395),
      vol1("v1-ocn02131", "ocn02131", "Meetup Vol. 1", 1600, 2395),
      vol1("v1-ocn02133", "ocn02133", "Meetup Vol. 1", 1600, 2395),
      vol1("v1-ocn02147", "ocn02147", "Meetup Vol. 1", 1600, 2395),
      vol1("v1-ocn02161", "ocn02161", "Meetup Vol. 1", 1600, 1069),
      vol1("v1-ocn02166", "ocn02166", "Meetup Vol. 1", 1600, 2395),
      vol1("v1-ocn02178", "ocn02178", "Meetup Vol. 1", 1600, 1069),
    ],
  },
];
