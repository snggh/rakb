export type Member = {
  id: string;
  name: string;
  role: string;
  photo: string;
};

export const members: Member[] = [
  {
    id: "seno",
    name: "Seno Rahmanto",
    role: "Founder & Creative Lead",
    photo: "/team/seno.jpg",
  },
  {
    id: "dito",
    name: "Pradipto Jati",
    role: "Finance & Administration",
    photo: "/team/dito.jpg",
  },
  {
    id: "arden",
    name: "Arden Joewondo",
    role: "Program Lead & Operations",
    photo: "/team/arden.jpg",
  },
  {
    id: "hendra",
    name: "Hendra Saputra",
    role: "Advisor & Partner Relations",
    photo: "/team/hendra.jpg",
  },
];
