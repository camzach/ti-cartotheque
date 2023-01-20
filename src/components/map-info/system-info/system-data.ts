export type Planet = {
  name: string;
  resources: number;
  influence: number;
  trait: "hazardous" | "industrial" | "cultural";
  specialty?: "cybernetic" | "biotic" | "propulsion" | "warfare";
};

export type LegendaryPlanet = Planet & { legendaryAbility: string };
export type HomePlanet = Omit<Planet, "trait" | "specialty">;
export type MecatolRex = Omit<Planet, "trait" | "specialty">;

type Wormhole = "alpha" | "beta" | "gamma" | "delta" | "all";
type Anomaly = "gravity-rift" | "nebula" | "supernova" | "asteroid-field";

type NonHomePlanet = Planet | LegendaryPlanet | MecatolRex;

type BlueSystem = {
  type: "blue";
  planets: NonHomePlanet[];
  wormhole?: Wormhole;
};
type RedSystem = {
  type: "red";
  anomaly?: Anomaly;
  planets?: NonHomePlanet[];
  wormhole?: Wormhole;
};
type GreenSystem = {
  type: "green";
  faction: string;
  planets: HomePlanet[];
};

type TileEdge = 0 | 1 | 2 | 3 | 4 | 5;
export type Hyperlane = { hyperlanes: [TileEdge, TileEdge][] };

