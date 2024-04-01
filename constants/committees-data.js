import {
  faGavel,
  faBook,
  faSackDollar,
  faHeart,
  faAppleWhole,
  faPersonRunning,
  faHouse,
  faWineGlass,
  faFishFins,
  faScaleBalanced,
  faFlag,
  faSection,
  faOtter,
  faDice,
  faMasksTheater,
  faArrowTrendUp,
  faCartShopping,
  faBasketball,
} from "@fortawesome/free-solid-svg-icons";

const board = {
  name: "CtyreLsen",
  icon: faGavel,
  id: "ctyrelsen",
};

const committees = [
  {
    name: "Studienämnden",
    icon: faBook,
    id: "studienamnden",
  },
  {
    name: "Näringslivsnämnden",
    icon: faSackDollar,
    id: "naringslivsnamnden",
  },
  {
    name: "Mottagningsnämnden",
    icon: faHeart,
    id: "mottagningsnamnden",
  },
  {
    name: "JML-nämnden",
    icon: faAppleWhole,
    id: "jml-namnden",
  },
  {
    name: "Aktivitetsnämnden",
    icon: faPersonRunning,
    id: "aktivitetsnamnden",
  },
  {
    name: "Lokalnämnden",
    icon: faHouse,
    id: "lokalnamnden",
  },
  {
    name: "CLubWästeriet",
    icon: faWineGlass,
    id: "clw",
  },
  {
    name: "Valberedningen",
    icon: faFishFins,
    id: "valberedningen",
  },
];
const trustees = [
  {
    name: "Revisorer",
    icon: faScaleBalanced,
    id: "revisorer",
  },
  {
    name: "Fanborg",
    icon: faFlag,
    id: "fanborg",
  },
  {
    name: "Kårfullmäktigedelegation",
    icon: faSection,
    id: "kf",
  },
  {
    name: "Enskilda",
    icon: faOtter,
    id: "enskilda",
  },
];

const individuals = [
  { name: "Talman", icon: faGavel, id: "talman" },
  { name: "Försäljningsansvarig", icon: faCartShopping, id: "forsaljningsansvarig" },
  { name: "Idrottsansvarig", icon: faBasketball, id: "idrottsansvarig" },
];

const associations = [
  {
    name: "CLek",
    icon: faDice,
    id: "clek",
  },
  {
    name: "Dubbelspexet",
    icon: faMasksTheater,
    id: "dubbelspexet",
  },
];

const all_committees = [board, ...committees, ...trustees, ...individuals, ...associations];

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
for (let individual of individuals) {
  all_committee_ids[individual.id] = individual;
}

export {
  board,
  committees,
  trustees,
  individuals,
  associations,
  all_committees,
  all_committee_ids,
};
