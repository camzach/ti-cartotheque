import React from "react";
import styles from "./styles.module.scss";
import { Select } from "../select";
import { Map } from "../../app";

const options = [
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

function mapToFilters(map: Map) {
  const filters = [`PC-${map.playerCount}`, `DIFF-${map.difficulty}`];
  if (map.requiresPoK) {
    filters.push("COMP-POK");
  }
  if (map.ttsOnly) {
    filters.push("COMP-TTS");
  }
  return filters;
}

type Props = {
  maps: Map[];
  loadingMaps: boolean;
  setSelectedMap: (mapString: Map | null) => void;
};

export function MapSelector(props: Props) {
  const { maps, setSelectedMap, loadingMaps } = props;
  const [includeFilters, setIncludeFilters] = React.useState<
    Array<{ label: string; value: string }>
  >([]);
  const [excludeFilters, setExcludeFilters] = React.useState<
    Array<{ label: string; value: string }>
  >([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const loadedMapName = decodeURIComponent(location.hash.substring(1));
  React.useEffect(() => {
    if (loadedMapName) {
      setSelectedMap(maps.find(({ name }) => name === loadedMapName) ?? null);
    }
  }, [loadedMapName, maps]);

  return (
    <div
      style={{
        backgroundColor: "var(--primary-light)",
        overflowY: "scroll",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "var(--primary-light)",
        }}
      >
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
      <div style={{ margin: ".5em 0" }}>
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
                  setSelectedMap(map);
                }}
              >
                {map.name}
              </span>
            ))
        )}
      </div>
    </div>
  );
}
