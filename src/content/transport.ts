export const arrivalNotes = [
  "Check in at the front desk with your confirmation email.",
  "Carry your keyboard in a bag or case; we provide table mats and power.",
  "Bring your own deskmat and cable extension if you have preferences.",
  "Parking is limited — public transport or ride hailing is recommended.",
] as const;

export const transport = [
  {
    kind: "MRT",
    name: "Fatmawati or Cilandak",
    body: "Take MRT Jakarta (Lebak Bulus line) and get off at Fatmawati or Cilandak, then continue by ride hailing along TB Simatupang — roughly 5 minutes.",
  },
  {
    kind: "TransJakarta",
    name: "TB Simatupang stops",
    body: "Routes running along Jl. TB Simatupang stop within walking distance. Get off at the stop nearest No. 100 and walk toward the building with the bike-rack facade.",
  },
  {
    kind: "Ride hailing",
    name: "Pickup point",
    body: 'Search "BMW Motorrad Indonesia Flagship Store" in the app. Ask to be dropped at the main showroom entrance on TB Simatupang, not the service bay.',
  },
  {
    kind: "Private vehicle",
    name: "Parking",
    body: "On-site parking including a basement level; car and motorcycle areas are separate. Space is limited, so arrive early or come by MRT.",
  },
] as const;
