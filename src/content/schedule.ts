export const scheduleNote =
  "The schedule below is an example and may change. The final version is locked once the venue and headcount are confirmed.";

export const scheduleDraft = true;

export const rundown = [
  {
    time: "09.30",
    title: "Check-in & table setup",
    note: "Pick up your name tag, set your board on a display table",
    room: "Lobby",
  },
  {
    time: "10.30",
    title: "Opening & community intro",
    note: "Welcome from the organisers, house rules",
    room: "Main room",
  },
  {
    time: "11.00",
    title: "Open sound test",
    note: "All display tables open for typing",
    room: "Main room",
  },
  {
    time: "12.30",
    title: "Break & lunch",
    note: "Lunch on your own nearby",
    room: "—",
  },
  {
    time: "13.30",
    title: "Workshop: lube & stabilisers",
    note: "20 seats, sign up on site",
    room: "Side room",
  },
  {
    time: "15.00",
    title: "Technical talk: mounting & foam",
    note: "Short panel plus Q&A",
    room: "Main room",
  },
  {
    time: "15.30",
    title: "Typing race, Kahoot & quiz",
    note: "Open bracket, prizes for the top finishers",
    room: "Main room",
  },
  {
    time: "16.15",
    title: "Trade, small auction, giveaways",
    note: "Bring anything you want to pass on; supporter prizes drawn here",
    room: "Main room",
  },
  {
    time: "17.00",
    title: "Group photo & close",
    note: "Help pack down the tables before you go",
    room: "Main room",
  },
] as const;