export const systems: {
  [id: string]: GreenSystem | RedSystem | BlueSystem | Hyperlane;
} = {
  "1": {
    type: "green",
    faction: "The Federation of Sol",
    planets: [
      {
        name: "Jord",
        resources: 4,
        influence: 2,
      },
    ],
  },
  "2": {
    type: "green",
    faction: "The Mentak Coalition",
    planets: [
      {
        name: "Moll Primus",
        resources: 4,
        influence: 1,
      },
    ],
  },
  "3": {
    type: "green",
    faction: "The Yin Brotherhood",
    planets: [
      {
        name: "Darien",
        resources: 4,
        influence: 4,
      },
    ],
  },
  "4": {
    type: "green",
    faction: "The Embers of Muaat",
    planets: [
      {
        name: "Muaat",
        resources: 4,
        influence: 1,
      },
    ],
  },
  "5": {
    type: "green",
    faction: "The Arborec",
    planets: [
      {
        name: "Nestphar",
        resources: 3,
        influence: 2,
      },
    ],
  },
  "6": {
    type: "green",
    faction: "The Lizix Mindnet",
    planets: [
      {
        name: "[0.0.0]",
        resources: 5,
        influence: 0,
      },
    ],
  },
  "7": {
    type: "green",
    faction: "The Winnu",
    planets: [
      {
        name: "Winnu",
        resources: 3,
        influence: 4,
      },
    ],
  },
  "8": {
    type: "green",
    faction: "The Nekro Virus",
    planets: [
      {
        name: "Mordai II",
        resources: 4,
        influence: 0,
      },
    ],
  },
  "9": {
    type: "green",
    faction: "The Naalu Collective",
    planets: [
      {
        name: "Maaluuk",
        resources: 2,
        influence: 0,
      },
      {
        name: "Druaa",
        resources: 3,
        influence: 1,
      },
    ],
  },
  "10": {
    type: "green",
    faction: "The Barony of Letnev",
    planets: [
      {
        name: "Arc Prime",
        resources: 4,
        influence: 0,
      },
      {
        name: "Wren Terra",
        resources: 2,
        influence: 1,
      },
    ],
  },
  "11": {
    type: "green",
    faction: "The Clan of Saar",
    planets: [
      {
        name: "Lisis II",
        resources: 1,
        influence: 0,
      },
      {
        name: "Ragh",
        resources: 2,
        influence: 1,
      },
    ],
  },
  "12": {
    type: "green",
    faction: "The Universities of Jol-Nar",
    planets: [
      {
        name: "Nar",
        resources: 2,
        influence: 3,
      },
      {
        name: "Jol",
        resources: 1,
        influence: 2,
      },
    ],
  },
  "13": {
    type: "green",
    faction: "Sardakk N'orr",
    planets: [
      {
        name: "Tren'lak",
        resources: 1,
        influence: 0,
      },
      {
        name: "Quinarra",
        resources: 3,
        influence: 1,
      },
    ],
  },
  "14": {
    type: "green",
    faction: "The Xxcha Kingdom",
    planets: [
      {
        name: "Archon Ren",
        resources: 2,
        influence: 3,
      },
      {
        name: "Archon Tau",
        resources: 1,
        influence: 1,
      },
    ],
  },
  "15": {
    type: "green",
    faction: "The Yssaril Tribes",
    planets: [
      {
        name: "Retillion",
        resources: 2,
        influence: 3,
      },
      {
        name: "Shalloq",
        resources: 1,
        influence: 2,
      },
    ],
  },
  "16": {
    type: "green",
    faction: "The Emirates of Hacan",
    planets: [
      {
        name: "Arretze",
        resources: 2,
        influence: 0,
      },
      {
        name: "Hercant",
        resources: 1,
        influence: 1,
      },
      {
        name: "Kamdorn",
        resources: 0,
        influence: 1,
      },
    ],
  },
  "17": {
    type: "green",
    faction: "The Ghosts of Creuss",
    wormhole: "delta",
  },
  "18": {
    type: "blue",
    planets: [
      {
        name: "Mecatol Rex",
        resources: 1,
        influence: 6,
      },
    ],
  },
  "19": {
    type: "blue",
    planets: [
      {
        name: "Wellon",
        resources: 1,
        influence: 2,
        trait: "industrial",
        specialty: "cybernetic",
      },
    ],
  },
  "20": {
    type: "blue",
    planets: [
      {
        name: "Vefut II",
        resources: 2,
        influence: 2,
        trait: "hazardous",
      },
    ],
  },
  "21": {
    type: "blue",
    planets: [
      {
        name: "Thibah",
        resources: 1,
        influence: 1,
        trait: "industrial",
        specialty: "propulsion",
      },
    ],
  },
  "22": {
    type: "blue",
    planets: [
      {
        name: "Tar'mann",
        resources: 1,
        influence: 1,
        trait: "industrial",
        specialty: "biotic",
      },
    ],
  },
  "23": {
    type: "blue",
    planets: [
      {
        name: "Saudor",
        resources: 2,
        influence: 2,
        trait: "industrial",
      },
    ],
  },
  "24": {
    type: "blue",
    planets: [
      {
        name: "Mehar Xull",
        resources: 1,
        influence: 3,
        trait: "hazardous",
        specialty: "warfare",
      },
    ],
  },
  "25": {
    type: "blue",
    wormhole: "beta",
    planets: [
      {
        name: "Quann",
        resources: 2,
        influence: 1,
        trait: "cultural",
      },
    ],
  },
  "26": {
    type: "blue",
    wormhole: "alpha",
    planets: [
      {
        name: "Lodor",
        resources: 3,
        influence: 1,
        trait: "cultural",
      },
    ],
  },
  "27": {
    type: "blue",
    planets: [
      {
        name: "New Albion",
        resources: 1,
        influence: 1,
        trait: "industrial",
        specialty: "biotic",
      },
      {
        name: "Starpoint",
        resources: 3,
        influence: 1,
        trait: "hazardous",
      },
    ],
  },
  "28": {
    type: "blue",
    planets: [
      {
        name: "Tequ'ran",
        resources: 2,
        influence: 0,
        trait: "hazardous",
      },
      {
        name: "Torkan",
        resources: 0,
        influence: 3,
        trait: "cultural",
      },
    ],
  },
  "29": {
    type: "blue",
    planets: [
      {
        name: "Qucen'n",
        resources: 1,
        influence: 2,
        trait: "industrial",
      },
      {
        name: "Rarron",
        resources: 0,
        influence: 3,
        trait: "cultural",
      },
    ],
  },
  "30": {
    type: "blue",
    planets: [
      {
        name: "Mellon",
        resources: 0,
        influence: 2,
        trait: "cultural",
      },
      {
        name: "Zohbat",
        resources: 3,
        influence: 1,
        trait: "hazardous",
      },
    ],
  },
  "31": {
    type: "blue",
    planets: [
      {
        name: "Lazar",
        resources: 1,
        influence: 0,
        trait: "industrial",
        specialty: "cybernetic",
      },
      {
        name: "Sakulag",
        resources: 2,
        influence: 1,
        trait: "hazardous",
      },
    ],
  },
  "32": {
    type: "blue",
    planets: [
      {
        name: "Dal Bootha",
        resources: 0,
        influence: 2,
        trait: "cultural",
      },
      {
        name: "Xxehan",
        resources: 1,
        influence: 1,
        trait: "cultural",
      },
    ],
  },
  "33": {
    type: "blue",
    planets: [
      {
        name: "Corneeq",
        resources: 1,
        influence: 2,
        trait: "cultural",
      },
      {
        name: "Resulon",
        resources: 2,
        influence: 0,
        trait: "cultural",
      },
    ],
  },
  "34": {
    type: "blue",
    planets: [
      {
        name: "Centauri",
        resources: 1,
        influence: 3,
        trait: "cultural",
      },
      {
        name: "Gral",
        resources: 1,
        influence: 1,
        trait: "industrial",
        specialty: "propulsion",
      },
    ],
  },
  "35": {
    type: "blue",
    planets: [
      {
        name: "Bereg",
        resources: 3,
        influence: 1,
        trait: "hazardous",
      },
      {
        name: "Lirta IV",
        resources: 2,
        influence: 3,
        trait: "hazardous",
      },
    ],
  },
  "36": {
    type: "blue",
    planets: [
      {
        name: "Arnor",
        resources: 2,
        influence: 1,
        trait: "industrial",
      },
      {
        name: "Lor",
        resources: 1,
        influence: 2,
        trait: "industrial",
      },
    ],
  },
  "37": {
    type: "blue",
    planets: [
      {
        name: "Arinam",
        resources: 1,
        influence: 2,
        trait: "industrial",
      },
      {
        name: "Meer",
        resources: 0,
        influence: 4,
        trait: "hazardous",
        specialty: "warfare",
      },
    ],
  },
  "38": {
    type: "blue",
    planets: [
      {
        name: "Abyz",
        resources: 3,
        influence: 0,
        trait: "hazardous",
      },
      {
        name: "Fria",
        resources: 2,
        influence: 0,
        trait: "hazardous",
      },
    ],
  },
  "39": {
    type: "red",
    wormhole: "alpha",
  },
  "40": {
    type: "red",
    wormhole: "beta",
  },
  "41": {
    type: "red",
    anomaly: "gravity-rift",
  },
  "42": {
    type: "red",
    anomaly: "nebula",
  },
  "43": {
    type: "red",
    anomaly: "supernova",
  },
  "44": {
    type: "red",
    anomaly: "asteroid-field",
  },
  "45": {
    type: "red",
    anomaly: "asteroid-field",
  },
  "46": { type: "red" },
  "47": { type: "red" },
  "48": { type: "red" },
  "49": { type: "red" },
  "50": { type: "red" },
  "51": {
    wormhole: "delta",
    planets: [
      {
        name: "Creuss",
        resources: 4,
        influence: 2,
      },
    ],
  },
  "52": {
    type: "green",
    faction: "The Mahact Gene-sorcerers",
    planets: [
      {
        name: "Ixth",
        resources: 3,
        influence: 5,
      },
    ],
  },
  "53": {
    type: "green",
    faction: "The Nomad",
    planets: [
      {
        name: "Arcturus",
        resources: 4,
        influence: 4,
      },
    ],
  },
  "54": {
    type: "green",
    faction: "The Vuil'raith Cabal",
    planets: [
      {
        name: "Acheron",
        resources: 4,
        influence: 0,
      },
    ],
  },
  "55": {
    type: "green",
    faction: "The Titans of Ul",
    planets: [
      {
        name: "Elysium",
        resources: 4,
        influence: 1,
      },
    ],
  },
  "56": {
    type: "green",
    faction: "The Empyrean",
    planets: [
      {
        name: "The Dark",
        resources: 3,
        influence: 4,
      },
    ],
  },
  "57": {
    type: "green",
    faction: "The Naaz-Rokha Alliance",
    planets: [
      {
        name: "Naazir",
        resources: 2,
        influence: 1,
      },
      {
        name: "Rokha",
        resources: 1,
        influence: 2,
      },
    ],
  },
  "58": {
    type: "green",
    faction: "The Argent Flight",
    planets: [
      {
        name: "Valk",
        resources: 2,
        influence: 0,
      },
      {
        name: "Avar",
        resources: 1,
        influence: 1,
      },
      {
        name: "Ylir",
        resources: 0,
        influence: 2,
      },
    ],
  },
  "59": {
    type: "blue",
    planets: [
      {
        name: "Archon Vail",
        resources: 1,
        influence: 3,
        trait: "hazardous",
        specialty: "propulsion",
      },
    ],
  },
  "60": {
    type: "blue",
    planets: [
      {
        name: "Perimeter",
        resources: 2,
        influence: 1,
        trait: "industrial",
      },
    ],
  },
  "61": {
    type: "blue",
    planets: [
      {
        name: "Perimeter",
        resources: 2,
        influence: 0,
        trait: "industrial",
        specialty: "warfare",
      },
    ],
  },
  "62": {
    type: "blue",
    planets: [
      {
        name: "Sem-Lore",
        resources: 3,
        influence: 2,
        trait: "cultural",
        specialty: "cybernetic",
      },
    ],
  },
  "63": {
    type: "blue",
    planets: [
      {
        name: "Vorhal",
        resources: 0,
        influence: 2,
        trait: "cultural",
        specialty: "biotic",
      },
    ],
  },
  "64": {
    type: "blue",
    wormhole: "beta",
    planets: [
      {
        name: "Atlas",
        resources: 3,
        influence: 1,
        trait: "hazardous",
      },
    ],
  },
  "65": {
    type: "blue",
    planets: [
      {
        name: "Primor",
        resources: 2,
        influence: 1,
        trait: "cultural",
        legendaryAbility: "",
      },
    ],
  },
  "66": {
    type: "blue",
    planets: [
      {
        name: "Hope's End",
        resources: 3,
        influence: 0,
        trait: "hazardous",
        legendaryAbility: "",
      },
    ],
  },
  "67": {
    type: "red",
    anomaly: "gravity-rift",
    planets: [
      {
        name: "Cormund",
        resources: 2,
        influence: 0,
        trait: "hazardous",
      },
    ],
  },
  "68": {
    type: "red",
    anomaly: "nebula",
    planets: [
      {
        name: "Everra",
        resources: 3,
        influence: 1,
        trait: "cultural",
      },
    ],
  },
  "69": {
    type: "blue",
    planets: [
      {
        name: "Accoen",
        resources: 2,
        influence: 3,
        trait: "industrial",
      },
      {
        name: "Jeol Ir",
        resources: 2,
        influence: 3,
        trait: "industrial",
      },
    ],
  },
  "70": {
    type: "blue",
    planets: [
      {
        name: "Kraag",
        resources: 2,
        influence: 1,
        trait: "hazardous",
      },
      {
        name: "Siig",
        resources: 0,
        influence: 2,
        trait: "hazardous",
      },
    ],
  },
  "71": {
    type: "blue",
    planets: [
      {
        name: "Ba'Kal",
        resources: 3,
        influence: 2,
        trait: "industrial",
      },
      {
        name: "Alio Prima",
        resources: 1,
        influence: 1,
        trait: "cultural",
      },
    ],
  },
  "72": {
    type: "blue",
    planets: [
      {
        name: "Lisis",
        resources: 2,
        influence: 2,
        trait: "industrial",
      },
      {
        name: "Velnor",
        resources: 2,
        influence: 1,
        trait: "industrial",
        specialty: "warfare",
      },
    ],
  },
  "73": {
    type: "blue",
    planets: [
      {
        name: "Lisis",
        resources: 0,
        influence: 2,
        trait: "cultural",
        specialty: "cybernetic",
      },
      {
        name: "Xanhact",
        resources: 0,
        influence: 1,
        trait: "hazardous",
      },
    ],
  },
  "74": {
    type: "blue",
    planets: [
      {
        name: "Vega Major",
        resources: 2,
        influence: 1,
        trait: "cultural",
      },
      {
        name: "Vega Minor",
        resources: 1,
        influence: 2,
        trait: "cultural",
        specialty: "propulsion",
      },
    ],
  },
  "75": {
    type: "blue",
    planets: [
      {
        name: "Loki",
        resources: 1,
        influence: 2,
        trait: "cultural",
      },
      {
        name: "Abaddon",
        resources: 1,
        influence: 0,
        trait: "cultural",
      },
      {
        name: "Ashtroth",
        resources: 2,
        influence: 0,
        trait: "hazardous",
      },
    ],
  },
  "76": {
    type: "blue",
    planets: [
      {
        name: "Rigel I",
        resources: 0,
        influence: 1,
        trait: "hazardous",
      },
      {
        name: "Rigel II",
        resources: 1,
        influence: 2,
        trait: "industrial",
      },
      {
        name: "Rigel III",
        resources: 1,
        influence: 1,
        trait: "industrial",
        specialty: "biotic",
      },
    ],
  },
  "77": { type: "red" },
  "78": { type: "red" },
  "79": {
    type: "red",
    wormhole: "alpha",
    anomaly: "asteroid-field",
  },
  "80": {
    type: "red",
    anomaly: "supernova",
  },
  "81": {
    type: "red",
    anomaly: "supernova",
  },
  "82": {
    wormhole: "all",
    planets: [
      {
        name: "Mallice",
        resources: 0,
        influence: 3,
        trait: "cultural",
        legendaryAbility: "",
      },
    ],
  },
  "83A": {
    hyperlanes: [[1, 4]],
  },
  "83B": {
    hyperlanes: [
      [0, 3],
      [0, 2],
      [3, 5],
    ],
  },
  "84A": {
    hyperlanes: [[2, 5]],
  },
  "84B": {
    hyperlanes: [
      [0, 3],
      [0, 4],
      [1, 3],
    ],
  },
  "85A": {
    hyperlanes: [[1, 5]],
  },
  "85B": {
    hyperlanes: [
      [0, 3],
      [0, 2],
      [3, 5],
    ],
  },
  "86A": {
    hyperlanes: [[1, 5]],
  },
  "86B": {
    hyperlanes: [
      [0, 3],
      [0, 4],
      [1, 3],
    ],
  },
  "87A": {
    hyperlanes: [
      [0, 2],
      [2, 4],
      [2, 5],
    ],
  },
  "87B": {
    hyperlanes: [
      [0, 2],
      [0, 3],
    ],
  },
  "88A": {
    hyperlanes: [
      [0, 4],
      [1, 4],
      [2, 4],
    ],
  },
  "88B": {
    hyperlanes: [
      [0, 3],
      [0, 2],
      [3, 5],
    ],
  },
  "89A": {
    hyperlanes: [
      [0, 2],
      [0, 4],
      [2, 4],
    ],
  },
  "89B": {
    hyperlanes: [
      [0, 3],
      [0, 4],
    ],
  },
  "90A": {
    hyperlanes: [
      [1, 5],
      [2, 4],
    ],
  },
  "90B": {
    hyperlanes: [
      [0, 3],
      [0, 4],
    ],
  },
  "91A": {
    hyperlanes: [
      [0, 3],
      [0, 4],
      [1, 3],
    ],
  },
  "91B": {
    hyperlanes: [
      [0, 2],
      [0, 3],
    ],
  },
};
