import {
  solid,
  gavel,
  book,
  sackDollar,
  heart,
  appleWhole,
  personRunning,
  house,
  wineGlass,
  fishFins,
  scaleBalanced,
  flag,
  section,
  otter,
  dice,
  masksTheater,
  arrowTrendUp,
} from "../styles/fontawesome.module.css";

const board = {
  name: "CtyreLsen",
  icon: `${solid} ${gavel}`,
  id: "ctyrelsen",
};

const committees = [
  {
    name: "Studienämnden",
    icon: `${solid} ${book}`,
    id: "studienamnden",
  },
  {
    name: "Näringslivsnämnden",
    icon: `${solid} ${sackDollar}`,
    id: "naringslivsnamnden",
  },
  {
    name: "Mottagningsnämnden",
    icon: `${solid} ${heart}`,
    id: "mottagningsnamnden",
  },
  {
    name: "JML-nämnden",
    icon: `${solid} ${appleWhole}`,
    id: "jml-namnden",
  },
  {
    name: "Aktivitetsnämnden",
    icon: `${solid} ${personRunning}`,
    id: "aktivitetsnamnden",
  },
  {
    name: "Lokalnämnden",
    icon: `${solid} ${house}`,
    id: "lokalnamnden",
  },
  {
    name: "CLubWästeriet",
    icon: `${solid} ${wineGlass}`,
    id: "clw",
  },
  {
    name: "Valberedningen",
    icon: `${solid} ${fishFins}`,
    id: "valberedningen",
  },
];
const trustees = [
  {
    name: "Revisorer",
    icon: `${solid} ${scaleBalanced}`,
    id: "revisorer",
  },
  {
    name: "Fanborg",
    icon: `${solid} ${flag}`,
    id: "fanborg",
  },
  {
    name: "Kårfullmäktigedelegation",
    icon: `${solid} ${section}`,
    id: "kf",
  },
  {
    name: "Enskilda",
    icon: `${solid} ${otter}`,
    id: "enskilda",
  },
];
const associations = [
  {
    name: "CLek",
    icon: `${solid} ${dice}`,
    id: "clek",
  },
  {
    name: "Dubbelspexet",
    icon: `${solid} ${masksTheater}`,
    id: "dubbelspexet",
  },
  {
    name: "CLak",
    icon: `${solid} ${arrowTrendUp}`,
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
