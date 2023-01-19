import React from "react";
import { MapSelector } from "./components/map-selector";
import { MapInfo } from "./components/map-info";
import styles from "./styles.module.css";
import { MapDisplay } from "./components/map-display";

export type Map = {
  name: string;
  mapString: string[];
  sliceNames?: string[];
  playerCount: number;
  requiresPoK: boolean;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  comments: string;
  ttsOnly: boolean;
};

export default function App() {
  const [maps, setMaps] = React.useState<Map[]>([]);
  const [selectedMap, setSelectedMap] = React.useState<Map | null>(null);
  const [loadingMaps, setLoadingMaps] = React.useState(true);
  const [selectedSystems, setSelectedSystems] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      const url = `https://docs.google.com/spreadsheets/d/1UEt_sZhJ4vkPdCM_kgR8a6p6rvb8yInLYKExIBWTKqs/gviz/tq?tqx=out:json&tq&gid=1102116771`;
      const response = await fetch(url);
      const raw = await response.text();
      const json = JSON.parse(raw.substring(47).slice(0, -2));
      const rows = json.table.rows
        .filter((r: { c: unknown[] }) =>
          r.c.slice(0, -1).some((el) => el !== null)
        )
        .map(
          (row: { c: Array<{ f: unknown; v: unknown } | null> }) =>
            ({
              name: row.c[2]!.v as string,
              mapString: (row.c[3]!.v as string).split(" ") as string[],
              sliceNames: (row.c[4]?.v as string | undefined)?.split(" "),
              playerCount: row.c[5]!.v as number,
              requiresPoK:
                (row.c[7]?.v as string)?.includes("PoK Required") ?? false,
              difficulty: row.c[6]!.v as Map["difficulty"],
              comments: (row.c[8]?.v as string) ?? "",
              ttsOnly: (row.c[7]?.v as string).includes("TTS only") ?? false,
            } satisfies Map)
        );
      setMaps(rows);
      setLoadingMaps(false);
    })();
  }, []);

  const handleMapSelect = (map: Map | null) => {
    setSelectedMap(map);
    setSelectedSystems([]);
  };

  return (
    <div className={styles.wrapper}>
      <MapSelector
        maps={maps}
        setSelectedMap={handleMapSelect}
        loadingMaps={false}
      />
      {selectedMap && (
        <>
          <MapDisplay
            map={selectedMap}
            setSelectedSystems={setSelectedSystems}
          />
          <MapInfo map={selectedMap} selectedSystems={selectedSystems} />
        </>
      )}
    </div>
  );
}
