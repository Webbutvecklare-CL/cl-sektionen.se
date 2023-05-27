const board = {
  name: "CtyreLsen",
  icon: "fa-solid fa-gavel",
  id: "ctyrelsen",
};

const committees = [
  {
    name: "Studienämnden",
    icon: "fa-solid fa-book",
    id: "studienamnden",
  },
  {
    name: "Näringslivsnämnden",
    icon: "fa-solid fa-sack-dollar",
    id: "naringslivsnamnden",
  },
  {
    name: "Mottagningsnämnden",
    icon: "fa-solid fa-heart",
    id: "mottagningsnamnden",
  },
  {
    name: "JML-nämnden",
    icon: "fa-solid fa-apple-whole",
    id: "jml-namnden",
  },
  {
    name: "Aktivitetsnämnden",
    icon: "fa-solid fa-person-running",
    id: "aktivitetsnamnden",
  },
  {
    name: "Lokalnämnden",
    icon: "fa-solid fa-house",
    id: "lokalnamnden",
  },
  {
    name: "CLubWästeriet",
    icon: "fa-solid fa-wine-glass",
    id: "clw",
  },
  {
    name: "Valberedningen",
    icon: "fa-solid fa-fish-fins",
    id: "valberedningen",
  },
];
const trustees = [
  {
    name: "Revisorer",
    icon: "fa-solid fa-scale-balanced",
    id: "revisorer",
  },
  {
    name: "Fanborg",
    icon: "fa-solid fa-flag",
    id: "fanborg",
  },
  {
    name: "Kårfullmäktigedelegation",
    icon: "fa-solid fa-section",
    id: "kf",
  },
  {
    name: "Enskilda",
    icon: "fa-solid fa-otter",
    id: "enskilda",
  },
];
const associations = [
  {
    name: "CLek",
    icon: "fa-solid fa-dice",
    id: "clek",
  },
  {
    name: "Dubbelspexet",
    icon: "fa-solid fa-masks-theater",
    id: "dubbelspexet",
  },
  {
    name: "CLak",
    icon: "fa-solid fa-arrow-trend-up",
    id: "clak",
  },
];

const all_committees = [board, ...committees, ...trustees, ...associations];

var all_committee_ids = {};
all_committee_ids[board.id] = board;
for (let committee of committees) {
  all_committee_ids[committee.id] = committee;
}
for (let trustee of trustees) {
  all_committee_ids[trustee.id] = trustee;
}
for (let association of associations) {
  all_committee_ids[association.id] = association;
}

export { board, committees, trustees, associations, all_committees, all_committee_ids };
