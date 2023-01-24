import React from "react";
import styles from "./styles.module.scss";
import { Select } from "../select";
import { Map, Milty } from "../../app";

const options = [
  {
    label: "Type",
    options: [
      { label: "Prebuilt Map", value: "TYPE-PREMADE" },
      { label: "Milty Draft Pool", value: "TYPE-MILTY" },
    ],
  },
  {
    label: "Components",
    options: [
      { label: "Requires PoK", value: "COMP-POK" },
      { label: "TTS Only", value: "COMP-TTS" },
    ],
  },
  {
    label: "Player Count",
    options: [
      ...[3, 4, 5, 6, 7, 8].map((val) => ({ label: val, value: `PC-${val}` })),
    ],
  },
  {
    label: "Difficulty",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"].map((val) => ({
      label: val,
      value: `DIFF-${val}`,
    })),
  },
];

function mapToFilters(map: Map | Milty) {
  const filters = [`DIFF-${map.difficulty}`];
  if ("playerCount" in map) {
    filters.push(`PC-${map.playerCount}`);
    filters.push("TYPE-PREMADE");
  } else {
    filters.push("TYPE-MILTY");
  }
  if (map.requiresPoK) {
    filters.push("COMP-POK");
  }
  if (map.ttsOnly) {
    filters.push("COMP-TTS");
  }
  return filters;
}

type Props = {
  onMapSelect: (selection: Map | Milty | null) => void;
};

export function MapSelector(props: Props) {
  const [maps, setMaps] = React.useState<(Map | Milty)[]>([]);
  const [loadingMaps, setLoadingMaps] = React.useState(true);
  const { onMapSelect } = props;
  const [includeFilters, setIncludeFilters] = React.useState<
    Array<{ label: string; value: string }>
  >([]);
  const [excludeFilters, setExcludeFilters] = React.useState<
    Array<{ label: string; value: string }>
  >([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const modalRef = React.useRef<HTMLDialogElement>(null);
  const loadedMapName = decodeURIComponent(location.hash.substring(1));

  const showModal = () => {
    if (!modalRef.current) return;
    modalRef.current.showModal();
  };
  const hideModal = () => {
    if (!modalRef.current) return;
    modalRef.current.close();
  };

  React.useEffect(() => {
    (async () => {
      const url = `https://docs.google.com/spreadsheets/d/1gtDCFBaDOZVNk-U6A8WOZTeDbJAEMxodBE5pL8rjWxI/gviz/tq?tqx=out:json&tq&gid=262335736`;
      const response = await fetch(url);
      const raw = await response.text();
      const json = JSON.parse(raw.substring(47).slice(0, -2));
      const rows = json.table.rows
        .filter((r: { c: unknown[] }) =>
          r.c.slice(0, -1).some((el) => el !== null)
        )
        .map((row: { c: Array<{ f: unknown; v: unknown } | null> }) => {
          const base = {
            name: row.c[2]!.v as string,
            sliceNames: (row.c[7]?.v as string)?.split("\n"),
            requiresPoK:
              (row.c[9]?.v as string)?.includes("Requires PoK") ?? false,
            difficulty: row.c[8]!.v as Map["difficulty"],
            comments: (row.c[10]?.v as string) ?? "",
            ttsOnly: (row.c[9]?.v as string)?.includes("TTS only") ?? false,
          };
          return row.c[3]?.v === "Prebuilt Map"
            ? ({
                ...base,
                type: "prebuilt",
                mapString: (row.c[4]!.v as string).split(" ") as string[],
                playerCount: row.c[5]!.v as number,
              } satisfies Map)
            : ({
                ...base,
                sliceStrings: (row.c[6]!.v as string)
                  .split("\n")
                  .map((line) => line.split(" ")),
                type: "milty",
              } satisfies Milty);
        });
      setMaps(rows);
      setLoadingMaps(false);
    })();
  }, []);

  React.useEffect(() => {
    if (loadedMapName) {
      onMapSelect(maps.find(({ name }) => name === loadedMapName) ?? null);
    }
  }, [loadedMapName, maps]);

  return (
    <div
      style={{
        backgroundColor: "var(--primary-light)",
        height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <div>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", height: "2.5em", boxSizing: "border-box" }}
          placeholder={"Search..."}
        />
        <label>Include</label>
        <Select
          options={options}
          value={includeFilters}
          // @ts-ignore: This won't be null
          onChange={setIncludeFilters}
          isClearable={true}
          isMulti
          closeMenuOnSelect={false}
        />
        <label>Exclude</label>
        <Select
          options={options}
          value={excludeFilters}
          // @ts-ignore: This won't be null
          onChange={setExcludeFilters}
          isClearable={true}
          isMulti
          closeMenuOnSelect={false}
        />
      </div>
      <div style={{ margin: ".5em 0", overflowY: "scroll", flex: 1 }}>
        {loadingMaps ? (
          <img className={styles["spinning-image"]} src={"tiles/51.png"} />
        ) : (
          maps
            .filter(
              (map) =>
                includeFilters?.every((filter) =>
                  mapToFilters(map).includes(filter.value)
                ) &&
                !excludeFilters?.some((filter) =>
                  mapToFilters(map).includes(filter.value)
                ) &&
                map.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((map, idx) => (
              <span
                className={styles["map-button"]}
                key={idx}
                onClick={() => {
                  location.hash = map.name;
                  onMapSelect(map);
                }}
              >
                {map.name}
              </span>
            ))
        )}
      </div>
      <div
        style={{
          padding: "1em",
          backgroundColor: "var(--primary)",
          color: "var(--secondary-dark)",
        }}
      >
        Have a map you want to contribute? Fill out the submissions form{" "}
        <a
          href={"https://forms.gle/BVUzTrvj44nr152M8"}
          onClick={(e) => {
            e.preventDefault();
            showModal();
          }}
        >
          here
        </a>
        .
        <dialog ref={modalRef} style={{ padding: 0 }}>
          <div
            style={{
              width: "100%",
              backgroundColor: "var(--primary-dark)",
              direction: "rtl",
            }}
          >
            <button onClick={hideModal}>Close</button>
          </div>
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfd82LFZz3fXrMFRvnizVy71XJB34bK5ndLIyZVrKibAbTfYA/viewform?embedded=true"
            width="640"
            height="1045"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading…
          </iframe>
        </dialog>
      </div>
    </div>
  );
}
