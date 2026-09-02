export type Member = {
  id: string;
  name: string;
  role: string;
  kb: string;
  photo?: string;
};

export const members: Member[] = [
  { id: "m1", name: "Member name", role: "Founder", kb: "Daily: TBD" },
  { id: "m2", name: "Member name", role: "Event lead", kb: "Daily: TBD" },
  { id: "m3", name: "Member name", role: "Community", kb: "Daily: TBD" },
  { id: "m4", name: "Member name", role: "Media & documentation", kb: "Daily: TBD" },
  { id: "m5", name: "Member name", role: "Vendor relations", kb: "Daily: TBD" },
  { id: "m6", name: "Member name", role: "Workshop", kb: "Daily: TBD" },
];

export const membersNote =
  "Names and roles above are placeholders — replace with the real team.";
