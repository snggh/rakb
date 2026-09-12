export const event = {
  volume: "Vol. 02",
  volumeLabel: "Meetup Vol. 2",
  status: "In preparation",
  titleLines: ["Ruang Aksara", "Keyboard", "Meetup Vol. 2"] as const,
  tagline:
    "One room, a lot of boards. Bring your build, run sound tests, trade keycaps, and meet people who take switches as seriously as you do.",
  dateLabel: "5 December 2026",
  dayLabel: "Saturday, 09.30 – 17.00",
  timeRange: "09.30 – 17.00",
  registrationOpen: true,
  ctaOpen: "Register now",
  ctaClosed: "Registration not open yet",
  capacity: "± 80 people",
  capacityNote: "Including 20 display tables",
  venue: {
    shortName: "BMW Motorrad Flagship",
    fullName: "BMW Motorrad Indonesia Flagship Store",
    address: "Jl. TB Simatupang No. 100, Cilandak Barat, South Jakarta 12430",
    shortAddress: "Jl. TB Simatupang No. 100, Cilandak",
    mapQuery:
      "BMW Motorrad Indonesia Flagship Store, Jl. TB Simatupang No.100, Cilandak Barat, Jakarta Selatan",
  },
  announcement: `Hello everyone!

The first Ruang Aksara Keyboard meetup was an extraordinary experience for us. Seeing so many stories, keyboards, and new friendships come out of a single room convinced us that this community deserves to keep growing.

So we are glad to announce that Ruang Aksara Keyboard Meetup Vol. 2 is in preparation.`,
  announcementSignoff: "— The organisers, Ruang Aksara Keyboard",
  heroImage: "/mascot/rakb-mascot-gmk-a.svg",
  announcementImage: "/gallery/vol1/dsc00750.webp",
} as const;

export function mapEmbedSrc(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}
